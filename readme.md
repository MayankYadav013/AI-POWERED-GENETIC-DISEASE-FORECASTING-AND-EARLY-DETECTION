Genetic Disease Risk Predictor - Web Application

📖 Overview

This is a self-contained web application designed to provide a preliminary risk assessment for five significant genetic diseases prevalent in India: β-Thalassemia, Cystic Fibrosis, Down Syndrome, G6PD Deficiency, and Sickle Cell Anemia.

The application features a user-friendly interface for entering patient data and utilizes an embedded JavaScript logic engine to simulate the predictions of a machine learning model trained on a large dataset (50,000 patient records). It aims to provide an accessible demonstration of how such a risk assessment tool might function.

✨ Features

Comprehensive Input Form: Collects essential demographic, clinical, and family history data relevant to genetic risk.

Instant Prediction: Employs an embedded JavaScript "points-based" scoring system that mimics the decision patterns learned by a sophisticated Random Forest model.

Clear Results: Displays the predicted risk category (e.g., "High Risk," "Potential Risk," "Low Risk") along with a descriptive explanation.

Dynamic Styling: Results are color-coded (Red for High Risk, Yellow for Potential Risk, Green for Low Risk) for immediate visual feedback.

Standalone Application: Runs entirely in the browser; no server or internet connection is required after loading.

Important Medical Disclaimer: Clearly states that the tool is for informational purposes only and not a substitute for professional medical advice.

⚙️ Technology Stack

Frontend: HTML

Styling: Tailwind CSS (via CDN)

Icons: FontAwesome (via CDN)

Logic: Vanilla JavaScript (embedded)

🧠 How It Works

Instead of directly running a Python model, this application uses a sophisticated JavaScript function (predictRisk()) within the HTML file. This function acts as a rule-based engine:

Gathers Inputs: It reads all the values entered by the user in the form.

Calculates Scores: It assigns points to each of the six possible outcomes (the five diseases + Healthy) based on the input data. These scoring rules are designed to emulate the key decision factors learned by the Random Forest model trained on the 50,000-row dataset (e.g., low MCV strongly increases the β-Thalassemia score, high maternal age increases the Down Syndrome score).

Determines Prediction: The outcome with the highest score is selected as the final prediction.

Displays Result: The application then shows the corresponding disease name, description, and color-coding based on the prediction.

💻 How to Use

Save: Save the index.html file to your computer.

Open: Double-click the saved index.html file. It will open in your default web browser.

Enter Data: Fill in all the fields in the patient information form.

Predict: Click the "Predict Risk" button.

View Result: The prediction and explanation will appear below the button.

⚕️ Important Disclaimer

This tool is an educational project and simulates a machine learning model. It is NOT a substitute for a real medical diagnosis. The predictions are based on rules derived from a model trained on synthetic data. For any health concerns, please consult a qualified medical professional for accurate diagnosis and genetic counseling.