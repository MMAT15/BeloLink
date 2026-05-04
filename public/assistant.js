// BeloLink Assistant (floating helper) for all pages except corporate clients
// Injects UI and provides quick smart-home style actions (demo/UX)

(function() {
  const EXCLUDE = /(^|\/)(empresas|simulador)\.html$/i;
  if (EXCLUDE.test(location.pathname)) return; // do not inject in corporate clients page

  const ready = (fn) => (document.readyState !== 'loading') ? fn() : document.addEventListener('DOMContentLoaded', fn);

  ready(() => {
    if (document.getElementById('assistant-button') || document.getElementById('assistant-panel')) return;

    // Create button
    const btn = document.createElement('div');
    btn.id = 'assistant-button';
    btn.title = 'Asistente BeloLink';
    btn.setAttribute('aria-label', 'Abrir asistente');
    btn.setAttribute('role', 'button');
    btn.tabIndex = 0;
    btn.textContent = '🤖';
    document.body.appendChild(btn);

    // Hint sutil una sola vez por sesión
    if (!sessionStorage.getItem('bl_asst_hint')) {
      btn.classList.add('attention');
      setTimeout(()=> btn.classList.remove('attention'), 4000);
      sessionStorage.setItem('bl_asst_hint','1');
    }

    // Scrim for outside click
    const scrim = document.createElement('div');
    scrim.id = 'assistant-scrim';
    document.body.appendChild(scrim);

    // Create panel
    const panel = document.createElement('div');
    panel.id = 'assistant-panel';
    panel.innerHTML = `
      <div class="assistant-header" id="assistant-drag">
        <div class="assistant-id">
          <div class="assistant-avatar">🛠️</div>
          <div class="assistant-titles">
            <p id="assistant-greeting">Hola</p>
            <span>Asistente BeloLink</span>
          </div>
        </div>
        <div class="assistant-controls">
          <button id="assistant-voice" aria-label="Comandos de voz" title="Comandos de voz">🎤</button>
          <button class="assistant-close" id="assistant-close" aria-label="Cerrar">×</button>
        </div>
      </div>
      <div class="assistant-search">
        <span class="icon">🔎</span>
        <input id="assistant-search-input" type="text" placeholder="Acción rápida (ej: Instagram)">
      </div>
      <div class="assistant-sections">
        <!-- Utilidades primero: fila 1 Soporte/Instagram, fila 2 Arriba/Tema, fila 3 Navegar/Recordatorio -->
        <div class="assistant-section">
          <h4>Utilidades</h4>
          <div class="assistant-buttons">
            <button class="assistant-btn" id="bl-support"><span class="icon">📧</span><div><strong>Soporte</strong><br><span>Contactar por email</span></div></button>
            <button class="assistant-btn" id="bl-instagram"><span class="icon">📨</span><div><strong>Instagram</strong><br><span>Enviar DM</span></div></button>
            <button class="assistant-btn" id="bl-top"><span class="icon">⬆️</span><div><strong>Arriba</strong><br><span>Volver al inicio</span></div></button>
                        <button class="assistant-btn" id="bl-nav"><span class="icon">🧭</span><div><strong>Navegar</strong><br><span>Ir a una página</span></div></button>
            <button class="assistant-btn" id="bl-reminder"><span class="icon">⏰</span><div><strong>Recordatorio</strong><br><span>En 30s (demo)</span></div></button>
          </div>
        </div>

        <!-- Acciones rápidas después -->
        <div class="assistant-section">
          <h4>Acciones rápidas</h4>
          <div class="assistant-buttons">
            <button class="assistant-btn" id="bl-light"><span class="icon">💡</span><div><strong>Luces</strong><br><span>Encender/Apagar</span></div></button>
            <button class="assistant-btn" id="bl-security"><span class="icon">🔒</span><div><strong>Seguridad</strong><br><span>Activar/Desactivar</span></div></button>
            <div class="assistant-btn" id="bl-temp" style="display:flex;flex-direction:column;align-items:flex-start;gap:8px;">
              <div style="display:flex;align-items:center;gap:8px;"><span class="icon">🌡️</span><strong>Temperatura</strong></div>
              <div class="assistant-slider"><input id="bl-temp-range" type="range" min="18" max="26" value="22"><span class="value" id="bl-temp-value">22°C</span></div>
            </div>
            <button class="assistant-btn" id="bl-locks"><span class="icon">🔐</span><div><strong>Puertas</strong><br><span>Bloquear/Desbloquear</span></div></button>
            <button class="assistant-btn" id="bl-energy"><span class="icon">⚡</span><div><strong>Ahorro</strong><br><span>Reducir consumo</span></div></button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Greeting
    const greet = () => {
      const h = new Date().getHours();
      const period = h < 6 ? 'Buenas noches' : h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
      const el = document.getElementById('assistant-greeting');
      if (el) el.textContent = `${period}`;
    };
    greet();

    // Open/Close Logic
    const open = () => { panel.classList.add('active'); scrim.classList.add('active'); btn.setAttribute('aria-expanded','true'); setTimeout(ensureInView, 0); };
    const close = () => { panel.classList.remove('active'); scrim.classList.remove('active'); btn.setAttribute('aria-expanded','false'); };
    const toggle = () => { (panel.classList.contains('active') ? close : open)(); };
    btn.addEventListener('click', toggle);
    document.getElementById('assistant-close')?.addEventListener('click', close);
    scrim.addEventListener('click', close);
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }});
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    const ensureInView = () => {
      const rect = panel.getBoundingClientRect();
      let changed = false;
      if (rect.right > window.innerWidth - 10) { panel.style.left = (window.innerWidth - rect.width - 10) + 'px'; changed = true; }
      if (rect.bottom > window.innerHeight - 10) { panel.style.top = (window.innerHeight - rect.height - 10) + 'px'; changed = true; }
      if (rect.left < 10) { panel.style.left = '10px'; changed = true; }
      if (rect.top < 10) { panel.style.top = '10px'; changed = true; }
      if (changed) { panel.style.bottom = 'auto'; panel.style.right = 'auto'; }
    };
    window.addEventListener('resize', ensureInView);

    // Drag support (header)
    const dragArea = document.getElementById('assistant-drag');
    let dragging = false, offX = 0, offY = 0;
    const onMove = (e) => {
      if (!dragging) return;
      const x = (e.touches?.[0]?.clientX ?? e.clientX) - offX;
      const y = (e.touches?.[0]?.clientY ?? e.clientY) - offY;
      panel.style.left = Math.min(Math.max(10, x), window.innerWidth - panel.offsetWidth - 10) + 'px';
      panel.style.top = Math.min(Math.max(10, y), window.innerHeight - panel.offsetHeight - 10) + 'px';
      panel.style.bottom = 'auto'; panel.style.right = 'auto';
      e.preventDefault();
    };
    const startDrag = (e) => {
      if (e.target && (e.target.closest('button') || e.target.closest('input'))) return;
      const rect = panel.getBoundingClientRect();
      const px = e.touches?.[0]?.clientX ?? e.clientX;
      const py = e.touches?.[0]?.clientY ?? e.clientY;
      offX = px - rect.left; offY = py - rect.top; dragging = true;
      document.addEventListener('mousemove', onMove); document.addEventListener('touchmove', onMove, {passive:false});
      e.preventDefault();
    };
    const endDrag = () => { dragging = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('touchmove', onMove); };
    dragArea.addEventListener('mousedown', startDrag); dragArea.addEventListener('touchstart', startDrag, {passive:false});
    document.addEventListener('mouseup', endDrag); document.addEventListener('touchend', endDrag);

    // Voice Commands (Web Speech API)
    const voiceBtn = document.getElementById('assistant-voice');
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null, recognizing = false;
    if (SR && voiceBtn) {
      recognition = new SR();
      try { recognition.lang = (navigator.language && navigator.language.startsWith('es')) ? navigator.language : 'es-ES'; } catch {}
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        recognizing = true;
        voiceBtn?.classList.add('listening');
        voiceBtn?.setAttribute('aria-pressed','true');
      };
      recognition.onend = () => {
        recognizing = false;
        voiceBtn?.classList.remove('listening');
        voiceBtn?.setAttribute('aria-pressed','false');
      };
      recognition.onerror = (ev) => {
        const t = ev.error;
        if (t === 'not-allowed') toast('Permiso denegado para micrófono');
        else if (t === 'no-speech') toast('No se detectó voz');
        else if (t === 'network') toast('Error de red de voz');
        else toast('Error de voz');
      };
      recognition.onresult = (ev) => {
        try {
          const res = ev.results[0][0];
          let transcript = (res.transcript || '').toLowerCase();
          if (!transcript) return;
          toast('🎤 ' + transcript);
          if (!runFuzzy(transcript)) toast('No entiendo ese comando');
        } catch (_) {}
      };
    } else {
      voiceBtn?.setAttribute('disabled','disabled');
      voiceBtn?.setAttribute('title','Voz no soportada en este navegador');
    }

    const toggleVoice = () => {
      if (!recognition) return toast('Voz no soportada');
      try {
        if (recognizing) { recognition.stop(); }
        else { recognition.start(); }
      } catch (e) { /* ignore */ }
    };
    voiceBtn?.addEventListener('click', (e) => { e.stopPropagation(); toggleVoice(); });

    // Toast helper (re-use existing if present)
    const toast = (msg='') => {
      if (!msg) return;
      let t = document.getElementById('toast');
      if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role','status'); t.setAttribute('aria-live','polite'); document.body.appendChild(t); }
      t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2200);
    };

    // Overlay helpers
    const addOverlay = (id, bg, text) => {
      const oid = 'ov-' + id;
      if (document.getElementById(oid)) return;
      const ov = document.createElement('div'); ov.id = oid; ov.className = 'bl-overlay'; ov.style.background = bg;
      const label = document.createElement('div'); label.className = 'label'; label.textContent = text; ov.appendChild(label);
      document.body.appendChild(ov); setTimeout(() => ov.classList.add('active'), 30);
    };
    const removeOverlay = (id) => { const ov = document.getElementById('ov-' + id); if (ov) { ov.classList.remove('active'); setTimeout(() => ov.remove(), 220); } };

    // Cameras removed para evitar elementos superpuestos innecesarios

    // States
    // Restore state
    let lights = sessionStorage.getItem('bl_lights') === '1';
    let security = sessionStorage.getItem('bl_security') === '1';
    let locks = sessionStorage.getItem('bl_locks') === '1';
    let temp = Number(sessionStorage.getItem('bl_temp')) || 22;
    let energy = sessionStorage.getItem('bl_energy') === '1';

    // Apply state on load
    if (lights) document.body.classList.add('lights-on');
    // efectos invasivos (overlays/cámaras) solo al activar manualmente
    if (energy) document.body.classList.add('energy-saver');
    const tempRangeEl = document.getElementById('bl-temp-range');
    const tempValEl = document.getElementById('bl-temp-value');
    if (tempRangeEl && tempValEl) { tempRangeEl.value = temp; tempValEl.textContent = `${temp}°C`; }

    // Actions
    const toggleLights = () => { lights = !lights; toast(lights ? 'Luces encendidas' : 'Luces apagadas'); document.body.classList.toggle('lights-on', lights); sessionStorage.setItem('bl_lights', lights ? '1' : '0'); };
    const toggleSecurity = () => {
      security = !security; toast(security ? 'Seguridad activada' : 'Seguridad desactivada');
      if (security) { addOverlay('bl-security', 'rgba(231,76,60,0.35)', 'Seguridad Activada'); }
      else { removeOverlay('bl-security'); }
      sessionStorage.setItem('bl_security', security ? '1' : '0');
    };
    const setTemp = (v) => { temp = Number(v)||22; const tv = document.getElementById('bl-temp-value'); if (tv) tv.textContent = `${temp}°C`; addOverlay('bl-temp', 'rgba(243,156,18,0.25)', `Temp: ${temp}°C`); setTimeout(() => removeOverlay('bl-temp'), 1000); sessionStorage.setItem('bl_temp', String(temp)); };
    const toggleLocks = () => { locks = !locks; toast(locks ? 'Puertas bloqueadas' : 'Puertas desbloqueadas'); if (locks) addOverlay('bl-lock', 'rgba(46,204,113,0.25)','Puertas Bloqueadas'); else removeOverlay('bl-lock'); sessionStorage.setItem('bl_locks', locks ? '1' : '0'); };

    // Se eliminan escenas
    const toggleEnergy = () => { energy = !energy; document.body.classList.toggle('energy-saver', energy); toast(energy ? 'Ahorro activado' : 'Ahorro desactivado'); sessionStorage.setItem('bl_energy', energy ? '1' : '0'); };

    const quickNav = () => {
      const opts = [
        ['Inicio','index.html'], ['Nuestras Soluciones','productos.html'], ['Casos de Éxito','casos.html'], ['Más Información','info.html'], ['Política de Privacidad','privacidad.html']
      ];
      const current = location.pathname.split('/').pop() || 'index.html';
      const next = prompt('Ir a (Inicio, Nuestras Soluciones, Casos de Éxito, Más Información, Política de Privacidad):');
      if (!next) return;
      const m = opts.find(o => o[0].toLowerCase() === next.trim().toLowerCase());
      if (m) {
        const url = m[1]; if (url === current) window.scrollTo({top:0, behavior:'smooth'}); else location.href = url;
      } else toast('Opción no reconocida');
    };
    const goTop = () => window.scrollTo({top:0, behavior:'smooth'});
    const support = () => { const email = 'Belolink@proton.me'; navigator.clipboard?.writeText(email).then(()=>toast('Email copiado: ' + email)); location.href = 'mailto:' + email; };
    const reminder = () => { toast('Recordatorio en 30 segundos'); setTimeout(()=> toast('⏰ Recordatorio BeloLink'), 30000); };

    // Bind
    document.getElementById('bl-light')?.addEventListener('click', toggleLights);
    document.getElementById('bl-security')?.addEventListener('click', toggleSecurity);
    document.getElementById('bl-temp-range')?.addEventListener('input', (e)=> setTemp(e.target.value));
    document.getElementById('bl-locks')?.addEventListener('click', toggleLocks);

    document.getElementById('bl-energy')?.addEventListener('click', toggleEnergy);

    document.getElementById('bl-nav')?.addEventListener('click', quickNav);
    document.getElementById('bl-top')?.addEventListener('click', goTop);
    document.getElementById('bl-support')?.addEventListener('click', support);
    document.getElementById('bl-reminder')?.addEventListener('click', reminder);
    const instagramDM = () => { try { window.open('https://ig.me/m/belolinkdomotica', '_blank'); } catch(_){} toast('Abriendo Instagram…'); };
    document.getElementById('bl-instagram')?.addEventListener('click', instagramDM);

    // Search quick action
    const commands = [
      ['luces', toggleLights], ['light', toggleLights], ['luz', toggleLights],
      ['seguridad', toggleSecurity], ['security', toggleSecurity],
      ['temperatura', () => setTemp(temp)], ['clima', () => setTemp(temp)], ['temp', () => setTemp(temp)],
      ['puertas', toggleLocks], ['cerradura', toggleLocks], ['puerta', toggleLocks],
      ['ahorro', toggleEnergy], ['arriba', goTop], ['soporte', support], ['contacto', support],
      ['navegar', quickNav], ['nav', quickNav], ['recordatorio', reminder],
      ['instagram', instagramDM], ['ig', instagramDM], ['dm', instagramDM], ['mensaje', instagramDM], ['directo', instagramDM]
    ];
    const levenshtein = (a,b) => {
      a = a.toLowerCase(); b = b.toLowerCase();
      const m = Array.from({length: a.length+1}, (_,i)=>[i, ...Array(b.length).fill(0)]);
      for (let j=1;j<=b.length;j++) m[0][j] = j;
      for (let i=1;i<=a.length;i++) {
        for (let j=1;j<=b.length;j++) {
          const cost = a[i-1] === b[j-1] ? 0 : 1;
          m[i][j] = Math.min(m[i-1][j] + 1, m[i][j-1] + 1, m[i-1][j-1] + cost);
        }
      }
      return m[a.length][b.length];
    };
    const runFuzzy = (text) => {
      const v = text.trim().toLowerCase(); if (!v) return false;
      const words = v.split(/\s+/);
      for (const [key, fn] of commands) {
        if (v.includes(key)) { fn(); return true; }
        for (const w of words) {
          if (w.length < 3) continue;
          const d = levenshtein(w, key);
          if (d <= 2) { fn(); return true; }
        }
      }
      return false;
    };
    document.getElementById('assistant-search-input')?.addEventListener('keydown', (e)=>{
      if (e.key !== 'Enter') return; if (!runFuzzy(e.target.value)) toast('No encontrado');
    });
  });
})();
