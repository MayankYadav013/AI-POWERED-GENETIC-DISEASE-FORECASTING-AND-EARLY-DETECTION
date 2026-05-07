import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path('d:/PROJECTS/Genetic-App/ml-api')
DATASET_PATH = BASE_DIR / 'dataset.csv'
MODEL_PATH = BASE_DIR / 'genetic_model.joblib'
ENCODER_PATH = BASE_DIR / 'label_encoder.joblib'

df = pd.read_csv(DATASET_PATH)

FEATURES = [
    'Maternal_Age_at_Birth',
    'Gender',
    'Hemoglobin_Level_g/dL',
    'MCV_fL',
    'MCH_pg',
    'Family_History_Score',
    'Is_Parent_Carrier',
    'Is_Sibling_Affected',
    'Has_Chronic_Cough',
    'Newborn_Screen_Flag',
]

df = df.dropna(subset=FEATURES + ['Disease_Status']).copy()

# Preprocess for model
df_model = df.copy()
df_model['Gender'] = df_model['Gender'].map({'Male': 1, 'Female': 0})
for column in ['Is_Parent_Carrier', 'Is_Sibling_Affected', 'Has_Chronic_Cough']:
    df_model[column] = df_model[column].map({'Yes': 1, 'No': 0})
df_model['Newborn_Screen_Flag'] = df_model['Newborn_Screen_Flag'].map({'Detected': 1, 'Not_Detected': 0})

numeric_columns = [
    'Maternal_Age_at_Birth',
    'Hemoglobin_Level_g/dL',
    'MCV_fL',
    'MCH_pg',
    'Family_History_Score',
]
df_model[numeric_columns] = df_model[numeric_columns].astype(float)

model = joblib.load(MODEL_PATH)
le = joblib.load(ENCODER_PATH)

X = df_model[FEATURES]
y_pred_encoded = model.predict(X)
y_pred_proba = model.predict_proba(X)
y_pred_labels = le.inverse_transform(y_pred_encoded)

df['Predicted'] = y_pred_labels
df['Confidence'] = [max(probs) for probs in y_pred_proba]

conditions = ['Beta_Thalassemia', 'Cystic_Fibrosis', 'Down_Syndrome', 'G6PD_Deficiency', 'Sickle_Cell_Anemia', 'Healthy']

for cond in conditions:
    alias = 'Huntingtons_Disease' if cond == 'G6PD_Deficiency' else cond
    matches = df[(df['Disease_Status'] == alias) & (df['Predicted'] == cond)]
    if len(matches) > 0:
        best_match = matches.sort_values(by='Confidence', ascending=False).iloc[0]
        print(f"--- Best {cond} (Confidence: {best_match['Confidence']*100:.2f}%) ---")
        for f in FEATURES:
            print(f"  {f}: {best_match[f]}")
    else:
        print(f"--- NO MATCH FOUND FOR {cond} ---")
