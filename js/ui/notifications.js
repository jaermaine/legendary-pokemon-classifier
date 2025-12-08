// ============================================================================
// ERROR HANDLING & NOTIFICATIONS MODULE
// ============================================================================

import { getErrorDisplay, elements, getBadge } from '../dom/domElements.js';

export function showError(message) {
    const errorDisplay = getErrorDisplay();
    const formattedMessage = message.replace(/\n/g, '<br>');
    errorDisplay.text.innerHTML = formattedMessage;
    errorDisplay.container.style.display = 'block';
    console.error(message);
}

export function clearError() {
    const errorDisplay = getErrorDisplay();
    errorDisplay.container.style.display = 'none';
}

export function setLoading(isLoading) {
    elements.predictBtn.disabled = isLoading;
    
    if (isLoading) {
        elements.predictBtn.textContent = "Analyzing...";
        elements.predictBtn.style.opacity = "0.6";
    } else {
        elements.predictBtn.innerHTML = '<span>Throw Pokéball</span>';
        elements.predictBtn.style.opacity = "1";
    }
}

export function updateBadgeStatus(isConnected) {
    const badge = getBadge();
    if (badge) {
        if (isConnected) {
            badge.textContent = '🟢 Live';
            badge.style.background = '#4ade80';
        } else {
            badge.textContent = '🔴 Offline';
            badge.style.background = '#ef4444';
        }
    }
}
