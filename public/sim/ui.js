import { resetState } from './state.js';

export function bindUI(bus, devices, controls, world) {
  const $ = (s) => document.querySelector(s);
  const tempSlider = $('#temp'); const tempRead = $('#temp-read');

  $('#btn-start')?.addEventListener('click', ()=> controls.lock());
  $('#btn-lights')?.addEventListener('click', ()=> devices.toggle('lights'));
  $('#btn-leds')?.addEventListener('click', ()=> devices.toggle('leds'));
  $('#btn-curtains')?.addEventListener('click', ()=> devices.toggle('curtains'));
  $('#btn-tv')?.addEventListener('click', ()=> devices.toggle('tv'));
  $('#btn-speakers')?.addEventListener('click', ()=> devices.toggle('speakers'));
  $('#btn-ac')?.addEventListener('click', ()=> { devices.toggle('ac'); updateThermo(); });
  $('#btn-heat')?.addEventListener('click', ()=> devices.toggle('heat'));
  $('#btn-robot')?.addEventListener('click', ()=> devices.toggle('robot'));
  $('#btn-alarm')?.addEventListener('click', ()=> devices.toggle('alarm'));
  $('#btn-cam')?.addEventListener('click', ()=> devices.toggle('cams'));
  $('#btn-reset')?.addEventListener('click', ()=> { resetState(); location.reload(); });

  tempSlider?.addEventListener('input', (e)=>{
    const v = Number(e.target.value)||22; tempRead.textContent = v; devices.setAC(v);
  });

  // Mostrar panel termostato si AC
  const thermo = document.getElementById('thermostat');
  const updateThermo = () => { const s = devices.get(); thermo?.classList.toggle('hidden', !s.ac.on); };
  updateThermo();
}
