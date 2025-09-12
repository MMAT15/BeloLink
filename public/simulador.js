(() => {
  // Canvas/Renderer
  const canvas = document.getElementById('sim');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  const setSize = () => renderer.setSize(window.innerWidth, window.innerHeight);
  setSize(); window.addEventListener('resize', setSize);

  // Scene & Camera
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0d12);
  scene.fog = new THREE.Fog(0x0b0d12, 8, 45);
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.65, 6);

  // Controls
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  let controls, orbit;
  if (!isMobile && THREE.PointerLockControls) {
    controls = new THREE.PointerLockControls(camera, document.body);
  } else if (THREE.OrbitControls) {
    orbit = new THREE.OrbitControls(camera, renderer.domElement);
    orbit.enablePan = false; orbit.maxPolarAngle = Math.PI / 2 - 0.05;
    orbit.target.set(0, 1.3, 0);
  }

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.35); scene.add(ambient);
  const roomLight = new THREE.PointLight(0xfff2e6, 0.0, 35); roomLight.position.set(0, 2.9, 0); scene.add(roomLight);
  const ledBar = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.02, 0.04), new THREE.MeshStandardMaterial({ color: 0x0a0f18, emissive: 0x000000 }));
  ledBar.position.set(0,2.6,-2); scene.add(ledBar);
  const ledPoint = new THREE.PointLight(0x58caff, 0.0, 6); ledPoint.position.set(0,2.6,-2); scene.add(ledPoint);

  // Room (simple)
  const matWall = new THREE.MeshStandardMaterial({ color: 0x1a2233, roughness: 0.9, metalness: 0.0 });
  const matFloor = new THREE.MeshStandardMaterial({ color: 0x2a2f3a, roughness: 0.95 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), matFloor); floor.rotation.x = -Math.PI / 2; floor.position.y = 0; scene.add(floor);
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshStandardMaterial({ color: 0x141a28 })); ceiling.rotation.x = Math.PI / 2; ceiling.position.y = 3; scene.add(ceiling);
  const wallBack = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), matWall); wallBack.position.set(0, 1.5, -4); scene.add(wallBack);
  const wallFront = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), matWall); wallFront.position.set(0, 1.5, 4); wallFront.rotation.y = Math.PI; scene.add(wallFront);
  const wallLeft = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), matWall); wallLeft.position.set(-4, 1.5, 0); wallLeft.rotation.y = Math.PI / 2; scene.add(wallLeft);
  const wallRight = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), matWall); wallRight.position.set(4, 1.5, 0); wallRight.rotation.y = -Math.PI / 2; scene.add(wallRight);

  // Furniture (rough shapes)
  const couch = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 0.9), new THREE.MeshStandardMaterial({ color: 0x384157, roughness: 0.9 }));
  couch.position.set(-1.2, 0.4, 1.5); scene.add(couch);
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.6), new THREE.MeshStandardMaterial({ color: 0x303846 })); table.position.set(0, 0.4, 0.6); scene.add(table);

  // Devices
  const devices = {
    lights: false,
    leds: false,
    curtains: 1, // 1 abierto, 0 cerrado
    tv: false,
    speakers: false,
    ac: { on: false, temp: 22 },
    heat: false,
    robot: false,
    alarm: false,
    cams: false
  };

  // Curtains
  const curtainGeo = new THREE.PlaneGeometry(2.5, 2.2, 10, 2);
  const curtainMat = new THREE.MeshStandardMaterial({ color: 0x5a6a88, roughness: 0.9, side: THREE.DoubleSide });
  const curtainL = new THREE.Mesh(curtainGeo, curtainMat.clone()); curtainL.position.set(-1.3, 1.6, -3.99); scene.add(curtainL);
  const curtainR = new THREE.Mesh(curtainGeo, curtainMat.clone()); curtainR.position.set(1.3, 1.6, -3.99); scene.add(curtainR);
  // Window frame
  const frame = new THREE.Mesh(new THREE.BoxGeometry(4, 2.2, 0.05), new THREE.MeshStandardMaterial({ color: 0x101827, metalness: 0.1 })); frame.position.set(0,1.6,-3.98); scene.add(frame);

  // TV (video texture)
  const tvMatOff = new THREE.MeshStandardMaterial({ color: 0x050607, roughness: 1 });
  const tv = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.0), tvMatOff); tv.position.set(2.2, 1.4, -2.5); tv.rotation.y = -Math.PI/4; scene.add(tv);
  const video = document.createElement('video'); video.loop = true; video.muted = true; video.crossOrigin = 'anonymous';
  video.src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
  const tvTexture = new THREE.VideoTexture(video); tvTexture.colorSpace = THREE.SRGBColorSpace;
  const tvMatOn = new THREE.MeshBasicMaterial({ map: tvTexture });

  // Speakers (audio)
  const audioListener = new THREE.AudioListener(); camera.add(audioListener);
  const speakerSound = new THREE.Audio(audioListener);
  const osc = audioListener.context.createOscillator(); osc.type = 'sine'; osc.frequency.value = 220; const gain = audioListener.context.createGain(); gain.gain.value = 0.0001; osc.connect(gain).connect(audioListener.context.destination); osc.start();
  const setSpeakers = (on) => { gain.gain.linearRampToValueAtTime(on ? 0.015 : 0.0001, audioListener.context.currentTime + 0.2); };

  // Robot vacuum
  const robot = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.08,24), new THREE.MeshStandardMaterial({ color: 0x2d9c5b })); robot.position.set(0,0.04,0); scene.add(robot);
  let robotT = 0;

  // Cameras PiP
  const cam1 = new THREE.PerspectiveCamera(60, 16/9, 0.1, 50); cam1.position.set(-3.2, 2.2, 2.2); cam1.lookAt(0, 1.2, -2);
  const cam2 = new THREE.PerspectiveCamera(60, 16/9, 0.1, 50); cam2.position.set(3, 2.6, 0); cam2.lookAt(0, 1.4, -2);
  const pipEl1 = document.createElement('div'); pipEl1.className = 'pip'; const pipEl2 = document.createElement('div'); pipEl2.className = 'pip pip2';
  const alarmOverlay = document.createElement('div'); alarmOverlay.className = 'alarm'; document.body.appendChild(alarmOverlay);

  // Movement (WASD)
  const vel = new THREE.Vector3(); const dir = new THREE.Vector3(); const keys = {};
  document.addEventListener('keydown', (e)=>{ keys[e.code] = true; });
  document.addEventListener('keyup', (e)=>{ keys[e.code] = false; });

  const moveUpdate = (dt) => {
    if (!controls || !controls.isLocked) return;
    const speed = 2.3;
    dir.set(0,0,0);
    if (keys['KeyW'] || keys['ArrowUp']) dir.z -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) dir.z += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) dir.x -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) dir.x += 1;
    dir.normalize();
    const forward = new THREE.Vector3(); controls.getDirection(forward);
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0,1,0));
    const move = forward.multiplyScalar(dir.z).add(right.multiplyScalar(dir.x));
    camera.position.addScaledVector(move, speed * dt);
    camera.position.y = 1.65; // bloquear altura
  };

  // Device toggles
  const setLights = (on) => { devices.lights = on; roomLight.intensity = on ? 1.1 : 0.0; };
  const setLeds = (on) => { devices.leds = on; ledPoint.intensity = on ? 1.5 : 0.0; ledBar.material.emissive.setHex(on ? 0x58caff : 0x000000); };
  const setCurtains = (v) => { devices.curtains = v; curtainL.position.x = -1.3 - (1.2 * (1-v)); curtainR.position.x = 1.3 + (1.2 * (1-v)); };
  const setTV = (on) => { devices.tv = on; tv.material = on ? tvMatOn : tvMatOff; if (on) { video.play().catch(()=>{}); } else { try{ video.pause(); }catch(_){ } } };
  const setAC = (on) => { devices.ac.on = on; document.getElementById('thermostat').classList.toggle('hidden', !on); };
  const setHeat = (on) => { devices.heat = on; matFloor.color.set(on ? 0x3d2d20 : 0x2a2f3a); };
  const setRobot = (on) => { devices.robot = on; };
  const setAlarm = (on) => { devices.alarm = on; alarmOverlay.classList.toggle('on', on); if (on) { try{ audioListener.context.resume(); }catch(_){ } gain.gain.setValueAtTime(0.0001, audioListener.context.currentTime); const t = audioListener.context.createOscillator(); const g = audioListener.context.createGain(); t.type='sawtooth'; t.frequency.value = 880; g.gain.value = 0.03; t.connect(g).connect(audioListener.context.destination); t.start(); setTimeout(()=>{ t.stop(); }, 900); } };
  const setCams = (on) => { devices.cams = on; if (on) { document.body.appendChild(pipEl1); document.body.appendChild(pipEl2); } else { pipEl1.remove(); pipEl2.remove(); } };

  // Initial state
  setLights(false); setLeds(false); setCurtains(1); setTV(false); setHeat(false); setAC(false); setRobot(false); setAlarm(false); setCams(false);

  // UI
  const $ = (s) => document.querySelector(s);
  $('#btn-lights').onclick = () => setLights(!devices.lights);
  $('#btn-leds').onclick   = () => setLeds(!devices.leds);
  $('#btn-curtains').onclick = () => setCurtains(devices.curtains > 0.5 ? 0 : 1);
  $('#btn-tv').onclick = () => setTV(!devices.tv);
  $('#btn-speakers').onclick = () => { devices.speakers = !devices.speakers; setSpeakers(devices.speakers); };
  $('#btn-ac').onclick = () => setAC(!devices.ac.on);
  $('#btn-heat').onclick = () => setHeat(!devices.heat);
  $('#btn-robot').onclick = () => setRobot(!devices.robot);
  $('#btn-alarm').onclick = () => setAlarm(!devices.alarm);
  $('#btn-cam').onclick = () => setCams(!devices.cams);
  const tempSlider = document.getElementById('temp'); const tempRead = document.getElementById('temp-read');
  tempSlider.addEventListener('input', (e)=>{ const v = Number(e.target.value)||22; devices.ac.temp = v; tempRead.textContent = v; ambient.intensity = THREE.MathUtils.lerp(0.25, 0.45, (v-18)/10); });

  // Enter/start
  const startBtn = document.getElementById('btn-start');
  startBtn.onclick = () => {
    if (controls && controls.lock) controls.lock();
    try { audioListener.context.resume(); } catch(_){ }
  };

  if (controls) {
    controls.addEventListener('lock', () => startBtn.disabled = true);
    controls.addEventListener('unlock', () => startBtn.disabled = false);
  }

  // Animate
  let last = performance.now();
  function animate(now){
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    moveUpdate(dt);
    // Robot path (simple circle)
    if (devices.robot) { robotT += dt * 0.5; robot.position.set(Math.cos(robotT)*2.2, 0.04, Math.sin(robotT)*1.6); }

    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissorTest(false); renderer.clear();
    renderer.render(scene, camera);

    if (devices.cams) {
      const dpr = window.devicePixelRatio || 1;
      const w = 200 * dpr; const h = 120 * dpr;
      const margin = 12;
      // bottom-right cam1
      renderer.setViewport(window.innerWidth - (w/dpr) - margin, margin, w, h);
      renderer.setScissor(window.innerWidth - (w/dpr) - margin, margin, w, h);
      renderer.setScissorTest(true); renderer.render(scene, cam1);
      // next to it (to the left)
      renderer.setViewport(window.innerWidth - (2*w/dpr) - margin*2 - 8, margin, w, h);
      renderer.setScissor(window.innerWidth - (2*w/dpr) - margin*2 - 8, margin, w, h);
      renderer.render(scene, cam2);
      renderer.setScissorTest(false);
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
