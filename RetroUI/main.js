// RetroMod Main Script - TGMoLink v3-secure Compliant
// TGUID: com.tgmods.retro

(function() {
    console.log('[RetroMod] Initializing with TGUID: com.tgmods.retro');
    
    // Retro Mod Configuration
    const RetroConfig = {
        themeName: "Retro Minimal v2.0",
        author: "TGMods Team",
        version: "2.0.0",
        tgUid: "workshop.shaman.retroui", // Valid TGUID format
        
        // Retro palette
        colors: {
            background: "#0a0a12",
            surface: "#1a1a2e",
            accent: "#00ffff",
            text: "#a0a0c0",
            textBright: "#e0e0ff",
            border: "#303050"
        },
        
        // Register with TGMoLink (SECURITY: Must happen first!)
        register: function() {
            if (!window.TGMoLink) {
                console.error('[RetroMod] TGMoLink API not available');
                return false;
            }
            
            const success = window.TGMoLink.register(this.tgUid);
            if (success) {
                console.log(`[RetroMod] Successfully registered as ${this.tgUid}`);
                return true;
            } else {
                console.error(`[RetroMod] Failed to register with TGUID: ${this.tgUid}`);
                return false;
            }
        },
        
        // Apply retro styling
        applyTheme: function() {
            console.log('[RetroMod] Applying retro theme...');
            
            // Add retro class to body for CSS targeting
            document.body.classList.add('retro-mod-active');
            
            // Override CSS variables
            document.documentElement.style.setProperty('--bg', this.colors.background);
            document.documentElement.style.setProperty('--toolbar-bg', this.colors.surface);
            document.documentElement.style.setProperty('--text', this.colors.text);
            document.documentElement.style.setProperty('--text-light', this.colors.text);
            document.documentElement.style.setProperty('--primary', this.colors.accent);
            document.documentElement.style.setProperty('--border', this.colors.border);
            document.documentElement.style.setProperty('--menu-bg', this.colors.surface);
            document.documentElement.style.setProperty('--item-hover', 'rgba(0, 255, 255, 0.1)');
            
            // Hide elements for minimal look
            this.minimizeUI();
            
            // Apply retro font
            document.documentElement.style.setProperty('--font-stack', '"Courier New", Consolas, monospace');
            
            // Modify TGHome for retro look
            this.styleTGHome();
            
            console.log('[RetroMod] Theme applied');
        },
        
        // Minimize UI elements
        minimizeUI: function() {
            // Simplify toolbar
            const toolbar = document.querySelector('.toolbar');
            if (toolbar) {
                toolbar.style.padding = '4px 8px';
                toolbar.style.height = '40px';
                toolbar.style.borderBottom = '1px solid var(--border)';
            }
            
            // Simplify buttons
            const buttons = document.querySelectorAll('.toolbar button');
            buttons.forEach(btn => {
                btn.style.width = '32px';
                btn.style.height = '32px';
                btn.style.opacity = '0.8';
                btn.style.transition = 'all 0.2s ease';
            });
            
            // Simplify address bar
            const addressBar = document.getElementById('address');
            if (addressBar) {
                addressBar.style.height = '30px';
                addressBar.style.borderRadius = '15px';
                addressBar.style.fontSize = '12px';
                addressBar.style.letterSpacing = '0.5px';
            }
            
            // Simplify status bar
            const statusBar = document.querySelector('.status-bar');
            if (statusBar) {
                statusBar.style.height = '20px';
                statusBar.style.fontSize = '10px';
            }
        },
        
        // Style TGHome for retro look
        styleTGHome: function() {
            const tgHome = document.getElementById('tgHome');
            if (!tgHome) return;
            
            // Remove gradient, use solid color
            tgHome.style.backgroundImage = 'none';
            tgHome.style.backgroundColor = this.colors.background;
            
            // Style home content
            const homeContent = tgHome.querySelector('.tg-home-content');
            if (homeContent) {
                homeContent.style.background = this.colors.surface;
                homeContent.style.border = `1px solid ${this.colors.accent}`;
                homeContent.style.boxShadow = `0 0 20px ${this.colors.accent}40`;
                homeContent.style.backdropFilter = 'none';
                
                // Style title
                const title = homeContent.querySelector('.tg-home-title');
                if (title) {
                    title.style.color = this.colors.accent;
                    title.style.textShadow = `0 0 10px ${this.colors.accent}`;
                    title.style.fontFamily = '"Courier New", monospace';
                    title.style.letterSpacing = '2px';
                }
                
                // Style subtitle
                const subtitle = homeContent.querySelector('.tg-home-subtitle');
                if (subtitle) {
                    subtitle.style.color = this.colors.textBright;
                    subtitle.style.fontFamily = '"Courier New", monospace';
                    subtitle.style.fontSize = '14px';
                    subtitle.style.letterSpacing = '1px';
                }
            }
        },
        
        // Add retro scanlines effect
        addScanlines: function() {
            const scanlines = document.createElement('div');
            scanlines.id = 'retro-scanlines';
            scanlines.style.position = 'fixed';
            scanlines.style.top = '0';
            scanlines.style.left = '0';
            scanlines.style.width = '100%';
            scanlines.style.height = '100%';
            scanlines.style.pointerEvents = 'none';
            scanlines.style.zIndex = '9999';
            scanlines.style.background = 'linear-gradient(0deg, transparent 50%, rgba(0, 255, 255, 0.03) 50%)';
            scanlines.style.backgroundSize = '100% 4px';
            scanlines.style.opacity = '0.3';
            document.body.appendChild(scanlines);
        },
        
        // Add retro terminal-style cursor to address bar
        addTerminalCursor: function() {
            const addressBar = document.getElementById('address');
            if (addressBar) {
                addressBar.style.caretColor = this.colors.accent;
                
                // Add blinking cursor effect on focus
                addressBar.addEventListener('focus', () => {
                    addressBar.style.boxShadow = `0 0 0 1px ${this.colors.accent}`;
                });
                
                addressBar.addEventListener('blur', () => {
                    addressBar.style.boxShadow = 'none';
                });
            }
        },
        
        // Broadcast initialization
        broadcastInit: function() {
            if (window.TGMoLink) {
                window.TGMoLink.broadcast('Retro Minimal UI Activated', this.tgUid);
            }
        },
        
        // Initialize mod - IMPORTANT: Must register first!
        init: function() {
            console.log(`[RetroMod] ${this.themeName} by ${this.author}`);
            console.log(`[RetroMod] TGUID: ${this.tgUid}`);
            
            // Step 1: Register with TGMoLink (SECURITY REQUIREMENT)
            const registered = this.register();
            
            if (registered) {
                // Step 2: Apply theme only if registered successfully
                this.applyTheme();
                
                // Step 3: Add visual effects
                this.addScanlines();
                this.addTerminalCursor();
                
                // Step 4: Broadcast success
                this.broadcastInit();
                
                console.log('[RetroMod] Initialization complete and verified');
                return true;
            } else {
                console.error('[RetroMod] Failed to register with TGMoLink - theme not applied');
                // Optionally show user feedback
                const statusBar = document.getElementById('status');
                if (statusBar) {
                    statusBar.textContent = "RetroMod: Invalid TGUID format";
                    statusBar.classList.add('status-error');
                }
                return false;
            }
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => RetroConfig.init());
    } else {
        RetroConfig.init();
    }
    
})();