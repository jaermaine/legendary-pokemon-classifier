"""Prediction and explanation utilities"""

from typing import List, Tuple
import numpy as np

from ..core.config import FEATURE_NAMES, FEATURE_DISPLAY_NAMES, REFERENCE_STATS
from ..core.schemas import PokemonStats, FeatureContribution


# ============================================================================
# FEATURE PREPARATION
# ============================================================================

def prepare_features(stats: PokemonStats, scaler=None) -> np.ndarray:
    """Prepare feature array from Pokemon stats"""
    features = np.array([
        stats.hp,
        stats.attack,
        stats.defense,
        stats.sp_attack,
        stats.sp_defense,
        stats.speed
    ]).reshape(1, -1)
    
    if scaler is not None:
        features = scaler.transform(features)
    
    return features


# ============================================================================
# CONFIDENCE CALCULATION
# ============================================================================

def calculate_confidence(probability: float) -> str:
    """Calculate confidence level based on probability"""
    if probability >= 0.8 or probability <= 0.2:
        return "High"
    elif probability >= 0.6 or probability <= 0.4:
        return "Medium"
    else:
        return "Low"


# ============================================================================
# FALLBACK CONTRIBUTIONS
# ============================================================================

def calculate_fallback_contributions(
    stats: PokemonStats, 
    prediction: int, 
    probability: float,
    feature_importance: dict
) -> List[FeatureContribution]:
    """
    Fallback method when SHAP is not available.
    Uses feature importance weighted by deviation from reference values.
    """
    contributions = []
    
    # Get feature importance
    importances = feature_importance['importances']
    
    # Reference stats based on prediction
    if prediction == 1:
        reference = REFERENCE_STATS['legendary']
    else:
        reference = REFERENCE_STATS['non_legendary']
    
    # Calculate contributions for each feature
    for i, feature_name in enumerate(FEATURE_NAMES):
        value = getattr(stats, feature_name)
        ref_value = reference[feature_name]
        importance = importances[i]
        
        # Calculate normalized deviation (-1 to 1)
        deviation = (value - ref_value) / 100.0
        
        # Weight deviation by feature importance and prediction probability
        if prediction == 1:
            contribution_value = deviation * importance * probability
        else:
            contribution_value = -deviation * importance * (1 - probability)
        
        # Determine impact
        if abs(contribution_value) < 0.01:
            impact = "Neutral"
            magnitude = "Low"
        else:
            impact = "Positive" if contribution_value > 0 else "Negative"
            abs_contrib = abs(contribution_value)
            if abs_contrib > 0.15:
                magnitude = "High"
            elif abs_contrib > 0.05:
                magnitude = "Medium"
            else:
                magnitude = "Low"
        
        # Generate explanation
        if value > ref_value:
            comparison = f"above average ({value} vs {ref_value})"
        elif value < ref_value:
            comparison = f"below average ({value} vs {ref_value})"
        else:
            comparison = f"at average ({value})"
        
        explanation = f"{FEATURE_DISPLAY_NAMES[feature_name]} is {comparison}"
        
        contributions.append(FeatureContribution(
            feature=feature_name,
            display_name=FEATURE_DISPLAY_NAMES[feature_name],
            value=float(value),
            contribution=float(contribution_value),
            impact=impact,
            magnitude=magnitude,
            explanation=explanation
        ))
    
    # Sort by absolute contribution
    contributions.sort(key=lambda x: abs(x.contribution), reverse=True)
    
    return contributions


# ============================================================================
# SHAP CONTRIBUTIONS
# ============================================================================

def calculate_shap_contributions(
    features: np.ndarray,
    stats: PokemonStats,
    prediction: int,
    probability: float,
    feature_importance: dict,
    shap_explainer=None
) -> Tuple[List[FeatureContribution], str]:
    """
    Calculate SHAP values or use fallback method.
    Returns (contributions_list, method_used)
    """
    
    # Try SHAP first
    if shap_explainer is not None:
        try:
            print("🔍 Calculating SHAP values...")
            
            # Calculate SHAP values
            shap_values = shap_explainer.shap_values(features)
            
            print(f"📊 Raw SHAP values: {shap_values}")
            print(f"📊 Type: {type(shap_values)}")
            
            # Handle different SHAP output formats
            if isinstance(shap_values, list):
                # Binary classification returns list [class_0_values, class_1_values]
                if len(shap_values) == 2:
                    shap_values = shap_values[1]  # Use class 1 (legendary)
                    print(f"📊 Using class 1 SHAP values: {shap_values}")
                else:
                    shap_values = shap_values[0]
            
            # Extract first sample if it's 2D
            if len(shap_values.shape) > 1:
                shap_values = shap_values[0]
            
            print(f"📊 Final SHAP values: {shap_values}")
            
            # Check if we got meaningful values
            if np.all(shap_values == 0) or np.isnan(shap_values).any():
                print("⚠️ SHAP returned all zeros or NaN, using fallback")
                return calculate_fallback_contributions(stats, prediction, probability, feature_importance), "fallback (SHAP returned zeros)"
            
            # Create contributions from SHAP values
            contributions = []
            for i, feature_name in enumerate(FEATURE_NAMES):
                value = getattr(stats, feature_name)
                contribution_value = float(shap_values[i])
                
                # Determine impact
                if abs(contribution_value) < 0.001:
                    impact = "Neutral"
                    magnitude = "Low"
                else:
                    impact = "Positive" if contribution_value > 0 else "Negative"
                    abs_contrib = abs(contribution_value)
                    if abs_contrib > 0.1:
                        magnitude = "High"
                    elif abs_contrib > 0.03:
                        magnitude = "Medium"
                    else:
                        magnitude = "Low"
                
                # Generate explanation
                if impact == "Positive":
                    explanation = f"Pushes prediction toward Legendary"
                elif impact == "Negative":
                    explanation = f"Pushes prediction toward Non-Legendary"
                else:
                    explanation = f"Minimal impact on prediction"
                
                contributions.append(FeatureContribution(
                    feature=feature_name,
                    display_name=FEATURE_DISPLAY_NAMES[feature_name],
                    value=float(value),
                    contribution=contribution_value,
                    impact=impact,
                    magnitude=magnitude,
                    explanation=explanation
                ))
            
            # Sort by absolute contribution
            contributions.sort(key=lambda x: abs(x.contribution), reverse=True)
            
            return contributions, "SHAP"
        
        except Exception as e:
            print(f"❌ SHAP calculation failed: {str(e)}")
            import traceback
            traceback.print_exc()
    
    # Fallback method
    print("ℹ️ Using fallback contribution method")
    return calculate_fallback_contributions(stats, prediction, probability, feature_importance), "fallback (importance-based)"
