// ============================================================================
// API COMMUNICATION MODULE
// ============================================================================

import { CONFIG } from '../config/config.js';

export async function predictLegendary(stats) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stats)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Prediction failed');
        }
        
        return await response.json();
        
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error(`Cannot connect to API server. Make sure FastAPI is running on ${CONFIG.API_BASE_URL}`);
        }
        throw error;
    }
}

export async function fetchFeatureImportance() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/feature-importance`);
        if (!response.ok) throw new Error('Failed to fetch feature importance');
        return await response.json();
    } catch (error) {
        console.error('Error loading feature importance:', error);
        return null;
    }
}

export async function checkHealthStatus() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/health`);
        return response.ok;
    } catch (error) {
        console.warn('⚠️ FastAPI server not running');
        return false;
    }
}

export async function getSimilarPokemon(stats) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/similar-pokemon`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stats)
        });
        
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.warn('Could not fetch similar Pokémon:', error);
    }
    
    return null;
}
