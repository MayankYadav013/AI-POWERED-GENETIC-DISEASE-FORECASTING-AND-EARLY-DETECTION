import React, { useMemo, useState } from 'react';

import api from '../services/api';

const numericFields = [
  {
    id: 'maternalAge',
    label: 'Maternal age at birth',
    unit: 'yrs',
    min: 14,
    max: 55,
    step: 1,
    placeholder: 'e.g., 29',
    helper: 'Typical healthy pregnancy window: 20 - 34 yrs.',
    scaleStops: ['Teen', 'Optimal', 'Advanced'],
    scaleDefault: 30,
  },
  {
    id: 'hemoglobin',
    label: 'Hemoglobin',
    unit: 'g/dL',
    min: 7,
    max: 20,
    step: 0.1,
    placeholder: 'e.g., 13.2',
    helper: 'Balanced oxygen capacity lives between 11.5 - 15.5 g/dL.',
    scaleStops: ['Low', 'Target', 'High'],
    scaleDefault: 13,
  },
  {
    id: 'mcv',
    label: 'MCV',
    unit: 'fL',
    min: 55,
    max: 120,
    step: 0.1,
    placeholder: 'e.g., 85',
    helper: 'Microcytic if < 80 fL. Macrocytic if > 100 fL.',
    scaleStops: ['Micro', 'Normo', 'Macro'],
    scaleDefault: 86,
  },
  {
    id: 'mch',
    label: 'MCH',
    unit: 'pg',
    min: 15,
    max: 38,
    step: 0.1,
    placeholder: 'e.g., 30',
    helper: 'Goldilocks zone is usually 27 - 33 pg.',
    scaleStops: ['Hypo', 'Optimal', 'Hyper'],
    scaleDefault: 30,
  },
  {
    id: 'familyHistoryScore',
    label: 'Family history score',
    unit: '',
    min: 0,
    max: 1,
    step: 0.01,
    placeholder: '0.00 - 1.00',
    helper: 'Cumulative risk index (0: none, 1: multi-factor flagged).',
    scaleStops: ['None', 'Cluster', 'High'],
    scaleDefault: 0.35,
  },
];

const selectFields = [
  {
    id: 'gender',
    label: 'Patient gender',
    options: ['Female', 'Male'],
  },
  {
    id: 'isParentCarrier',
    label: 'Parent carrier status',
    options: ['No', 'Yes'],
  },
  {
    id: 'isSiblingAffected',
    label: 'Sibling affected?',
    options: ['No', 'Yes'],
  },
  {
    id: 'hasChronicCough',
    label: 'Chronic cough present?',
    options: ['No', 'Yes'],
  },
];

const initialFormState = {
  maternalAge: '',
  gender: '',
  hemoglobin: '',
  mcv: '',
  mch: '',
  familyHistoryScore: '',
  isParentCarrier: '',
  isSiblingAffected: '',
  hasChronicCough: '',
  newbornScreen: '',
};

const samples = {
  Beta_Thalassemia: {
    maternalAge: '19',
    gender: 'Male',
    hemoglobin: '9.2',
    mcv: '66.0',
    mch: '21.8',
    familyHistoryScore: '0.55',
    isParentCarrier: 'No',
    isSiblingAffected: 'No',
    hasChronicCough: 'No',
    newbornScreen: 'Detected',
  },
  Cystic_Fibrosis: {
    maternalAge: '38',
    gender: 'Female',
    hemoglobin: '14.5',
    mcv: '93.6',
    mch: '28.6',
    familyHistoryScore: '0.15',
    isParentCarrier: 'No',
    isSiblingAffected: 'No',
    hasChronicCough: 'Yes',
    newbornScreen: 'Not_Detected',
  },
  Down_Syndrome: {
    maternalAge: '35',
    gender: 'Male',
    hemoglobin: '13.5',
    mcv: '73.1',
    mch: '31.8',
    familyHistoryScore: '0.97',
    isParentCarrier: 'No',
    isSiblingAffected: 'No',
    hasChronicCough: 'No',
    newbornScreen: 'Not_Detected',
  },
  G6PD_Deficiency: {
    maternalAge: '26',
    gender: 'Female',
    hemoglobin: '14.0',
    mcv: '87.4',
    mch: '29.9',
    familyHistoryScore: '0.78',
    isParentCarrier: 'Yes',
    isSiblingAffected: 'No',
    hasChronicCough: 'No',
    newbornScreen: 'Not_Detected',
  },
  Sickle_Cell_Anemia: {
    maternalAge: '28',
    gender: 'Male',
    hemoglobin: '7.9',
    mcv: '72.4',
    mch: '24.9',
    familyHistoryScore: '0.32',
    isParentCarrier: 'No',
    isSiblingAffected: 'No',
    hasChronicCough: 'No',
    newbornScreen: 'Not_Detected',
  },
  Healthy: {
    maternalAge: '28',
    gender: 'Male',
    hemoglobin: '13.6',
    mcv: '95.4',
    mch: '32.5',
    familyHistoryScore: '0.0',
    isParentCarrier: 'No',
    isSiblingAffected: 'No',
    hasChronicCough: 'No',
    newbornScreen: 'Not_Detected',
  }
};

const PredictorPage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasPredicted, setHasPredicted] = useState(false);

  const sliderRanges = useMemo(
    () =>
      numericFields.reduce((acc, field) => {
        acc[field.id] = field.scaleDefault;
        return acc;
      }, {}),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        maternalAge: Number(formData.maternalAge),
        gender: formData.gender,
        hemoglobin: Number(formData.hemoglobin),
        mcv: Number(formData.mcv),
        mch: Number(formData.mch),
        familyHistoryScore: Number(formData.familyHistoryScore),
        isParentCarrier: formData.isParentCarrier,
        isSiblingAffected: formData.isSiblingAffected,
        hasChronicCough: formData.hasChronicCough,
        newbornScreen: formData.newbornScreen || 'Not_Detected',
      };
      const { data } = await api.post('/predict', payload);
      setResult(data);
      setHasPredicted(true);
      setFormData(initialFormState);
    } catch (err) {
      setError(err?.response?.data?.msg || err?.response?.data?.error || 'Prediction failed. Confirm all services are running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleFill = (e) => {
    const key = e.target.value;
    if (key && samples[key]) {
      setFormData(samples[key]);
    }
  };

  const sliderValue = (fieldId) => {
    const current = formData[fieldId];
    if (current === '' || current === null || current === undefined) {
      return sliderRanges[fieldId];
    }
    return Number(current);
  };

  return (
    <section className="predictor-container">
      <div className="form-box">
        <div className="predictor-header">
          <div>
            <h2>Genetic disease risk assessment</h2>
            <p className="form-subtitle">Track each metric against a guided scale to keep the model inputs precise.</p>
          </div>
          <select 
            className="btn-secondary btn-pill sample-select" 
            onChange={handleSampleFill}
            defaultValue=""
            style={{ appearance: 'auto', cursor: 'pointer' }}
          >
            <option value="" disabled>Load sample values...</option>
            <option value="Beta_Thalassemia">β-Thalassemia</option>
            <option value="Cystic_Fibrosis">Cystic Fibrosis</option>
            <option value="Down_Syndrome">Down Syndrome</option>
            <option value="G6PD_Deficiency">G6PD Deficiency</option>
            <option value="Sickle_Cell_Anemia">Sickle Cell Anemia</option>
            <option value="Healthy">Healthy Profile</option>
          </select>
        </div>

        {hasPredicted && !result && (
          <div className="predictor-toast">Previous inputs cleared — placeholders now guide your next submission.</div>
        )}

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="predictor-form">
          <div className="form-grid">
            {numericFields.map((field) => (
              <div key={field.id} className="form-group">
                <div className="field-header">
                  <label htmlFor={field.id}>{field.label}</label>
                  {field.unit && <span className="field-unit">{field.unit}</span>}
                </div>
                <input
                  id={field.id}
                  type="number"
                  name={field.id}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={formData[field.id]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                />
                <div className="input-scale">
                  <input
                    type="range"
                    name={field.id}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={sliderValue(field.id)}
                    onChange={handleChange}
                  />
                  <div className="scale-stops">
                    {field.scaleStops.map((stop) => (
                      <span key={stop}>{stop}</span>
                    ))}
                  </div>
                </div>
                <p className="field-helper">{field.helper}</p>
              </div>
            ))}

            {selectFields.map((field) => (
              <div key={field.id} className={`form-group ${field.id === 'newbornScreen' ? 'full-width' : ''}`}>
                <label htmlFor={field.id}>{field.label}</label>
                <select
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button type="submit" className="btn-primary btn-block predict-btn" disabled={loading}>
            {loading ? 'Analyzing sample...' : 'Predict risk'}
          </button>
        </form>

        <div className="predictor-guide">
          <h3>Why we collect these metrics</h3>
          <ul>
            <li><strong>Blood indices</strong> (Hb, MCV, MCH) quantify oxygen carrying capacity and cell morphology signatures.</li>
            <li><strong>Family clustering</strong> via the history score, carrier, and sibling flags keeps the model sensitive to hereditary prevalence.</li>
            <li><strong>Phenotype triggers</strong> like chronic cough capture neonatal and respiratory cues early.</li>
          </ul>
        </div>

        {result && (
          <>
            <div className={`result-box ${result.prediction === 'Healthy' ? 'success' : 'danger'}`}>
              <p className="result-label">Predicted condition</p>
              <p className="result-value">{result.prediction.replace(/_/g, ' ')}</p>
              {result.confidence && (
                <p className="result-confidence">Confidence: {result.confidence}%</p>
              )}
              <p className="result-description">{result.description}</p>
            </div>
            {result.probabilities && (
              <div className="result-probabilities">
                <h4>Prediction probabilities</h4>
                <div className="probabilities-grid">
                  {Object.entries(result.probabilities)
                    .sort(([, a], [, b]) => b - a)
                    .map(([condition, prob]) => (
                      <div key={condition} className="probability-item">
                        <span className="prob-label">{condition.replace(/_/g, ' ')}</span>
                        <div className="prob-bar-container">
                          <div
                            className="prob-bar"
                            style={{ width: `${prob * 100}%` }}
                          />
                        </div>
                        <span className="prob-value">{(prob * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {result.features && (
              <div className="result-meta">
                <h4>Input snapshot</h4>
                <div className="result-meta-grid">
                  {Object.entries(result.features).map(([key, value]) => (
                    <div key={key} className="result-meta-item">
                      <p className="meta-label">{key.replace(/_/g, ' ')}</p>
                      <p className="meta-value">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PredictorPage;
