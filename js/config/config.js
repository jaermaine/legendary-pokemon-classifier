// ============================================================================
// CONFIGURATION MODULE
// ============================================================================

export const CONFIG = {
    API_BASE_URL: 'http://localhost:8000',
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
