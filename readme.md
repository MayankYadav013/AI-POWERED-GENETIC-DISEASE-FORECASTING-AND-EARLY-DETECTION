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

## 🚀 Quick Start

### Option 1: Run All Services (Recommended)

From the project root directory:

```bash
# Install dependencies for backend and frontend
npm --prefix backend install
npm --prefix frontend install

# Start backend (runs in background)
npm --prefix backend run dev

# Start ML API (runs in background)
cd ml-api
.\venv\Scripts\python.exe app.py
# Or on macOS/Linux: source venv/bin/activate && python app.py

# Start frontend (runs in background)
npm --prefix frontend start
```

### Option 2: Run Services Individually

#### 1. Machine-Learning Service (Port 5001)

```bash
cd ml-api

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train the model (first time or when dataset changes)
python train_model.py

# Run the Flask API
python app.py
```

You should see:
```
Model and label encoder loaded successfully
Running on http://0.0.0.0:5001
```

#### 2. Backend API (Port 5000)

```bash
cd backend

# Copy environment template
cp env.example .env

# Edit .env and update the following values:
# - MONGO_URI (MongoDB connection string)
# - JWT_SECRET (random secure string)
# - ML_SERVICE_URL (http://localhost:5001/predict)
# - CLIENT_URL (http://localhost:3000)

# Install dependencies
npm install

# Start server (development mode with auto-reload)
npm run dev

# Or production mode
npm start
```

**Key Environment Variables** (`backend/.env`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/genetic_guard
ENABLE_MEMORY_DB=true          # falls back to in-memory Mongo when Atlas/local DB is unreachable
MONGO_TIMEOUT_MS=5000
JWT_SECRET=your-super-secret-jwt-key-here
ML_SERVICE_URL=http://localhost:5001/predict
CLIENT_URL=http://localhost:3000
```

> ⚠️ Set `ENABLE_MEMORY_DB=false` in production so the API fails fast instead of using the temporary in-memory database. When enabled, the backend automatically boots a throwaway Mongo instance (powered by `mongodb-memory-server`) whenever it cannot connect to the primary URI—handy for local development and demos.

#### 3. Frontend (Port 3000)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will automatically open in your browser at `http://localhost:3000`.

**Optional:** Create `frontend/.env` if you need to change the API base URL:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

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

## 🛠️ Troubleshooting

| Symptom | Solution |
|---------|----------|
| `ML service error` in React | Confirm Flask server is running on `http://localhost:5001` and `ML_SERVICE_URL` in backend `.env` matches |
| `MongoDB Connected` never appears | Verify `MONGO_URI` points to a reachable instance and MongoDB is running locally or remotely. With `ENABLE_MEMORY_DB=true`, the server will automatically use an in-memory fallback, but data will reset on every restart. |
| `Invalid value for ...` when predicting | Ensure form inputs stay within allowed ranges (Family history score 0–1, positive lab values, etc.) |
| 401 responses after refresh | Token likely expired or missing. Clear `localStorage` token and log in again |
| Frontend won't start | Check if port 3000 is already in use. Kill the process or change the port |
| Backend connection errors | Verify MongoDB is running and the connection string in `.env` is correct |
| ML API not responding | Ensure Python virtual environment is activated and all dependencies are installed |

---

## 📝 Useful Commands

### Backend
```bash
npm run dev        # Development mode with nodemon (auto-reload)
npm start          # Production mode
```

### Frontend
```bash
npm start          # Development server (auto-opens browser)
npm run build      # Production build
npm test           # Run tests
```

### ML Service
```bash
python train_model.py     # Retrain model and save new artifacts
python app.py            # Run Flask API server
```

### Stopping Services

**Windows PowerShell:**
```powershell
# Stop all Node.js processes
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# Stop all Python processes
Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process -Force
```

**macOS/Linux:**
```bash
# Find and kill processes by port
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:5001 | xargs kill -9  # ML API
```

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

## 🚢 Deployment Considerations

### Frontend
- Build production bundle: `npm run build`
- Serve static files from `build/` directory
- Configure environment variables for production API URL

### Backend
- Set `NODE_ENV=production`
- Use process manager (PM2, systemd, etc.)
- Configure MongoDB connection for production
- Set secure `JWT_SECRET`

### ML API
- Deploy Flask app using Gunicorn or similar WSGI server
- Ensure model files (`genetic_model.joblib`, `label_encoder.joblib`) are included
- Configure CORS for production domains

---

## 📄 License

This project is provided as-is for educational and research purposes.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues, questions, or suggestions, please open an issue on the repository.

---

**Happy predicting! 🧬**

Let us know if you deploy GeneticGuard to the cloud or integrate it with new clinical data sources.
