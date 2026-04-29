// ==UserScript==
// @name         Braze DS Demo Customizer (Pro)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replaces text and UI logo for Braze DS Demos
// @author       You
// @match        https://portal.offerfit.ai/clients/retail_company/*
// @match        https://portal.offerfit.ai/use-cases?org=retail_company*
// @match        https://portal.offerfit.ai/use-case/repurchase/dimensions*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================
    // CONFIGURATION
    // =================================================================

    const TEXT_REPLACEMENTS = [
        { from: "Retail Company", to: "Jollibee Food Corp" },
        { from: "camera_capture_activity", to: "geo_fence_store_entry" },
        { from: "purchase_activity", to: "food_order_history" },
        { from: "mobile_activity", to: "app_menu_browsing" },
        { from: "Frequency", to: "Revisit Frequency" },
        { from: "Days of Week", to: "Day of Week" },
        { from: "Offer", to: "Meal Deal / Promo" },
        { from: "Creative", to: "Menu Item Theme" },
        { from: "Time", to: "Daypart" },
        { from: "Repurchase use case", to: "Win-back Frequency" },
        { from: "Onboarding use case", to: "Loyalty Enrollment" }
    ];

    // Using your specific selector path
    const IMAGE_REPLACEMENTS = [
        {
            selector: 'img[alt="Braze Decisioning Studio logo"]',
            newSrc: 'https://companiesmarketcap.com/img/company-logos/256/JBFCF.png'
        }
    ];

    // =================================================================
    // ENGINE
    // =================================================================

    function processUI() {
        // Handle Text
        const textElements = document.querySelectorAll('span, div, h1, h2, h3, h4, p, td, th');
        textElements.forEach(el => {
            if (el.getAttribute('data-demo-text-replaced')) return;

            TEXT_REPLACEMENTS.forEach(item => {
                if (el.innerText.trim() === item.from) {
                    el.innerText = item.to;
                    el.setAttribute('data-demo-text-replaced', 'true');
                }
            });
        });

        // Handle Images
        IMAGE_REPLACEMENTS.forEach(item => {
            const img = document.querySelector(item.selector);
            // Only update if found and not already updated
            if (img && img.src !== item.newSrc) {
                img.src = item.newSrc;
                img.style.height = '40px'; // Set a fixed height for consistency
                img.style.width = 'auto';
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        processUI();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    processUI();

})();