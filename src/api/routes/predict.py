"""API routes and endpoints"""

from fastapi import APIRouter, HTTPException
import numpy as np
from scipy.spatial.distance import euclidean

from ..core.config import FEATURE_NAMES, FEATURE_DISPLAY_NAMES
from ..core.schemas import (
    PokemonStats, PredictionResponse, FeatureImportanceResponse,
    FeatureImportanceItem, SimilarPokemonResponse, SimilarPokemonItem
)
from ..utils.prediction import prepare_features, calculate_confidence, calculate_shap_contributions

router = APIRouter()


# ============================================================================
# GLOBAL STATE
# ============================================================================

state = {
    'model': None,
    'scaler': None,
    'feature_importance': None,
    'shap_explainer': None,
    'training_data': None
}


def set_state(model, scaler, feature_importance, shap_explainer, training_data):
    """Set the global state with loaded models and data"""
    state['model'] = model
    state['scaler'] = scaler
    state['feature_importance'] = feature_importance
    state['shap_explainer'] = shap_explainer
    state['training_data'] = training_data


# ============================================================================
# ROOT ENDPOINTS
# ============================================================================

@router.get("/")
async def root():
    """Root endpoint - returns API information"""
    return {
        "name": "Legendary Pokémon Classifier API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "predict": "/predict (POST)",
            "feature-importance": "/feature-importance (GET)",
            "similar-pokemon": "/similar-pokemon (POST)",
            "health": "/health (GET)",
            "docs": "/docs"
        }
    }


@router.get("/health")
async def health_check():
    """Health check endpoint - returns status of loaded models and data"""
    return {
        "status": "healthy",
        "model_loaded": state['model'] is not None,
        "scaler_loaded": state['scaler'] is not None,
        "shap_available": state['shap_explainer'] is not None,
        "feature_importance_available": state['feature_importance'] is not None,
        "explanation_method": "SHAP" if state['shap_explainer'] is not None else "fallback"
    }


# ============================================================================
# PREDICTION ENDPOINTS
# ============================================================================

@router.post("/predict", response_model=PredictionResponse)
async def predict_legendary(stats: PokemonStats):
    """Predict whether a Pokémon is Legendary based on base stats"""
    if state['model'] is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Prepare features
        features = prepare_features(stats, state['scaler'])
        
        # Make prediction
        prediction = state['model'].predict(features)[0]
        
        # Get probability scores
        try:
            probabilities = state['model'].predict_proba(features)[0]
            prob_non_legendary = float(probabilities[0])
            prob_legendary = float(probabilities[1])
        except AttributeError:
            prob_legendary = 1.0 if prediction == 1 else 0.0
            prob_non_legendary = 1.0 - prob_legendary
        
        # Calculate confidence
        confidence = calculate_confidence(prob_legendary)
        
        # Calculate feature contributions
        feature_contributions, method = calculate_shap_contributions(
            features, stats, int(prediction), prob_legendary,
            state['feature_importance'], state['shap_explainer']
        )
        
        return PredictionResponse(
            prediction=int(prediction),
            probability_legendary=prob_legendary,
            probability_non_legendary=prob_non_legendary,
            confidence=confidence,
            stats=stats.dict(),
            feature_contributions=feature_contributions,
            explanation_method=method,
            model_type=type(state['model']).__name__
        )
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


# ============================================================================
# FEATURE IMPORTANCE ENDPOINTS
# ============================================================================

@router.get("/feature-importance", response_model=FeatureImportanceResponse)
async def get_feature_importance():
    """Get overall feature importance for the model"""
    if state['model'] is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    if state['feature_importance'] is None:
        raise HTTPException(status_code=500, detail="Feature importance not available")
    
    try:
        model_type = type(state['model']).__name__
        importance_type = state['feature_importance'].get('type', 'unknown')
        importances = state['feature_importance']['importances']
        
        features = []
        for i, feature_name in enumerate(FEATURE_NAMES):
            features.append(FeatureImportanceItem(
                feature=feature_name,
                display_name=FEATURE_DISPLAY_NAMES[feature_name],
                importance=float(importances[i])
            ))
        
        features.sort(key=lambda x: x.importance, reverse=True)
        
        return FeatureImportanceResponse(
            model_type=model_type,
            importance_type=importance_type,
            features=features
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving feature importance: {str(e)}")


# ============================================================================
# SIMILARITY ENDPOINTS
# ============================================================================

@router.post("/similar-pokemon", response_model=SimilarPokemonResponse)
async def find_similar_pokemon(stats: PokemonStats):
    """Find the 5 most similar Pokémon from training data"""
    if state['training_data'] is None:
        raise HTTPException(status_code=503, detail="Training data not available")
    
    try:
        # Convert input stats to array
        input_vector = np.array([
            stats.hp, stats.attack, stats.defense,
            stats.sp_attack, stats.sp_defense, stats.speed
        ])
        
        # Calculate distances to all training samples
        distances = []
        for idx, row in state['training_data'].iterrows():
            train_vector = np.array([
                row['hp'], row['attack'], row['defense'],
                row['sp_attack'], row['sp_defense'], row['speed']
            ])
            dist = euclidean(input_vector, train_vector)
            
            # Try multiple column names for Pokemon name
            pokemon_name = None
            for col_name in ['name_stats', 'Name', 'pokemon_name']:
                if col_name in row.index:
                    potential_name = row[col_name]
                    if not (isinstance(potential_name, float) and np.isnan(potential_name)) and potential_name != '':
                        pokemon_name = str(potential_name)
                        break
            
            # Fallback to Pokemon number if no name found
            if pokemon_name is None or pokemon_name == '':
                pokemon_name = f"Pokemon #{idx + 1}"
            
            distances.append(SimilarPokemonItem(
                name=pokemon_name,
                distance=float(dist),
                bst=int(train_vector.sum()),
                legendary=int(row.get('legendary', 0))
            ))
        
        # Sort by distance and get top 5
        distances.sort(key=lambda x: x.distance)
        similar = distances[:5]
        
        return SimilarPokemonResponse(
            similar_pokemon=similar,
            count=len(similar)
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding similar Pokemon: {str(e)}")
