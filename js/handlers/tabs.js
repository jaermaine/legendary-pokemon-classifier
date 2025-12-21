// ============================================================================
// TAB SWITCHING MODULE
// ============================================================================

import { logger } from '../utils/logger.js';
import { getTabs, getTabContents } from '../dom/domElements.js';
import { fetchFeatureImportance } from '../api/api.js';
import { renderFeatureImportanceChart } from '../ui/visualizations.js';

let featureImportanceLoaded = false;

export function initializeTabs() {
    const tabs = getTabs();
    const contents = getTabContents();
    
    logger.log('🔖 Initializing tabs...', { tabs: tabs.length, contents });
    
    tabs.forEach((tab) => {
        tab.addEventListener("click", async () => {
            logger.log('📑 Tab clicked:', tab.dataset.tab);
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            const name = tab.dataset.tab;
            
            logger.log('🎯 Switching to tab:', name);
            Object.entries(contents).forEach(([key, el]) => {
                if (el) {
                    const shouldBeActive = key === name;
                    el.classList.toggle("active", shouldBeActive);
                    logger.log(`  ${key}: ${shouldBeActive ? '✅ active' : '❌ inactive'}`, el);
                } else {
                    logger.warn(`⚠️ Missing content element for key: ${key}`);
                }
            });
            
            // Lazy load feature importance when Explainability tab is first opened
            if (name === 'explain' && !featureImportanceLoaded) {
                logger.log('📊 Loading feature importance data...');
                featureImportanceLoaded = true;
                try {
                    const importanceData = await fetchFeatureImportance();
                    if (importanceData) {
                        renderFeatureImportanceChart(importanceData);
                    }
                } catch (error) {
                    logger.warn('⚠️ Failed to load feature importance:', error);
                }
            }
        });
    });
}
