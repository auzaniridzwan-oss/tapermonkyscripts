// ==UserScript==
// @name         Braze DS Demo Customizer (Pro)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replaces text and UI logo for Braze DS Demos
// @author       You
// @match        https://portal.offerfit.ai/clients/retail_company/*
// @match        https://portal.offerfit.ai/use-cases?org=retail_company*
// @match        https://portal.offerfit.ai/use-case/repurchase/*
// @match        https://portal.offerfit.ai/reports/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // =================================================================
    // CONFIGURATION
    // =================================================================

    const TEXT_REPLACEMENTS = [
        { from: "Retail Company", to: "Jollibee Food Corp" },
        { from: "camera_capture_activity", to: "store_visit_frequency" },
        { from: "marketing_events", to: "previous_campaign_engagement" },
        { from: "mobile_activity", to: "app_session_recency" },
        { from: "purchase_activity", to: "last_transaction_category" },
        { from: "user_status", to: "loyalty_tier_status" },
        { from: "retail_customer_snapshot_onboarding", to: "lapsed_customer_profile" },
        { from: "onboarding_marketing_events", to: "reactivation_event_history" },
        { from: "Frequency", to: "Purchase Recency" },
        { from: "Days of Week", to: "Preferred Ordering Day" },
        { from: "Offer", to: "Optimal Incentive Type" },
        { from: "Channel", to: "High-Conversion Touchpoint" },
        { from: "Creative", to: "Visual Menu Theme" },
        { from: "Time", to: "Preferred Delivery Window" },
        { from: "Repurchase use case", to: "Bounce Back Journey" },
        { from: "Onboarding use case", to: "Lapsed Loyalty Recovery" },
        { from: "Repurchase", to: "Bounce Back Journey" },
    ];

    // Using your specific selector path
    const IMAGE_REPLACEMENTS = [
        {
            selector: 'img[alt="Braze Decisioning Studio logo"]',
            newSrc: 'https://braze-images.com/appboy/communication/assets/image_assets/images/69f185e12242bf0066109f4b/original.png?1777436128'
        }
    ];

    // =================================================================
    // ENGINE
    // =================================================================

    /** Idempotent: safe to run on every mutation (Vue may reset label text). */
    function applyTextReplacements(el) {
        const t = el.textContent.trim();
        for (let i = 0; i < TEXT_REPLACEMENTS.length; i++) {
            const item = TEXT_REPLACEMENTS[i];
            if (t === item.from) {
                el.textContent = item.to;
                return;
            }
        }
    }

    /** Naive UI select: visible value lives in a leaf div, not in the generic tag list. */
    function processSelectionLabels() {
        document.querySelectorAll('.n-base-selection-input__content').forEach((el) => {
            if (el.children.length > 0) return;
            applyTextReplacements(el);
        });
    }

    function processUI() {
        processSelectionLabels();

        const allElements = document.querySelectorAll('span, a, h1, h2, h3, h4, p, td, th, label');

        allElements.forEach((el) => {
            if (['SELECT', 'INPUT', 'TEXTAREA', 'BUTTON'].includes(el.tagName)) return;
            if (el.children.length > 0) return;
            applyTextReplacements(el);
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