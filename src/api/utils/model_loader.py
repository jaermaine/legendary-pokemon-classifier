"""Model loading and management utilities"""

import os
import joblib
import numpy as np
from typing import Optional, Any, Dict

from ..core.config import (
    MODEL_PATH, SCALER_PATH, FEATURE_IMPORTANCE_PATH, 
    TRAINING_DATA_PATH, BACKGROUND_DATA_PATH, FEATURE_NAMES
)

# Check SHAP availability
try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False
    print("⚠️ SHAP not installed. Using fallback explanation method.")


# ============================================================================
# MODEL LOADING FUNCTIONS
# ============================================================================

def load_model(model_path: str = MODEL_PATH):
    """Load the trained ML model"""
    try:
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        model = joblib.load(model_path)
        print(f"✅ Model loaded successfully: {type(model).__name__}")
        return model
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        raise


def load_scaler(scaler_path: str = SCALER_PATH) -> Optional[Any]:
    """Load feature scaler"""
    try:
        if os.path.exists(scaler_path):
            scaler = joblib.load(scaler_path)
            print(f"✅ Scaler loaded successfully")
            return scaler
        else:
            print("ℹ️ No scaler found")
            return None
    except Exception as e:
        print(f"⚠️ Warning loading scaler: {str(e)}")
        return None


def load_feature_importance(importance_path: str = FEATURE_IMPORTANCE_PATH) -> Optional[Dict]:
    """Load pre-computed feature importance"""
    try:
        if os.path.exists(importance_path):
            importance = joblib.load(importance_path)
            print(f"✅ Feature importance loaded")
            return importance
        else:
            print("ℹ️ No pre-computed feature importance found")
            return None
    except Exception as e:
        print(f"⚠️ Warning loading feature importance: {str(e)}")
        return None


def load_training_data(data_path: str = TRAINING_DATA_PATH):
    """Load training data for similar Pokemon comparisons"""
    try:
        if os.path.exists(data_path):
            data = joblib.load(data_path)
            print(f"✅ Training data loaded: {len(data)} samples")
            return data
        else:
            print("ℹ️ No training data file found")
            return None
    except Exception as e:
        print(f"⚠️ Error loading training data: {str(e)}")
        return None


# ============================================================================
# FEATURE IMPORTANCE EXTRACTION
# ============================================================================

def extract_feature_importance(model) -> Dict[str, Any]:
    """Extract feature importance from the model"""
    try:
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            importance_type = "feature_importances"
        elif hasattr(model, 'coef_'):
            importances = np.abs(model.coef_[0])
            importance_type = "coefficient_magnitude"
        else:
            importances = np.ones(len(FEATURE_NAMES)) / len(FEATURE_NAMES)
            importance_type = "uniform"
        
        # Normalize to sum to 1
        importances = importances / importances.sum()
        
        return {
            'importances': importances,
            'type': importance_type
        }
    
    except Exception as e:
        print(f"⚠️ Error extracting feature importance: {str(e)}")
        return {
            'importances': np.ones(len(FEATURE_NAMES)) / len(FEATURE_NAMES),
            'type': 'uniform'
        }


# ============================================================================
# SHAP EXPLAINER INITIALIZATION
# ============================================================================

def initialize_shap_explainer(model, background_data_path: str = BACKGROUND_DATA_PATH):
    """Initialize SHAP explainer with proper error handling"""
    if not SHAP_AVAILABLE:
        print("ℹ️ SHAP not available, will use fallback method")
        return None
    
    try:
        # Load or create background data
        if os.path.exists(background_data_path):
            background_data = joblib.load(background_data_path)
            print(f"✅ Background data loaded: shape {background_data.shape}")
        else:
            print("⚠️ Creating synthetic background data for SHAP")
            # Create diverse background samples
            background_data = np.array([
                [45, 49, 49, 65, 65, 45],    # Weak pokemon
                [65, 75, 65, 75, 65, 65],    # Average non-legendary
                [85, 95, 85, 95, 85, 85],    # Strong non-legendary
                [100, 115, 95, 115, 95, 95], # Average legendary
                [120, 134, 110, 131, 110, 100], # Strong legendary
            ])
        
        model_type = type(model).__name__
        print(f"🔍 Attempting to initialize SHAP for {model_type}")
        
        # Try TreeExplainer first for tree-based models
        if any(x in model_type for x in ['RandomForest', 'XGB', 'GradientBoosting', 'DecisionTree', 'ExtraTrees']):
            try:
                explainer = shap.TreeExplainer(model)
                print(f"✅ SHAP TreeExplainer initialized successfully")
                return explainer
            except Exception as e:
                print(f"⚠️ TreeExplainer failed: {str(e)}, trying KernelExplainer")
        
        # Fallback to KernelExplainer
        try:
            # For KernelExplainer, we need a prediction function
            if hasattr(model, 'predict_proba'):
                predict_fn = lambda x: model.predict_proba(x)[:, 1]  # Probability of class 1
            else:
                predict_fn = model.predict
            
            explainer = shap.KernelExplainer(predict_fn, background_data)
            print(f"✅ SHAP KernelExplainer initialized successfully")
            return explainer
        except Exception as e:
            print(f"⚠️ KernelExplainer failed: {str(e)}")
            return None
    
    except Exception as e:
        print(f"❌ SHAP initialization failed completely: {str(e)}")
        return None
