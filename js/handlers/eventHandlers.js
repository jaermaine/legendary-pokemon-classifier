// ============================================================================
// EVENT HANDLERS MODULE
// ============================================================================

import { logger } from '../utils/logger.js';
import { elements, getNumberInputs } from '../dom/domElements.js';
import { validateInputs, getStatInputs as getValidatedStats } from '../utils/validation.js';
import { predictLegendary, fetchFeatureImportance, getSimilarPokemon } from '../api/api.js';
import { showError, clearError } from '../ui/notifications.js';
import { updatePredictionDisplay, updateConfidenceDisplay, updateModelInfo } from '../ui/uiUpdate.js';
import { renderFeatureContributions, updateComparisonChart, displaySimilarPokemon, updateRadarChart } from '../ui/visualizations.js';
import { updateBST, updateStatBreakdown, getStatSummary } from '../utils/statistics.js';

export async function handlePredict() {
    clearError();
    
    const errors = validateInputs();
    if (errors.length > 0) {
        showError('Please fill all stat fields correctly:\n' + errors.join('\n'));
        return;
    }
    
    const stats = getValidatedStats();
    const pokemonName = elements.name.value.trim();
    
    try {
        const result = await predictLegendary(stats);
        
        updatePredictionDisplay(
            result.prediction,
            result.probability_legendary,
            pokemonName || null
        );
        
        updateConfidenceDisplay(result.confidence, result.probability_legendary);
        updateComparisonChart(stats, result.prediction);
        updateModelInfo(result.model_type, result.explanation_method);
        
        const similarData = await getSimilarPokemon(stats);
        displaySimilarPokemon(similarData);
        
        renderFeatureContributions(result.feature_contributions, result.explanation_method);
        
        logger.log('Prediction Result:', result);
        
    } catch (error) {
        showError(error.message);
    }
}

export function handleRealtimeStatsUpdate() {
    updateBST();
    updateStatBreakdown();
    
    const summary = getStatSummary();
    updateRadarChart(summary.hp, summary.atk, summary.def, summary.spAtk, summary.spDef, summary.spd);
}

export function initializeEventListeners() {
    elements.predictBtn.addEventListener('click', handlePredict);
    
    getNumberInputs().forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handlePredict();
            }
        });
        
        input.addEventListener('input', handleRealtimeStatsUpdate);
    });
}
