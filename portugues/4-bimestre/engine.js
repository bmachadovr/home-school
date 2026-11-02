(function(){
'use strict';
const rev=Number(document.body.dataset.revisao);
const data=window.P4CURRICULUM;
const root=document.querySelector('#application');
const storeKey='hs-port4-v1-r'+rev;
const doneKey=storeKey+'-done';
const home='../../../index.html';
const slides=data&&data['r'+rev];
const h=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if(!slides||!slides.length){root.textContent='Conteúdo não encontrado.';return;}
let saved={};
try{saved=JSON.parse(localStorage.getItem(storeKey)||'{}')||{};}catch(e){}
let pos=Math.min(Math.max(0,Number(saved.pos)||0),slides.length);
let answers=saved.answers||{};
let elapsed=Number(saved.elapsed)||0;
let paused=false,finished=!!saved.finished;
let currentGame=null;
const counting=()=>Object.values(answers).filter(a=>a&&a.scored).length;
const correctCount=()=>Object.values(answers).filter(a=>a&&a.scored&&a.ok).length;
function write(){
 try{localStorage.setItem(storeKey,JSON.stringify({pos:pos,answers:answers,elapsed:elapsed,finished:finished}));}catch(e){}
}
function mmss(seconds){const m=Math.floor(seconds/60);const s=seconds%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}
setInterval(function(){if(!paused&&!finished&&document.visibilityState!=='hidden'){elapsed++;if(elapsed%5===0)write();const t=document.querySelector('#clock');if(t)t.textContent=mmss(elapsed);}},1000);
function slugTopic(t){return t||'Raciocínio';}
function questionDone(){return !!answers['p'+pos];}
function gate(s){return s.type!=='lab'&&s.type!=='explore'&&s.type!=='order'&&s.type!=='fill'&&s.type!=='write'&&s.type!=='game'&&s.type!=='mcq'&&s.type!=='tf'&&s.type!=='numeric'&&s.type!=='pairs'&&s.type!=='pause'||questionDone();}
function header(){
 let n=Math.min(pos+1,slides.length), pct=Math.round((pos/slides.length)*100);
 return '<header class="topbar"><a href="'+home+'" class="homelink">⌂ Home School</a><span>Português • 4º Bimestre V1 • Revisão '+rev+'</span><button id="restart" class="quiet">Reiniciar</button></header>'+
 '<div class="dash"><span>Página <b id="pagecount">'+n+'</b> de '+slides.length+'</span><span>⏱ <b id="clock">'+mmss(elapsed)+'</b> <button id="pause" class="quiet">'+(paused?'Continuar':'Pausar')+'</button></span><span>⭐ <b id="points">'+(correctCount()*10+Object.values(answers).filter(x=>x&&x.bonus).length*5)+'</b> pts</span></div>'+
 '<div class="progress" role="progressbar" aria-label="Progresso" aria-valuenow="'+pct+'" aria-valuemax="100"><div style="width:'+pct+'%"></div></div>';
}
function render(){
 currentGame=null;
 if(finished||pos>=slides.length){finishView();return;}
 const s=slides[pos];
 const label=rev===1?'Exploração guiada':rev===2?'Oficina de interpretação e gramática':'Simulado por níveis';
 const content='<div class="minihead"><span class="eyebrow">'+label+' • '+h(s.topic||'Checkpoint')+'</span><span>~ '+(s.minutes||1)+' min nesta etapa</span></div>'+
 '<div class="layout"><main class="lesson"><h1>'+h(s.title||s.prompt||'Desafio')+'</h1>'+
 (s.text?'<div class="bodytext">'+s.text.split('\n').map(x=>'<p>'+h(x)+'</p>').join('')+'</div>':'')+
 (s.example?'<div class="example"><strong>🔎 Exemplo comentado</strong><p>'+h(s.example)+'</p></div>':'')+
 '<div id="activity"></div>'+
 (s.tip?'<aside class="tip"><strong>💡 Dica da Jujuba</strong><p>'+h(s.tip)+'</p></aside>':'')+
 (s.link?'<p class="media"><a href="'+h(s.link)+'" target="_blank" rel="noopener">▶ Assistir ou explorar o recurso complementar ↗</a></p>':'')+
 '</main><aside class="guide"><img src="../../../assets/jujuba.webp" alt="Jujuba, guia da revisão"><p>'+h(s.guide||'Olhe o exemplo, experimente e só avance quando fizer sentido.')+'</p><button id="speak" class="quiet">🔊 Ouvir esta explicação</button></aside></div>'+
 '<nav class="nav"><button id="previous" class="btn secondary" '+(pos===0?'disabled':'')+'>← Anterior</button><span id="message" role="status" aria-live="polite"></span><button id="next" class="btn" '+(gate(s)?'':'disabled')+'>'+(pos===slides.length-1?'Concluir missão ✓':'Próxima →')+'</button></nav>';
 root.innerHTML=header()+'<section class="screen">'+content+'</section>';
 attachGlobal(s);
 if(s.type==='lab')drawLab(s);
 else if(s.type==='explore')drawExplore(s);
 else if(s.type==='order')drawOrder(s);
 else if(s.type==='fill')drawFill(s);
 else if(s.type==='write')drawWrite(s);
 else if(s.type==='game'||s.type==='mcq'||s.type==='tf')drawChoices(s);
 else if(s.type==='numeric')drawNumeric(s);
 else if(s.type==='pairs')drawPairs(s);
 else if(s.type==='pause')drawPause(s);
 else if(s.type==='visual')drawVisual(s);
 if(questionDone()){showFeedback(s);const next=document.querySelector('#next');if(next)next.disabled=false;}
}
function attachGlobal(s){
 document.querySelector('#previous').onclick=()=>{if(pos>0){pos--;write();render();}};
 document.querySelector('#next').onclick=()=>{
   if(!gate(s))return;
   if(pos===slides.length-1){pos=slides.length;finished=true;localStorage.setItem(doneKey,'1');write();finishView();}
   else {pos++;write();render();}
   window.scrollTo({top:0,behavior:'instant'});
 };
 document.querySelector('#pause').onclick=()=>{paused=!paused;document.querySelector('#pause').textContent=paused?'Continuar':'Pausar';};
 document.querySelector('#restart').onclick=()=>{if(confirm('Reiniciar esta revisão? Suas respostas e seu tempo serão apagados.')){pos=0;answers={};elapsed=0;finished=false;localStorage.removeItem(doneKey);write();render();}};
 document.querySelector('#speak').onclick=()=>{
   if(!('speechSynthesis' in window)){alert('Áudio indisponível neste navegador.');return;}
   if(speechSynthesis.speaking){speechSynthesis.cancel();return;}
   const u=new SpeechSynthesisUtterance([s.title,s.text,s.example,s.tip].filter(Boolean).join('. '));u.lang='pt-BR';u.rate=.94;speechSynthesis.speak(u);
 };
}
function complete(ok,scored,feedback){
 if(questionDone())return;
 answers['p'+pos]={ok:!!ok,scored:!!scored,topic:slides[pos].topic,bonus:!scored};
 write();
 const next=document.querySelector('#next');if(next)next.disabled=false;
 const msg=document.querySelector('#message');if(msg)msg.textContent=feedback||(ok?'Boa! Etapa concluída.':'Revise a explicação e siga.');
 const points=document.querySelector('#points');if(points)points.textContent=correctCount()*10+Object.values(answers).filter(x=>x&&x.bonus).length*5;
}
function showFeedback(s){
 const el=document.querySelector('#activity');
 if(!el||el.querySelector('.feedback'))return;
 const a=answers['p'+pos];
 const p=document.createElement('div');p.className='feedback '+(a.ok?'ok':'warn');
 p.textContent=(a.ok?'✓ ':'↪ ')+(s.explain||'Etapa registrada. Agora avance para continuar.');
 el.appendChild(p);
}
function drawLab(s){
 const lab=s.lab||{};
 const el=document.querySelector('#activity');
 el.innerHTML='<div class="interactive"><h2>🧪 Laboratório de observação</h2><p>'+h(lab.caption||'Mude o controle para ver a relação entre as grandezas.')+'</p><div class="barlabels"><span>'+h(lab.label||'Quantidade')+': <b id="labX"></b></span><span>'+h(lab.out||'Resultado')+': <b id="labY"></b></span></div><input id="ruler" aria-label="'+h(lab.label||'Quantidade')+'" type="range" min="'+lab.min+'" max="'+lab.max+'" step="'+(lab.step||1)+'" value="'+lab.initial+'"><div class="bars"><div id="bar1"></div><div id="bar2"></div></div><p class="formula" id="labExplain"></p><button class="btn" id="discover">Registrei minha descoberta ✓</button></div>';
 const range=el.querySelector('#ruler');
 function update(){
  let x=Number(range.value),y=lab.kind==='inverse'?lab.constant/x:x*Number(lab.factor||1)+(Number(lab.offset)||0);
  const fmt=n=>Number(n.toFixed(3)).toLocaleString('pt-BR',{maximumFractionDigits:3});
  el.querySelector('#labX').textContent=fmt(x)+(lab.xunit||'');
  el.querySelector('#labY').textContent=fmt(y)+(lab.yunit||'');
  el.querySelector('#bar1').style.width=Math.max(8,Math.round(x/lab.max*95))+'%';
  el.querySelector('#bar2').style.width=Math.max(8,Math.round(y/Math.max(y,lab.kind==='inverse'?lab.constant/lab.min:lab.max*Number(lab.factor||1)+Number(lab.offset||0))*95))+'%';
  el.querySelector('#labExplain').textContent=lab.kind==='inverse'?'Quando a primeira aumenta, a segunda diminui para manter o produto constante.':(lab.offset?'Observe o valor fixo: nem toda relação crescente é proporcional.':'A multiplicação pelo mesmo fator conserva a proporção.');
 }
 range.addEventListener('input',update);update();
 if(questionDone())el.querySelector('#discover').disabled=true;
 el.querySelector('#discover').onclick=()=>{complete(true,false,'Você observou a relação de perto.');el.querySelector('#discover').disabled=true;};
}
function drawChoices(s){
 const isGame=s.type==='game';
 const el=document.querySelector('#activity');
 el.innerHTML='<div class="interactive"><h2>'+(isGame?'🎲 Missão-relâmpago':'🎯 Sua resposta')+'</h2><p class="prompt">'+h(s.prompt||'Qual alternativa faz sentido?')+'</p><div class="choices" id="choices">'+s.options.map((x,i)=>'<button class="choice" data-i="'+i+'"><b>'+String.fromCharCode(65+i)+'.</b> '+h(x)+'</button>').join('')+'</div><div id="solution"></div></div>';
 const buttons=Array.from(el.querySelectorAll('.choice'));
 if(questionDone()){const a=answers['p'+pos];buttons.forEach(b=>b.disabled=true);el.querySelector('#solution').textContent=(a.ok?'Você acertou. ':'')+(s.explain||'');return;}
 buttons.forEach((b,i)=>b.onclick=()=>{
    const ok=i===s.correct;
    if(isGame&&!ok){b.classList.add('wrong');const m=document.querySelector('#message');if(m)m.textContent='Experimente outra hipótese. A dica está na explicação!';return;}
    buttons.forEach((x,j)=>{x.disabled=true;if(j===s.correct)x.classList.add('right');else if(i===j)x.classList.add('wrong');});
    el.querySelector('#solution').innerHTML='<div class="feedback '+(ok?'ok':'warn')+'">'+(ok?'Correto! ':'Resposta correta: '+h(s.options[s.correct])+'. ')+h(s.explain||'')+'</div>';
    complete(ok,!isGame,ok?'Boa!':'Esta era uma armadilha comum. Leia a correção.');
 });
}
function drawNumeric(s){
 const el=document.querySelector('#activity');
 el.innerHTML='<div class="interactive"><h2>✍️ Produção ativa</h2><p class="prompt">'+h(s.prompt)+'</p><label for="numberAnswer">Digite o resultado</label><div class="answerline"><input id="numberAnswer" type="text" inputmode="decimal" autocomplete="off" placeholder="Ex.: 12,5"><button id="verify" class="btn">Conferir</button></div><div id="solution"></div></div>';
 const input=el.querySelector('#numberAnswer'),btn=el.querySelector('#verify');
 if(questionDone()){btn.disabled=true;input.disabled=true;el.querySelector('#solution').textContent='Resposta: '+s.answer+'. '+(s.explain||'');return;}
 const verify=()=>{
  let n=Number(input.value.trim().replace(/\s/g,'').replace(',','.'));
  if(!input.value.trim()||!Number.isFinite(n)){el.querySelector('#solution').textContent='Digite um número para conferir.';return;}
  const ok=Math.abs(n-Number(s.answer))<=Number(s.tolerance||.001);
  btn.disabled=true;input.disabled=true;
  el.querySelector('#solution').innerHTML='<div class="feedback '+(ok?'ok':'warn')+'">'+(ok?'Certo! ':'O resultado correto é '+h(s.answer)+'. ')+h(s.explain||'')+'</div>';
  complete(ok,true,ok?'Acerto registrado!':'Leia a solução antes de avançar.');
 };
 btn.onclick=verify;input.onkeydown=e=>{if(e.key==='Enter')verify();};
}
function drawPairs(s){
 const el=document.querySelector('#activity');
 let list=s.pairs.flatMap((pair,i)=>[{text:pair[0],id:i},{text:pair[1],id:i}]);
 // Intercalar metades, em vez de apresentar pares lado a lado
 list=s.pairs.map((p,i)=>({text:p[0],id:i})).concat(s.pairs.map((p,i)=>({text:p[1],id:i})).reverse());
 el.innerHTML='<div class="interactive"><h2>🧩 Jogo de associação</h2><p>Selecione duas cartas que formam um par matemático.</p><div class="pairs">'+list.map((c,i)=>'<button class="pair" data-n="'+i+'">'+h(c.text)+'</button>').join('')+'</div><p id="pairmsg" aria-live="polite"></p></div>';
 if(questionDone()){el.querySelectorAll('.pair').forEach(b=>b.disabled=true);el.querySelector('#pairmsg').textContent='Todos os pares encontrados!';return;}
 const chosen=[];const found=new Set();
 el.querySelectorAll('.pair').forEach(b=>b.onclick=()=>{
  const idx=Number(b.dataset.n);
  if(chosen.length===2||chosen.includes(idx)||found.has(idx))return;
  chosen.push(idx);b.classList.add('selected');
  if(chosen.length===2){
    if(list[chosen[0]].id===list[chosen[1]].id){
      chosen.forEach(k=>{found.add(k);el.querySelector('[data-n="'+k+'"]').classList.add('matched');});
      chosen.length=0;el.querySelector('#pairmsg').textContent='Par encontrado! '+found.size/2+' de '+s.pairs.length;
      if(found.size===list.length){complete(true,false,'Memória matemática concluída!');}
    }else{
      el.querySelector('#pairmsg').textContent='Ainda não combinam. Olhe os conceitos e tente de novo.';
      const previous=chosen.slice();chosen.length=0;setTimeout(()=>previous.forEach(k=>el.querySelector('[data-n="'+k+'"]')?.classList.remove('selected')),600);
    }
  }
 });
}

function drawExplore(s){
 const el=document.querySelector('#activity'),cards=s.cards||[];
 const visited=new Set();
 el.innerHTML='<div class="interactive"><h2>🕵️ Laboratório de pistas</h2><p>'+h(s.prompt||'Abra cada pista e explique o que ela revela.')+'</p><div class="explore-tabs">'+cards.map((c,i)=>'<button class="choice" data-index="'+i+'">'+h(c.label)+'</button>').join('')+'</div><div id="explore-info" class="example">Selecione uma pista para observar o detalhe.</div><button id="explore-done" class="btn" disabled>Registrei todas as descobertas ✓</button></div>';
 el.querySelectorAll('[data-index]').forEach(b=>b.onclick=()=>{
  const i=Number(b.dataset.index);visited.add(i);
  el.querySelectorAll('[data-index]').forEach(x=>x.classList.remove('right'));b.classList.add('right');
  el.querySelector('#explore-info').textContent=cards[i].detail;
  if(visited.size===cards.length)el.querySelector('#explore-done').disabled=false;
 });
 if(questionDone()){el.querySelector('#explore-done').disabled=true;el.querySelector('#explore-info').textContent='Todas as pistas foram investigadas.';}
 el.querySelector('#explore-done').onclick=()=>{complete(true,false,'Você investigou todas as pistas.');el.querySelector('#explore-done').disabled=true;};
}
function drawOrder(s){
 const el=document.querySelector('#activity'),pieces=s.pieces||[],shuffled=s.shuffled||pieces.map((_,i)=>pieces.length-1-i);
 let selected=[];
 el.innerHTML='<div class="interactive"><h2>🧱 Oficina de montagem</h2><p>'+h(s.prompt)+'</p><div class="pairs" id="orderPieces">'+shuffled.map(k=>'<button class="pair" data-i="'+k+'">'+h(pieces[k])+'</button>').join('')+'</div><p class="formula" id="orderCurrent">Sua construção aparecerá aqui.</p><button class="quiet" id="orderReset">Recomeçar montagem</button><button class="btn" id="orderCheck" disabled>Conferir montagem</button><div id="orderFeedback"></div></div>';
 const refresh=()=>{el.querySelector('#orderCurrent').textContent=selected.length?selected.map(i=>pieces[i]).join(' '):'Sua construção aparecerá aqui.';el.querySelector('#orderCheck').disabled=selected.length!==pieces.length;};
 el.querySelectorAll('#orderPieces button').forEach(b=>b.onclick=()=>{if(b.disabled)return;const idx=Number(b.dataset.i);selected.push(idx);b.disabled=true;b.classList.add('matched');refresh();});
 el.querySelector('#orderReset').onclick=()=>{selected=[];el.querySelectorAll('#orderPieces button').forEach(b=>{b.disabled=false;b.classList.remove('matched')});el.querySelector('#orderFeedback').textContent='';refresh();};
 el.querySelector('#orderCheck').onclick=()=>{
  if(selected.length!==pieces.length)return;
  const ok=selected.every((x,i)=>x===i);
  if(ok){complete(true,false,'Montagem concluída!');el.querySelector('#orderFeedback').innerHTML='<div class="feedback ok">'+h(s.explain||'Você organizou a sequência com sentido.')+'</div>';el.querySelector('#orderCheck').disabled=true;el.querySelector('#orderReset').disabled=true;}
  else{el.querySelector('#orderFeedback').innerHTML='<div class="feedback warn">A ordem ainda não comunica bem a ideia. Reorganize e tente novamente.</div>';el.querySelector('#orderReset').click();}
 };
 if(questionDone()){el.querySelectorAll('button').forEach(b=>b.disabled=true);el.querySelector('#orderFeedback').textContent=s.explain||'Sequência registrada.';}
}
function normal(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[.!?;:,]/g,'').trim().replace(/\s+/g,' ');}
function drawFill(s){
 const el=document.querySelector('#activity');
 el.innerHTML='<div class="interactive"><h2>✍️ Complete com precisão</h2><p class="prompt">'+h(s.prompt)+'</p><div class="answerline"><input id="fillAnswer" type="text" autocomplete="off" spellcheck="false" placeholder="Digite uma palavra ou expressão"><button class="btn" id="fillCheck">Conferir</button></div><div id="fillResult"></div></div>';
 const inp=el.querySelector('#fillAnswer'),button=el.querySelector('#fillCheck');
 if(questionDone()){inp.disabled=true;button.disabled=true;el.querySelector('#fillResult').textContent='Resposta esperada: '+s.answer+'. '+(s.explain||'');return;}
 const submit=()=>{if(!normal(inp.value))return;let good=[s.answer,...(s.accept||[])].some(x=>normal(x)===normal(inp.value));complete(good,true,good?'Acerto registrado!':'Confira a explicação e aprenda com a tentativa.');button.disabled=true;inp.disabled=true;el.querySelector('#fillResult').innerHTML='<div class="feedback '+(good?'ok':'warn')+'">'+(good?'Correto! ':'Resposta de referência: '+h(s.answer)+'. ')+h(s.explain||'')+'</div>';};
 button.onclick=submit;inp.onkeydown=e=>{if(e.key==='Enter')submit();};
}
function drawWrite(s){
 const el=document.querySelector('#activity');const min=Number(s.min||30);
 el.innerHTML='<div class="interactive"><h2>📝 Ateliê de escrita</h2><p class="prompt">'+h(s.prompt)+'</p><textarea id="writeAnswer" rows="5" placeholder="Escreva com suas palavras..."></textarea><p class="formula">Sua produção será salva neste navegador. A avaliação automática não substitui a leitura e a revisão do texto.</p><button class="btn" id="saveWrite">Salvar minha produção ✓</button><div id="writeFeedback"></div></div>';
 const area=el.querySelector('#writeAnswer'),button=el.querySelector('#saveWrite');
 if(questionDone()){area.value=answers['p'+pos]?.writing||'';area.disabled=true;button.disabled=true;el.querySelector('#writeFeedback').textContent=s.explain||'Produção registrada.';return;}
 area.value=saved.writing&&saved.writing['p'+pos]||'';
 area.addEventListener('input',()=>{if(!saved.writing)saved.writing={};saved.writing['p'+pos]=area.value;});
 button.onclick=()=>{const v=area.value.trim();if(v.length<min){el.querySelector('#writeFeedback').innerHTML='<div class="feedback warn">Escreva pelo menos '+min+' caracteres. Desenvolva sua ideia um pouco mais.</div>';return;}complete(true,false,'Produção registrada. Leia os critérios e revise se necessário.');answers['p'+pos].writing=v;write();area.disabled=true;button.disabled=true;el.querySelector('#writeFeedback').innerHTML='<div class="feedback ok">Texto registrado. '+h(s.explain||'Confira se ele atende à proposta.')+'</div>';};
}
function drawPause(s){
 const el=document.querySelector('#activity');
 el.innerHTML='<div class="interactive rest"><h2>🌿 Pausa inteligente</h2><p>'+h(s.prompt||'Levante, alongue os ombros e descanse os olhos por alguns instantes.')+'</p><p>O descanso também faz parte da estratégia. Toque no botão quando terminar.</p><button id="ready" class="btn">Voltar à missão ✓</button></div>';
 el.querySelector('#ready').onclick=()=>{complete(true,false,'Pausa concluída. Próxima rodada!');el.querySelector('#ready').disabled=true;};
}
function drawVisual(s){
 const el=document.querySelector('#activity');
 const items=s.items||['1','2','3','4'];
 el.innerHTML='<div class="interactive"><h2>🧭 Observe o padrão</h2><div class="visualrow">'+items.map((x,i)=>'<div class="visualcell"><span>'+h(x)+'</span><div style="height:'+(25+i*18)+'px"></div></div>').join('')+'</div><p>'+h(s.caption||'A mesma relação pode ser representada por uma tabela ou por barras.')+'</p></div>';
}
function finishView(){
 const scored=counting(),correct=correctCount(),pct=scored?Math.round(correct/scored*100):100;
 const byTopic={};
 Object.values(answers).filter(a=>a&&a.scored).forEach(a=>{const k=slugTopic(a.topic);if(!byTopic[k])byTopic[k]={hits:0,total:0};byTopic[k].total++;if(a.ok)byTopic[k].hits++;});
 const weak=Object.entries(byTopic).filter(([k,v])=>v.hits<v.total).map(([k])=>k);
 root.innerHTML=header()+'<section class="finish"><img src="../../../assets/jujuba.webp" alt="Jujuba"><span class="eyebrow">🏆 Missão concluída</span><h1>Você completou a Revisão '+rev+'!</h1><div class="results"><div><b>'+ (rev===1?Object.values(answers).filter(a=>a&&a.bonus).length+' descobertas':correct+' / '+scored)+'</b><small>'+(rev===1?'laboratórios e jogos':'acertos na primeira tentativa')+'</small></div><div><b>'+pct+'%</b><small>'+ (rev===1?'missão exploratória':'desempenho')+'</small></div><div><b>'+mmss(elapsed)+'</b><small>tempo de estudo</small></div></div><h2>Mapa de aprendizagem</h2>'+
 (Object.keys(byTopic).length?'<ul class="diagnostic">'+Object.entries(byTopic).map(([k,v])=>'<li><span>'+h(k)+'</span><strong>'+v.hits+'/'+v.total+'</strong></li>').join('')+'</ul>':'<p>Você explorou os conceitos, observou gráficos e concluiu as experiências.</p>')+
 (weak.length?'<p>Vale voltar a: <strong>'+h(weak.join(', '))+'</strong>.</p>':'<p>Jujuba: missão registrada! O importante é compreender o motivo de cada resultado.</p>')+
 '<div class="finishlinks"><a class="btn secondary" href="'+home+'">Voltar à Home</a>'+(rev<3?'<a class="btn" href="../revisao-'+(rev+1)+'/index.html">Abrir Revisão '+(rev+1)+' →</a>':'<a class="btn" href="'+home+'">Rever minhas missões</a>')+'</div></section>';
 const p=document.querySelector('#pagecount');if(p)p.textContent=slides.length;
 const bar=document.querySelector('.progress div');if(bar)bar.style.width='100%';
 const restart=document.querySelector('#restart');if(restart)restart.onclick=()=>{if(confirm('Apagar a conclusão e refazer esta revisão?')){localStorage.removeItem(doneKey);answers={};pos=0;elapsed=0;finished=false;write();render();}};
 const pause=document.querySelector('#pause');if(pause)pause.disabled=true;
}
document.addEventListener('keydown',e=>{
 if(e.key==='ArrowLeft'&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){if(pos>0&&!finished){pos--;write();render();}}
 if(e.key==='ArrowRight'&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)&&!finished){const s=slides[pos];if(s&&gate(s)){if(pos===slides.length-1){pos=slides.length;finished=true;localStorage.setItem(doneKey,'1');write();finishView();}else{pos++;write();render();}}}
});
if(finished&&localStorage.getItem(doneKey)!=='1'){localStorage.setItem(doneKey,'1');}
render();
})();