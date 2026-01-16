/**
 * 🧙‍♂️ TGBrowser System Mod: Shaman's Developer Tools v2.2
 * TGUID: workshop.shaman.devtools
 * Target: TGBrowser Beta 5+
 * Features: Clean system monitor with real-time TGBrowser analytics
 */

(function() {
    'use strict';

    // 1. Manifest with enhanced metadata
    const manifest = {
        tguid: "workshop.shaman.devkitui",
        name: "Shaman's DevKit",
        version: "2.2",
        author: "Shaman's Workshop",
        type: "system_monitor",
        description: "Clean system monitoring panel for TGBrowser"
    };

    // State tracking
    let devState = {
        activePlugs: [],
        browserFeatures: {},
        lastUpdate: null
    };

    // 2. Registration Ritual
    function startPlug() {
        if (window.TGMoLink && window.TGMoLink.register) {
            const success = window.TGMoLink.register(manifest.tguid);
            if (!success) return;
            
            console.log(`✨ [${manifest.name}] Successfully registered - v${manifest.version}`);
            
            // Initialize after registration
            setTimeout(() => {
                initDevTools();
                startMonitoring();
            }, 100);
        } else {
            setTimeout(startPlug, 50);
        }
    }

    // 3. Main Initialization
    function initDevTools() {
        injectDevUI();
        setupEventListeners();
        updateBrowserState();
        
        console.log(`🛠️ [${manifest.name}] Monitoring ${manifest.tguid}`);
    }

    // 4. Compact UI Injection
    function injectDevUI() {
        // Clean previous injection if exists
        const oldUI = document.getElementById('shaman-dev-ui');
        if (oldUI) oldUI.remove();
        
        // Style injection
        const style = document.createElement('style');
        style.textContent = `
            .shaman-dev-overlay {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 380px; max-height: 70vh;
                background: rgba(20, 20, 30, 0.98); backdrop-filter: blur(20px);
                border: 2px solid var(--primary); border-radius: 14px;
                color: #fff; z-index: 10000; padding: 0;
                box-shadow: 0 0 30px rgba(var(--primary-rgb, 66, 133, 244), 0.3);
                display: none; font-family: 'Segoe UI', 'Consolas', monospace;
                overflow: hidden;
                font-size: 12px;
            }
            
            .shaman-dev-header {
                background: linear-gradient(135deg, var(--primary), #8a2be2);
                color: #fff; padding: 12px 16px;
                font-weight: 700; display: flex; justify-content: space-between;
                align-items: center; font-size: 13px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .shaman-dev-body {
                padding: 16px; max-height: 55vh; overflow-y: auto;
            }
            
            .dev-section {
                background: rgba(255,255,255,0.05);
                border-radius: 8px; padding: 12px;
                margin-bottom: 12px; border-left: 3px solid var(--primary);
            }
            
            .dev-section-title {
                color: #64b5f6; font-size: 11px; font-weight: 700;
                text-transform: uppercase; letter-spacing: 1px;
                margin-bottom: 8px; display: flex; align-items: center;
                gap: 6px;
            }
            
            .dev-section-title::before {
                content: "▶"; font-size: 9px;
            }
            
            .dev-grid {
                display: grid; grid-template-columns: 1fr 1fr;
                gap: 8px; font-size: 11px;
            }
            
            .dev-item {
                display: flex; justify-content: space-between;
                padding: 5px 0; border-bottom: 1px dotted rgba(255,255,255,0.1);
            }
            
            .dev-key {
                color: #90caf9; font-weight: 600;
            }
            
            .dev-val {
                color: #81c784; font-weight: 500;
            }
            
            .dev-val.active { color: #4caf50; }
            .dev-val.inactive { color: #f44336; }
            .dev-val.warning { color: #ff9800; }
            .dev-val.info { color: #64b5f6; }
            
            .plug-list {
                max-height: 100px; overflow-y: auto;
                background: rgba(0,0,0,0.3); padding: 6px;
                border-radius: 5px; margin-top: 5px;
            }
            
            .plug-item {
                font-family: 'Consolas', monospace; font-size: 10px;
                padding: 3px 6px; margin: 2px 0;
                background: rgba(100, 181, 246, 0.1);
                border-radius: 3px; display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .plug-id {
                color: #bb86fc; overflow: hidden;
                text-overflow: ellipsis; white-space: nowrap;
                flex: 1;
            }
            
            .dev-buttons {
                display: flex; gap: 8px; margin-top: 12px;
            }
            
            .dev-btn {
                flex: 1; padding: 8px; border: none;
                border-radius: 6px; cursor: pointer;
                font-weight: 600; font-size: 11px;
                transition: all 0.2s;
            }
            
            .dev-btn-primary {
                background: var(--primary); color: white;
            }
            
            .dev-btn-secondary {
                background: rgba(255,255,255,0.1); color: #fff;
            }
            
            .dev-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            }
            
            .timestamp {
                font-size: 9px; color: #aaa;
                text-align: right; margin-top: 10px;
            }
            
            .no-data {
                padding: 10px; text-align: center;
                color: #aaa; font-size: 10px;
                background: rgba(0,0,0,0.2);
                border-radius: 5px; margin-top: 5px;
            }
            
            .status-indicator {
                display: inline-block; width: 7px; height: 7px;
                border-radius: 50%; margin-right: 5px;
            }
            
            .status-active { background: #4caf50; box-shadow: 0 0 4px #4caf50; }
            .status-inactive { background: #f44336; }
            
            .sentinel-indicator {
                display: inline-flex; align-items: center; gap: 4px;
                font-size: 9px; padding: 2px 6px; border-radius: 10px;
                background: rgba(0,0,0,0.2); margin-left: 4px;
            }
        `;
        document.head.appendChild(style);

        // UI Overlay
        const ui = document.createElement('div');
        ui.id = 'shaman-dev-ui';
        ui.className = 'shaman-dev-overlay';
        ui.innerHTML = `
            <div class="shaman-dev-header">
                <span>⚡ DevKit v${manifest.version}</span>
                <span style="cursor:pointer; font-size:18px" onclick="window.toggleDevUI()">×</span>
            </div>
            <div class="shaman-dev-body">
                <!-- TGBrowser Features Section -->
                <div class="dev-section">
                    <div class="dev-section-title">📊 TGBrowser State</div>
                    <div class="dev-grid" id="dev-browser-features">
                        <!-- Dynamic content -->
                    </div>
                </div>
                
                <!-- TGPlugs Section -->
                <div class="dev-section">
                    <div class="dev-section-title">🔌 Active TGPlugs (<span id="plug-count">0</span>)</div>
                    <div class="plug-list" id="dev-plug-list">
                        <div class="no-data">No TGPlugs active</div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="dev-buttons">
                    <button class="dev-btn dev-btn-secondary" onclick="window.refreshDevPanel()">
                        🔄 Refresh
                    </button>
                    <button class="dev-btn dev-btn-primary" onclick="window.exportDevData()">
                        📋 Copy Data to Clipboard
                    </button>
                </div>
                
                <div class="timestamp" id="last-update">
                    Last updated: --
                </div>
            </div>
        `;
        document.body.appendChild(ui);

        // Add to TGPanel menu
        injectMenuButton();
    }

    // 5. Menu Integration
    function injectMenuButton() {
        const menuContent = document.querySelector('.menu-content');
        if (!menuContent) {
            setTimeout(injectMenuButton, 100);
            return;
        }

        // Remove existing button if present
        const existingBtn = menuContent.querySelector('.devkit-menu-btn');
        if (existingBtn) existingBtn.remove();

        // Create new menu item
        const section = document.createElement('div');
        section.className = 'menu-section';
        section.innerHTML = `
            <div class="menu-label">Developer Settings</div>
            <div class="menu-item devkit-menu-btn" style="cursor:pointer">
                <span>🔧 DevKit</span>
                <span style="color:var(--primary); font-size:9px">v${manifest.version}</span>
            </div>
        `;

        // Insert before bookmarks section
        const bookmarkSection = menuContent.querySelector('.menu-section:last-child');
        if (bookmarkSection) {
            menuContent.insertBefore(section, bookmarkSection);
        } else {
            menuContent.appendChild(section);
        }

        // Add click handler
        const btn = section.querySelector('.devkit-menu-btn');
        btn.onclick = () => {
            window.toggleDevUI();
            menuContent.style.display = 'none';
        };
    }

    // 6. State Monitoring Functions
    function updateBrowserState() {
        devState.lastUpdate = new Date();
        
        // Extract browser features from DOM
        devState.browserFeatures = {
            nightMode: document.body.classList.contains('dark-mode'),
            dataBarrier: document.getElementById('dataBarrierToggle')?.checked || false,
            tgSentinel: document.getElementById('tgSentinelToggle')?.checked || false,
            tgChroma: document.getElementById('chromaPicker')?.value || '#4285f4',
            tgRitual: document.getElementById('ritualSelect')?.value || 'none',
            tgHomeBackground: document.getElementById('wallpaperInput')?.value || 'none',
            activePlugsCount: window.TGMoLink?.plugs?.length || 0
        };
        
        // Get active plugs
        devState.activePlugs = window.TGMoLink?.plugs || [];
        
        // Update UI
        renderDevPanel();
    }

    // 7. UI Rendering
    function renderDevPanel() {
        if (!document.getElementById('shaman-dev-ui')) return;
        
        // Update browser features with TGSentinel status included
        const featuresContainer = document.getElementById('dev-browser-features');
        featuresContainer.innerHTML = `
            <div class="dev-item">
                <span class="dev-key">🌙 Night Mode</span>
                <span class="dev-val ${devState.browserFeatures.nightMode ? 'active' : 'inactive'}">
                    ${devState.browserFeatures.nightMode ? 'ON' : 'OFF'}
                </span>
            </div>
            <div class="dev-item">
                <span class="dev-key">🛡️ Data Barrier</span>
                <span class="dev-val ${devState.browserFeatures.dataBarrier ? 'active' : 'inactive'}">
                    ${devState.browserFeatures.dataBarrier ? 'ACTIVE' : 'INACTIVE'}
                </span>
            </div>
            <div class="dev-item">
                <span class="dev-key">🛡️ TGSentinel</span>
                <span class="dev-val ${devState.browserFeatures.tgSentinel ? 'active' : 'inactive'}">
                    ${devState.browserFeatures.tgSentinel ? 'ACTIVE' : 'INACTIVE'}
                </span>
            </div>
            <div class="dev-item">
                <span class="dev-key">🎨 TGChroma</span>
                <span class="dev-val" style="color:${devState.browserFeatures.tgChroma}">
                    ${devState.browserFeatures.tgChroma}
                </span>
            </div>
            <div class="dev-item">
                <span class="dev-key">🔮 TGRitual</span>
                <span class="dev-val ${devState.browserFeatures.tgRitual !== 'none' ? 'active' : 'inactive'}">
                    ${devState.browserFeatures.tgRitual.toUpperCase()}
                </span>
            </div>
        `;
        
        // Update plug list
        const plugList = document.getElementById('dev-plug-list');
        const plugCount = document.getElementById('plug-count');
        plugCount.textContent = devState.activePlugs.length;
        
        if (devState.activePlugs.length > 0) {
            plugList.innerHTML = devState.activePlugs.map(plug => `
                <div class="plug-item">
                    <span class="plug-id" title="${plug}">${plug}</span>
                    <span style="color:#4caf50; font-size:8px">●</span>
                </div>
            `).join('');
        } else {
            plugList.innerHTML = '<div class="no-data">No TGPlugs active</div>';
        }
        
        // Update timestamp
        document.getElementById('last-update').textContent = 
            `Last updated: ${devState.lastUpdate.toLocaleTimeString()}`;
    }

    // 8. Event Listeners and Monitoring
    function setupEventListeners() {
        // Monitor TGMoLink registration
        const originalRegister = window.TGMoLink?.register;
        if (originalRegister && !originalRegister.isHooked) {
            // Mark as hooked
            originalRegister.isHooked = true;
            
            const hookedRegister = function(...args) {
                const result = originalRegister.apply(this, args);
                if (result) {
                    setTimeout(updateBrowserState, 50);
                }
                return result;
            };
            
            // Copy properties
            Object.assign(hookedRegister, originalRegister);
            window.TGMoLink.register = hookedRegister;
        }
        
        // Monitor toggle changes
        ['darkModeToggle', 'dataBarrierToggle', 'tgSentinelToggle'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', updateBrowserState);
            }
        });
        
        // Monitor ritual select
        const ritualSelect = document.getElementById('ritualSelect');
        if (ritualSelect) {
            ritualSelect.addEventListener('change', updateBrowserState);
        }
    }

    function startMonitoring() {
        // Periodic updates every 5 seconds
        setInterval(updateBrowserState, 5000);
        
        // Also update on visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) updateBrowserState();
        });
    }

    // 9. Clipboard Copy Function
    function copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            // Try modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text)
                    .then(() => resolve(true))
                    .catch(() => fallbackCopy(text) ? resolve(true) : reject(false));
            } else {
                fallbackCopy(text) ? resolve(true) : reject(false);
            }
        });
    }

    function fallbackCopy(text) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
        } catch (err) {
            console.error('Fallback copy failed:', err);
            return false;
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: ${type === 'error' ? '#f44336' : 'var(--primary)'}; 
            color: white; padding: 10px 15px; border-radius: 8px;
            font-size: 12px; font-weight: 600; z-index: 10001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideInUp 0.3s ease-out, fadeOut 0.3s ease-in 2.7s;
            max-width: 250px; word-break: break-word;
            border-left: 3px solid ${type === 'error' ? '#d32f2f' : '#1976d2'};
        `;
        notification.textContent = message;
        notification.id = 'devkit-notification-' + Date.now();
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutDown 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    // 10. Global API Methods
    window.toggleDevUI = function() {
        const ui = document.getElementById('shaman-dev-ui');
        if (!ui) return;
        
        if (ui.style.display === 'block') {
            ui.style.display = 'none';
        } else {
            ui.style.display = 'block';
            updateBrowserState();
        }
    };

    window.refreshDevPanel = function() {
        updateBrowserState();
        const btn = document.querySelector('.dev-btn-secondary');
        if (btn) {
            btn.textContent = '🔄 Refreshing...';
            setTimeout(() => btn.textContent = '🔄 Refresh', 500);
        }
    };

    window.exportDevData = async function() {
        try {
            const data = {
                manifest: manifest,
                state: devState,
                timestamp: new Date().toISOString(),
                browserInfo: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    screen: `${screen.width}x${screen.height}`
                }
            };
            
            const jsonString = JSON.stringify(data, null, 2);
            
            const exportBtn = document.querySelector('.dev-btn-primary');
            const originalText = exportBtn.textContent;
            exportBtn.textContent = '📋 Copying...';
            exportBtn.disabled = true;
            
            const success = await copyToClipboard(jsonString);
            
            if (success) {
                showNotification('✅ Data copied to clipboard!', 'success');
                console.log('📋 TGBrowser DevKit Data (copied to clipboard):\n', data);
            } else {
                throw new Error('Copy failed');
            }
            
        } catch (error) {
            console.error('Export failed:', error);
            showNotification('❌ Failed to copy to clipboard!', 'error');
        } finally {
            const exportBtn = document.querySelector('.dev-btn-primary');
            if (exportBtn) {
                setTimeout(() => {
                    exportBtn.textContent = '📋 Export Data';
                    exportBtn.disabled = false;
                }, 1000);
            }
        }
    };

    // 11. Expose DevKit API for other plugins
    window.DevKitAPI = {
        version: manifest.version,
        getState: () => ({...devState}),
        refresh: () => updateBrowserState(),
        showPanel: () => window.toggleDevUI()
    };

    // 12. Initialize
    startPlug();

    // 13. Add animation styles
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes slideInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOutDown {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(animationStyle);

    // 14. Log initialization
    console.log(`%c🧙‍♂️ ${manifest.name} ${manifest.version} initialized`, 
        'color: #64b5f6; font-weight: bold; font-size: 14px');
    console.log(`%cTGUID: ${manifest.tguid}`, 'color: #81c784');
    console.log('%c📊 System monitoring active', 'color: #4caf50');
})();