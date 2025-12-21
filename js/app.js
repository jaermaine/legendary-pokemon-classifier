// ============================================================================
// MAIN APP INITIALIZATION
// ============================================================================

import { logger } from './utils/logger.js';
import { initializeInputValidation } from './utils/validation.js';
import { initializeTabs } from './handlers/tabs.js';
import { initializeEventListeners } from './handlers/eventHandlers.js';
import { loadChartJS, renderFeatureImportanceChart } from './ui/visualizations.js';
import { checkHealthStatus, fetchFeatureImportance } from './api/api.js';
import { updateBadgeStatus } from './ui/notifications.js';

async function initializeApp() {
    logger.log('🎮 Legendary Pokémon Classifier initializing...');
    
    // Chart.js will be loaded lazily when needed (when user enters stats or views charts)
    // This reduces initial bundle size by ~62 KiB
    
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
        logger.log('✅ Connected to FastAPI server');
        
        // Feature importance will be loaded when user switches to Explainability tab
        // This defers Chart.js loading until actually needed
    } else {
        logger.warn('⚠️ FastAPI server not running');
    }
    
    logger.log('🎮 App initialized successfully!');
    logger.log('📡 API URL:', window.API_BASE_URL || 'Not configured');
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
