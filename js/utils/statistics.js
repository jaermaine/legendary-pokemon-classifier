// ============================================================================
// STATISTICS CALCULATIONS MODULE
// ============================================================================

import { elements } from '../dom/domElements.js';
import { CONFIG, STAT_NAMES } from '../config/config.js';

export function calculateBST() {
    const stats = ['hp', 'atk', 'def', 'sp_atk', 'sp_def', 'spd'];
    let total = 0;
    let allFilled = true;
    
    stats.forEach(stat => {
        const value = parseInt(elements[stat].value);
        if (isNaN(value)) {
            allFilled = false;
        } else {
            total += value;
        }
    });
    
    return { total, allFilled };
}

export function updateBST() {
    const { total, allFilled } = calculateBST();
    const bstValue = document.getElementById('bstValue');
    const bstCategory = document.getElementById('bstCategory');
    
    if (!bstValue || !bstCategory) return;
    
    if (allFilled && total > 0) {
        bstValue.textContent = total;
        
        if (total >= CONFIG.BST_LEGENDARY_THRESHOLD) {
            bstCategory.textContent = '🌟 Pseudo-Legendary Tier';
            bstCategory.style.color = '#fbbf24';
        } else if (total >= CONFIG.BST_STRONG_THRESHOLD) {
            bstCategory.textContent = '⭐ Strong';
            bstCategory.style.color = '#a3e635';
        } else if (total >= CONFIG.BST_AVERAGE_THRESHOLD) {
            bstCategory.textContent = '➡️ Average';
            bstCategory.style.color = '#cbd5e1';
        } else {
            bstCategory.textContent = '📉 Below Average';
            bstCategory.style.color = '#94a3b8';
        }
    } else {
        bstValue.textContent = '---';
        bstCategory.textContent = 'Enter stats';
        bstCategory.style.color = 'rgba(255,255,255,0.9)';
    }
}

export function updateStatBreakdown() {
    const hp = parseInt(elements.hp.value) || 0;
    const atk = parseInt(elements.atk.value) || 0;
    const def = parseInt(elements.def.value) || 0;
    const spAtk = parseInt(elements.sp_atk.value) || 0;
    const spDef = parseInt(elements.sp_def.value) || 0;
    const spd = parseInt(elements.spd.value) || 0;
    
    if (hp + atk + def + spAtk + spDef + spd === 0) return;
    
    const offensive = (atk + spAtk) / 2;
    const defensive = (def + spDef) / 2;
    const speed = spd;
    const bulk = hp;
    
    const offensiveValue = document.getElementById('offensiveValue');
    const defensiveValue = document.getElementById('defensiveValue');
    const speedValue = document.getElementById('speedValue');
    const bulkValue = document.getElementById('bulkValue');
    
    if (offensiveValue) offensiveValue.textContent = Math.round(offensive);
    if (defensiveValue) defensiveValue.textContent = Math.round(defensive);
    if (speedValue) speedValue.textContent = speed;
    if (bulkValue) bulkValue.textContent = bulk;
    
    const offensiveFill = document.getElementById('offensiveFill');
    const defensiveFill = document.getElementById('defensiveFill');
    const speedFill = document.getElementById('speedFill');
    const bulkFill = document.getElementById('bulkFill');
    
    if (offensiveFill) offensiveFill.style.width = (offensive / CONFIG.STAT_MAX * 100) + '%';
    if (defensiveFill) defensiveFill.style.width = (defensive / CONFIG.STAT_MAX * 100) + '%';
    if (speedFill) speedFill.style.width = (speed / CONFIG.STAT_MAX * 100) + '%';
    if (bulkFill) bulkFill.style.width = (bulk / CONFIG.STAT_MAX * 100) + '%';
}

export function getStatSummary() {
    const hp = parseInt(elements.hp.value) || 0;
    const atk = parseInt(elements.atk.value) || 0;
    const def = parseInt(elements.def.value) || 0;
    const spAtk = parseInt(elements.sp_atk.value) || 0;
    const spDef = parseInt(elements.sp_def.value) || 0;
    const spd = parseInt(elements.spd.value) || 0;
    
    return {
        hp, atk, def, spAtk, spDef, spd,
        offensive: (atk + spAtk) / 2,
        defensive: (def + spDef) / 2,
        speed: spd,
        bulk: hp
    };
}
