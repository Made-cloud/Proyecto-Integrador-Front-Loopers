
return Math.min(100, percent);


function renderTimeline(data){
const timeline = document.getElementById('timeline'); timeline.innerHTML = '';
const events = data.events.slice().reverse(); // mostrar más reciente arriba
events.forEach((ev, i) => {
const div = document.createElement('div'); div.className='event';
const completed = i===0; // el primero de la lista invertida es el último evento
const dot = document.createElement('div'); dot.className = 'dot' + (completed? ' completed' : '');
dot.setAttribute('aria-hidden','true');
div.appendChild(dot);


const time = document.createElement('div'); time.className='ev-time'; time.textContent = formatDate(ev.time);
div.appendChild(time);


const body = document.createElement('div'); body.className='ev-body';
const title = document.createElement('div'); title.className='ev-title'; title.textContent = ev.title;
const loc = document.createElement('div'); loc.className='ev-location'; loc.textContent = ev.location + ' — ' + ev.details;
body.appendChild(title); body.appendChild(loc);
div.appendChild(body);


timeline.appendChild(div);
});
}


function showData(data){
document.getElementById('infoBox').hidden = false;
document.getElementById('carrier').textContent = data.carrier || '-';
document.getElementById('statusText').textContent = data.status || '-';
document.getElementById('lastUpdate').textContent = formatDate(data.lastUpdated || (data.events && data.events[data.events.length-1] && data.events[data.events.length-1].time) || '-');


const prog = calculateProgress(data.events || []);
document.getElementById('progPercent').textContent = prog + '%';
const progBar = document.getElementById('progBar'); progBar.style.width = prog + '%';
document.getElementById('progressWrap').hidden = false;


renderTimeline(data);
document.getElementById('timeline').hidden = false;
}


// Simula una llamada a la API — en producción reemplaza con fetch()
async function fetchTracking(number){
// Aquí podrías hacer: return fetch(`/api/track?num=${number}`).then(r=>r.json())
// Simulación: si coincide con demoData, devuelvo demo; si no, devuelvo error
await new Promise(r=>setTimeout(r, 420));
if(!number) throw new Error('Número vacío');
if(number.trim().toUpperCase() === demoData.trackingNumber) return demoData;
// Simular respuesta genérica
return {
trackingNumber: number,
carrier: 'Transportes Demo',
status: 'Información recibida',
lastUpdated: new Date().toISOString(),
events: [
{time:new Date().toISOString(), title:'Información recibida', location:'Sistema', details:'El remitente creó la guía.'}
]
};
}


// Eventos UI
document.getElementById('btnTrack').addEventListener('click', async ()=>{
const num = document.getElementById('trackInput').value.trim();
try{
document.getElementById('btnTrack').textContent = 'Cargando...'; document.getElementById('btnTrack').disabled = true;
const data = await fetchTracking(num);
showData(data);
window.latestData = data; // para controles
}catch(err){
alert('Error al obtener tracking: ' + err.message);
}finally{
document.getElementById('btnTrack').textContent = 'Rastrear'; document.getElementById('btnTrack').disabled = false;
}
});


document.getElementById('btnDemo').addEventListener('click', ()=>{
document.getElementById('trackInput').value = demoData.trackingNumber;
document.getElementById('btnTrack').click();
});


document.getElementById('btnCopy').addEventListener('click', ()=>{
if(!window.latestData){ alert('Rastrea primero para copiar el JSON.'); return }
const text = JSON.stringify(window.latestData, null, 2);
navigator.clipboard.writeText(text).then(()=>alert('JSON copiado al portapapeles.'))
});


document.getElementById('btnExport').addEventListener('click', ()=>{
if(!window.latestData){ alert('Rastrea primero para exportar.'); return }
const blob = new Blob([JSON.stringify(window.latestData, null, 2)], {type:'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a'); a.href = url; a.download = (window.latestData.trackingNumber || 'tracking') + '.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});


document.getElementById('btnPrint').addEventListener('click', ()=>{
window.print();
});


// Autofocus al cargar
document.getElementById('trackInput').focus();
