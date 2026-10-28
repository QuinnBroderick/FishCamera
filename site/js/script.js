// === Simple Local Viewer for the Arduino 'CameraWebServer' endpoints ===
    // Expected endpoints on the ESP32‑CAM:
    //   /                     (optional index)
    //   /stream               (multipart/x-mixed-replace;bound=frame)
    //   /capture              (single JPEG)
    //   /status               (JSON)
    //   /control?var=framesize&val=7       (etc.)
    //   /control?var=quality&val=12
    //   /control?var=led_intensity&val=64  (if LED enabled at build)
const $ = (sel) => document.querySelector(sel);
    const UI = {
      start: $('#start'), stop: $('#stop'), stream: $('#stream'),
      res: $('#res'), applyRes: $('#applyRes'),
      quality: $('#quality'), qVal: $('#qualityVal'), applyQuality: $('#applyQuality'),
      flash: $('#flash'), fVal: $('#flashVal'), applyFlash: $('#applyFlash'),
      status: $('#status'), ping: $('#ping'), camStatus: $('#camStatus'),
      gallery: $('#gallery'), thumbTmpl: $('#thumbTmpl')
    };


    //testing code for new const IP
    // sets the IP address
    const CAMERA_HOST = "";

    // --- mock switch (true = test without device) ---
    const MOCK = false; // flip to false when you have the camera

    UI.quality.addEventListener('input', () => UI.qVal.textContent = UI.quality.value);
    UI.flash.addEventListener('input', () => UI.fVal.textContent = UI.flash.value);
    // --- Local placeholder assets for mock mode ---
    const MOCK_SNAPSHOT = "assets/placeholder.jpg";
    const MOCK_STREAM   = "assets/placeholder.jpg";

    function urlWithBuster(base) {
        const sep = base.includes('?') ? '&' : '?';
        return `${base}${sep}t=${Date.now()}`;
        }
    const STREAM_BASE = '/stream';

    function setStatus(text, good=false) {
      UI.status.innerHTML = `Status: <span class="${good ? 'ok':'muted'}">${text}</span>`;
    }
    function ok(text){ setStatus(text, true); }

    async function getJSON(path){
        //testing code
        if (MOCK) {
            const t0 = performance.now(); await new Promise(r => setTimeout(r, 120));
            const t1 = performance.now(); UI.ping.textContent = `Ping: ${Math.round(t1-t0)} ms`;
            if (path === '/status') return { framesize: 8 }; // pretend “online”
            return {};
          }
      const t0 = performance.now();
      const res = await fetch(CAMERA_HOST+path, { cache: 'no-store' });
      const t1 = performance.now();
      UI.ping.textContent = `Ping: ${Math.round(t1-t0)} ms`;
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res.json();
    }

    async function call(path){
            //testing code
         if (MOCK) {
            const t0 = performance.now(); await new Promise(r => setTimeout(r, 120));
            const t1 = performance.now(); UI.ping.textContent = `Ping: ${Math.round(t1-t0)} ms`;
            return { ok: true };
          }
      const t0 = performance.now();
      const res = await fetch(CAMERA_HOST+path, { cache: 'no-store' });
      const t1 = performance.now();
      UI.ping.textContent = `Ping: ${Math.round(t1-t0)} ms`;
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res;
    }

    async function probe(){
      try {
        const s = await getJSON('/status');
        UI.camStatus.textContent = 'Camera: ' + (s.framesize !== undefined ? 'online' : 'unknown');
        ok('Connected');
      } catch(err){
        UI.camStatus.textContent = 'Camera: offline';
        setStatus('Could not reach camera');
      }
    }

    async function setFrameSize(val){
      await call(`/control?var=framesize&val=${val}`);
      ok('Resolution updated');
    }

    async function setQuality(val){
      await call(`/control?var=quality&val=${val}`);
      ok('Quality updated');
    }

    async function setFlash(val){
      await call(`/control?var=led_intensity&val=${val}`);
      ok('Flash set');
    }

    function startStream(){
        //testing code
        if (MOCK) {
            UI.stream.src = MOCK_STREAM;
            ok('Mock stream…');
            return;
          }
      UI.stream.src = urlWithBuster(STREAM_BASE);
      ok('Streaming…');
    }

    function stopStream(){
      UI.stream.src = '';
      setStatus('Stopped');
    }

    // Wire UI
    UI.start.addEventListener('click', () => { try { startStream(); } catch(e){ setStatus(e.message); }});
    UI.stop.addEventListener('click', stopStream);
    UI.applyRes.addEventListener('click', () => setFrameSize(UI.res.value).catch(e => setStatus(e.message)));
    UI.applyQuality.addEventListener('click', () => setQuality(UI.quality.value).catch(e => setStatus(e.message)));
    UI.applyFlash.addEventListener('click', () => setFlash(UI.flash.value).catch(e => setStatus(e.message)));

    // Auto-probe on load if host exists

    probe();

