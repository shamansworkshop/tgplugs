/*
  TGBrowser Inline GIF Panel Mod (v2.1 - FIXED)
  Now with PROPER REGISTRATION! 🔥
*/

(function () {
  // 🔐 CRITICAL: Register this mod with TGBrowser's security system
  // TGUID Format: Must have at least one dot (e.g., com.shaman.gifloader)
  const MOD_ID = "workshop.shaman.gifloader";
  
  if (window.TGMoLink && window.TGMoLink.register) {
    const registered = window.TGMoLink.register(MOD_ID);
    if (!registered) {
      console.error(`[GIF Loader] Failed to register with TGUID: ${MOD_ID}`);
      return; // Stop execution if registration fails
    }
  } else {
    console.error("[GIF Loader] TGMoLink API not available!");
    return;
  }

  // Default fallback if storage is empty
  const DEFAULT_GIF = "https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyczBkYmh4aXlhazY2eWJ6OGlvd3hmejVuOWNlYWc1MWlhcDlxaHNheSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dgQqSYyXD6XwGrTzl7/giphy.gif";
  
  // Load from memory or use default
  let currentGifUrl = localStorage.getItem("tg_mod_gif_url") || DEFAULT_GIF;

  function injectGifPanel() {
    const menuContent = document.getElementById("menuContent");
    if (!menuContent) return;

    // prevent duplicate spam
    if (document.querySelector(".tg-gif-section")) return;

    const section = document.createElement("div");
    section.className = "menu-section tg-gif-section";

    section.innerHTML = `
      <div class="menu-label">GIF LOADER MOD</div>
      <div class="tg-gif-wrapper">
        <div class="tg-gif-input-wrapper">
            <input type="text" id="tgGifInput" class="tg-gif-input" placeholder="Paste Giphy Link & Enter..." value="${currentGifUrl}">
        </div>
        <img class="tg-gif-img" src="${currentGifUrl}" alt="GIF Mod">
      </div>
      <div class="tg-gif-controls">
        <button id="tgGifOpen">OPEN</button>
        <button id="tgGifReset">RESET</button>
      </div>
    `;

    // Inject at the top of the menu for visibility, or append? Let's append.
    menuContent.appendChild(section);

    // --- DOM Elements ---
    const img = section.querySelector(".tg-gif-img");
    const input = document.getElementById("tgGifInput");
    const btnOpen = document.getElementById("tgGifOpen");
    const btnReset = document.getElementById("tgGifReset");

    // --- Actions ---

    // 1. Update GIF on Enter key
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const newUrl = input.value.trim();
        if (newUrl) {
            updateGif(newUrl);
        }
      }
    });

    // 2. Click image to open
    img.onclick = () => window.open(currentGifUrl, "_blank");

    // 3. Open Button
    btnOpen.onclick = () => window.open(currentGifUrl, "_blank");

    // 4. Reset Button (instead of copy, since we have the input now)
    btnReset.onclick = () => {
        updateGif(DEFAULT_GIF);
        input.value = DEFAULT_GIF;
        alert("GIF reset to default chaos! 🌀");
    };

    // Helper to update state and storage
    function updateGif(url) {
        currentGifUrl = url;
        img.src = url;
        localStorage.setItem("tg_mod_gif_url", url); // Save for next time!
    }

    // Console backdoor
    window.tg_set_gif = (url) => {
      updateGif(url);
      input.value = url;
    };
    
    // Broadcast that we're loaded (optional, but cool!)
    if (window.TGMoLink && window.TGMoLink.broadcast) {
      window.TGMoLink.broadcast("GIF Loader is ALIVE! 🎆", MOD_ID);
    }
  }

  // Loader Logic
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectGifPanel);
  } else {
    injectGifPanel();
    setTimeout(injectGifPanel, 500); // Safety check
  }
})();