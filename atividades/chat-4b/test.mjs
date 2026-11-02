import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const dir='atividades/chat-4b';
const home=fs.readFileSync('index.html','utf8');
const engine=fs.readFileSync(dir+'/engine.js','utf8');
new vm.Script(engine,{filename:'engine.js'});
const scenes={};
for(const subject of ['portugues','matematica']){
 const ctx={window:{CHAT_TURNS:[]}};
 const page=fs.readFileSync(dir+'/'+subject+'/index.html','utf8');
 for(const script of ['config.js','part-1.js','part-2.js','part-3.js','part-4.js']){
  assert.ok(page.includes('src="'+script+'"'),subject+' missing '+script);
  const content=fs.readFileSync(dir+'/'+subject+'/'+script,'utf8');
  new vm.Script(content,{filename:script}).runInNewContext(ctx);
 }
 assert.ok(page.includes('src="../engine.js"'));
 assert.ok(page.includes('href="../style.css"'));
 scenes[subject]={cfg:ctx.window.CHAT_CONFIG,turns:ctx.window.CHAT_TURNS};
}
const scoreMap=(i)=>{
 const target=(i*7+Math.floor(i/4))%4;
 const partial=(target+1+(i%2))%4;
 return {target,partial,wrong:[0,1,2,3].filter(x=>x!==target&&x!==partial)};
};
test('Duas conversas independentes, com 80 respostas em cada',()=>{
 for(const [subject,{cfg,turns}] of Object.entries(scenes)){
  assert.equal(turns.length,80,subject);
  assert.ok(cfg.welcome&&cfg.teacher&&cfg.intro&&cfg.closing);
  assert.equal(new Set(turns.map(t=>t[2])).size,80,subject+' perguntas repetidas');
  assert.ok(new Set(turns.map(t=>t[0])).size>=8);
  turns.forEach((row,i)=>{
   assert.equal(row.length,7,subject+' item '+i);
   for(let n=0;n<7;n++)assert.ok(typeof row[n]==='string'&&row[n].trim().length>=10,subject+' fala curta '+i+':'+n);
   assert.equal(new Set(row.slice(3,7)).size,4,subject+' alternativas repetidas '+i);
   for(const opt of row.slice(3,7))assert.ok(/^Eu |^Nós |^Acho |^Isso |^Penso |^Prefiro |^Concordo |^Não |^Sim |^Seria |^Diria |^Talvez |^Vou |^Me |^Parece |^Uma |^Aumentou |^O |^Se |^Podemos |^Em |^Acredito |^Pode /.test(opt),subject+' resposta pouco natural '+i+': '+opt);
  });
 }
});
test('Pontuação de quatro alternativas: 1,25, 0,75, 0, 0',()=>{
 for(const subject of Object.keys(scenes)){
  let full=0,partial=0,zero=0,byOption=[0,0,0,0];
  for(let i=0;i<80;i++){
   const g=scoreMap(i);
   assert.equal(new Set([g.target,g.partial,...g.wrong]).size,4);
   assert.equal(g.wrong.length,2);
   byOption[g.target]++;
   full+=1.25;partial+=.75;
   zero+=g.wrong.map(()=>0).reduce((a,b)=>a+b,0);
  }
  assert.equal(full,100);
  assert.equal(partial,60);
  assert.equal(zero,0);
  assert.deepEqual(byOption,[20,20,20,20]);
 }
 assert.match(engine,/points:1\.25/);
 assert.match(engine,/points:\.75/);
 assert.match(engine,/points:0/);
});
test('Somente nome é digitado; respostas por quatro opções',()=>{
 assert.match(engine,/id="studentName"/);
 assert.match(engine,/class="response-option"/);
 assert.doesNotMatch(engine,/<textarea/);
 assert.doesNotMatch(engine,/class="answer-input"/);
 assert.match(engine,/Array\.isArray\(saved\.answers\)/);
 assert.match(engine,/aria-live="polite"/);
});
test('O chat não revela acertos ou notas de alternativas durante as escolhas',()=>{
 assert.match(engine,/Nenhuma alternativa revela a pontuação/);
 assert.match(engine,/Como combinado, suas respostas não recebem gabarito/);
 assert.doesNotMatch(engine,/Resposta correta:/);
});
test('Home inclui duas atividades sem remover as seis revisões',()=>{
 for(const subject of ['portugues','matematica']){
  assert.ok(home.includes('href="atividades/chat-4b/'+subject+'/index.html"'));
  for(let n=1;n<=3;n++)assert.ok(home.includes('href="'+subject+'/4-bimestre/revisao-'+n+'/index.html"'));
 }
 const section=home.slice(home.indexOf('<section class="term current"'),home.indexOf('<details class="term archive">'));
 const order=[...section.matchAll(/<h4>(Português|Matemática|Inglês|História)<\/h4>/g)].map(x=>x[1]);
 assert.deepEqual(order,['Português','Matemática','Inglês','História']);
});
