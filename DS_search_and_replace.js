// ==UserScript==
// @name         Braze DS Demo Text Customizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces Braze AI Decisioning Studio UI labels for demo purposes
// @author       You
// @match        https://*braze.com/decisioning-studio/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================
    // CONFIGURATION: Add your mappings here
    // =================================================================
    const REPLACEMENTS = [
        // Data Assets
        { from: "camera_capture_activity", to: "geo_fence_store_entry" },
        { from: "purchase_activity", to: "food_order_history" },
        { from: "mobile_activity", to: "app_menu_browsing" },

        // Dimensions
        { from: "Frequency", to: "Revisit Frequency" },
        { from: "Days of Week", to: "Day of Week" },
        { from: "Offer", to: "Meal Deal / Promo" },
        { from: "Creative", to: "Menu Item Theme" },
        { from: "Time", to: "Daypart" },

        // Use Cases
        { from: "Repurchase use case", to: "Win-back Frequency" },
        { from: "Onboarding use case", to: "Loyalty Enrollment" }
    ];

    // =================================================================
    // ENGINE
    // =================================================================
    function replaceText() {
        // We look for elements that contain text.
        // We exclude script, style, and already processed elements.
        const elements = document.querySelectorAll('span, div, h1, h2, h3, h4, p, td, th');

        elements.forEach(el => {
            // Check if this element has already been processed to avoid infinite loops
            if (el.getAttribute('data-demo-replaced')) return;

            // Check if innerText matches any of our 'from' keys
            REPLACEMENTS.forEach(item => {
                if (el.innerText.trim() === item.from) {
                    el.innerText = item.to;
                    el.setAttribute('data-demo-replaced', 'true');
                    el.style.backgroundColor = '#fff3cd'; // Optional: Highlight change for debugging
                    console.log(`[Demo] Replaced "${item.from}" with "${item.to}"`);
                }
            });
        });
    }

    // Initialize MutationObserver
    // This watches for changes in the page (SPA navigation)
    const observer = new MutationObserver((mutations) => {
        replaceText();
    });

    // Start observing the body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run once on load
    replaceText();

})();