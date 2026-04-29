import json
import pytest
from app import app, FEATURE_ORDER

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    response = client.get('/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    assert data['service'] == 'ml-api'
    assert data['feature_count'] == len(FEATURE_ORDER)

def test_predict_endpoint_success(client):
    payload = {
        'maternalAge': 28,
        'gender': 'Female',
        'hemoglobin': 13.2,
        'mcv': 85,
        'mch': 30,
        'familyHistoryScore': 0.35,
        'isParentCarrier': 'No',
        'isSiblingAffected': 'No',
        'hasChronicCough': 'No',
        'newbornScreen': 'Not_Detected'
    }
    response = client.post('/predict', json=payload)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'prediction' in data
    assert 'confidence' in data
    assert 'probabilities' in data

def test_predict_endpoint_missing_field(client):
    payload = {
        'maternalAge': 28,
        # 'gender' is missing
        'hemoglobin': 13.2
    }
    response = client.post('/predict', json=payload)
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
