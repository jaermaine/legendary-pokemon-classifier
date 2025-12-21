// ============================================================================
// CHARTS & VISUALIZATIONS MODULE
// ============================================================================

import { logger } from '../utils/logger.js';
import { CONFIG, STAT_NAMES } from '../config/config.js';

let radarChart = null;

export async function loadChartJS() {
    if (typeof Chart !== 'undefined') {
        logger.log('✅ Chart.js already loaded');
        return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = CONFIG.CHART_JS_CDN;
        script.onload = () => {
            logger.log('✅ Chart.js loaded');
            resolve();
        };
        script.onerror = () => {
            logger.warn('⚠️ Failed to load Chart.js');
            reject();
        };
        document.head.appendChild(script);
    });
}

export async function updateRadarChart(hp, atk, def, spAtk, spDef, spd) {
    const canvas = document.getElementById('statRadarChart');
    const placeholder = document.getElementById('radarPlaceholder');
    
    if (!canvas || !placeholder) return;
    
    if (hp + atk + def + spAtk + spDef + spd === 0) {
        if (radarChart) {
            radarChart.destroy();
            radarChart = null;
        }
        canvas.style.display = 'none';
        placeholder.style.display = 'block';
        return;
    }
    
    canvas.style.display = 'block';
    placeholder.style.display = 'none';
    
    // Lazy load Chart.js when first needed
    if (typeof Chart === 'undefined') {
        logger.log('📦 Lazy loading Chart.js...');
        try {
            await loadChartJS();
        } catch (error) {
            logger.warn('⚠️ Failed to load Chart.js:', error);
            return;
        }
    }
    
    const ctx = canvas.getContext('2d');
    
    if (radarChart) {
        radarChart.destroy();
    }
    
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'],
            datasets: [{
                label: 'Current Stats',
                data: [hp, atk, def, spAtk, spDef, spd],
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(139, 92, 246, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(139, 92, 246, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 255,
                    ticks: {
                        stepSize: 50,
                        font: { size: 10 }
                    },
                    pointLabels: {
                        font: { size: 11, weight: 'bold' }
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

export function renderFeatureImportanceChart(data) {
    const container = document.getElementById('feature-importance-chart');
    if (!container || !data) return;
    
    container.innerHTML = '';
    
    const title = document.createElement('h3');
    title.textContent = 'Overall Feature Importance';
    title.style.marginBottom = '10px';
    title.style.fontSize = '0.9rem';
    title.style.color = '#333';
    container.appendChild(title);
    
    const maxImportance = Math.max(...data.features.map(f => f.importance));
    
    data.features.forEach((feature, index) => {
        const barContainer = document.createElement('div');
        barContainer.style.marginBottom = '8px';
        
        const label = document.createElement('div');
        label.textContent = feature.display_name;
        label.style.fontSize = '0.75rem';
        label.style.marginBottom = '3px';
        label.style.color = '#555';
        label.style.fontWeight = '600';
        barContainer.appendChild(label);
        
        const barBg = document.createElement('div');
        barBg.style.width = '100%';
        barBg.style.height = '20px';
        barBg.style.background = '#e5e7eb';
        barBg.style.borderRadius = '4px';
        barBg.style.position = 'relative';
        barBg.style.overflow = 'hidden';
        
        const barFill = document.createElement('div');
        const widthPercent = (feature.importance / maxImportance) * 100;
        barFill.style.width = widthPercent + '%';
        barFill.style.height = '100%';
        barFill.style.background = `linear-gradient(90deg, hsl(${220 - index * 30}, 70%, 60%), hsl(${220 - index * 30}, 70%, 50%))`;
        barFill.style.transition = 'width 0.5s ease';
        barFill.style.display = 'flex';
        barFill.style.alignItems = 'center';
        barFill.style.paddingLeft = '8px';
        
        const valueText = document.createElement('span');
        valueText.textContent = (feature.importance * 100).toFixed(1) + '%';
        valueText.style.fontSize = '0.7rem';
        valueText.style.color = 'white';
        valueText.style.fontWeight = 'bold';
        barFill.appendChild(valueText);
        
        barBg.appendChild(barFill);
        barContainer.appendChild(barBg);
        container.appendChild(barContainer);
    });
    
    const info = document.createElement('p');
    info.style.fontSize = '0.7rem';
    info.style.color = '#888';
    info.style.marginTop = '10px';
    info.textContent = `Method: ${data.importance_type} | Model: ${data.model_type}`;
    container.appendChild(info);
}

export function renderFeatureContributions(contributions, explanationMethod = 'Fallback') {
    const container = document.getElementById('feature-contributions');
    if (!container) return;
    
    container.innerHTML = '';
    
    const title = document.createElement('h3');
    title.textContent = 'Feature Contributions to This Prediction';
    title.style.marginBottom = '10px';
    title.style.fontSize = '0.9rem';
    title.style.color = '#333';
    container.appendChild(title);
    
    const methodBadge = document.createElement('div');
    methodBadge.style.display = 'inline-block';
    methodBadge.style.padding = '3px 8px';
    methodBadge.style.background = (explanationMethod && explanationMethod.includes('SHAP')) ? '#3b82f6' : '#f59e0b';
    methodBadge.style.color = 'white';
    methodBadge.style.fontSize = '0.7rem';
    methodBadge.style.borderRadius = '4px';
    methodBadge.style.marginBottom = '10px';
    methodBadge.textContent = `Method: ${explanationMethod || 'Fallback'}`;
    container.appendChild(methodBadge);
    
    contributions.forEach(contrib => {
        const item = document.createElement('div');
        item.style.marginBottom = '10px';
        item.style.padding = '8px';
        item.style.background = contrib.impact === 'Positive' ? '#f0fdf4' : contrib.impact === 'Negative' ? '#fef2f2' : '#f9fafb';
        item.style.borderRadius = '6px';
        item.style.borderLeft = `3px solid ${contrib.impact === 'Positive' ? '#22c55e' : contrib.impact === 'Negative' ? '#ef4444' : '#9ca3af'}`;
        
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.marginBottom = '4px';
        
        const featureName = document.createElement('span');
        featureName.textContent = contrib.display_name;
        featureName.style.fontSize = '0.8rem';
        featureName.style.fontWeight = '600';
        featureName.style.color = '#333';
        
        const featureValue = document.createElement('span');
        featureValue.textContent = `Value: ${contrib.value}`;
        featureValue.style.fontSize = '0.75rem';
        featureValue.style.color = '#666';
        
        header.appendChild(featureName);
        header.appendChild(featureValue);
        item.appendChild(header);
        
        const contributionInfo = document.createElement('div');
        contributionInfo.style.fontSize = '0.75rem';
        contributionInfo.style.color = '#555';
        contributionInfo.style.marginTop = '4px';
        
        const contributionValue = contrib.contribution >= 0 ? 
            `+${contrib.contribution.toFixed(3)}` : 
            contrib.contribution.toFixed(3);
        
        const impactIcon = contrib.impact === 'Positive' ? '↑' : contrib.impact === 'Negative' ? '↓' : '→';
        const impactColor = contrib.impact === 'Positive' ? '#22c55e' : contrib.impact === 'Negative' ? '#ef4444' : '#9ca3af';
        
        contributionInfo.innerHTML = `
            <span style="color: ${impactColor}; font-weight: bold;">${impactIcon} ${contrib.magnitude} impact</span>: 
            ${contributionValue} contribution to legendary prediction
        `;
        
        item.appendChild(contributionInfo);
        container.appendChild(item);
    });
    
    const explanation = document.createElement('p');
    explanation.style.fontSize = '0.7rem';
    explanation.style.color = '#888';
    explanation.style.marginTop = '10px';
    explanation.textContent = 'Positive values push toward Legendary, negative values push toward Non-Legendary';
    container.appendChild(explanation);
}

export function updateComparisonChart(stats, prediction) {
    const container = document.getElementById('comparisonChart');
    if (!container) return;
    
    container.innerHTML = '';
    
    const legendaryAvg = { hp: 100, attack: 115, defense: 95, sp_attack: 115, sp_defense: 95, speed: 95 };
    const nonLegendaryAvg = { hp: 65, attack: 75, defense: 65, sp_attack: 75, sp_defense: 65, speed: 65 };
    
    Object.entries(stats).forEach(([key, value]) => {
        const item = document.createElement('div');
        item.className = 'comparison-item';
        
        const label = document.createElement('div');
        label.className = 'comparison-label';
        label.textContent = STAT_NAMES[key];
        
        const bars = document.createElement('div');
        bars.className = 'comparison-bars';
        
        const userBar = document.createElement('div');
        userBar.className = 'comparison-bar user';
        userBar.style.width = (value / CONFIG.STAT_MAX * 100) + '%';
        userBar.textContent = value;
        bars.appendChild(userBar);
        
        item.appendChild(label);
        item.appendChild(bars);
        container.appendChild(item);
        
        const compareText = document.createElement('div');
        compareText.style.fontSize = '0.7rem';
        compareText.style.color = '#666';
        compareText.style.marginLeft = '120px';
        compareText.style.marginBottom = '8px';
        
        const legDiff = value - legendaryAvg[key];
        const nonLegDiff = value - nonLegendaryAvg[key];
        
        if (prediction === 1) {
            compareText.textContent = `${legDiff >= 0 ? '+' : ''}${legDiff} vs legendary avg (${legendaryAvg[key]})`;
        } else {
            compareText.textContent = `${nonLegDiff >= 0 ? '+' : ''}${nonLegDiff} vs non-legendary avg (${nonLegendaryAvg[key]})`;
        }
        
        container.appendChild(compareText);
    });
}

export function displaySimilarPokemon(similarData) {
    const container = document.getElementById('similarPokemon');
    if (!container) return;
    
    if (!similarData || !similarData.similar_pokemon || similarData.similar_pokemon.length === 0) {
        container.innerHTML = '<p class="placeholder-text">No similar Pokémon found in training data</p>';
        return;
    }
    
    container.innerHTML = '';
    
    similarData.similar_pokemon.slice(0, CONFIG.SIMILAR_POKEMON_LIMIT).forEach(pokemon => {
        const item = document.createElement('div');
        item.className = 'similar-pokemon-item';
        
        const info = document.createElement('div');
        const name = document.createElement('div');
        name.className = 'similar-pokemon-name';
        name.textContent = pokemon.name || 'Unknown';
        
        const stats = document.createElement('div');
        stats.className = 'similar-pokemon-stats';
        stats.textContent = `BST: ${pokemon.bst || '-'} | Distance: ${pokemon.distance?.toFixed(2) || '-'}`;
        
        info.appendChild(name);
        info.appendChild(stats);
        
        const badge = document.createElement('div');
        badge.className = `similar-pokemon-badge ${pokemon.legendary ? 'legendary' : 'normal'}`;
        badge.textContent = pokemon.legendary ? 'Legendary' : 'Normal';
        
        item.appendChild(info);
        item.appendChild(badge);
        container.appendChild(item);
    });
}
