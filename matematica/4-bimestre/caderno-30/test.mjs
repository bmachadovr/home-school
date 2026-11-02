import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const folder='matematica/4-bimestre/caderno-30';
const ctx={window:{CADERNO_QUESTOES:[]}};
for(const name of ['questoes-1.js','questoes-2.js','questoes-3.js']){
 const text=fs.readFileSync(folder+'/'+name,'utf8');
 new vm.Script(text,{filename:name}).runInNewContext(ctx);
}
const qs=ctx.window.CADERNO_QUESTOES;
const engine=fs.readFileSync(folder+'/app.js','utf8');
const home=fs.readFileSync('index.html','utf8');
test('Página e scripts carregam sem dependências externas',()=>{
 const page=fs.readFileSync(folder+'/index.html','utf8');
 for(const x of ['questoes-1.js','questoes-2.js','questoes-3.js','app.js','style.css'])assert.ok(page.includes(x),'Falta '+x);
 new vm.Script(engine,{filename:'app.js'});
});
test('Trinta questões inéditas de cálculo, sem múltipla escolha ou perguntas teóricas',()=>{
 assert.equal(qs.length,30);
 assert.equal(new Set(qs.map(x=>x.problem)).size,30);
 assert.equal(new Set(qs.map(x=>x.title)).size,30);
 for(const [i,q] of qs.entries()){
  assert.equal(q.level,i<10?'Fundamentos':i<20?'Intermediário':'Desafios');
  assert.ok(q.title.length>9);
  assert.ok(q.topic.length>4);
  assert.ok(q.problem.length>80,'Enunciado muito curto: '+i);
  assert.ok(/\d/.test(q.problem),'Enunciado sem dados numéricos: '+i);
  assert.ok(q.steps.length>=3,'Resolução insuficiente: '+i);
  assert.ok(q.answer.length>5,'Resposta não registrada: '+i);
  assert.ok(!q.options,'Não deve conter opções na questão '+i);
 }
});
test('Conteúdos coerentes com capítulos 13 e 14, com dificuldade gradual',()=>{
 const topics=qs.map(q=>q.topic.toLowerCase()).join('|');
 for(const term of ['razão','proporção','escala','velocidade','densidade','demográfica','aceleração','regra de três','porcentagem','juros'])assert.ok(topics.includes(term),'Tema ausente: '+term);
 assert.equal(qs.filter(q=>q.level==='Fundamentos').length,10);
 assert.equal(qs.filter(q=>q.level==='Intermediário').length,10);
 assert.equal(qs.filter(q=>q.level==='Desafios').length,10);
 assert.ok(qs.slice(20).filter(q=>q.steps.length>=5).length>=8,'Poucos desafios de várias etapas');
});
test('Conferência independente dos resultados de cálculo mais complexos',()=>{
 assert.equal((5.6*75000)/100000,4.2);
 assert.equal((96+144)/((80+160)/60),60);
 assert.equal(1260/7,180);
 assert.equal(45600/120-73500/210,30);
 assert.equal(148/8*13.5,249.75);
 assert.equal(6*15/10,9);
 assert.equal((480*(1-.125))*(1+.05),441);
 assert.equal(1250*.016*8,160);
 assert.equal(8*400000/100000,32);
 assert.equal(7*280/7,280);
 assert.equal(280/(7*5)*(12*7),672);
 assert.equal((54000*1.12)/90,672);
 assert.equal((30-15)/5,3);
 assert.equal(2400*.02*6,288);
 assert.equal(Math.round(720*1.18*.85*100)/100,722.16);
 assert.equal((8*18*5)/(9*8),10);
 assert.equal((1200+900)/(1200/8+900/6),7);
 assert.equal(Math.round((2000+2000*.015*5-(2400*.85*1.04))*100)/100,28.4);
 assert.match(qs[29].answer,/28,40/);
});
test('Gabarito trancado até 30 marcações e impressão sem resposta',()=>{
 assert.match(engine,/done\.size===30/);
 assert.match(engine,/if\(screen==='answers'&&done\.size!==30\)/);
 assert.match(engine,/function answerPage\(\)/);
 assert.match(engine,/function printing\(\)/);
 assert.match(engine,/Resolvi no caderno/);
 assert.match(engine,/Gabarito oculto/);
 const printSection=engine.slice(engine.indexOf('function printing()'),engine.indexOf('function render()'));
 assert.doesNotMatch(printSection,/q\.answer|x\.answer|\.steps/);
});
test('Home inclui acesso ao caderno sem mexer nas três revisões de Matemática',()=>{
 assert.match(home,/matematica\/4-bimestre\/caderno-30\/index\.html/);
 for(let n=1;n<=3;n++)assert.ok(home.includes('matematica/4-bimestre/revisao-'+n+'/index.html'));
 assert.match(home,/atividades\/chat-4b\/matematica\/index\.html/);
});
