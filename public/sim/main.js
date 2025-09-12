import { createBus } from './bus.js';
import { loadState, saveState } from './state.js';
import { createWorld } from './world.js';
import { createControls } from './controls.js';
import { createDevices } from './devices.js';
import { bindUI } from './ui.js';

// Three.js globals loaded from CDN in HTML

const canvas = document.getElementById('sim');
const bus = createBus();
const world = createWorld(canvas);
const controls = createControls(world);
const devices = createDevices(world, loadState());

bindUI(bus, devices, controls, world);

// Simple audio tone for speakers and alarm feedback
const listener = new THREE.AudioListener();
world.refs.camera.add(listener);
const audioCtx = listener.context;
const toneGain = audioCtx.createGain(); toneGain.gain.value = 0.0001; toneGain.connect(audioCtx.destination);
const osc = audioCtx.createOscillator(); osc.type='sine'; osc.frequency.value=220; osc.connect(toneGain); osc.start();
function setSpeakers(on){ toneGain.gain.linearRampToValueAtTime(on?0.015:0.0001, audioCtx.currentTime+0.2); }

let robotT = 0;

// Alarm overlay
let alarmActive = false; const overlay = document.createElement('div'); overlay.className = 'alarm'; document.body.appendChild(overlay);

// Loop
let last = performance.now();
const raycaster = new THREE.Raycaster();
const tempVec = new THREE.Vector2(0,0);
function clickCenterToggle(){
  // ray from center of screen
  raycaster.setFromCamera(tempVec, world.refs.camera);
  const targets = [world.refs.tv, world.refs.curtainL, world.refs.curtainR, world.refs.ledBar, world.refs.robot];
  const hit = raycaster.intersectObjects(targets, false)[0];
  if (hit && hit.distance < 5 && hit.object?.userData?.id) {
    const id = hit.object.userData.id; devices.toggle(id);
  }
}
document.addEventListener('mousedown', (e)=>{ if (controls.isLocked?.() && e.button===0) clickCenterToggle(); });
document.addEventListener('keydown', (e)=>{ if (controls.isLocked?.() && (e.key==='e' || e.key==='E')) clickCenterToggle(); });

// Visual hint + reticle when locked
const body = document.body; const hintEl = document.getElementById('hint');
const inspectorEl = document.getElementById('inspector');
function updateHint(){
  const dpr = window.devicePixelRatio || 1; // not used but kept for future scale
  const temp = new THREE.Vector2(0,0); raycaster.setFromCamera(temp, world.refs.camera);
  const targets = [world.refs.tv, world.refs.curtainL, world.refs.curtainR, world.refs.ledBar, world.refs.robot];
  const hit = raycaster.intersectObjects(targets, false)[0];
  if (hit && hit.distance < 5 && hit.object?.userData?.id) {
    const id = hit.object.userData.id; const map = { tv: 'TV', curtains: 'Cortinas', leds: 'LEDs', robot: 'Aspiradora' };
    hintEl.textContent = `E — ${map[id]||id}`; hintEl.classList.remove('hidden');
  } else { hintEl.classList.add('hidden'); }
}

// Toggle body class when pointer is locked
const startBtn = document.getElementById('btn-start');
startBtn.addEventListener('click', ()=> { body.classList.add('locked'); });
document.addEventListener('pointerlockchange', ()=> { if (document.pointerLockElement) body.classList.add('locked'); else body.classList.remove('locked'); });

// Inspector (tecla I)
function scanNodes(){
  const root = world.refs.scene;
  const findAny = (arr)=>{
    let f = null; root.traverse(o=>{ if (f) return; const n=(o.name||'').toLowerCase(); if (arr.some(t=> n.includes(t.toLowerCase()))) f=o; }); return f; };
  const sets = [
    { label: 'TV', anyOf: ['tv','tvscreen','screen'] },
    { label: 'Curtain.L', anyOf: ['curtain.l','curtain_left','curtainleft','cortina.l','cortina_izq'] },
    { label: 'Curtain.R', anyOf: ['curtain.r','curtain_right','curtainright','cortina.r','cortina_der'] },
    { label: 'LEDStrip', anyOf: ['ledstrip','led_bar','ledbar','strip'] },
    { label: 'CeilingLight', anyOf: ['ceilinglight','ceiling_light','techo','light'] },
    { label: 'Vacuum', anyOf: ['robot','vacuum','robotvacuum','roomba','aspiradora'] },
  ];
  const report = sets.map(s=>{ const n=findAny(s.anyOf); return { need:s.label, ok:!!n, match:n?.name||null }; });
  return report;
}

function renderInspector(showIfMissingOnly=false){
  const data = scanNodes();
  const miss = data.filter(x=>!x.ok);
  if (showIfMissingOnly && miss.length===0) { inspectorEl.classList.add('hidden'); return; }
  const log = (world.refs.loadLog||[]).map(l=>`<div><small>${l[0]==='ok'?'✔':'✖'} ${l[1]} ${l[2]?'— '+l[2]:''}</small></div>`).join('');
  const src = world.refs.lastModelLoaded ? `<div><small>Cargado desde: <code>${world.refs.lastModelLoaded}</code></small></div>` : `<div><small>No se detectó modelo cargado.</small></div>`;
  inspectorEl.innerHTML = `<h4>Inspector de Nodos</h4>${src}${log}` +
    data.map(d=>`<div><strong>${d.need}</strong>: <span class="${d.ok?'ok':'miss'}">${d.ok?'OK':'FALTA'}</span> ${d.match?`<em>(${d.match})</em>`:''}</div>`).join('');
  inspectorEl.classList.remove('hidden');
}
document.addEventListener('keydown', (e)=>{ if (e.key==='i' || e.key==='I') { if (inspectorEl.classList.contains('hidden')) renderInspector(false); else inspectorEl.classList.add('hidden'); } });
function loop(now){
  const dt = Math.min(0.05, (now-last)/1000); last = now;
  controls.update(dt);
  if (controls.isLocked?.()) updateHint();

  const s = devices.get();
  if (s.robot) { robotT += dt * 0.5; world.refs.robot.position.set(Math.cos(robotT)*2.2, 0.04, Math.sin(robotT)*1.6); }
  overlay.classList.toggle('on', !!s.alarm);
  setSpeakers(!!s.speakers);

  const r = world.refs.renderer; const c = world.refs.camera; r.setViewport(0,0,window.innerWidth, window.innerHeight); r.setScissorTest(false); r.clear(); r.render(world.refs.scene, c);

  if (s.cams) {
    const dpr = window.devicePixelRatio || 1; const w = 200 * dpr; const h = 120 * dpr; const m = 12;
    r.setViewport(window.innerWidth - (w/dpr) - m, m, w, h); r.setScissor(window.innerWidth - (w/dpr) - m, m, w, h); r.setScissorTest(true); r.render(world.refs.scene, world.refs.cam1);
    r.setViewport(window.innerWidth - (2*w/dpr) - m*2 - 8, m, w, h); r.setScissor(window.innerWidth - (2*w/dpr) - m*2 - 8, m, w, h); r.render(world.refs.scene, world.refs.cam2);
    r.setScissorTest(false);
  }

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Resize
world.resize();
