from pathlib import Path

import joblib
import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / 'dataset.csv'
MODEL_PATH = BASE_DIR / 'genetic_model.joblib'
ENCODER_PATH = BASE_DIR / 'label_encoder.joblib'
REPORT_PATH = BASE_DIR / 'training_report.txt'

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

BOOLEAN_COLUMNS = [
    'Is_Parent_Carrier',
    'Is_Sibling_Affected',
    'Has_Chronic_Cough',
    'Newborn_Screen_Flag',
]

CONDITION_ALIASES = {
    'Huntingtons_Disease': 'G6PD_Deficiency'
}


def preprocess_dataset() -> pd.DataFrame:
    if not DATASET_PATH.exists():
        raise FileNotFoundError(f'Dataset not found at {DATASET_PATH}')

    df = pd.read_csv(DATASET_PATH)
    df['Disease_Status'] = df['Disease_Status'].replace(CONDITION_ALIASES)

    df = df.dropna(subset=FEATURES + ['Disease_Status']).copy()

    df['Gender'] = df['Gender'].map({'Male': 1, 'Female': 0})
    if df['Gender'].isna().any():
        raise ValueError('Dataset contains unsupported gender values.')

    for column in BOOLEAN_COLUMNS:
        if column == 'Newborn_Screen_Flag':
            df[column] = df[column].map({'Detected': 1, 'Not_Detected': 0})
        else:
            df[column] = df[column].map({'Yes': 1, 'No': 0})

        if df[column].isna().any():
            raise ValueError(f'Dataset contains unexpected values in {column}.')

    numeric_columns = [
        'Maternal_Age_at_Birth',
        'Hemoglobin_Level_g/dL',
        'MCV_fL',
        'MCH_pg',
        'Family_History_Score',
    ]
    df[numeric_columns] = df[numeric_columns].astype(float)

    return df


def train():
    df = preprocess_dataset()
    X = df[FEATURES]
    y = df['Disease_Status']

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )

    # Apply SMOTE to balance the training data
    print('Applying SMOTE to balance training data...')
    smote = SMOTE(random_state=42, k_neighbors=3)
    X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
    
    print(f'Original training set size: {len(X_train)}')
    print(f'Resampled training set size: {len(X_train_resampled)}')

    model = RandomForestClassifier(
        n_estimators=500,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        class_weight='balanced',
        n_jobs=-1,
    )
    model.fit(X_train_resampled, y_train_resampled)

    y_pred = model.predict(X_test)
    report = classification_report(
        y_test,
        y_pred,
        target_names=label_encoder.classes_,
        digits=4,
    )

    joblib.dump(model, MODEL_PATH)
    joblib.dump(label_encoder, ENCODER_PATH)
    REPORT_PATH.write_text(report)

    print('Model saved to', MODEL_PATH)
    print('Label encoder saved to', ENCODER_PATH)
    print('--- Classification Report ---')
    print(report)


if __name__ == '__main__':
    train()

