// ============================================================================
// PRODUCTION-SAFE LOGGING UTILITY
// ============================================================================

// Detect if we're in production (Netlify or other production environment)
const isProduction = () => {
    return window.location.hostname !== 'localhost' && 
           window.location.hostname !== '127.0.0.1' &&
           !window.location.hostname.includes('local');
};

// Create safe logging functions that only work in development
export const logger = {
    log: (...args) => {
        if (!isProduction()) {
            console.log(...args);
        }
    },
    warn: (...args) => {
        if (!isProduction()) {
            console.warn(...args);
        }
    },
    error: (...args) => {
        // Always log errors, even in production (for debugging)
        console.error(...args);
    },
    info: (...args) => {
        if (!isProduction()) {
            console.info(...args);
        }
    }
};

// Override global console in production to prevent accidental logging
if (isProduction()) {
    const noop = () => {};
    window.console.log = noop;
    window.console.info = noop;
    window.console.warn = noop;
    // Keep console.error for critical issues
}
