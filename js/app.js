// ============================================================================
// MAIN APP INITIALIZATION
// ============================================================================

import { initializeInputValidation } from './utils/validation.js';
import { initializeTabs } from './handlers/tabs.js';
import { initializeEventListeners } from './handlers/eventHandlers.js';
import { loadChartJS, renderFeatureImportanceChart } from './ui/visualizations.js';
import { checkHealthStatus, fetchFeatureImportance } from './api/api.js';
import { updateBadgeStatus } from './ui/notifications.js';

async function initializeApp() {
    console.log('🎮 Legendary Pokémon Classifier initializing...');
    
    try {
        // Load Chart.js library
        await loadChartJS();
    } catch (error) {
        console.warn('⚠️ Radar chart will be disabled:', error);
    }
    
    // Initialize input validation
    initializeInputValidation();
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Test API connection
    const isConnected = await checkHealthStatus();
    updateBadgeStatus(isConnected);
    
    if (isConnected) {
        console.log('✅ Connected to FastAPI server');
        
        // Load feature importance
        const importanceData = await fetchFeatureImportance();
        if (importanceData) {
            renderFeatureImportanceChart(importanceData);
        }
    } else {
        console.warn('⚠️ FastAPI server not running');
    }
    
    console.log('🎮 App initialized successfully!');
    console.log('📡 API URL: http://localhost:8000');
}

// Smooth scroll to section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Track predictions for counter
function trackPrediction() {
  const currentCount = parseInt(localStorage.getItem('pokemonPredictions')) || 0;
  localStorage.setItem('pokemonPredictions', currentCount + 1);
  
  // Dispatch custom event for landing page to listen
  window.dispatchEvent(new Event('predictionMade'));
}

// Make functions globally accessible
window.scrollToSection = scrollToSection;
window.trackPrediction = trackPrediction;

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
