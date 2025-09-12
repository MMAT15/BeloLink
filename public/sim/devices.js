import { saveState } from './state.js';

export function createDevices(world, initialState) {
  const w = world.refs;
  const state = JSON.parse(JSON.stringify(initialState));

  const api = {
    get: () => state,
    set(patch) { Object.assign(state, patch); saveState(state); this.applyAll(); },
    applyAll() {
      // lights
      w.roomLight.intensity = state.lights ? 1.1 : 0.0;
      // leds
      w.ledPoint.intensity = state.leds ? 1.5 : 0.0; w.ledBar.material.emissive.setHex(state.leds ? 0x58caff : 0x000000);
      // curtains (0 cerrado, 1 abierto)
      const v = state.curtains; w.curtainL.position.x = -1.3 - (1.2 * (1-v)); w.curtainR.position.x = 1.3 + (1.2 * (1-v));
      // tv
      w.tv.material = state.tv ? w.tvMatOn : w.tvMatOff; if (state.tv) { try { w.video.play(); } catch(_){} } else { try { w.video.pause(); } catch(_){} }
      // heat
      w.floor.material.color.set(state.heat ? 0x3d2d20 : 0x2a2f3a);
      // cams handled in main loop viewport drawing
    },
    toggle(id) {
      switch(id){
        case 'lights': state.lights = !state.lights; break;
        case 'leds': state.leds = !state.leds; break;
        case 'curtains': state.curtains = state.curtains > 0.5 ? 0 : 1; break;
        case 'tv': state.tv = !state.tv; break;
        case 'heat': state.heat = !state.heat; break;
        case 'cams': state.cams = !state.cams; break;
        case 'alarm': state.alarm = !state.alarm; break;
        case 'robot': state.robot = !state.robot; break;
        case 'speakers': state.speakers = !state.speakers; break;
        case 'ac': state.ac.on = !state.ac.on; break;
      }
      saveState(state); this.applyAll();
    },
    setAC(temp) { state.ac.on = true; state.ac.temp = temp; saveState(state); },
  };
  api.applyAll();
  return api;
}

