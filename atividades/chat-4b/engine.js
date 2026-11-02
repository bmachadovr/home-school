(()=>{
'use strict';
const subject=document.body.dataset.subject;
const cfg=window.CHAT_CONFIG;
const raw=window.CHAT_TURNS;
const root=document.getElementById('app');
if(!cfg||!Array.isArray(raw)||raw.length!==80||!root){document.body.textContent='Não foi possível carregar a conversa.';return;}
const key='hs-chat-4b-'+subject+'-v1';
const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const valid=(n)=>typeof n==='string'&&n.trim().length>=2;
const grade=(item,i)=>{const opts=[{text:item[3],points:1.25},{text:item[4],points:.75},{text:item[5],points:0},{text:item[6],points:0}];const target=(i*7+Math.floor(i/4))%4;const partial=(target+1+(i%2))%4;const wrongPositions=[0,1,2,3].filter(x=>x!==target&&x!==partial);const out=[];out[target]=opts[0];out[partial]=opts[1];out[wrongPositions[0]]=opts[2];out[wrongPositions[1]]=opts[3];return out;};
const turns=raw.map((line,i)=>({topic:line[0],setup:line[1],ask:line[2],options:grade(line,i),transition:line[7]||''}));
let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){}
let name=valid(saved.name)?saved.name.trim().slice(0,26):'';
let answers=Array.isArray(saved.answers)?saved.answers.filter(x=>Number.isInteger(x)&&x>=0&&x<4).slice(0,80):[];
let busy=false;
const total=()=>Math.round(answers.reduce((n,idx,i)=>n+turns[i].options[idx].points,0)*100)/100;
const save=()=>{try{localStorage.setItem(key,JSON.stringify({name,answers}));}catch(e){}};
function drawEntry(){
 root.innerHTML='<main class="onboarding"><div class="welcome-symbol">'+(subject==='portugues'?'✒':'∑')+'</div><span class="overline">Home School • 4º bimestre</span><h1>'+esc(cfg.welcome)+'</h1><p class="intro">'+esc(cfg.subtitle)+'</p><div class="preview"><span class="portrait">'+esc(cfg.initials)+'</span><span><strong>'+esc(cfg.teacher)+'</strong><small>Conversa educativa fictícia inspirada em uma figura histórica</small></span><span class="online-dot"></span></div><form id="nameForm"><label for="studentName">Como você quer aparecer no chat?</label><input id="studentName" autocomplete="given-name" maxlength="26" placeholder="Digite seu primeiro nome" required minlength="2" value="'+esc(name)+'"><small id="nameError" class="form-error" aria-live="polite"></small><button class="primary" type="submit">Começar nossa conversa <span aria-hidden="true">→</span></button></form><p class="footnote">80 escolhas • até 100 pontos • sem correções no meio da conversa • progresso salvo neste navegador</p><a href="../../../index.html" class="back-link">← Voltar para a Home</a></main>';
 root.querySelector('#nameForm').onsubmit=e=>{e.preventDefault();const v=root.querySelector('#studentName').value.trim().replace(/\s+/g,' ').slice(0,26);if(!valid(v)){root.querySelector('#nameError').textContent='Digite pelo menos duas letras.';return;}name=v;save();drawChat();};
}
function bubble(text,mine=false,extra=''){
 return '<div class="message '+(mine?'from-me':'from-teacher')+' '+extra+'"><p>'+esc(String(text).replaceAll('{nome}',name)).replace(/\n/g,'<br>')+'</p><span class="bubble-time">'+(mine?'✓✓':'')+'</span></div>';
}
function progress(){
 const i=answers.length,p=Math.round(i/80*100);
 return '<div class="progress-wrap"><div><span>Conversa em andamento</span><strong>'+i+' de 80 respostas</strong></div><div class="progress-track" role="progressbar" aria-label="Progresso da conversa" aria-valuemin="0" aria-valuemax="80" aria-valuenow="'+i+'"><div style="width:'+p+'%"></div></div></div>';
}
function transcript(){
 const count=answers.length;
 let html='<div class="date-chip">Hoje • Aula pelo chat</div>'+bubble(cfg.intro)+bubble('Pode falar comigo como falaria numa conversa normal. Quando eu fizer uma pergunta, escolha a mensagem que representa melhor o que você diria. Não vou corrigir cada resposta durante o papo.');
 let lastTopic='';
 for(let i=0;i<=count&&i<80;i++){
  const t=turns[i];
  if(t.topic!==lastTopic){html+='<div class="scene-chip">'+esc(t.topic)+'</div>';lastTopic=t.topic;}
  html+=bubble(t.setup)+bubble(t.ask);
  if(i<count){const picked=t.options[answers[i]];html+=bubble(picked.text,true);if(t.transition)html+=bubble(t.transition);}
 }
 if(count===80){html+=bubble(cfg.closing.replaceAll('{nome}',name));}
 return html;
}
function choose(index){
 if(busy||answers.length>=80)return;
 const i=answers.length;
 if(!Number.isInteger(index)||index<0||index>3)return;
 busy=true;
 answers.push(index);
 save();
 drawChat();
 busy=false;
}
function drawChat(){
 if(!name){drawEntry();return;}
 const n=answers.length,complete=n===80;
 root.innerHTML='<div class="desktop"><div class="app-label"><div class="app-logo">✦</div><div><span class="overline">Home School apresenta</span><h1>Conversa com '+esc(cfg.teacher)+'</h1></div><span class="app-tag">'+esc(cfg.subject)+'</span></div><div class="phone"><header class="conversation-header"><a href="../../../index.html" class="back-icon" aria-label="Voltar para Home">‹</a><div class="portrait portrait-small">'+esc(cfg.initials)+'</div><div class="contact"><strong>'+esc(cfg.teacher)+'</strong><span><i class="online-dot"></i> com '+esc(name)+' • conversa fictícia</span></div><button class="header-action" id="reset" title="Reiniciar conversa" aria-label="Reiniciar a conversa">↻</button></header>'+progress()+'<div class="chat-scroll" id="chatScroll" aria-live="polite">'+transcript()+'</div>'+(complete?resultPanel():choicePanel())+'</div><p class="privacy">Simulação educativa. Conversa salva apenas neste navegador, sem envio de mensagens a terceiros.</p></div>';
 root.querySelector('#reset').onclick=()=>{if(confirm('Recomeçar a conversa e apagar as respostas anteriores?')){answers=[];save();drawChat();}};
 const chat=root.querySelector('#chatScroll');chat.scrollTop=chat.scrollHeight;
 if(!complete){
  root.querySelectorAll('.response-option').forEach(btn=>btn.onclick=()=>choose(Number(btn.dataset.option)));
 }else{
  root.querySelector('#again').onclick=()=>{if(confirm('Apagar esta pontuação e recomeçar as 80 respostas?')){answers=[];save();drawChat();}};
 }
}
function choicePanel(){
 const turn=turns[answers.length];
 return '<footer class="reply-area"><div class="reply-label"><span>Escolha sua próxima mensagem</span><span class="choice-hint">Nenhuma alternativa revela a pontuação</span></div><div class="option-grid">'+turn.options.map((o,i)=>'<button type="button" class="response-option" data-option="'+i+'"><span class="option-number">'+String.fromCharCode(65+i)+'</span><span>'+esc(o.text)+'</span><span class="chevron">›</span></button>').join('')+'</div><div class="compose-placeholder"><span class="compose-icon">☺</span><span>Responda escolhendo uma mensagem acima</span><span>➤</span></div></footer>';
}
function resultPanel(){
 const score=total(),label=score>=85?'Uma conversa muito consistente':score>=65?'Uma boa conversa, com espaço para crescer':score>=40?'Muitas ideias para continuar explorando':'O começo de uma conversa que merece ser retomada';
 let by={};turns.forEach((t,i)=>{if(!by[t.topic])by[t.topic]={earned:0,max:0};by[t.topic].earned+=t.options[answers[i]].points;by[t.topic].max+=1.25;});
 return '<section class="result" aria-labelledby="result-title"><span class="result-icon">✦</span><h2 id="result-title">Conversa concluída, '+esc(name)+'!</h2><p>'+esc(label)+'. Você participou de todas as 80 trocas de ideias.</p><div class="score"><strong>'+score.toFixed(2).replace('.',',')+'</strong><span>/ 100 pontos</span></div><div class="score-detail"><span>80 respostas registradas</span><span>Máximo: 1,25 por escolha</span></div><details><summary>Ver meus pontos por assunto</summary>'+Object.entries(by).map(([topic,pts])=>'<div class="topic-row"><span>'+esc(topic)+'</span><b>'+pts.earned.toFixed(2).replace('.',',')+' / '+pts.max.toFixed(2).replace('.',',')+'</b></div>').join('')+'</details><p class="no-correction">Como combinado, suas respostas não recebem gabarito nem correção individual.</p><div class="result-buttons"><button id="again" class="primary">Recomeçar conversa</button><a class="secondary" href="../../../index.html">Voltar à Home</a></div></section>';
}
if(name)drawChat();else drawEntry();
})();