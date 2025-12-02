import json
import urllib.request
import urllib.error

BASE_URL = 'http://localhost:5001/predict'

test_cases = [
    {
        "name": "Beta Thalassemia",
        "payload": {
            "maternalAge": 25,
            "gender": "Female",
            "hemoglobin": 10,
            "mcv": 60,
            "mch": 20,
            "familyHistoryScore": 0.2,
            "isParentCarrier": "No",
            "isSiblingAffected": "No",
            "hasChronicCough": "No",
            "newbornScreen": "Not_Detected"
        },
        "expected": "Beta_Thalassemia"
    },
    {
        "name": "Sickle Cell Anemia",
        "payload": {
            "maternalAge": 25,
            "gender": "Female",
            "hemoglobin": 6,
            "mcv": 85,
            "mch": 29,
            "familyHistoryScore": 0.2,
            "isParentCarrier": "No",
            "isSiblingAffected": "Yes",
            "hasChronicCough": "No",
            "newbornScreen": "Not_Detected"
        },
        "expected": "Sickle_Cell_Anemia"
    },
    {
        "name": "Cystic Fibrosis",
        "payload": {
            "maternalAge": 25,
            "gender": "Male",
            "hemoglobin": 13,
            "mcv": 85,
            "mch": 29,
            "familyHistoryScore": 0.2,
            "isParentCarrier": "No",
            "isSiblingAffected": "No",
            "hasChronicCough": "Yes",
            "newbornScreen": "Detected"
        },
        "expected": "Cystic_Fibrosis"
    },
    {
        "name": "Down Syndrome",
        "payload": {
            "maternalAge": 45,
            "gender": "Female",
            "hemoglobin": 13,
            "mcv": 85,
            "mch": 29,
            "familyHistoryScore": 0.2,
            "isParentCarrier": "No",
            "isSiblingAffected": "No",
            "hasChronicCough": "No",
            "newbornScreen": "Not_Detected"
        },
        "expected": "Down_Syndrome"
    },
    {
        "name": "Huntington's Disease",
        "payload": {
            "maternalAge": 25,
            "gender": "Male",
            "hemoglobin": 13,
            "mcv": 85,
            "mch": 29,
            "familyHistoryScore": 0.9,
            "isParentCarrier": "Yes",
            "isSiblingAffected": "No",
            "hasChronicCough": "No",
            "newbornScreen": "Not_Detected"
        },
        "expected": "Huntingtons_Disease"
    }
]

print("Running verification tests...")
for case in test_cases:
    try:
        data = json.dumps(case["payload"]).encode('utf-8')
        req = urllib.request.Request(BASE_URL, data=data, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                result = json.loads(response.read().decode('utf-8'))
                prediction = result.get("prediction")
                if prediction == case["expected"]:
                    print(f"\n[PASS] {case['name']}")
                else:
                    print(f"\n[FAIL] {case['name']}")
                    print(f"  Expected: {case['expected']}")
                    print(f"  Got:      {prediction}")
                    print(f"  Response: {json.dumps(result, indent=2)}")
            else:
                print(f"\n[ERROR] {case['name']}: API returned {response.status}")
    except urllib.error.HTTPError as e:
        print(f"\n[ERROR] {case['name']}: HTTP {e.code} - {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"\n[ERROR] {case['name']}: {str(e)}")
