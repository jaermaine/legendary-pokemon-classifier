"""
Legendary Pokémon Classifier API

A FastAPI-based machine learning API that predicts whether a Pokémon 
is Legendary based on its base stats, with SHAP-based explanations.

Modular structure:
- src/api/core/: Core configuration and schemas
- src/api/utils/: Utility functions for model loading and prediction
- src/api/routes/: API endpoints and routes
- src/frontend/: Frontend files (HTML, CSS, JS)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.core.config import (
    API_TITLE, API_DESCRIPTION, API_VERSION,
    CORS_ORIGINS, CORS_CREDENTIALS, CORS_METHODS, CORS_HEADERS
)
from src.api.utils.model_loader import (
    load_model, load_scaler, load_feature_importance,
    load_training_data, extract_feature_importance, initialize_shap_explainer
)
from src.api.routes.predict import router, set_state


# ============================================================================
# FASTAPI APP INITIALIZATION
# ============================================================================

app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION
)

# Add CORS middleware FIRST to handle OPTIONS requests properly
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=CORS_CREDENTIALS,
    allow_methods=CORS_METHODS,
    allow_headers=CORS_HEADERS,
)

# Include routes
app.include_router(router)


# ============================================================================
# STARTUP EVENT
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Load models and data on application startup"""
    print("🚀 Starting Legendary Pokémon Classifier API...")
    
    # Load model (required)
    model = None
    try:
        model = load_model()
    except Exception as e:
        print(f"❌ Critical error loading model: {str(e)}")
    
    # Load scaler (optional)
    scaler = load_scaler()
    
    # Load or compute feature importance
    feature_importance = None
    shap_explainer = None
    
    if model is not None:
        feature_importance = load_feature_importance()
        if feature_importance is None:
            feature_importance = extract_feature_importance(model)
        
        # Initialize SHAP explainer
        shap_explainer = initialize_shap_explainer(model)
    else:
        print("⚠️ Skipping feature importance and SHAP initialization (model not loaded)")
    
    # Load training data for similar Pokemon lookup
    training_data = load_training_data()
    
    # Set state in routes
    set_state(model, scaler, feature_importance, shap_explainer, training_data)
    
    print("✅ API is ready to serve predictions!")


# ============================================================================
# SHUTDOWN EVENT
# ============================================================================

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown"""
    print("👋 Shutting down API...")


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
