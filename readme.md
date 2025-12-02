
# 🧬 GeneticGuard — Full-Stack Genetic Disease Prediction Platform

GeneticGuard is a comprehensive full-stack application that combines a Python machine-learning microservice with a secure MERN (MongoDB, Express, React, Node.js) application to predict the risk of five high-impact hereditary conditions:

- **β-Thalassemia** — Detect low hemoglobin and microcytosis patterns
- **Cystic Fibrosis** — Spot chronic respiratory indicators
- **Down Syndrome** — Flag clinical markers linked with chromosomal screening
- **G6PD Deficiency** — Evaluate enzymatic risk factors
- **Sickle Cell Anemia** — Identify sickling phenotypes through MCV/MCH signatures

The stack is fully decoupled, allowing each layer to be deployed or scaled independently.

---

## ✨ Features

### User Experience
- **Personalized Landing Page** — Dynamic greeting for logged-in users with quick access to the predictor
- **Smart Form Interface** — Interactive prediction form with:
  - Placeholder guidance for all input fields
  - Dual input controls (number inputs + range sliders) for precise value selection
  - Visual scales showing optimal ranges (e.g., "Low", "Target", "High")
  - Helper text explaining each metric's clinical significance
  - Sample values button for quick testing
  - Auto-clear form after successful predictions
- **Enhanced UI/UX** — Modern gradient hero sections, glassmorphism effects, and intuitive navigation
- **3D Visualization** — Interactive DNA helix animation in the hero section
- **Comprehensive Results** — Detailed prediction outcomes with:
  - Condition prediction with confidence scores
  - Probability breakdown for all conditions
  - Input snapshot for reference
  - Clinical descriptions

### Technical Features
- **JWT Authentication** — Secure user authentication with token-based sessions
- **Protected Routes** — Private routes for authenticated users only
- **RESTful API** — Clean API architecture with proper error handling
- **ML Microservice** — Isolated Python Flask service for model inference
- **Real-time Validation** — Client and server-side input validation

---

## 🏗️ Architecture

```
┌─────────────────┐
│   React Frontend │  (Port 3000)
│   - Auth Context │
│   - Protected Routes │
│   - Prediction UI │
└────────┬─────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Express Backend │  (Port 5000)
│  - JWT Auth     │
│  - MongoDB      │
│  - Route Proxy  │
└────────┬─────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Flask ML API    │  (Port 5001)
│  - Model Load   │
│  - Inference    │
│  - Predictions  │
└─────────────────┘
```

### Directory Structure

- **`ml-api/`** – Flask service that loads the trained model (`genetic_model.joblib`), performs inference, and exposes `/predict` + `/health` endpoints
- **`backend/`** – Express API that handles authentication, MongoDB persistence, and securely forwards prediction payloads to the ML service
- **`frontend/`** – React SPA with polished UI, guarded routes, and context-driven authentication

---

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+ (virtual environment recommended)
- **MongoDB** (local or hosted instance)
- **Dataset** — `dataset.csv` should be in `ml-api/` directory for training

---

## 🔄 End-to-End User Flow

1. **Landing Page** — Public users see the main landing page with signup/login options
2. **Authentication** — Users can sign up or log in to access the platform
3. **Personalized Dashboard** — Logged-in users see:
   - Personalized greeting: "Hello, [Username]!"
   - Quick access button to the predictor
   - Prediction playbook guide
4. **Risk Prediction** — Users can:
   - Fill out the prediction form with clinical metrics
   - Use interactive sliders for precise value selection
   - Click "Use sample values" for quick testing
   - Submit to get instant predictions
5. **Results View** — See detailed prediction results with:
   - Predicted condition with confidence score
   - Probability breakdown for all conditions
   - Clinical descriptions
   - Input snapshot

---

## 🎯 Using the Predictor

### Input Fields

The predictor collects the following clinical metrics:

**Numeric Fields** (with sliders):
- **Maternal Age at Birth** (14-55 years) — Typical healthy window: 20-34 yrs
- **Hemoglobin** (7-20 g/dL) — Balanced range: 11.5-15.5 g/dL
- **MCV** (55-120 fL) — Microcytic if < 80 fL, Macrocytic if > 100 fL
- **MCH** (15-38 pg) — Optimal zone: 27-33 pg
- **Family History Score** (0.00-1.00) — Cumulative risk index

**Select Fields**:
- Patient Gender (Female/Male)
- Parent Carrier Status (No/Yes)
- Sibling Affected (No/Yes)
- Chronic Cough Present (No/Yes)
- Newborn Screening Flag (Not Detected/Detected)

### Tips for Accurate Predictions

- Use the **slider controls** to fine-tune numeric values within clinical ranges
- Refer to the **helper text** below each field for guidance
- Click **"Use sample values"** to see example inputs
- After a prediction, the form clears automatically — placeholders guide your next submission

---

## 🔐 Security Notes

- JWT tokens are stored in `localStorage` (consider httpOnly cookies for production)
- Environment variables should never be committed to version control
- Use strong `JWT_SECRET` values in production
- Enable HTTPS in production environments
- Implement rate limiting for API endpoints
- Validate all inputs on both client and server side

---

## 📊 Model Information

The machine learning model is trained on a dataset with the following features:
- Maternal age at birth
- Gender
- Hemoglobin level (g/dL)
- MCV (fL)
- MCH (pg)
- Family history score
- Parent carrier status
- Sibling affected status
- Chronic cough presence
- Newborn screening flag

The model predicts one of six possible outcomes:
- Healthy
- Beta_Thalassemia
- Cystic_Fibrosis
- Down_Syndrome
- G6PD_Deficiency
- Sickle_Cell_Anemia

---

## 📄 License

This project is provided as-is for educational and research purposes.
