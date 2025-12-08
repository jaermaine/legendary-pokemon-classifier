# Legendary Pokémon Classifier

An AI-powered web application that predicts whether a Pokémon is Legendary based on its base stats. Built with FastAPI backend and interactive HTML/CSS/JavaScript frontend.

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104%2B-009688)

## 🎯 Overview

This project uses machine learning to classify Pokémon as either **Legendary** or **Non-Legendary** based on their base stats (HP, Attack, Defense, Special Attack, Special Defense, Speed).

The application features:
- **Real-time predictions** with probability scores
- **Feature importance visualization** showing which stats matter most
- **SHAP explanations** (or fallback method) for individual predictions
- **Similar Pokémon finder** to compare with training data
- **Interactive stat visualization** with charts and breakdowns
- **Responsive web interface** with tabs for prediction and explainability

## 📋 Requirements

- Python 3.8+
- FastAPI 0.104+
- scikit-learn 1.3+
- NumPy 1.24+
- Pandas 2.0+
- joblib 1.3+
- SHAP (optional, for advanced explanations)

## 🚀 Quick Start

### 1. Installation

```bash
# Clone or navigate to the project directory
cd PokemonClassifier

# Install dependencies
pip install -r requirements.txt
```

### 2. Run the Backend

```bash
# Start the FastAPI server
uvicorn app:app --reload

# Server will be available at: http://localhost:8000
```

### 3. Run the Frontend

```bash
# Option 1: Using Python's built-in server
python -m http.server 8080

# Option 2: Using Node.js http-server (if installed)
http-server --port 8080

# Option 3: Open index.html directly in a browser
# Navigate to: http://localhost:8080/index.html
```

### 4. Access the Application

Open your browser and go to:
```
http://localhost:8080
```

## � Landing Page JavaScript Features

The landing page includes advanced interactive features:

### **Smooth Scrolling**
- All CTA buttons smoothly scroll to target sections
- Keyboard accessible (Enter/Space keys supported)
- History API updates without page jump

### **Sticky Navigation with Intersection Observer**
- Detects when hero section leaves viewport
- Animated appearance (slide down, 300ms)
- Auto-hides when hero is visible
- Real-time active link highlighting

### **Animated Counters**
- Numbers animate from 0 to target value
- Triggers when stats section enters viewport
- Duration: 2 seconds with easing
- Supports decimal values (e.g., 95.2%)

### **Scroll Progress Bar**
- Thin line at top of page
- Updates in real-time as you scroll
- Gradient color (red → yellow → blue)
- Responsive to viewport height

### **Intersection Observer Animations**
- Elements fade in as they enter viewport
- Feature cards slide in with lift effect
- Stat cards animate on scroll
- Timeline steps cascade in
- Tech badges appear with stagger effect

### **Parallax Background**
- Hero section background moves as you scroll
- Subtle effect for better visual depth
- Only active while hero is visible

### **Button Effects**
- Ripple animation on click
- Hover states with transform
- Box shadow transitions
- Active press feedback

### **Prediction Tracking**
- LocalStorage tracks total predictions made
- Dynamic counter updates on new predictions
- Persists across sessions
- Dispatches custom events for UI updates

### **Lazy Loading**
- Sections optimize when entering viewport
- Deferred initialization of heavy components
- Improves initial page load performance

### **Keyboard Accessibility**
- All navigation links support Enter key
- ARIA labels for screen readers
- Proper focus management
- Skip links not needed (short page)

### **Responsive Design**
- Mobile breakpoint: 768px
- Tablet breakpoint: 1024px
- Stacks all grids vertically on mobile
- Reduced font sizes for small screens
- Full-width CTAs on mobile

## �📁 Project Structure

```
PokemonClassifier/
├── app.py                           # FastAPI backend
├── index.html                       # Main HTML interface
├── script.js                        # Frontend JavaScript logic
├── styles.css                       # CSS styling
├── requirements.txt                 # Python dependencies
├── README.md                        # This file
├── test_model.py                   # Model testing utility
│
├── backend/
│   ├── models/
│   │   ├── legendary_classifier_v1.pkl   # Trained ML model
│   │   ├── scaler.pkl                    # Feature scaler
│   │   ├── feature_importance.pkl        # Feature importance data
│   │   └── training_data.pkl             # Training data for similarity lookup
│   │
│   └── api/
│       └── models/
│
├── images/
│   ├── logo/
│   │   └── pokeball_logo.png
│   └── background/
│
└── __pycache__/
```

## 🔌 API Endpoints

### GET `/`
Root endpoint - returns API information and available endpoints.

**Response:**
```json
{
  "name": "Legendary Pokémon Classifier API",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "predict": "/predict (POST)",
    "feature-importance": "/feature-importance (GET)",
    "health": "/health (GET)"
  }
}
```

---

### GET `/health`
Health check endpoint - returns the status of loaded models and data.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "scaler_loaded": true,
  "shap_available": false,
  "feature_importance_available": true,
  "explanation_method": "fallback"
}
```

---

### POST `/predict`
Predicts whether a Pokémon is Legendary based on base stats.

**Request Body:**
```json
{
  "hp": 91,
  "attack": 134,
  "defense": 95,
  "sp_attack": 100,
  "sp_defense": 100,
  "speed": 80
}
```

**Response:**
```json
{
  "prediction": 1,
  "probability_legendary": 0.85,
  "probability_non_legendary": 0.15,
  "confidence": "High",
  "stats": { ... },
  "feature_contributions": [ ... ],
  "explanation_method": "fallback",
  "model_type": "RandomForestClassifier"
}
```

---

### GET `/feature-importance`
Returns the overall feature importance for the model.

**Response:**
```json
{
  "model_type": "RandomForestClassifier",
  "importance_type": "feature_importances",
  "features": [
    {
      "feature": "sp_attack",
      "display_name": "Special Attack",
      "importance": 0.25
    },
    ...
  ]
}
```

---

### POST `/similar-pokemon`
Finds the 5 most similar Pokémon from the training data.

**Request Body:**
```json
{
  "hp": 91,
  "attack": 134,
  "defense": 95,
  "sp_attack": 100,
  "sp_defense": 100,
  "speed": 80
}
```

**Response:**
```json
{
  "similar_pokemon": [
    {
      "name": "Dragonite",
      "distance": 2.5,
      "bst": 600,
      "legendary": 0
    },
    ...
  ],
  "count": 5
}
```

## 🎨 Frontend Features

### Landing Page (NEW!)
The application now includes a comprehensive landing page with the following sections:

#### **1. Hero Section**
- Eye-catching headline: "Predict Legendary Pokémon with AI"
- Subheading highlighting 700+ Pokémon training data
- Primary CTA button with smooth scroll to dashboard
- Animated gradient background with floating blobs
- Scroll indicator showing more content below

#### **2. Features Showcase**
- **3-card grid** highlighting key capabilities:
  - 95%+ Accuracy: Trained on extensive dataset
  - Explainable AI: SHAP visualizations for transparency
  - Real-Time Insights: Instant predictions with details
- Hover effects with lift animation
- Responsive grid (adapts to screen size)

#### **3. How It Works**
- **3-step horizontal timeline** explaining the process:
  1. Input Stats (📝) - Enter Pokémon base stats
  2. AI Analyzes (🤖) - Model processes instantly
  3. Get Results (🏆) - Receive probability and explanations
- Step numbers with gradient background
- Visual icons for each step

#### **4. Model Statistics**
- **Dynamic stat cards** with animated counters:
  - 750+ Training Samples
  - 95.2% Accuracy Rate
  - 6 Features Analyzed
  - Predictions Made (tracked dynamically)
- Counters animate when section enters viewport

#### **5. Technology Stack**
- **Badge display** of technologies used:
  - Python 🐍
  - FastAPI ⚙️
  - scikit-learn 🌲
  - XGBoost 🚀
  - SHAP 📊
  - Chart.js 📈
- Hover effects with scale animation

#### **6. Call-to-Action Section**
- Secondary CTA: "Try the Classifier Now"
- Blue gradient background
- Large, prominent button linking to dashboard

#### **7. Sticky Navigation**
- Appears when hero section scrolls out of view
- Logo and app title on left
- Navigation links on right:
  - About (links to landing)
  - Dashboard (links to dashboard)
  - GitHub (external link)
- Active link highlighting based on scroll position
- Smooth slide-down animation
- Fixed positioning with backdrop blur

#### **8. Back-to-Top Button**
- Fixed button in bottom-right corner
- Appears after scrolling 300px
- Smooth scroll animation back to top
- Gradient background matching theme

### Prediction Tab
- **Input Panel** (Left): Enter Pokémon base stats
- **Prediction Card**: Shows legendary probability with visual bar
- **Confidence Indicator**: Displays prediction confidence level
- **Base Stat Total (BST)**: Shows sum of all stats with category
- **Stat Distribution**: Radar chart visualization of stat distribution
- **Stat Breakdown**: Shows offensive, defensive, speed, and bulk ratings
- **Comparison Chart**: Compares stats to legendary/non-legendary averages
- **Similar Pokémon**: Lists the 5 most similar Pokémon from training data
- **Model Information**: Displays model type and explanation method

### Explainability Tab
- **Global Feature Importance**: Bar chart showing which features matter most
- **Per-Feature Contribution**: Individual feature contribution to the prediction
  - Shows positive/negative impact
  - Magnitude: High, Medium, Low
  - Detailed explanation for each stat

## 🤖 Model Details

- **Type**: Random Forest Classifier (or similar tree-based model)
- **Features**: 6 base stats (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed)
- **Training Data**: 700+ Pokémon from Generations 1-9
- **Decision Threshold**: ≥ 50% probability = Legendary
- **Explanation Method**: SHAP (if available) or importance-based fallback

## 🔧 Configuration

### Model Paths
Update these paths in `app.py` if your model files are in different locations:
```python
MODEL_PATH = "backend/models/legendary_classifier_v1.pkl"
SCALER_PATH = "backend/models/scaler.pkl"
FEATURE_IMPORTANCE_PATH = "backend/models/feature_importance.pkl"
TRAINING_DATA_PATH = "backend/models/training_data.pkl"
```

### API Configuration
```python
# In app.py
API_HOST = "0.0.0.0"
API_PORT = 8000
```

### Frontend Configuration
```javascript
// In script.js
const API_BASE_URL = 'http://localhost:8000';
```

## 📊 Understanding the Predictions

### Confidence Levels
- **High**: Probability ≥ 80% or ≤ 20%
- **Medium**: Probability ≥ 60% or ≤ 40%
- **Low**: All other probabilities

### Feature Contributions
- **Positive Impact** (↑): Pushes the prediction toward "Legendary"
- **Negative Impact** (↓): Pushes the prediction toward "Non-Legendary"
- **Neutral** (→): Minimal impact on the prediction

### Stat Categories
- **Offensive Power**: Average of Attack and Special Attack
- **Defensive Power**: Average of Defense and Special Defense
- **Speed Rating**: Speed stat value
- **Bulk (HP)**: HP stat value

## 🐛 Troubleshooting

### Issue: "Model not loaded" error
**Solution**: Ensure `legendary_classifier_v1.pkl` exists in `backend/models/`

### Issue: Feature importance shows as 500 error
**Solution**: Check that `feature_importance.pkl` exists or the model has `feature_importances_` attribute

### Issue: Similar Pokémon showing "Pokemon #<number>"
**Solution**: Ensure your training data CSV has a `name` column with Pokémon names

### Issue: CORS errors
**Solution**: The API has CORS enabled for all origins. Check browser console for specific errors.

### Issue: Prediction API returns 500
**Solution**: 
1. Check uvicorn terminal for error messages
2. Verify all model files are present and readable
3. Run `python test_model.py` to verify model loading

## 📈 Using Your Own Model

To use a different trained model:

1. Save your trained model with joblib:
   ```python
   import joblib
   joblib.dump(your_model, 'backend/models/legendary_classifier_v1.pkl')
   ```

2. If using a scaler:
   ```python
   joblib.dump(your_scaler, 'backend/models/scaler.pkl')
   ```

3. Save feature importance:
   ```python
   importance_dict = {
       'importances': your_model.feature_importances_,
       'type': 'feature_importances'
   }
   joblib.dump(importance_dict, 'backend/models/feature_importance.pkl')
   ```

4. Restart the API server

## 🎓 How It Works

1. **User inputs stats** via the web interface
2. **Frontend validates** the input (1-255 range)
3. **API receives POST request** to `/predict`
4. **Backend prepares features**: Optional scaling, format conversion
5. **Model predicts**: Returns legendary class (0 or 1)
6. **Probabilities calculated**: Using `predict_proba()`
7. **Explanations generated**: SHAP values or fallback method
8. **Response sent** with prediction, probabilities, and explanations
9. **Frontend displays**: Updates UI with prediction and feature contributions

## 📝 Example Usage

```bash
# Terminal 1: Start the API
uvicorn app:app --reload

# Terminal 2: Serve the frontend
python -m http.server 8080

# Browser: Navigate to http://localhost:8080
# Enter Pokémon stats and click "Predict Legendary Status"
```

## 📦 Dependencies

See `requirements.txt` for complete list. Key packages:
- **FastAPI**: Web framework
- **joblib**: Model serialization
- **scikit-learn**: Machine learning
- **numpy**: Numerical computing
- **pandas**: Data manipulation
- **SHAP**: Model explainability (optional)

## 🔒 Security Notes

- ✅ All inputs are validated (1-255 range)
- ✅ CORS enabled for development
- ⚠️ For production, restrict `allow_origins` in FastAPI config
- ⚠️ Consider adding rate limiting for API endpoints

## 📄 License

This project is provided as-is for educational and personal use.

## 🤝 Contributing

To improve this project:
1. Enhance the ML model with better training data
2. Add more visualization features
3. Improve UI/UX design
4. Add prediction history/bookmarking
5. Create data export features

## ✨ Future Enhancements

- [ ] User authentication and saved predictions
- [ ] Batch prediction upload (CSV)
- [ ] Model performance metrics dashboard
- [ ] Pokémon type classification integration
- [ ] Mobile-responsive improvements
- [ ] Dark mode support
- [ ] Export predictions to CSV/PDF

---

**Built with ❤️ for Pokémon enthusiasts and ML engineers**
