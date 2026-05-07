import joblib
import pandas as pd
from pathlib import Path
from sklearn.metrics import accuracy_score, classification_report

BASE_DIR = Path('d:/PROJECTS/Genetic-App/ml-api')
DATASET_PATH = BASE_DIR / 'dataset.csv'
MODEL_PATH = BASE_DIR / 'genetic_model.joblib'
ENCODER_PATH = BASE_DIR / 'label_encoder.joblib'

df = pd.read_csv(DATASET_PATH)

FEATURES = [
    'Maternal_Age_at_Birth', 'Gender', 'Hemoglobin_Level_g/dL',
    'MCV_fL', 'MCH_pg', 'Family_History_Score',
    'Is_Parent_Carrier', 'Is_Sibling_Affected',
    'Has_Chronic_Cough', 'Newborn_Screen_Flag'
]

# Aliases matching train_model.py
df['Disease_Status'] = df['Disease_Status'].replace({'Huntingtons_Disease': 'G6PD_Deficiency'})
df = df.dropna(subset=FEATURES + ['Disease_Status']).copy()

df_model = df.copy()
df_model['Gender'] = df_model['Gender'].map({'Male': 1, 'Female': 0})
for col in ['Is_Parent_Carrier', 'Is_Sibling_Affected', 'Has_Chronic_Cough']:
    df_model[col] = df_model[col].map({'Yes': 1, 'No': 0})
df_model['Newborn_Screen_Flag'] = df_model['Newborn_Screen_Flag'].map({'Detected': 1, 'Not_Detected': 0})
df_model[FEATURES[:5] + [FEATURES[5]]] = df_model[FEATURES[:5] + [FEATURES[5]]].astype(float)

model = joblib.load(MODEL_PATH)
le = joblib.load(ENCODER_PATH)

X = df_model[FEATURES]
y_true_encoded = le.transform(df['Disease_Status'])
y_pred_encoded = model.predict(X)

print("Accuracy:", accuracy_score(y_true_encoded, y_pred_encoded))
print("\nClassification Report:\n", classification_report(y_true_encoded, y_pred_encoded, target_names=le.classes_))
