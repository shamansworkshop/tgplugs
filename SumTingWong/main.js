/*
  tg_brick_and_shrine.js
  - Wipes the in-memory TGBrowser DOM and replaces with an ERROR screen + GIF.
  - Set GIF_URL and ERROR_TEXT below.
  - If PERSIST = true, this will re-run on every load until you click RECOVER.
  - To revoke persistence manually: localStorage.removeItem('tg_brick_persist');
*/

(function(){
  const GIF_URL = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHZla3R6NWNuNGwybmRzYzI2cGVxbm1kdzVpdWt1ZnBkcGd3dG8wbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8eMvsPgJQL5YiatjFW/giphy.gif"; // <-- replace with your gif link
  const ERROR_TEXT = "FATAL: TGBrowser farted."; // change as desired
  const PERSIST = true; // set true to survive reloads (until recovered)
  const STORAGE_KEY = "tg_brick_persist";

  // If persistence flag set and we didn't yet run this session, run
  try {
    if (localStorage.getItem(STORAGE_KEY) === "1" && !window.__tg_bricked_once) {
      window.__tg_bricked_once = true;
      setTimeout(() => runObliterate(), 60); // small delay so loader can be interrupted
      return;
    }
  } catch(e){ /* ignore localStorage errors */ }

  // If PERSIST chosen, mark localStorage
  if (PERSIST) {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch(e){}
  }

  // Main function: nuke DOM and write error + gif
  function runObliterate(){
    console.warn("🔴 TGBrowser -> BRICK MODE ENGAGED");

    // 1) stop network & timers (best-effort)
    try { window.stop?.(); } catch(e){}
    try {
      const max = setTimeout(() => {}, 0);
      for (let i = 0; i <= max; i++){ clearTimeout(i); clearInterval(i); }
    } catch(e){}

    // 2) remove all external resources from DOM
    try {
      document.querySelectorAll("script, link[rel=stylesheet], style, iframe").forEach(n => n.remove());
    } catch(e){}

    // 3) clear misc storages (non-destructive, optional)
    try { sessionStorage.clear(); } catch(e){}
    // localStorage intentionally NOT cleared (holds persistence flag), unless recover used

    // 4) blow away page content and render our shrine/error
    try {
      // Rewrite minimal safe HTML
      const html = `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width,initial-scale=1"/>
            <title>BRICKED - TGBrowser</title>
            <style>
              :root{--bg:#0f0f12;--card:#111216;--accent:#ff4d6d;--muted:#9aa0a6}
              html,body{height:100%;margin:0;padding:0;background:linear-gradient(180deg,#07070a, #0f0f12);font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#e8e8e8}
              .wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:28px;box-sizing:border-box}
              .card{background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));padding:20px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.7);max-width:820px;width:100%;text-align:center}
              h1{margin:0;font-size:20px;letter-spacing:0.6px;color:var(--accent)}
              p{margin:8px 0 0;color:var(--muted)}
              .gif{display:block;margin:18px auto 0;max-width:420px;max-height:420px;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,0.6);object-fit:contain}
              .controls{display:flex;gap:10px;justify-content:center;margin-top:14px}
              .btn{background:transparent;border:1px solid rgba(255,255,255,0.08);padding:8px 12px;border-radius:10px;color:inherit;cursor:pointer}
              .btn:hover{transform:translateY(-1px);opacity:0.95}
              .danger{border-color:rgba(255,77,109,0.25);color:var(--accent)}
              .mutedline{font-size:12px;color:var(--muted);margin-top:6px}
              .errorline{font-family:monospace;background:rgba(0,0,0,0.25);padding:10px;border-radius:8px;margin-top:12px;overflow:auto;text-align:left;white-space:pre-wrap}
            </style>
          </head>
          <body>
            <div class="wrap">
              <div class="card" role="main" aria-live="polite">
                <h1>⚠️ ${escapeHtml(ERROR_TEXT)}</h1>
                <div class="mutedline">This page was intentionally replaced by a mod. Reload to attempt normal load (may reapply if persistence is on).</div>
                <img class="gif" src="${escapeAttr(GIF_URL)}" alt="shrined gif" />
                <div class="errorline" id="errline">ERROR LOG: [0xDEADBEEF] shrine breach detected. System integrity compromised.</div>
                <div class="controls">
                  <button class="btn danger" id="recoverBtn">RECOVER (clear persist & reload)</button>
                  <button class="btn" id="openGif">OPEN GIF</button>
                  <button class="btn" id="copyLink">COPY GIF URL</button>
                </div>
              </div>
            </div>
            <script>
              document.getElementById('recoverBtn').addEventListener('click', function(){
                try { localStorage.removeItem('${STORAGE_KEY}'); } catch(e){}
                location.reload();
              });
              document.getElementById('openGif').addEventListener('click', function(){ window.open('${escapeAttr(GIF_URL)}','_blank'); });
              document.getElementById('copyLink').addEventListener('click', async function(){
                try { await navigator.clipboard.writeText('${escapeAttr(GIF_URL)}'); alert('GIF URL copied'); }
                catch(e){ alert('Clipboard denied'); }
              });
              // optionally append more fake log lines
              (function fakeLog(){
                const el = document.getElementById('errline');
                let i=0;
                const id = setInterval(()=>{
                  i++;
                  el.textContent += "\\n[TRACE] shrine-hook." + i + " => overflow";
                  if(i>6) clearInterval(id);
                }, 700);
              })();
            </script>
          </body>
        </html>
      `;
      document.open();
      document.write(html);
      document.close();
    } catch(e){
      // fallback simpler wipe if the big rewrite fails
      try {
        document.documentElement.innerHTML = "<body><pre style='color:#fff;background:#000;padding:20px;'>BRICKED</pre></body>";
      } catch(e){}
    }
  } // runObliterate end

  // basic helpers to avoid injection issues
  function escapeHtml(s){ if(!s) return ""; return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); }); }
  function escapeAttr(s){ return escapeHtml(s).replace(/"/g, '&quot;'); }

  // immediate run
  runObliterate();

})();