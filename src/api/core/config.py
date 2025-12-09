"""Configuration and constants for the Pokemon Classifier API"""

import os
from pathlib import Path
from typing import Dict

# ============================================================================
# MODEL AND DATA PATHS
# ============================================================================

# Get project root directory (parent of src directory)
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent

# Use absolute paths for model files, with environment variable override
MODEL_PATH = os.getenv("MODEL_PATH", str(PROJECT_ROOT / "backend" / "models" / "legendary_classifier_v1.pkl"))
SCALER_PATH = os.getenv("SCALER_PATH", str(PROJECT_ROOT / "backend" / "models" / "scaler.pkl"))
FEATURE_IMPORTANCE_PATH = os.getenv("FEATURE_IMPORTANCE_PATH", str(PROJECT_ROOT / "backend" / "models" / "feature_importance.pkl"))
TRAINING_DATA_PATH = os.getenv("TRAINING_DATA_PATH", str(PROJECT_ROOT / "backend" / "models" / "training_data.pkl"))
BACKGROUND_DATA_PATH = os.getenv("BACKGROUND_DATA_PATH", str(PROJECT_ROOT / "background_data.pkl"))

# ============================================================================
# FEATURE CONFIGURATION
# ============================================================================

FEATURE_NAMES = ['hp', 'attack', 'defense', 'sp_attack', 'sp_defense', 'speed']

FEATURE_DISPLAY_NAMES = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'sp_attack': 'Special Attack',
    'sp_defense': 'Special Defense',
    'speed': 'Speed'
}

# ============================================================================
# REFERENCE STATS
# ============================================================================

REFERENCE_STATS: Dict[str, Dict[str, int]] = {
    'legendary': {
        'hp': 100,
        'attack': 115,
        'defense': 95,
        'sp_attack': 115,
        'sp_defense': 95,
        'speed': 95
    },
    'non_legendary': {
        'hp': 65,
        'attack': 75,
        'defense': 65,
        'sp_attack': 75,
        'sp_defense': 65,
        'speed': 65
    }
}

# ============================================================================
# API CONFIGURATION
# ============================================================================

API_TITLE = "Legendary Pokémon Classifier API"
API_DESCRIPTION = "ML-powered API to predict if a Pokémon is Legendary based on base stats"
API_VERSION = "1.0.0"

CORS_ORIGINS = ["*"]
CORS_CREDENTIALS = True
CORS_METHODS = ["*"]
CORS_HEADERS = ["*"]
