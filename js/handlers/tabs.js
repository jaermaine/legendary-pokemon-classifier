// ============================================================================
// TAB SWITCHING MODULE
// ============================================================================

import { getTabs, getTabContents } from '../dom/domElements.js';

export function initializeTabs() {
    const tabs = getTabs();
    const contents = getTabContents();
    
    console.log('🔖 Initializing tabs...', { tabs: tabs.length, contents });
    
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            console.log('📑 Tab clicked:', tab.dataset.tab);
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            const name = tab.dataset.tab;
            
            console.log('🎯 Switching to tab:', name);
            Object.entries(contents).forEach(([key, el]) => {
                if (el) {
                    const shouldBeActive = key === name;
                    el.classList.toggle("active", shouldBeActive);
                    console.log(`  ${key}: ${shouldBeActive ? '✅ active' : '❌ inactive'}`, el);
                } else {
                    console.warn(`⚠️ Missing content element for key: ${key}`);
                }
            });
        });
    });
}
