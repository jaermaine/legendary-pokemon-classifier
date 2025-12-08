"""Pydantic models and schemas for API requests and responses"""

from pydantic import BaseModel, Field
from typing import List


class PokemonStats(BaseModel):
    """Input schema for Pokemon stats prediction"""
    hp: int = Field(..., ge=1, le=255, description="HP stat (1-255)")
    attack: int = Field(..., ge=1, le=255, description="Attack stat (1-255)")
    defense: int = Field(..., ge=1, le=255, description="Defense stat (1-255)")
    sp_attack: int = Field(..., ge=1, le=255, description="Special Attack stat (1-255)")
    sp_defense: int = Field(..., ge=1, le=255, description="Special Defense stat (1-255)")
    speed: int = Field(..., ge=1, le=255, description="Speed stat (1-255)")
    
    class Config:
        schema_extra = {
            "example": {
                "hp": 91,
                "attack": 134,
                "defense": 95,
                "sp_attack": 100,
                "sp_defense": 100,
                "speed": 80
            }
        }


class FeatureContribution(BaseModel):
    """Per-feature contribution to prediction"""
    feature: str = Field(..., description="Feature name")
    display_name: str = Field(..., description="Human-readable feature name")
    value: float = Field(..., description="Feature value")
    contribution: float = Field(..., description="Contribution to prediction")
    impact: str = Field(..., description="Positive/Negative impact")
    magnitude: str = Field(..., description="High/Medium/Low magnitude")
    explanation: str = Field(..., description="Human-readable explanation")


class PredictionResponse(BaseModel):
    """Response schema for prediction endpoint"""
    prediction: int = Field(..., description="0 = Non-Legendary, 1 = Legendary")
    probability_legendary: float = Field(..., description="Probability of being Legendary (0-1)")
    probability_non_legendary: float = Field(..., description="Probability of being Non-Legendary (0-1)")
    confidence: str = Field(..., description="Confidence level (Low/Medium/High)")
    stats: dict = Field(..., description="Input stats used for prediction")
    feature_contributions: List[FeatureContribution] = Field(..., description="Per-feature contributions")
    explanation_method: str = Field(..., description="Method used for explanation")
    model_type: str = Field(default="ML Classifier")


class FeatureImportanceItem(BaseModel):
    """Individual feature importance item"""
    feature: str
    display_name: str
    importance: float


class FeatureImportanceResponse(BaseModel):
    """Response schema for feature importance endpoint"""
    model_type: str = Field(..., description="Type of model")
    importance_type: str = Field(..., description="Method used")
    features: List[FeatureImportanceItem]


class SimilarPokemonItem(BaseModel):
    """Similar Pokemon entry"""
    name: str
    distance: float
    bst: int
    legendary: int


class SimilarPokemonResponse(BaseModel):
    """Response schema for similar Pokemon endpoint"""
    similar_pokemon: List[SimilarPokemonItem]
    count: int


class HealthCheckResponse(BaseModel):
    """Health check response schema"""
    status: str
    model_loaded: bool
    scaler_loaded: bool
    shap_available: bool
    feature_importance_available: bool
    explanation_method: str
