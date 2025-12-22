// ============================================================================
// API CONFIGURATION - BUILD-TIME INJECTION
// ============================================================================
// This file sets the global API_BASE_URL before any other modules load.
// The placeholder is replaced at build time by netlify-build.sh script.
// Security: External file eliminates need for CSP 'unsafe-inline' directive.

(function() {
    'use strict';
    
    // Build-time placeholder - replaced by deployment script
    const BUILD_TIME_API_URL = '__RENDER_URL_PLACEHOLDER__';
    
    // Production fallback (Render backend)
    const PRODUCTION_API_URL = 'https://legendary-pokemon-classifier.onrender.com';
    
    // Local development fallback
    const LOCAL_API_URL = 'http://localhost:8000';
    
    // Determine which URL to use
    if (BUILD_TIME_API_URL !== '__RENDER_URL_PLACEHOLDER__') {
        // Build script successfully replaced placeholder
        window.API_BASE_URL = BUILD_TIME_API_URL;
    } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Local development environment
        window.API_BASE_URL = LOCAL_API_URL;
    } else {
        // Production environment, use Render backend
        window.API_BASE_URL = PRODUCTION_API_URL;
    }
    
    // Freeze to prevent tampering
    Object.defineProperty(window, 'API_BASE_URL', {
        writable: false,
        configurable: false
    });
})();
