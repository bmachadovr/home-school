(()=>{
'use strict';
const items=window.CADERNO_QUESTOES||[];
const root=document.querySelector('#app');
const key='hs-mat4-caderno30-v1';
if(!root||items.length!==30){if(root)root.textContent='Não foi possível carregar os desafios.';return;}
let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){}
let done=new Set(Array.isArray(saved.done)?saved.done.filter(n=>Number.isInteger(n)&&n>=0&&n<30):[]);
let current=Number.isInteger(saved.current)?Math.max(0,Math.min(30,saved.current)):0;
let screen=saved.screen==='answers'&&done.size===30?'answers':'work';
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const level=i=>i<10?'Fundamentos':i<20?'Intermediário':'Desafios';
const tone=i=>i<10?'basic':i<20?'middle':'advanced';
const save=()=>{try{localStorage.setItem(key,JSON.stringify({done:[...done].sort((a,b)=>a-b),current,screen}));}catch(e){}};
function sidebar(){
 let out='<aside class="sidebar"><div class="brand"><span class="brand-mark">∑</span><span><strong>Home School</strong><small>Matemática • 7º ano</small></span></div><a class="home-link" href="../../../index.html">← Voltar à Home</a><div class="aside-heading"><span class="eyebrow">JORNADA NO CADERNO</span><h2>30 desafios<br>de cálculo.</h2><p>Problemas inéditos, contas reais, progresso no seu ritmo.</p></div><div class="progress-box"><div class="progress-numbers"><span>Resolvidos no caderno</span><b>'+done.size+' / 30</b></div><div class="track" role="progressbar" aria-valuenow="'+done.size+'" aria-valuemin="0" aria-valuemax="30" aria-label="Questões resolvidas"><span style="width:'+(100*done.size/30)+'%"></span></div><small>'+ (done.size===30?'Gabarito liberado!':'Gabarito oculto até concluir os 30 exercícios.') +'</small></div>';
 for(let j=0;j<3;j++){
  let start=j*10;
  out+='<div class="nav-level"><div class="nav-title"><i class="level-symbol '+tone(start)+'">'+(j+1)+'</i><b>'+level(start)+'</b></div><div class="nav-grid">';
  for(let i=start;i<start+10;i++)out+='<button class="nav-btn '+(done.has(i)?'done ':'')+(screen==='work'&&current===i?'current':'')+'" data-jump="'+i+'" aria-label="Ir ao exercício '+(i+1)+'">'+(i+1)+(done.has(i)?'<span class="tick">✓</span>':'')+'</button>';
  out+='</div></div>';
 }
 if(done.size===30)out+='<button class="aside-answer" id="toAnswers">Ver resoluções comentadas ↗</button>';
 return out+'<div class="aside-foot">✏️ Marcar como resolvido não confere automaticamente o resultado escrito no caderno.</div></aside>';
}
function worksheet(i){
 const x=items[i],n=i+1,resolved=done.has(i),lines=i>=20?6:i>=10?5:4;
 let out='<div class="topline"><span>✳ PRÁTICA NO CADERNO</span><button id="print" class="print-btn">⎙ Imprimir 30 exercícios</button></div>';
 out+='<div class="heading"><div><span class="level-pill '+tone(i)+'">'+level(i)+' • '+(i<10?'Domine as ferramentas':i<20?'Conecte os cálculos':'Resolva em várias etapas')+'</span><h1>'+esc(x.title)+'</h1><p>Separe o caderno, organize as operações e anote sua resposta com unidade.</p></div><span class="giant-num">'+String(n).padStart(2,'0')+'</span></div>';
 out+='<article class="paper '+tone(i)+'"><div class="paper-meta"><span>MATEMÁTICA</span><span>'+esc(x.topic)+'</span></div><span class="exercise-number">EXERCÍCIO '+String(n).padStart(2,'0')+'</span><p class="statement">'+esc(x.problem)+'</p><div class="notebook-tip"><span>✎</span><div><b>Agora é com o seu caderno</b><p>Registre os dados, desenvolva as contas e escreva o resultado. Sem alternativas e sem resposta antecipada.</p></div></div><div class="ruled-lines">';
 for(let k=0;k<lines;k++)out+='<i></i>';
 out+='</div><div class="paper-foot"><span>CÁLCULOS NO CADERNO</span><span>SEM GABARITO AQUI</span></div></article>';
 out+='<div class="navigation"><button id="prev" class="secondary" '+(i===0?'disabled':'')+'>← Anterior</button><span class="status">'+(resolved?'✓ Já marcada como resolvida':'Questão '+n+' de 30')+'</span><button class="primary" id="mark">'+(resolved?'Próxima questão':'Resolvi no caderno')+' →</button></div>';
 out+='<p class="closing-note">'+(done.size===30?'As 30 questões já foram marcadas. <button class="text-btn" id="finishEarly">Ir ao gabarito comentado</button>':'As resoluções comentadas aparecem somente ao final dos 30 exercícios.')+'</p>';
 return out;
}
function finished(){
 return '<section class="finish-screen"><div class="finish-mark">✓</div><span class="eyebrow">OS 30 DESAFIOS ESTÃO CONCLUÍDOS</span><h1>Hora de conferir o raciocínio!</h1><p>Agora que todos os problemas foram resolvidos no caderno, compare seus cálculos com as resoluções explicadas passo a passo. O importante é entender cada operação.</p><div class="stats"><div><b>30</b><small>problemas resolvidos</small></div><div><b>3</b><small>níveis de dificuldade</small></div><div><b>30</b><small>resoluções comentadas</small></div></div><div class="finish-buttons"><button id="reveal" class="primary">Abrir gabarito comentado ↓</button><button class="secondary" id="review">Rever exercícios</button></div><small class="no-grade">Sem nota automática: suas respostas estão no caderno, não no site.</small></section>';
}
function answerPage(){
 let h='<section class="answer-page"><div class="answer-head"><span class="answer-icon">✓</span><span class="eyebrow">ÚLTIMA ETAPA LIBERADA</span><h1>Gabarito comentado</h1><p>Confira os resultados e acompanhe o caminho das contas. Abra cada questão para comparar com sua resolução.</p></div><div class="answer-tools"><b>30 resoluções, por ordem de dificuldade</b><span><button id="openAll">Abrir todas</button><button id="closeAll">Fechar todas</button></span></div><div class="solution-list">';
 items.forEach((x,i)=>{
  h+='<details class="solution '+tone(i)+'" '+(i===0?'open':'')+'><summary><span class="solution-num">'+String(i+1).padStart(2,'0')+'</span><span class="solution-intro"><small>'+esc(x.topic)+'</small><b>'+esc(x.title)+'</b></span><span class="chevron">⌄</span></summary><div class="solution-body"><div class="original"><b>Enunciado</b><p>'+esc(x.problem)+'</p></div><h3>Passo a passo</h3><ol>';
  x.steps.forEach(step=>h+='<li>'+esc(step)+'</li>');
  h+='</ol><div class="answer-final"><b>Resposta</b><p>'+esc(x.answer)+'</p></div></div></details>';
 });
 return h+'</div><div class="answer-footer"><button class="secondary" id="return">← Rever exercícios</button><button class="primary" id="restart">Recomeçar a lista</button></div></section>';
}
function printing(){
 let h='<section class="print-only"><h1>30 exercícios de Matemática • Home School</h1><p>7º ano, 4º bimestre • Capítulos 13 e 14 • Faça os cálculos no caderno antes de conferir o gabarito comentado.</p>';
 items.forEach((x,i)=>{
  h+='<article class="print-question"><b>'+(i+1)+'. '+esc(x.title)+'</b><small>'+level(i)+' • '+esc(x.topic)+'</small><p>'+esc(x.problem)+'</p><div class="print-rules">';
  for(let k=0;k<(i>=20?5:3);k++)h+='<i></i>';
  h+='</div></article>';
 });
 return h+'</section>';
}
function render(){
 if(screen==='answers'&&done.size!==30){screen='work';current=0;}
 if(current===30&&done.size!==30)current=items.findIndex((_,i)=>!done.has(i));
 root.innerHTML='<div class="layout">'+sidebar()+'<main class="main">'+(screen==='answers'?answerPage():current===30?finished():worksheet(current))+'</main></div>'+printing();
 save();
 root.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{screen='work';current=Number(b.dataset.jump);render();});
 const bind=(id,cb)=>{const b=root.querySelector('#'+id);if(b)b.onclick=cb;};
 bind('print',()=>window.print());
 bind('prev',()=>{current=Math.max(0,current-1);render();});
 bind('mark',()=>{
  done.add(current);
  if(done.size===30){screen='work';current=30;}
  else if(current<29)current++;
  else current=items.findIndex((_,i)=>!done.has(i));
  render();
 });
 bind('finishEarly',()=>{screen='work';current=30;render();});
 bind('reveal',()=>{if(done.size===30){screen='answers';render();}});
 bind('toAnswers',()=>{if(done.size===30){screen='answers';render();}});
 bind('review',()=>{screen='work';current=0;render();});
 bind('return',()=>{screen='work';current=0;render();});
 bind('openAll',()=>root.querySelectorAll('.solution').forEach(x=>x.open=true));
 bind('closeAll',()=>root.querySelectorAll('.solution').forEach(x=>x.open=false));
 bind('restart',()=>{if(confirm('Recomeçar a lista e apagar as marcações de progresso?')){done.clear();current=0;screen='work';render();}});
}
document.addEventListener('keydown',e=>{
 if(e.target.closest('button,summary,a,input,textarea')||screen!=='work'||current===30||e.ctrlKey||e.altKey||e.metaKey)return;
 if(e.key==='ArrowLeft'&&current>0){e.preventDefault();current--;render();}
 if(e.key==='ArrowRight'&&current<29){e.preventDefault();current++;render();}
});
render();
})();