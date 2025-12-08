// ============================================================================
// DOM ELEMENTS MODULE
// ============================================================================

export const elements = {
    // Input fields
    name: document.getElementById('name'),
    hp: document.getElementById('hp'),
    atk: document.getElementById('atk'),
    def: document.getElementById('def'),
    sp_atk: document.getElementById('sp_atk'),
    sp_def: document.getElementById('sp_def'),
    spd: document.getElementById('spd'),
    
    // Buttons
    predictBtn: document.getElementById('predictBtn'),
    
    // Display elements
    predictionCard: document.getElementById('predictionCard'),
    predictionTag: document.getElementById('predictionTag'),
    probBar: document.getElementById('probBar'),
    probLegendary: document.getElementById('probLegendary'),
    probNonLegendary: document.getElementById('probNonLegendary')
};

export function getErrorDisplay() {
    return {
        container: document.getElementById('errorDisplay'),
        text: document.getElementById('errorText')
    };
}

export function getFeatureImportanceContainer() {
    return document.getElementById('feature-importance-chart');
}

export function getFeatureContributionsContainer() {
    return document.getElementById('feature-contributions');
}

export function getBadge() {
    return document.querySelector('.badge');
}

export function getTabs() {
    return document.querySelectorAll(".tab");
}

export function getTabContents() {
    return {
        prediction: document.getElementById("tab-prediction"),
        explain: document.getElementById("tab-explain"),
        methodology: document.getElementById("tab-methodology")
    };
}

export function getStatInputs() {
    return ['hp', 'atk', 'def', 'sp_atk', 'sp_def', 'spd'].map(id => elements[id]);
}

export function getNumberInputs() {
    return document.querySelectorAll('input[type="number"]');
}

export function getBSTElements() {
    return {
        value: document.getElementById('bstValue'),
        category: document.getElementById('bstCategory')
    };
}

export function getStatBreakdownElements() {
    return {
        offensiveValue: document.getElementById('offensiveValue'),
        defensiveValue: document.getElementById('defensiveValue'),
        speedValue: document.getElementById('speedValue'),
        bulkValue: document.getElementById('bulkValue'),
        offensiveFill: document.getElementById('offensiveFill'),
        defensiveFill: document.getElementById('defensiveFill'),
        speedFill: document.getElementById('speedFill'),
        bulkFill: document.getElementById('bulkFill')
    };
}

export function getRadarChartElements() {
    return {
        canvas: document.getElementById('statRadarChart'),
        placeholder: document.getElementById('radarPlaceholder')
    };
}

export function getConfidenceElements() {
    return {
        indicator: document.getElementById('confidenceIndicator'),
        level: document.getElementById('confidenceLevel'),
        fill: document.getElementById('confidenceFill')
    };
}

export function getComparisonChartContainer() {
    return document.getElementById('comparisonChart');
}

export function getSimilarPokemonContainer() {
    return document.getElementById('similarPokemon');
}

export function getModelInfoElements() {
    return {
        modelType: document.getElementById('modelType'),
        explanationMethod: document.getElementById('explanationMethod')
    };
}
