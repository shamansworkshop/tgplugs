/**
 * 🧙‍♂️ TGBrowser System Mod: Shaman's Developer Tools v3.2
 * TGUID: workshop.shaman.devkitui
 * Target: TGBrowser
 */

(function() {
    'use strict';

    // 1. Manifest
    const manifest = {
        tguid: "workshop.shaman.devkitui",
        name: "Shaman's DevKit",
        version: "3.2", 
        author: "Shaman's Workshop",
        type: "system_monitor",
        description: "Advanced system monitor with TGSentinel & Ritual integration"
    };

    // State tracking
    let devState = {
        activePlugs: [],
        browserFeatures: {},
        lastUpdate: null,
        hostIdentity: "Scanning..."
    };

    // 2. Registration Ritual (Enhanced from v2.2)
    function startPlug() {
        if (window.TGMoLink && window.TGMoLink.register) {
            // Hook into TGMoLink to detect future registrations
            hookTGMoLink();

            const success = window.TGMoLink.register(manifest.tguid);
            if (success) {
                console.log(`✨ [${manifest.name}] Kernel Linked - v${manifest.version}`);
                setTimeout(() => {
                    detectHostIdentity();
                    initDevTools();
                    startMonitoring();
                }, 200);
            }
        } else {
            setTimeout(startPlug, 100);
        }
    }

    // 3. Host Identity (Targeting Line 558 of TGBrowser HTML)
    function detectHostIdentity() {
        // We target the second span within .menu-header specifically.
        const versionSpan = document.querySelector('.menu-header span:nth-of-type(2)');
        
        if (versionSpan) {
            devState.hostIdentity = versionSpan.textContent.trim();
            console.log(`🎯 [DevKit] Targeted Host Version: ${devState.hostIdentity}`);
        } else {
            // Fallback if DOM structure changes
            devState.hostIdentity = document.title || "Unknown Host";
            console.warn(`⚠️ [DevKit] Could not locate version at target coordinates.`);
        }
    }

    // 4. Initialization
    function initDevTools() {
        ensureFonts();
        injectDevUI();
        injectMenuTrigger();
        updateBrowserState();
        
        // Expose API for other mods (Restored from v2.2)
        window.DevKitAPI = {
            version: manifest.version,
            getState: () => ({...devState}),
            refresh: () => updateBrowserState(),
            showPanel: () => window.toggleDevUI(),
            notify: (msg, type) => showNotification(msg, type)
        };
    }

    function ensureFonts() {
        if (!document.querySelector('link[href*="Material+Icons+Round"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons+Round';
            document.head.appendChild(link);
        }
    }

    // 5. Material You UI (Merged v3.1 Style + v2.2 Features)
    function injectDevUI() {
        const oldUI = document.getElementById('shaman-dev-ui');
        if (oldUI) oldUI.remove();
        
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --dk-sys-primary: var(--primary, #d0bcff);
                --dk-sys-surface: rgba(15, 15, 20, 0.95);
                --dk-sys-surface-var: rgba(255, 255, 255, 0.05);
                --dk-sys-outline: rgba(255, 255, 255, 0.1);
            }

            .shaman-dev-overlay {
                position: fixed; top: 50%; left: 50%; 
                transform: translate(-50%, -50%) scale(0.95);
                width: 400px; max-height: 80vh;
                background: var(--dk-sys-surface); 
                backdrop-filter: blur(24px);
                border: 1px solid var(--dk-sys-outline);
                border-radius: 24px;
                color: #e6e1e5; z-index: 999999;
                box-shadow: 0 24px 48px rgba(0,0,0,0.6);
                display: none; opacity: 0;
                font-family: 'Segoe UI', Roboto, monospace;
                transition: opacity 0.2s, transform 0.2s cubic-bezier(0.2, 0, 0, 1);
            }

            .shaman-dev-overlay.visible { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            
            .dev-header {
                padding: 20px 24px; border-bottom: 1px solid var(--dk-sys-outline);
                display: flex; justify-content: space-between; align-items: center;
            }
            .dev-title { font-size: 18px; font-weight: 500; color: var(--dk-sys-primary); display: flex; gap: 8px; }
            .dev-host { font-size: 11px; opacity: 0.6; margin-top: 4px; font-family: monospace; }
            
            .dev-body { padding: 20px 24px; overflow-y: auto; max-height: 60vh; }
            
            .dev-card {
                background: var(--dk-sys-surface-var); border-radius: 12px;
                padding: 12px; margin-bottom: 12px;
            }
            .card-title {
                font-size: 10px; text-transform: uppercase; letter-spacing: 1px;
                opacity: 0.7; margin-bottom: 8px; font-weight: 700;
            }

            .stat-row {
                display: flex; justify-content: space-between; align-items: center;
                padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.03);
                font-size: 13px;
            }
            .stat-row:last-child { border-bottom: none; }

            .pill {
                padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;
                background: rgba(255,255,255,0.1); font-family: monospace;
            }
            .pill.on { color: #b6f2ba; background: rgba(182, 242, 186, 0.1); border: 1px solid rgba(182, 242, 186, 0.2); }
            .pill.off { color: #ffb4ab; background: rgba(255, 180, 171, 0.1); }
            .pill.warn { color: #ffe088; background: rgba(255, 224, 136, 0.1); }

            /* Action Buttons */
            .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
            .dev-btn {
                padding: 10px; border: none; border-radius: 8px; cursor: pointer;
                background: rgba(255,255,255,0.08); color: white; font-weight: 500;
                transition: background 0.2s;
            }
            .dev-btn:hover { background: rgba(255,255,255,0.15); }
            .dev-btn.primary { background: var(--dk-sys-primary); color: #000; }

            /* Notifications */
            .dk-toast {
                position: fixed; bottom: 24px; right: 24px;
                background: #333; color: #fff; padding: 12px 20px;
                border-radius: 12px; font-size: 13px; z-index: 1000000;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                border-left: 4px solid var(--dk-sys-primary);
                animation: slideUp 0.3s ease-out forwards;
            }
            @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        `;
        document.head.appendChild(style);

        const ui = document.createElement('div');
        ui.id = 'shaman-dev-ui';
        ui.className = 'shaman-dev-overlay';
        
        ui.innerHTML = `
            <div class="dev-header">
                <div>
                    <div class="dev-title"><i class="material-icons-round">settings_input_component</i> DevKit</div>
                    <div class="dev-host">${devState.hostIdentity}</div>
                </div>
                <button class="dev-btn" style="padding:4px 8px; background:transparent" onclick="window.toggleDevUI()">
                    <i class="material-icons-round">close</i>
                </button>
            </div>
            
            <div class="dev-body">
                <div class="dev-card">
                    <div class="card-title">Security & Core</div>
                    <div id="dk-core-stats"></div>
                </div>

                <div class="dev-card">
                    <div class="card-title">Visual Engine</div>
                    <div id="dk-visual-stats"></div>
                </div>
                
                <div class="dev-card">
                    <div class="card-title">TGMoLink Bus (<span id="dk-plug-count">0</span>)</div>
                    <div id="dk-plug-list" style="font-size:11px; opacity:0.7; max-height:80px; overflow-y:auto;"></div>
                </div>
                
                <div class="btn-grid">
                    <button class="dev-btn" onclick="window.refreshDevPanel()">Refresh</button>
                    <button class="dev-btn primary" onclick="window.exportDevData()">Dump Data</button>
                </div>
            </div>
        `;
        document.body.appendChild(ui);
    }

    function injectMenuTrigger() {
        const menuContent = document.getElementById('menuContent');
        if (menuContent && !document.getElementById('dk-menu-item')) {
            const btn = document.createElement('div');
            btn.id = 'dk-menu-item';
            btn.className = 'menu-item';
            btn.innerHTML = `<span>🔧 DevKit Options</span> <span style="font-size:10px; opacity:0.6">v${manifest.version}</span>`;
            
            // Add click handler
            btn.onclick = (e) => {
                e.stopPropagation();
                window.toggleDevUI();
                menuContent.style.display = 'none';
            };
            
            // Insert before the last item (usually info/help)
            const lastItem = menuContent.lastElementChild;
            menuContent.insertBefore(btn, lastItem);
        }
    }

    // 6. Deep State Analysis (Beta 6 Specifics)
    function updateBrowserState() {
        devState.lastUpdate = new Date();
        
        // -- Beta 6 Feature Detection --
        
        // 1. Core Security (Restored from v2.2 + Beta 6)
        const barrier = document.getElementById('dataBarrierToggle')?.checked;
        const sentinel = document.getElementById('tgSentinelToggle')?.checked; // From v2.2
        
        // 2. Visuals
        const chroma = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        const bodyClass = document.body.className;
        const ritual = bodyClass.split(' ').find(c => c.startsWith('ritual-'))?.replace('ritual-', '') || 'Default';
        const darkMode = document.body.classList.contains('dark-mode');

        // 3. Iframe Context
        const iframe = document.getElementById('browser');
        
        devState.browserFeatures = {
            barrier: barrier,
            sentinel: sentinel || false, // Fallback if Sentinel isn't in Beta 6 HTML yet
            ritual: ritual.toUpperCase(),
            chroma: chroma,
            nightMode: darkMode,
            url: iframe ? iframe.src : 'TGHome',
            sandbox: iframe ? iframe.getAttribute('sandbox') : 'None'
        };
        
        devState.activePlugs = window.TGMoLink?.plugs || [];
        
        renderPanelContent();
    }

    function renderPanelContent() {
        const core = document.getElementById('dk-core-stats');
        const visual = document.getElementById('dk-visual-stats');
        const f = devState.browserFeatures;

        // Core Stats (with Sentinel restored)
        core.innerHTML = `
            <div class="stat-row">
                <span>Anti-Cookie Barrier</span>
                <span class="pill ${f.barrier ? 'on' : 'off'}">${f.barrier ? 'ACTIVE' : 'OFF'}</span>
            </div>
            <div class="stat-row">
                <span>TGSentinel</span>
                <span class="pill ${f.sentinel ? 'on' : 'off'}">${f.sentinel ? 'ARMED' : 'DISARMED'}</span>
            </div>
            <div class="stat-row">
                <span>Sandbox Context</span>
                <span class="pill warn" style="max-width:140px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${f.sandbox.includes('allow-same-origin') ? 'PERMISSIVE' : 'STRICT'}
                </span>
            </div>
        `;

        // Visual Stats
        visual.innerHTML = `
            <div class="stat-row">
                <span>Ritual Engine</span>
                <span class="pill warn">${f.ritual}</span>
            </div>
            <div class="stat-row">
                <span>Night Mode</span>
                <span class="pill ${f.nightMode ? 'on' : 'off'}">${f.nightMode ? 'ON' : 'OFF'}</span>
            </div>
            <div class="stat-row">
                <span>Chroma Hex</span>
                <div style="display:flex; align-items:center; gap:6px;">
                    <div style="width:10px; height:10px; border-radius:50%; background:${f.chroma}; border:1px solid #fff;"></div>
                    <span style="font-family:monospace; font-size:11px;">${f.chroma}</span>
                </div>
            </div>
        `;

        // Plug List
        const list = document.getElementById('dk-plug-list');
        document.getElementById('dk-plug-count').textContent = devState.activePlugs.length;
        
        if (devState.activePlugs.length === 0) {
            list.innerHTML = `<div style="padding:4px 0;">No external mods loaded.</div>`;
        } else {
            list.innerHTML = devState.activePlugs.map(p => `
                <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px dashed rgba(255,255,255,0.05);">
                    <span>${p}</span>
                    <i class="material-icons-round" style="font-size:10px; color:#b6f2ba;">check_circle</i>
                </div>
            `).join('');
        }
    }

    // 7. Watchers & Hooks
    function hookTGMoLink() {
        if (!window.TGMoLink) return;
        
        const originalRegister = window.TGMoLink.register;
        // prevent double hooking
        if (originalRegister.isHooked) return;

        window.TGMoLink.register = function(tguid) {
            const result = originalRegister.apply(this, arguments);
            if (result) {
                // If a new plug registers, update UI immediately
                showNotification(`New Mod Detected: ${tguid}`);
                setTimeout(updateBrowserState, 100);
            }
            return result;
        };
        window.TGMoLink.register.isHooked = true;
    }

    function startMonitoring() {
        // Watch for DOM changes (Beta 6 Specific Selectors)
        const observer = new MutationObserver(() => {
            if (document.getElementById('shaman-dev-ui').style.display !== 'none') {
                updateBrowserState();
            }
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        // Listen for specific inputs in the menu
        const inputs = ['dataBarrierToggle', 'darkModeToggle', 'ritualSelect', 'chromaPicker'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.addEventListener('change', updateBrowserState);
        });
    }

    // 8. API & Utilities (Restored Notification System)
    function showNotification(msg, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'dk-toast';
        toast.innerHTML = `<i class="material-icons-round" style="vertical-align:middle; font-size:16px; margin-right:8px">info</i> ${msg}`;
        
        if (type === 'error') toast.style.borderLeftColor = '#ffb4ab';
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    window.toggleDevUI = function() {
        const ui = document.getElementById('shaman-dev-ui');
        if (!ui) return;
        
        if (ui.classList.contains('visible')) {
            ui.classList.remove('visible');
            setTimeout(() => ui.style.display = 'none', 200);
        } else {
            detectHostIdentity(); // Re-scan version on open
            ui.style.display = 'block';
            setTimeout(() => ui.classList.add('visible'), 10);
            updateBrowserState();
        }
    };

    window.refreshDevPanel = () => {
        updateBrowserState();
        showNotification("DevKit State Refreshed");
    };

    window.exportDevData = function() {
        const data = {
            host: devState.hostIdentity,
            timestamp: new Date().toISOString(),
            features: devState.browserFeatures,
            mods: devState.activePlugs
        };
        
        const json = JSON.stringify(data, null, 2);
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(json)
                .then(() => showNotification("Diagnostic Data Copied!"))
                .catch(() => showNotification("Clipboard Access Denied", "error"));
        } else {
            // Fallback for older contexts
            const ta = document.createElement('textarea');
            ta.value = json;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showNotification("Diagnostic Data Copied (Fallback)!");
        }
    };

    // 9. Launch
    startPlug();

})();
