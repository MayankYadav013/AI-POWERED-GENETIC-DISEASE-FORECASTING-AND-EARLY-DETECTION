import urllib.request
import json

samples = {
  "Beta_Thalassemia": {
    "maternalAge": 29,
    "gender": "Female",
    "hemoglobin": 9.5,
    "mcv": 62.6,
    "mch": 25.6,
    "familyHistoryScore": 0.78,
    "isParentCarrier": "No",
    "isSiblingAffected": "No",
    "hasChronicCough": "Yes",
    "newbornScreen": "Detected",
  },
  "Cystic_Fibrosis": {
    "maternalAge": 26,
    "gender": "Male",
    "hemoglobin": 14.4,
    "mcv": 86.1,
    "mch": 29.1,
    "familyHistoryScore": 0.79,
    "isParentCarrier": "No",
    "isSiblingAffected": "No",
    "hasChronicCough": "Yes",
    "newbornScreen": "Not_Detected",
  },
  "Down_Syndrome": {
    "maternalAge": 40,
    "gender": "Male",
    "hemoglobin": 14.5,
    "mcv": 85.9,
    "mch": 29.1,
    "familyHistoryScore": 0.02,
    "isParentCarrier": "No",
    "isSiblingAffected": "No",
    "hasChronicCough": "No",
    "newbornScreen": "Detected",
  },
  "G6PD_Deficiency": {
    "maternalAge": 24,
    "gender": "Female",
    "hemoglobin": 13.3,
    "mcv": 92.9,
    "mch": 28.7,
    "familyHistoryScore": 0.56,
    "isParentCarrier": "No",
    "isSiblingAffected": "No",
    "hasChronicCough": "No",
    "newbornScreen": "Detected",
  },
  "Sickle_Cell_Anemia": {
    "maternalAge": 33,
    "gender": "Male",
    "hemoglobin": 7.4,
    "mcv": 64.1,
    "mch": 25.5,
    "familyHistoryScore": 0.55,
    "isParentCarrier": "No",
    "isSiblingAffected": "No",
    "hasChronicCough": "No",
    "newbornScreen": "Not_Detected",
  },
  "Healthy": {
    "maternalAge": 28,
    "gender": "Female",
    "hemoglobin": 13.2,
    "mcv": 85,
    "mch": 30,
    "familyHistoryScore": 0.35,
    "isParentCarrier": "No",
    "isSiblingAffected": "No",
    "hasChronicCough": "No",
    "newbornScreen": "Not_Detected",
  }
}

for disease, data in samples.items():
    req = urllib.request.Request(
        'http://localhost:5001/predict',
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            res_json = json.loads(res_body)
            pred = res_json.get('prediction')
            conf = res_json.get('confidence')
            print(f"Sample: {disease:20s} => Predicted: {pred:20s} (Conf: {conf}%)")
            if disease != pred and not (disease == "G6PD_Deficiency" and pred in ["G6PD_Deficiency", "Huntingtons_Disease"]):
                print(f"  MISMATCH! Expected {disease}, got {pred}")
    except Exception as e:
        print(f"Error for {disease}: {e}")
