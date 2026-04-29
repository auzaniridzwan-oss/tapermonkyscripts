// ==UserScript==
// @name         Braze DS Demo Customizer (Pro)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Replaces text and UI logo for Braze DS Demos (select menus included)
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

    /** Leaf text, or one inner span (Naive sometimes wraps label text). */
    function applyReplacementsToLabelLike(el) {
        if (el.children.length === 0) {
            applyTextReplacements(el);
            return;
        }
        if (el.children.length === 1) {
            const inner = el.firstElementChild;
            if (inner && inner.tagName === 'SPAN' && inner.children.length === 0) {
                applyTextReplacements(inner);
            }
        }
    }

    /** Naive UI select: closed control label. */
    function processSelectionLabels() {
        document.querySelectorAll('.n-base-selection-input__content').forEach((el) => {
            applyReplacementsToLabelLike(el);
        });
    }

    /** Naive UI select: open menu options (same DOM used for hover highlight). */
    function processSelectMenuOptions() {
        document.querySelectorAll('.n-base-select-menu .n-base-select-option__content').forEach((el) => {
            applyReplacementsToLabelLike(el);
        });
    }

    /** Native browser tooltip on options often uses `title` with the raw label. */
    function processSelectMenuOptionTitles() {
        document.querySelectorAll('.n-base-select-menu .n-base-select-option[title]').forEach((el) => {
            const raw = el.getAttribute('title');
            if (raw == null) return;
            const trimmed = raw.trim();
            for (let i = 0; i < TEXT_REPLACEMENTS.length; i++) {
                const item = TEXT_REPLACEMENTS[i];
                if (trimmed === item.from) {
                    el.setAttribute('title', item.to);
                    return;
                }
            }
        });
    }

    function processUI() {
        processSelectionLabels();
        processSelectMenuOptions();
        processSelectMenuOptionTitles();

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