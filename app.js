'use strict';
document.body.classList.add('js-enabled');
document.querySelector('.lab-controls fieldset').disabled=false;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const projects = {
 attackgraph: {title:'AttackGraph', category:'01 / SECURITY MODELLING', summary:'Trace attack paths. Compare the fixes.', points:['Generates synthetic enterprise networks and models privilege transitions.','Finds cheapest paths, counts bounded simple paths and compares control sets.','Includes an interactive report and tests for model behaviour.'], limits:'A model, not a scanner. It does not probe real systems. Costs are illustrative; an optimal fix set is optimal only inside this model.', source:'https://github.com/hadhiabdulla/attackgraph'},
 advids: {title:'AdvIDS', category:'02 / ADVERSARIAL ML', summary:'Test the detector, not just its clean accuracy.', points:['Compares Random Forest and neural-network intrusion detectors on NSL-KDD.','Uses a constrained feature-space evasion search and adversarial training.','Documents train, validation and holdout splits, multiple seeds and exploratory benchmarks.'], limits:'Edits dataset features, not packets. It does not demonstrate a working network attack or robustness to other attack families. Distribution shift and post-hoc tests are disclosed in the repository.', source:'https://github.com/hadhiabdulla/advids-adversarial-resilience-lab'},
 fim: {title:'Unix file-integrity monitor', category:'03 / SYSTEMS SECURITY', summary:'Baseline. Watch. Notice the change.', points:['SHA-256 file hashing and recursive directory traversal in C.','Init, check and monitor modes, plus a background daemon.','Alerts for modified, new and deleted files; exit codes for shell integration.'], limits:'A local file-change tool, not a full endpoint detection platform. A change alert does not establish that a change is malicious.', source:'https://github.com/hadhiabdulla/unix-file-integrity-monitor'},
 ticket: {title:'Secure ticketing demo', category:'04 / OBSERVABILITY', summary:'Follow an action from interface to alert.', points:['A local booking interface and a separate connected dashboard.','Structured JSON logs, trace/span correlation and security alerts.','Client-side traffic and attack scenarios with synthetic data.'], limits:'A local demo, not a production payment service. Correlation is modelled inside one process, not distributed tracing or an OpenTelemetry/Grafana integration.', source:'https://github.com/hadhiabdulla/secure-ticketing-observability'}
};
// All substantive project claims are grounded in the public repositories.
const projectDialog = $('#project-dialog');
$$('[data-project]').forEach(button => button.addEventListener('click', event => {
 event.preventDefault();
 const project = projects[button.dataset.project];
 $('#dialog-title').textContent = project.title;
 $('#dialog-category').textContent = project.category;
 $('#dialog-summary').textContent = project.summary;
 $('#dialog-points').replaceChildren(...project.points.map(point => {const li = document.createElement('li'); li.textContent = point; return li;}));
 $('#dialog-limits').textContent = project.limits;
 $('#dialog-source').href = project.source;
 projectDialog.showModal();
}));
$$('dialog').forEach(dialog => {
 $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
 dialog.addEventListener('click', event => {if(event.target === dialog){const rect = dialog.getBoundingClientRect();if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();}});
});
$$('.filter').forEach(button => button.addEventListener('click', () => {
 $$('.filter').forEach(item => {const selected = item === button; item.classList.toggle('active', selected);item.setAttribute('aria-pressed', String(selected));});
 let count=0;
 $$('.project').forEach(card => {const visible = button.dataset.filter === 'all' || card.dataset.category.split(' ').includes(button.dataset.filter);card.hidden = !visible;if(visible) count++;});
 $('#filter-status').textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown`;
}));
const controls = ['password','session','service'];
function updateLab(){
 let open=0;
 controls.forEach(key => {const blocked=$('#'+key).checked;$('#path-'+key).classList.toggle('blocked', blocked);$('#status-'+key).textContent=blocked?'Blocked':'Open';$('#status-'+key).classList.toggle('closed',blocked);if(!blocked)open++;});
 $('#path-count').textContent = `${open} open ${open===1?'route':'routes'}`;
 $('#lab-result strong').textContent = open ? 'Asset reachable' : 'Asset isolated in this model';
 $('#lab-result p').textContent = open ? `${open} independent ${open===1?'route remains':'routes remain'} open in this model.` : 'All three modelled routes are blocked. Real systems need wider validation.';
 $('#asset-box').style.stroke = open ? '#c4ff61' : '#92b8ff';
 $('#lab-result .result-dot').style.background = open ? '#c4ff61' : '#92b8ff';
}
controls.forEach(key=>$('#'+key).addEventListener('change',updateLab));
$('#reset-lab').addEventListener('click',()=>{controls.forEach(key=>$('#'+key).checked=false);updateLab();});
const motionButton=$('#motion');
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
let paused=motionPreference.matches;
function updateMotion(){document.body.classList.toggle('motion-paused',paused);motionButton.setAttribute('aria-pressed',String(paused));motionButton.innerHTML=`Motion ${paused?'off':'on'} <span aria-hidden="true">${paused?'○':'◉'}</span>`;motionButton.title=paused?'Enable decorative motion':'Pause decorative motion';if(typeof document.querySelector('svg').pauseAnimations==='function') $$('svg').forEach(svg=>paused?svg.pauseAnimations():svg.unpauseAnimations());}
motionPreference.addEventListener('change',event=>{paused=event.matches;updateMotion();});
motionButton.addEventListener('click',()=>{paused=!paused;updateMotion();});updateMotion();
const navDialog=$('#nav-dialog');
$('#open-search').addEventListener('click',()=>navDialog.showModal());
$$('a',navDialog).forEach(link=>link.addEventListener('click',()=>navDialog.close()));
document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(navDialog.open)navDialog.close();else if(!projectDialog.open)navDialog.showModal();}});
let ticking=false;
window.addEventListener('scroll',()=>{if(!ticking){window.requestAnimationFrame(()=>{const available=document.documentElement.scrollHeight-window.innerHeight;$('.progress').style.width=available>0?`${window.scrollY/available*100}%`:'0';ticking=false;});ticking=true;}},{passive:true});
