/* TGPlug: TGLite (TV/Low-Spec Mode)
   ID: workshop.shaman.tglite
   Description: DOM Surgery for performance, now with Gatekeeper Compliance.
*/

(function() {
    'use strict';
    
    // 1. Identity Definition
    const MOD_ID = "workshop.shaman.tglite";
    
    // 2. The Gatekeeper Compliant Startup Pattern
    function startPlug() {
        // Check if TGMoLink API is actually ready
        if (window.TGMoLink && window.TGMoLink.register) {
            
            // Attempt to register and CAPTURE the result
            const isRegistered = window.TGMoLink.register(MOD_ID);
            
            if (isRegistered) {
                console.log(`[${MOD_ID}] Security Verified. Initializing Potato Mode... 🥔`);
                
                // ONLY run the logic if registration returned TRUE
                initializeLiteMode();
            } else {
                // If register() returns false, it likely means a duplicate ID or invalid format.
                console.error(`[${MOD_ID}] Registration Failed! Aborting Lite Mode.`);
            }
        } else {
            // TGMoLink isn't ready yet. Wait 100ms and try again (Recursive Polling)
            // This prevents the "Mod ran before API" error.
            setTimeout(startPlug, 100);
        }
    }

    // 3. The Payload (The Surgeon Logic)
    function initializeLiteMode() {
        // Broadcast presence
        if(window.TGMoLink.broadcast) {
            window.TGMoLink.broadcast("Optimizing environment for low-spec hardware.", MOD_ID);
        }

        // DOM SURGERY
        const toolbar = document.querySelector('.toolbar');
        const oldNav = document.querySelector('.nav-buttons');
        const oldMenu = document.querySelector('.menu');
        const oldBook = document.querySelector('#bookmarkBtn');

        // Remove the stuff we don't need
        if(oldNav) oldNav.remove();
        if(oldMenu) oldMenu.remove();
        if(oldBook) oldBook.remove();

        // Create TV-Friendly Controls
        const controlPanel = document.createElement('div');
        controlPanel.style.display = 'flex';
        controlPanel.style.alignItems = 'center';

        // Helper to create buttons
        function createTvBtn(text, onClick) {
            const btn = document.createElement('button');
            btn.className = 'tv-btn';
            btn.innerText = text;
            btn.onclick = onClick;
            return btn;
        }

        // BACK
        controlPanel.appendChild(createTvBtn('<', () => {
            if(window.currentIframe) window.currentIframe.contentWindow.history.back();
        }));

        // FORWARD
        controlPanel.appendChild(createTvBtn('>', () => {
            if(window.currentIframe) window.currentIframe.contentWindow.history.forward();
        }));

        // REFRESH
        controlPanel.appendChild(createTvBtn('R', () => {
            if (window.currentIframe) window.currentIframe.src = window.currentIframe.src;
        }));

        // GO Button (Explicit Submit)
        const goBtn = createTvBtn('GO', () => {
            if (typeof window.loadFromInput === 'function') {
                window.loadFromInput();
            }
        });
        goBtn.style.background = 'var(--primary)';
        goBtn.style.color = 'black';
        goBtn.style.marginLeft = '10px';

        // Insert new controls
        if (toolbar) {
            toolbar.insertBefore(controlPanel, toolbar.firstChild);
        }
        
        const omnibox = document.querySelector('.omnibox-container');
        if (omnibox) {
            omnibox.appendChild(goBtn);
        }

        // Update Status
        const status = document.getElementById('status');
        if(status) {
            status.innerText = "TGLite: Optimized & Secure";
            status.style.color = "#00FF00";
        }
    }

    // 4. Ignite
    startPlug();

})();