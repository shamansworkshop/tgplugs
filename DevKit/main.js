/**
 * 🧙‍♂️ TGBrowser System Mod: Shaman's Developer Tools v3.0
 * TGUID: workshop.shaman.devkitui
 * Target: TGBrowser (Auto-Detect)
 * Features: Material You UI, Auto-Version Detection, TGMoLink v2 Support
 */

(function() {
    'use strict';

    // 1. Manifest with enhanced metadata
    const manifest = {
        tguid: "workshop.shaman.devkitui",
        name: "Shaman's DevKit",
        version: "3.0", // Bumped for the major UI overhaul
        author: "Shaman's Workshop",
        type: "system_monitor",
        description: "Material You system monitoring panel for TGBrowser"
    };

    // State tracking
    let devState = {
        activePlugs: [],
        browserFeatures: {},
        lastUpdate: null,
        browserVersion: "Detecting..."
    };

    // 2. Registration Ritual (TGMoLink v2 Compliant)
    function startPlug() {
        if (window.TGMoLink && window.TGMoLink.register) {
            const success = window.TGMoLink.register(manifest.tguid);
            
            if (success) {
                console.log(`✨ [${manifest.name}] Protocol Active - v${manifest.version}`);
                // Initialize after registration to ensure safety
                setTimeout(() => {
                    detectBrowserVersion();
                    initDevTools();
                    startMonitoring();
                }, 100);
            } else {
                console.error(`[${manifest.name}] Registration failed.`);
            }
        } else {
            // Wait silently for the API
            setTimeout(startPlug, 100);
        }
    }

    // 3. Environment Intelligence
    function detectBrowserVersion() {
        // 1. Try Global Object
        if (window.TGBrowser && window.TGBrowser.version) {
            devState.browserVersion = `TGBrowser v${window.TGBrowser.version}`;
            return;
        }

        // 2. Try User Agent Parsing (Standard TGBrowser pattern)
        const ua = navigator.userAgent;
        const match = ua.match(/TGBrowser\/([\d.]+)/);
        
        if (match && match[1]) {
            devState.browserVersion = `v${match[1]} (Stable)`;
        } else {
            // 3. Fallback based on feature detection
            devState.browserVersion = "Unknown Build (Dev)";
        }
        console.log(`🕵️ [DevKit] Detected Environment: ${devState.browserVersion}`);
    }

    // 4. Main Initialization
    function initDevTools() {
        ensureFonts(); // Make sure we have icons!
        injectDevUI();
        setupEventListeners();
        updateBrowserState();
        
        console.log(`🛠️ [${manifest.name}] UI Injection Complete`);
    }

    // Helper: Inject fonts if missing (Prevent broken icons)
    function ensureFonts() {
        if (!document.querySelector('link[href*="Material+Icons+Round"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons+Round';
            document.head.appendChild(link);
        }
    }

    // 5. Material You UI Injection
    function injectDevUI() {
        const oldUI = document.getElementById('shaman-dev-ui');
        if (oldUI) oldUI.remove();
        
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --dk-sys-primary: #d0bcff;
                --dk-sys-on-primary: #381e72;
                --dk-sys-surface: rgba(20, 18, 24, 0.85);
                --dk-sys-surface-variant: rgba(231, 224, 236, 0.1);
                --dk-sys-outline: #938f99;
                --dk-sys-success: #b6f2ba;
                --dk-sys-error: #ffb4ab;
            }

            .shaman-dev-overlay {
                position: fixed; 
                top: 50%; left: 50%; 
                transform: translate(-50%, -50%) scale(0.95);
                opacity: 0;
                width: 400px; 
                max-height: 80vh;
                background: var(--dk-sys-surface); 
                backdrop-filter: blur(24px) saturate(180%);
                border-radius: 28px;
                color: #e6e1e5; 
                z-index: 99999;
                box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1);
                display: none; 
                font-family: 'Roboto', 'Segoe UI', sans-serif;
                overflow: hidden;
                transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.2, 0, 0, 1);
            }

            .shaman-dev-overlay.visible {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            
            /* Header */
            .shaman-dev-header {
                padding: 24px 24px 16px 24px;
                display: flex; 
                justify-content: space-between;
                align-items: center;
            }

            .header-title h2 {
                margin: 0;
                font-size: 22px;
                font-weight: 400;
                color: var(--dk-sys-primary);
            }
            
            .header-subtitle {
                font-size: 12px;
                color: #cac4d0;
                opacity: 0.8;
                margin-top: 4px;
                font-family: 'Roboto Mono', monospace;
            }

            .close-btn {
                background: rgba(255,255,255,0.05);
                border: none;
                color: #e6e1e5;
                width: 32px; height: 32px;
                border-radius: 50%;
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                transition: background 0.2s;
            }
            .close-btn:hover { background: rgba(255,255,255,0.15); }
            
            /* Body */
            .shaman-dev-body {
                padding: 0 24px 24px 24px;
                max-height: 60vh; 
                overflow-y: auto;
            }

            /* Sections */
            .dev-card {
                background: var(--dk-sys-surface-variant);
                border-radius: 16px;
                padding: 16px;
                margin-bottom: 16px;
            }

            .card-label {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--dk-sys-primary);
                margin-bottom: 12px;
                font-weight: 700;
                display: flex; align-items: center; gap: 8px;
            }

            /* Data Grid */
            .info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                font-size: 13px;
                padding-bottom: 8px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
            }
            .info-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

            .status-pill {
                padding: 4px 12px;
                border-radius: 100px;
                font-size: 11px;
                font-weight: 500;
                background: rgba(255,255,255,0.1);
            }
            .status-pill.active { background: #003314; color: #b6f2ba; border: 1px solid #146c2e; }
            .status-pill.inactive { background: #410e0b; color: #ffb4ab; border: 1px solid #8c1d18; }
            .status-pill.info { background: #182856; color: #d0bcff; border: 1px solid #384f85; }

            /* Plug List */
            .plug-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 0;
            }
            .plug-icon {
                font-size: 18px;
                color: var(--dk-sys-outline);
            }
            .plug-name {
                font-family: 'Roboto Mono', monospace;
                font-size: 12px;
                color: #e6e1e5;
                flex: 1;
            }

            /* Actions */
            .action-bar {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-top: 8px;
            }

            .btn {
                border: none;
                padding: 12px;
                border-radius: 100px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                display: flex; align-items: center; justify-content: center; gap: 8px;
                transition: transform 0.1s;
            }
            .btn:active { transform: scale(0.98); }

            .btn-tonal {
                background: var(--dk-sys-primary);
                color: var(--dk-sys-on-primary);
            }
            .btn-text {
                background: transparent;
                color: var(--dk-sys-primary);
                border: 1px solid rgba(208, 188, 255, 0.3);
            }

            /* Scrollbar */
            .shaman-dev-body::-webkit-scrollbar { width: 4px; }
            .shaman-dev-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        `;
        document.head.appendChild(style);

        const ui = document.createElement('div');
        ui.id = 'shaman-dev-ui';
        ui.className = 'shaman-dev-overlay';
        
        ui.innerHTML = `
            <div class="shaman-dev-header">
                <div class="header-title">
                    <h2>DevKit</h2>
                    <div class="header-subtitle">${devState.browserVersion}</div>
                </div>
                <button class="close-btn" onclick="window.toggleDevUI()">
                    <i class="material-icons-round" style="font-size: 20px;">close</i>
                </button>
            </div>
            
            <div class="shaman-dev-body">
                <div class="dev-card">
                    <div class="card-label"><i class="material-icons-round" style="font-size:14px">memory</i> System State</div>
                    <div id="dev-features-list">
                        </div>
                </div>
                
                <div class="dev-card">
                    <div class="card-label">
                        <i class="material-icons-round" style="font-size:14px">extension</i> 
                        Active Mods (<span id="plug-count">0</span>)
                    </div>
                    <div id="dev-plug-list" style="max-height: 120px; overflow-y: auto;">
                        <div style="text-align:center; padding:10px; opacity:0.5; font-size:12px;">No mods active</div>
                    </div>
                </div>
                
                <div class="action-bar">
                    <button class="btn btn-text" onclick="window.refreshDevPanel()">
                        <i class="material-icons-round" style="font-size:18px">refresh</i> Refresh
                    </button>
                    <button class="btn btn-tonal" id="btn-export" onclick="window.exportDevData()">
                        <i class="material-icons-round" style="font-size:18px">content_copy</i> Export
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(ui);
        injectMenuButton();
    }

    // 6. Menu Button (Subtle Integration)
    function injectMenuButton() {
        // Wait for menu if it loads async
        const menuContent = document.querySelector('.menu-content');
        if (!menuContent) {
            setTimeout(injectMenuButton, 500);
            return;
        }

        if (document.getElementById('dk-menu-trigger')) return;

        const btn = document.createElement('div');
        btn.id = 'dk-menu-trigger';
        btn.style.cssText = `
            padding: 12px 16px; margin: 4px 8px;
            border-radius: 8px; cursor: pointer;
            display: flex; justify-content: space-between; align-items: center;
            background: rgba(var(--md-sys-color-primary-rgb, 11, 87, 208), 0.05);
        `;
        btn.innerHTML = `
            <span style="font-size:14px; font-weight:500;">🔧 Developer Options</span>
            <span style="font-size:10px; background:#e0e0e0; padding:2px 6px; border-radius:4px;">DEV</span>
        `;
        
        btn.onclick = () => {
            window.toggleDevUI();
            // Close the main menu if possible
            if(menuContent.parentElement.classList.contains('open')) {
                // Assuming a standard toggle class
            }
        };

        // Insert at bottom of menu
        menuContent.appendChild(btn);
    }

    // 7. State Management
    function updateBrowserState() {
        devState.lastUpdate = new Date();
        
        // Dynamic Feature Detection
        devState.browserFeatures = {
            nightMode: document.body.classList.contains('dark-mode'),
            tgSentinel: !!document.getElementById('tgSentinelToggle')?.checked,
            secureContext: window.isSecureContext,
            screenSize: `${window.innerWidth}x${window.innerHeight}`
        };
        
        // Get Plugs safely
        devState.activePlugs = window.TGMoLink?.plugs || [];
        
        renderDevPanel();
    }

    function renderDevPanel() {
        const ui = document.getElementById('shaman-dev-ui');
        if (!ui) return;

        // Render Features
        const fList = document.getElementById('dev-features-list');
        fList.innerHTML = `
            <div class="info-row">
                <span>Night Mode</span>
                <span class="status-pill ${devState.browserFeatures.nightMode ? 'active' : 'inactive'}">
                    ${devState.browserFeatures.nightMode ? 'ENABLED' : 'DISABLED'}
                </span>
            </div>
            <div class="info-row">
                <span>TGSentinel</span>
                <span class="status-pill ${devState.browserFeatures.tgSentinel ? 'active' : 'inactive'}">
                    ${devState.browserFeatures.tgSentinel ? 'ARMED' : 'DISARMED'}
                </span>
            </div>
             <div class="info-row">
                <span>Security Context</span>
                <span class="status-pill ${devState.browserFeatures.secureContext ? 'active' : 'inactive'}">
                    ${devState.browserFeatures.secureContext ? 'SECURE' : 'UNSAFE'}
                </span>
            </div>
        `;

        // Render Plugs
        const pList = document.getElementById('dev-plug-list');
        document.getElementById('plug-count').textContent = devState.activePlugs.length;

        if (devState.activePlugs.length > 0) {
            pList.innerHTML = devState.activePlugs.map(tguid => `
                <div class="plug-item">
                    <i class="material-icons-round plug-icon">extension</i>
                    <span class="plug-name">${tguid}</span>
                    <i class="material-icons-round" style="color:#b6f2ba; font-size:12px;">check_circle</i>
                </div>
            `).join('');
        } else {
            pList.innerHTML = `<div style="text-align:center; padding:15px; opacity:0.6; font-size:12px;">No TGPlugs detected via TGMoLink.</div>`;
        }
    }

    function setupEventListeners() {
        // Watch for DOM changes (Simulated Sentinel)
        const observer = new MutationObserver((mutations) => {
            if (document.getElementById('shaman-dev-ui').style.display !== 'none') {
                updateBrowserState();
            }
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    function startMonitoring() {
        setInterval(() => {
            if (document.getElementById('shaman-dev-ui').style.display !== 'none') {
                updateBrowserState();
            }
        }, 2000);
    }

    // 8. Public API & Actions
    window.toggleDevUI = function() {
        const ui = document.getElementById('shaman-dev-ui');
        if (!ui) return;
        
        if (ui.style.display === 'block') {
            ui.classList.remove('visible');
            setTimeout(() => ui.style.display = 'none', 200);
        } else {
            ui.style.display = 'block';
            // Slight delay to allow display:block to apply before opacity transition
            setTimeout(() => ui.classList.add('visible'), 10);
            updateBrowserState();
        }
    };

    window.refreshDevPanel = function() {
        updateBrowserState();
        const btn = document.querySelector('.btn-text');
        const icon = btn.querySelector('i');
        icon.style.transition = 'transform 0.5s';
        icon.style.transform = 'rotate(360deg)';
        setTimeout(() => icon.style.transform = 'rotate(0deg)', 500);
    };

    window.exportDevData = function() {
        const data = {
            timestamp: new Date().toISOString(),
            environment: devState.browserVersion,
            state: devState.browserFeatures,
            plugins: devState.activePlugs
        };
        
        const json = JSON.stringify(data, null, 2);
        
        // Clipboard API with fallback
        if (navigator.clipboard) {
            navigator.clipboard.writeText(json).then(notifySuccess, notifyError);
        } else {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = json;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            notifySuccess();
        }
    };

    function notifySuccess() {
        const btn = document.getElementById('btn-export');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<i class="material-icons-round" style="font-size:18px">check</i> Copied!`;
        btn.style.background = '#b6f2ba';
        btn.style.color = '#00210e';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = ''; // Revert to CSS var
            btn.style.color = '';
        }, 2000);
    }
    
    function notifyError() {
        alert("Could not copy data to clipboard. Check permissions.");
    }

    // 9. Launch
    startPlug();

})();
