import { createBus } from './bus.js';

export function createWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0d12);
  scene.fog = new THREE.Fog(0x0b0d12, 8, 45);
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.65, 6);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.6); scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0xbfd8ff, 0x2a2a2a, 0.35); scene.add(hemi);
  const roomLight = new THREE.PointLight(0xfff2e6, 0.0, 60, 2); roomLight.position.set(0, 2.9, 0); scene.add(roomLight);
  const ledBar = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.02, 0.04), new THREE.MeshStandardMaterial({ color: 0x0a0f18, emissive: 0x000000 })); ledBar.position.set(0,2.6,-2); ledBar.userData.id = 'leds'; scene.add(ledBar);
  const ledPoint = new THREE.PointLight(0x58caff, 0.0, 6); ledPoint.position.set(0,2.6,-2); scene.add(ledPoint);

  // Room
  const matWall = new THREE.MeshStandardMaterial({ color: 0x1a2233, roughness: 0.9, metalness: 0.0 });
  const matFloor = new THREE.MeshStandardMaterial({ color: 0x2a2f3a, roughness: 0.95 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), matFloor); floor.rotation.x = -Math.PI / 2; floor.position.y = 0; scene.add(floor);
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshStandardMaterial({ color: 0x141a28 })); ceiling.rotation.x = Math.PI / 2; ceiling.position.y = 3; scene.add(ceiling);
  const wallBack = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), matWall); wallBack.position.set(0, 1.5, -4); scene.add(wallBack);
  const wallFront = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), matWall); wallFront.position.set(0, 1.5, 4); wallFront.rotation.y = Math.PI; scene.add(wallFront);
  const wallLeft = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), matWall); wallLeft.position.set(-4, 1.5, 0); wallLeft.rotation.y = Math.PI / 2; scene.add(wallLeft);
  const wallRight = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), matWall); wallRight.position.set(4, 1.5, 0); wallRight.rotation.y = -Math.PI / 2; scene.add(wallRight);

  // Furniture sample
  const couch = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 0.9), new THREE.MeshStandardMaterial({ color: 0x384157, roughness: 0.9 })); couch.position.set(-1.2, 0.4, 1.5); scene.add(couch);
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.6), new THREE.MeshStandardMaterial({ color: 0x303846 })); table.position.set(0, 0.4, 0.6); scene.add(table);

  // Curtains window
  const curtainGeo = new THREE.PlaneGeometry(2.5, 2.2, 10, 2);
  const curtainMat = new THREE.MeshStandardMaterial({ color: 0x5a6a88, roughness: 0.9, side: THREE.DoubleSide });
  const curtainL = new THREE.Mesh(curtainGeo, curtainMat.clone()); curtainL.position.set(-1.3, 1.6, -3.99); curtainL.userData.id = 'curtains'; scene.add(curtainL);
  const curtainR = new THREE.Mesh(curtainGeo, curtainMat.clone()); curtainR.position.set(1.3, 1.6, -3.99); curtainR.userData.id = 'curtains'; scene.add(curtainR);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(4, 2.2, 0.05), new THREE.MeshStandardMaterial({ color: 0x101827, metalness: 0.1 })); frame.position.set(0,1.6,-3.98); scene.add(frame);

  // TV
  const tvMatOff = new THREE.MeshStandardMaterial({ color: 0x050607, roughness: 1 });
  const tv = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.0), tvMatOff); tv.position.set(2.2, 1.4, -2.5); tv.rotation.y = -Math.PI/4; tv.userData.id = 'tv'; scene.add(tv);
  const video = document.createElement('video'); video.loop = true; video.muted = true; video.crossOrigin = 'anonymous'; video.src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
  const tvTexture = new THREE.VideoTexture(video); tvTexture.colorSpace = THREE.SRGBColorSpace;
  const tvMatOn = new THREE.MeshBasicMaterial({ map: tvTexture });

  // Robot
  const robot = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.08,24), new THREE.MeshStandardMaterial({ color: 0x2d9c5b })); robot.position.set(0,0.04,0); robot.userData.id = 'robot'; scene.add(robot);

  // Cams
  const cam1 = new THREE.PerspectiveCamera(60, 16/9, 0.1, 50); cam1.position.set(-3.2, 2.2, 2.2); cam1.lookAt(0, 1.2, -2);
  const cam2 = new THREE.PerspectiveCamera(60, 16/9, 0.1, 50); cam2.position.set(3, 2.6, 0); cam2.lookAt(0, 1.4, -2);

  const refs = { renderer, scene, camera, ambient, roomLight, ledBar, ledPoint, floor, ceiling, wallBack, wallFront, wallLeft, wallRight, couch, table, curtainL, curtainR, tv, tvMatOn, tvMatOff, video, robot, cam1, cam2, lastModelLoaded: null };

  // Intentar cargar un modelo GLB de ambiente (opcional)
  const ROOT_MODEL_URL = 'living.glb'; // soporte si lo dejas en public/
  const PUBLIC_MODEL_URL = 'public/living.glb'; // algunos servidores sirven con prefijo /public
  const LOCAL_MODEL_URL = 'assets/models/living.glb';
  const FALLBACK_MODEL_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SimpleRoom/glTF-Binary/SimpleRoom.glb';
  const LOCAL_HDR_URL = 'assets/hdrs/env.hdr';

  function bindNodes(root){
    const find = (names) => {
      let found = null; root.traverse((o)=>{ if (found) return; if (!o.name) return; const n = o.name.toLowerCase(); if (names.some(x=> n.includes(x))) found = o; }); return found;
    };
    const setRef = (name, mesh) => { if (!mesh) return; mesh.userData.id = name; };

    const tvNode = find(['tv','screen']);
    if (tvNode && tvNode.isMesh) { refs.tv.visible = false; refs.tv = tvNode; refs.tv.material = tvMatOff; setRef('tv', refs.tv); }

    const cL = find(['curtain.l','curtain_left','curtainleft','cortina.l','cortina_izq']);
    const cR = find(['curtain.r','curtain_right','curtainright','cortina.r','cortina_der']);
    if (cL) { refs.curtainL.visible = false; refs.curtainL = cL; setRef('curtains', refs.curtainL); }
    if (cR) { refs.curtainR.visible = false; refs.curtainR = cR; setRef('curtains', refs.curtainR); }

    const led = find(['ledstrip','led_strip','led-bar','ledbar','strip']);
    if (led) { refs.ledBar.visible = false; refs.ledBar = led; setRef('leds', refs.ledBar); refs.ledPoint.position.copy(led.getWorldPosition(new THREE.Vector3())); }

    const light = find(['ceilinglight','light','lamp','techo']);
    if (light) { const p = new THREE.Vector3(); light.getWorldPosition(p); refs.roomLight.position.copy(p); }

    const rob = find(['robot','vacuum','roomba','aspiradora']);
    if (rob) { refs.robot.visible = false; refs.robot = rob; setRef('robot', refs.robot); }
  }

  function fitAndCenter(root){
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3(); box.getSize(size);
    const center = new THREE.Vector3(); box.getCenter(center);
    // target footprint ~7.0m en X/Z
    const target = 7.0; const current = Math.max(size.x, size.z) || 1;
    const scale = target / current;
    if (isFinite(scale) && scale > 0 && Math.abs(scale-1) > 0.01) root.scale.multiplyScalar(scale);
    // Recompute with new scale
    const box2 = new THREE.Box3().setFromObject(root);
    const size2 = new THREE.Vector3(); box2.getSize(size2);
    const center2 = new THREE.Vector3(); box2.getCenter(center2);
    // mover para centrar en XZ y apoyar en Y=0
    root.position.x += -center2.x;
    root.position.z += -center2.z;
    root.position.y += -box2.min.y; // base a 0

    // Posicionar cámara frente al centro a distancia razonable
    const dist = Math.max(6, size2.z * 0.9 + 3);
    camera.position.set(0, Math.min(1.65, size2.y * 0.55), dist);
    camera.lookAt(0, 1.3, 0);
  }
  try {
    // Environment lighting HDR
    if (THREE.RGBELoader) {
      const rgbe = new THREE.RGBELoader();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const loadHDR = (url) => rgbe.setDataType(THREE.UnsignedByteType).load(url, (hdr)=>{ const envMap = pmrem.fromEquirectangular(hdr).texture; scene.environment = envMap; hdr.dispose?.(); }, undefined, ()=>{});
      // intenta local y luego remoto
      loadHDR(LOCAL_HDR_URL);
      setTimeout(()=>{ if (!scene.environment) loadHDR('https://raw.githubusercontent.com/mrdoob/three.js/r159/examples/textures/equirectangular/royal_esplanade_1k.hdr'); }, 800);
    }
    // Optional GLB room
    if (window.THREE && THREE.GLTFLoader) {
      const loader = new THREE.GLTFLoader();
      // Soporte para Draco/KTX2 por si el modelo viene comprimido
      try {
        if (THREE.DRACOLoader) {
          const draco = new THREE.DRACOLoader();
          draco.setDecoderPath('https://unpkg.com/three@0.159.0/examples/js/libs/draco/');
          loader.setDRACOLoader(draco);
        }
        if (THREE.KTX2Loader) {
          const ktx2 = new THREE.KTX2Loader();
          ktx2.setTranscoderPath('https://unpkg.com/three@0.159.0/examples/js/libs/basis/');
          ktx2.detectSupport(renderer);
          loader.setKTX2Loader(ktx2);
        }
      } catch(_) {}
      refs.loadLog = [];
      const tryLoad = (url, onOk, onFail) => loader.load(url,
        (gltf)=> { refs.loadLog.push(['ok', url]); console.info('[Sim] GLB cargado:', url); onOk(gltf); },
        undefined,
        (e)=> { refs.loadLog.push(['fail', url, e?.message||String(e)]); console.warn('[Sim] Falló GLB:', url, e?.message||e); onFail?.(); }
      );
      const seq = [
        ROOT_MODEL_URL,
        '/living.glb',
        './living.glb',
        PUBLIC_MODEL_URL,
        '/public/living.glb',
        LOCAL_MODEL_URL,
        FALLBACK_MODEL_URL
      ];
      const placeholders = [floor, ceiling, wallBack, wallFront, wallLeft, wallRight, couch, table];
      const next = (i=0) => {
        if (i>=seq.length) return;
        tryLoad(seq[i], (gltf)=>{
          const room = gltf.scene; room.scale.setScalar(1.0); room.position.set(0,0,0);
          room.traverse((o)=>{ if (o.isMesh) { o.castShadow = false; o.receiveShadow = true; o.material.envMapIntensity = 1.0; } });
          scene.add(room);
          refs.lastModelLoaded = seq[i];
          // ocultar placeholders si cargó un modelo
          placeholders.forEach(p=> p.visible = false);
          bindNodes(room);
          fitAndCenter(room);
        }, ()=> next(i+1));
      };
      next(0);
    }
  } catch(_) {}

  // Fallback de iluminación si no hay environment ni luces prendidas
  setTimeout(()=>{
    if (!scene.environment) ambient.intensity = 0.8;
    if (roomLight.intensity === 0) roomLight.intensity = 0.5; // para ver el espacio inicialmente
  }, 1200);

  function resize() {
    const w = window.innerWidth, h = window.innerHeight; renderer.setSize(w, h); camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);

  return { refs, resize };
}
