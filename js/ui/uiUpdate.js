// ============================================================================
// UI UPDATE MODULE
// ============================================================================

import { CONFIG } from '../config/config.js';
import { elements, getModelInfoElements } from '../dom/domElements.js';

export function updatePredictionDisplay(prediction, probability, pokemonName = null) {
    const legendaryProb = Math.round(probability * 100);
    const nonLegendaryProb = 100 - legendaryProb;
    
    elements.probBar.style.width = legendaryProb + "%";
    elements.probLegendary.textContent = `Legendary: ${legendaryProb}%`;
    elements.probNonLegendary.textContent = `Non-Legendary: ${nonLegendaryProb}%`;
    
    if (prediction === 1) {
        elements.predictionTag.textContent = pokemonName 
            ? `${pokemonName} is Legendary!` 
            : "Legendary Pokémon!";
        elements.predictionTag.classList.remove("normal");
        elements.predictionTag.classList.add("legendary");
        elements.predictionCard.style.background = "linear-gradient(135deg, #ffd700, #ff8c00)";
    } else {
        elements.predictionTag.textContent = pokemonName 
            ? `${pokemonName} is not Legendary` 
            : "Not Legendary";
        elements.predictionTag.classList.remove("legendary");
        elements.predictionTag.classList.add("normal");
        elements.predictionCard.style.background = "linear-gradient(135deg, #90EE90, #32CD32)";
    }
}

export function updateConfidenceDisplay(confidence, probability) {
    const indicator = document.getElementById('confidenceIndicator');
    const level = document.getElementById('confidenceLevel');
    const fill = document.getElementById('confidenceFill');
    
    if (!indicator || !level || !fill) return;
    
    indicator.style.display = 'block';
    level.textContent = confidence;
    level.className = 'confidence-badge ' + confidence.toLowerCase();
    
    const distance = Math.abs(probability - CONFIG.PROBABILITY_THRESHOLD);
    const confidencePercent = (distance / CONFIG.PROBABILITY_THRESHOLD) * 100;
    fill.style.width = confidencePercent + '%';
}

export function updateModelInfo(modelType, explanationMethod) {
    const { modelType: modelEl, explanationMethod: methodEl } = getModelInfoElements();
    if (modelEl) modelEl.textContent = modelType || 'ML Classifier';
    if (methodEl) methodEl.textContent = explanationMethod || '-';
}
