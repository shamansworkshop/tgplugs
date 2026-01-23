// TGPlug: DragDrop Loader
// TGUID: workshop.shaman.dragdroploader
// Version: 1.0.0
// Description: Adds drag-and-drop .js file loading to TGBrowser's Install TGPlug section

(function() {
    'use strict';
    
    const MOD_ID = 'workshop.shaman.dragdroploader';
    const VERSION = '1.0.0';
    
    // Master initialization function - TGMoLink compliant pattern
    function startPlug() {
        if (window.TGMoLink && window.TGMoLink.register) {
            const registered = window.TGMoLink.register(MOD_ID);
            
            if (registered) {
                console.log(`[${MOD_ID}] ⚡ Registration successful! Version ${VERSION}`);
                initializeDragDropLoader();
                announcePresence();
            } else {
                console.error(`[${MOD_ID}] ❌ Registration failed - invalid TGUID?`);
            }
        } else {
            // TGMoLink not ready yet, wait and try again
            setTimeout(startPlug, 100);
        }
    }
    
    function announcePresence() {
        window.TGMoLink.broadcast('DragDrop Loader activated! 📂✨', MOD_ID);
        console.log(`[${MOD_ID}] 🎯 DragDrop feature enabled in TGPanel`);
    }
    
    function initializeDragDropLoader() {
        // Wait for DOM to be ready
        const checkDOM = setInterval(() => {
            const installSection = findInstallSection();
            
            if (installSection) {
                clearInterval(checkDOM);
                injectDragDropUI(installSection);
                console.log(`[${MOD_ID}] 🎨 DragDrop UI injected successfully`);
            }
        }, 200);
    }
    
    function findInstallSection() {
        // Find the "Install TGPlug" section in the menu
        const menuItems = document.querySelectorAll('.menu-item');
        for (let item of menuItems) {
            const text = item.textContent;
            if (text.includes('Install TGPlug') || text.includes('TGPlug')) {
                return item;
            }
        }
        return null;
    }
    
    function injectDragDropUI(parentSection) {
        // Create the drag-and-drop zone
        const dropZone = document.createElement('div');
        dropZone.id = 'tgDragDropZone';
        dropZone.className = 'tg-dragdrop-zone';
        dropZone.innerHTML = `
            <div class="tg-drop-icon">📂</div>
            <div class="tg-drop-text">Drop .js file here</div>
            <div class="tg-drop-subtext">or click to browse</div>
            <input type="file" id="tgFileInput" accept=".js" style="display: none;">
        `;
        
        // Insert right after the Install TGPlug input section
        parentSection.parentNode.insertBefore(dropZone, parentSection.nextSibling);
        
        // Get elements
        const fileInput = document.getElementById('tgFileInput');
        
        // Click to browse functionality
        dropZone.addEventListener('click', (e) => {
            if (!e.target.matches('input[type="file"]')) {
                fileInput.click();
            }
        });
        
        // File input change handler
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleFile(file, dropZone);
            }
        });
        
        // Drag and drop handlers
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('tg-drag-over');
        });
        
        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('tg-drag-over');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('tg-drag-over');
            
            const file = e.dataTransfer.files[0];
            if (file && file.name.endsWith('.js')) {
                handleFile(file, dropZone);
            } else {
                showError(dropZone, '❌ Only .js files are supported');
            }
        });
    }
    
    function handleFile(file, dropZone) {
        console.log(`[${MOD_ID}] 📥 Processing file: ${file.name}`);
        
        // Show loading state
        dropZone.classList.add('tg-loading');
        const originalHTML = dropZone.innerHTML;
        dropZone.innerHTML = `
            <div class="tg-drop-icon">⏳</div>
            <div class="tg-drop-text">Loading ${file.name}...</div>
        `;
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const code = e.target.result;
            
            // Execute the code
            try {
                // Create a script element to execute
                const script = document.createElement('script');
                script.textContent = code;
                document.body.appendChild(script);
                
                // Show success
                showSuccess(dropZone, `✅ ${file.name} loaded!`);
                
                // Broadcast to other mods
                window.TGMoLink.broadcast(`File loaded: ${file.name}`, MOD_ID);
                
                console.log(`[${MOD_ID}] ✅ File executed successfully`);
                
                // Reset after 3 seconds
                setTimeout(() => {
                    dropZone.classList.remove('tg-loading');
                    dropZone.innerHTML = originalHTML;
                    reattachListeners(dropZone);
                }, 3000);
                
            } catch (error) {
                console.error(`[${MOD_ID}] ❌ Error executing file:`, error);
                showError(dropZone, `❌ Error: ${error.message}`);
                
                // Reset after 3 seconds
                setTimeout(() => {
                    dropZone.classList.remove('tg-loading');
                    dropZone.innerHTML = originalHTML;
                    reattachListeners(dropZone);
                }, 3000);
            }
        };
        
        reader.onerror = () => {
            console.error(`[${MOD_ID}] ❌ Failed to read file`);
            showError(dropZone, '❌ Failed to read file');
            
            setTimeout(() => {
                dropZone.classList.remove('tg-loading');
                dropZone.innerHTML = originalHTML;
                reattachListeners(dropZone);
            }, 3000);
        };
        
        reader.readAsText(file);
    }
    
    function showSuccess(dropZone, message) {
        dropZone.classList.remove('tg-loading');
        dropZone.classList.add('tg-success');
        dropZone.innerHTML = `
            <div class="tg-drop-icon">✅</div>
            <div class="tg-drop-text">${message}</div>
        `;
    }
    
    function showError(dropZone, message) {
        dropZone.classList.remove('tg-loading');
        dropZone.classList.add('tg-error');
        dropZone.innerHTML = `
            <div class="tg-drop-icon">❌</div>
            <div class="tg-drop-text">${message}</div>
        `;
    }
    
    function reattachListeners(dropZone) {
        // Re-initialize the drag-drop zone after reset
        const fileInput = document.getElementById('tgFileInput');
        
        if (!fileInput) {
            // Recreate if missing
            const input = document.createElement('input');
            input.type = 'file';
            input.id = 'tgFileInput';
            input.accept = '.js';
            input.style.display = 'none';
            dropZone.appendChild(input);
        }
        
        // Note: Event listeners are recreated when the parent re-injects,
        // but for safety we could add them here too if needed
    }
    
    // Add visual indicator badge
    function addBadge() {
        const badge = document.createElement('div');
        badge.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(102, 153, 255, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 12px;
            font-size: 11px;
            z-index: 9999;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            animation: slideInBadge 0.5s ease-out;
        `;
        badge.innerHTML = '📂 DragDrop Loader Active';
        document.body.appendChild(badge);
        
        // Remove badge after 4 seconds
        setTimeout(() => {
            badge.style.animation = 'slideOutBadge 0.5s ease-out';
            setTimeout(() => badge.remove(), 500);
        }, 4000);
    }
    
    // Inject badge animations
    function injectAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInBadge {
                from { transform: translateX(200px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutBadge {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(200px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Wait a moment then show badge
    setTimeout(() => {
        injectAnimations();
        addBadge();
    }, 500);
    
    // START THE PLUG!
    startPlug();
})();
