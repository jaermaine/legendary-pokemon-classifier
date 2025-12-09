// ============================================================================
// CONFIGURATION MODULE
// ============================================================================

// Get API URL from window object (injected by index.html script tag)
// Falls back to localhost for local development
const getApiBaseUrl = () => {
    // Check for globally injected API URL (set by index.html)
    if (typeof window !== 'undefined' && window.API_BASE_URL) {
        // If it's not the placeholder, use it
        if (window.API_BASE_URL && window.API_BASE_URL !== 'REPLACE_WITH_RENDER_URL') {
            return window.API_BASE_URL;
        }
    }
    // Default to Render backend for production
    return 'https://legendary-pokemon-classifier.onrender.com';
};

export const CONFIG = {
    API_BASE_URL: getApiBaseUrl(),
    STAT_MAX: 255,
    STAT_MIN: 1,
    BST_LEGENDARY_THRESHOLD: 600,
    BST_STRONG_THRESHOLD: 500,
    BST_AVERAGE_THRESHOLD: 400,
    PROBABILITY_THRESHOLD: 0.5,
    SIMILAR_POKEMON_LIMIT: 5,
    CHART_JS_CDN: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
};

export const STAT_NAMES = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    sp_attack: 'Sp. Attack',
    sp_defense: 'Sp. Defense',
    speed: 'Speed'
};

export const STAT_INPUTS = ['hp', 'atk', 'def', 'sp_atk', 'sp_def', 'spd'];

