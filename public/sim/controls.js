export function createControls(world) {
  const { camera, renderer } = world.refs;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  let controls = null; let orbit = null; let locked = false;

  if (!isMobile && THREE.PointerLockControls) {
    controls = new THREE.PointerLockControls(camera, document.body);
    controls.addEventListener('lock', () => locked = true);
    controls.addEventListener('unlock', () => locked = false);
  } else if (THREE.OrbitControls) {
    orbit = new THREE.OrbitControls(camera, renderer.domElement);
    orbit.enablePan = false; orbit.maxPolarAngle = Math.PI / 2 - 0.05; orbit.target.set(0, 1.3, 0);
  }

  const keys = {}; const dir = new THREE.Vector3();
  document.addEventListener('keydown', (e)=>{ keys[e.code] = true; });
  document.addEventListener('keyup', (e)=>{ keys[e.code] = false; });

  function update(dt) {
    if (!controls || !locked) return;
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
    camera.position.y = 1.65;
  }

  function lock() { controls?.lock(); }
  function isLocked() { return !!locked; }

  return { update, lock, isLocked };
}

