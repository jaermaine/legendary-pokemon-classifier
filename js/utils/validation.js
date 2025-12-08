// ============================================================================
// INPUT VALIDATION MODULE
// ============================================================================

import { CONFIG, STAT_INPUTS } from '../config/config.js';
import { elements } from '../dom/domElements.js';

export function validateInputs() {
    const errors = [];
    
    STAT_INPUTS.forEach(stat => {
        const value = parseInt(elements[stat].value);
        if (isNaN(value) || value < CONFIG.STAT_MIN || value > CONFIG.STAT_MAX) {
            errors.push(`${stat.toUpperCase()}: Must be between ${CONFIG.STAT_MIN} and ${CONFIG.STAT_MAX}`);
        }
    });
    
    return errors;
}

export function enforceStatMaximum(input) {
    input.addEventListener('input', (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value)) {
            return;
        }
        if (value > CONFIG.STAT_MAX) {
            e.target.value = CONFIG.STAT_MAX;
        } else if (value < CONFIG.STAT_MIN && e.target.value !== '') {
            e.target.value = CONFIG.STAT_MIN;
        }
    });
    
    input.addEventListener('change', (e) => {
        let value = parseInt(e.target.value);
        if (!isNaN(value)) {
            if (value > CONFIG.STAT_MAX) {
                e.target.value = CONFIG.STAT_MAX;
            } else if (value < CONFIG.STAT_MIN) {
                e.target.value = CONFIG.STAT_MIN;
            }
        }
    });
}

export function initializeInputValidation() {
    STAT_INPUTS.forEach(stat => {
        const input = elements[stat];
        enforceStatMaximum(input);
    });
}

export function getStatInputs() {
    return {
        hp: parseInt(elements.hp.value),
        attack: parseInt(elements.atk.value),
        defense: parseInt(elements.def.value),
        sp_attack: parseInt(elements.sp_atk.value),
        sp_defense: parseInt(elements.sp_def.value),
        speed: parseInt(elements.spd.value)
    };
}
