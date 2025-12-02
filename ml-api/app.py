import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, 'genetic_model.joblib')
LE_PATH = os.path.join(BASE_DIR, 'label_encoder.joblib')

FEATURE_ORDER = [
    'Maternal_Age_at_Birth',
    'Gender',
    'Hemoglobin_Level_g/dL',
    'MCV_fL',
    'MCH_pg',
    'Family_History_Score',
    'Is_Parent_Carrier',
    'Is_Sibling_Affected',
    'Has_Chronic_Cough',
    'Newborn_Screen_Flag'
]

CONDITION_ALIASES = {
    'Huntingtons_Disease': 'G6PD_Deficiency'
}

CONDITION_DESCRIPTIONS = {
    'Beta_Thalassemia': 'Inherited blood disorder affecting hemoglobin production, often identified by low MCV/MCH.',
    'Cystic_Fibrosis': 'Genetic disease that causes thick mucus buildup impacting lungs and digestion.',
    'Down_Syndrome': 'A chromosomal condition (Trisomy 21) associated with developmental and physical traits.',
    'Huntingtons_Disease': 'The model suggests a potential risk based on family history. Genetic testing is the standard for diagnosis.',
    'Sickle_Cell_Anemia': 'Hemoglobin disorder where red blood cells take a sickle shape, leading to pain and anemia.',
    'Healthy': 'No elevated risk detected for the tracked genetic conditions.'
}


def load_artifacts():
    try:
        model_obj = joblib.load(MODEL_PATH)
        label_encoder = joblib.load(LE_PATH)
        print("Model and label encoder loaded successfully")
        return model_obj, label_encoder
    except Exception as exc:
        raise RuntimeError(f"Error loading model artifacts: {exc}") from exc


model, le = load_artifacts()


def _to_float(value, field):
    try:
        return float(value)
    except (TypeError, ValueError):
        raise ValueError(f'{field} must be a numeric value.')


def _to_binary(value, field):
    if isinstance(value, str):
        normalized = value.strip().lower()
        if normalized in ('yes', 'detected', 'true', '1'):
            return 1
        if normalized in ('no', 'not_detected', 'false', '0'):
            return 0
        if normalized in ('male', 'm'):
            return 1 if field == 'Gender' else None
        if normalized in ('female', 'f'):
            return 0 if field == 'Gender' else None
    if isinstance(value, (int, float)):
        return 1 if float(value) == 1 else 0
    raise ValueError(f'Invalid value for {field}.')


def normalize_payload(data):
    if data is None:
        raise ValueError('Request body must be valid JSON.')

    gender_input = data.get('gender')
    gender = None
    if gender_input is not None:
        gender = 1 if str(gender_input).strip().lower() in ('male', 'm', '1') else 0
    else:
        raise ValueError('Gender is required.')

    payload = {
        'Maternal_Age_at_Birth': _to_float(data.get('maternalAge'), 'Maternal age'),
        'Gender': gender,
        'Hemoglobin_Level_g/dL': _to_float(data.get('hemoglobin'), 'Hemoglobin'),
        'MCV_fL': _to_float(data.get('mcv'), 'MCV'),
        'MCH_pg': _to_float(data.get('mch'), 'MCH'),
        'Family_History_Score': _to_float(data.get('familyHistoryScore'), 'Family history score'),
        'Is_Parent_Carrier': _to_binary(data.get('isParentCarrier'), 'Is_Parent_Carrier'),
        'Is_Sibling_Affected': _to_binary(data.get('isSiblingAffected'), 'Is_Sibling_Affected'),
        'Has_Chronic_Cough': _to_binary(data.get('hasChronicCough'), 'Has_Chronic_Cough'),
        'Newborn_Screen_Flag': _to_binary(data.get('newbornScreen'), 'Newborn_Screen_Flag'),
    }

    for key, value in payload.items():
        if value is None:
            raise ValueError(f'{key} is required.')

    if not 0 <= payload['Family_History_Score'] <= 1:
        raise ValueError('Family history score must be between 0 and 1.')
    if payload['Hemoglobin_Level_g/dL'] <= 0:
        raise ValueError('Hemoglobin level must be greater than 0.')
    if payload['MCV_fL'] <= 0 or payload['MCH_pg'] <= 0:
        raise ValueError('MCV and MCH must be greater than 0.')
    if payload['Maternal_Age_at_Birth'] <= 0:
        raise ValueError('Maternal age must be greater than 0.')

    return payload


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'ml-api', 'feature_count': len(FEATURE_ORDER)})


@app.route('/predict', methods=['POST'])
def predict():
    try:
        features = normalize_payload(request.get_json(silent=True))
    except ValueError as exc:
        return jsonify({'error': str(exc)}), 400

    # --- Rule-Based Logic from index.html ---
    # 0: Beta_Thalassemia
    # 1: Cystic_Fibrosis
    # 2: Down_Syndrome
    # 3: Healthy
    # 4: Huntington's Disease
    # 5: Sickle_Cell_Anemia

    scores = {0: 0, 1: 0, 2: 0, 3: 10, 4: 0, 5: 0}
    
    mcv = features['MCV_fL']
    mch = features['MCH_pg']
    hemoglobin = features['Hemoglobin_Level_g/dL']
    parent_carrier = features['Is_Parent_Carrier']
    sibling_affected = features['Is_Sibling_Affected']
    family_history = features['Family_History_Score']
    chronic_cough = features['Has_Chronic_Cough']
    newborn_screen = features['Newborn_Screen_Flag']
    maternal_age = features['Maternal_Age_at_Birth']

    # Rules
    if mcv < 78: scores[0] += 20
    if mcv < 65: scores[0] += 15
    if mch < 25: scores[0] += 15
    if hemoglobin < 11: scores[0] += 10
    if parent_carrier == 1: scores[0] += 15
    if sibling_affected == 1: scores[0] += 25
    if family_history > 0.5: scores[0] += 10

    if hemoglobin < 9: scores[5] += 25
    if hemoglobin < 7: scores[5] += 15
    if parent_carrier == 1: scores[5] += 15
    if sibling_affected == 1: scores[5] += 25
    if family_history > 0.5: scores[5] += 10

    if chronic_cough == 1: scores[1] += 30
    if newborn_screen == 1: scores[1] += 20
    if family_history > 0.3: scores[1] += 10

    if maternal_age >= 35: scores[2] += 20
    if maternal_age >= 40: scores[2] += 25
    if newborn_screen == 1: scores[2] += 10
    
    if family_history > 0.8: scores[4] += 30
    if parent_carrier == 1: scores[4] += 20

    # Find max score
    final_prediction_idx = 3
    max_score = scores[3]
    
    for i in range(6):
        if scores[i] > max_score:
            max_score = scores[i]
            final_prediction_idx = i

    # Map index to class name
    idx_to_class = {
        0: 'Beta_Thalassemia',
        1: 'Cystic_Fibrosis',
        2: 'Down_Syndrome',
        3: 'Healthy',
        4: 'Huntingtons_Disease',
        5: 'Sickle_Cell_Anemia'
    }

    normalized_prediction = idx_to_class[final_prediction_idx]
    
    # Calculate pseudo-probabilities (normalize scores)
    total_score = sum(scores.values())
    class_probs = {}
    for i in range(6):
        class_name = idx_to_class[i]
        prob = scores[i] / total_score if total_score > 0 else 0
        class_probs[class_name] = round(prob, 4)

    confidence = class_probs[normalized_prediction]

    return jsonify({
        'prediction': normalized_prediction,
        'raw_prediction': normalized_prediction,
        'confidence': round(confidence * 100, 2),
        'description': CONDITION_DESCRIPTIONS.get(normalized_prediction, 'No description available yet.'),
        'probabilities': class_probs,
        'features': features
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_DEBUG', '0') == '1'
    app.run(host='0.0.0.0', port=port, debug=debug)