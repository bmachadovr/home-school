import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const folder=path.resolve('matematica/4-bimestre');
const source=fs.readFileSync(path.join(folder,'curriculum.js'),'utf8');
const ctx={window:{}};
new vm.Script(source,{filename:'curriculum.js'}).runInNewContext(ctx);
const book=ctx.window.M4CURRICULUM;
const engine=fs.readFileSync(path.join(folder,'engine.js'),'utf8');
new vm.Script(engine,{filename:'engine.js'});
const home=fs.readFileSync('index.html','utf8');
function assertQuestions(qs){for(const q of qs){assert.ok(q.topic,'Sem assunto');assert.ok(q.explain,'Sem explicação');assert.ok(q.prompt,'Sem enunciado');assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(Number.isInteger(q.correct));assert.ok(q.correct>=0&&q.correct<4);}}
test('As três revisões existem e usam o mesmo motor',()=>{
 for(const n of [1,2,3]){const html=fs.readFileSync(path.join(folder,'revisao-'+n,'index.html'),'utf8');assert.match(html,new RegExp('data-revisao="'+n+'"'));assert.match(html,/\.\.\/curriculum\.js/);assert.match(html,/\.\.\/engine\.js/);assert.match(html,/\.\.\/style\.css/);}
});
test('Revisão 1: didática com 47 telas, jogos e sem exercícios de prova',()=>{
 assert.equal(book.r1.length,47);
 assert.equal(book.r1.filter(s=>s.type==='mcq'||s.type==='numeric'||s.type==='tf').length,0);
 assert.ok(book.r1.filter(s=>s.type==='lab').length>=12);
 assert.ok(book.r1.filter(s=>s.type==='game'||s.type==='pairs').length>=14);
 for(const s of book.r1){assert.ok(s.title);assert.ok(s.topic);}
});
test('Revisão 2: aprofundamento e formatos de resposta variados',()=>{
 assert.equal(book.r2.length,44);
 for(const kind of ['mcq','numeric','tf','pairs','pause'])assert.ok(book.r2.some(s=>s.type===kind),kind);
 for(const s of book.r2.filter(s=>s.type==='mcq')){assert.ok(s.explain);assert.ok(s.options[s.correct]);}
 for(const s of book.r2.filter(s=>s.type==='numeric')){assert.ok(Number.isFinite(Number(s.answer)));}
});
test('Revisão 3: 20 + 20 + 20 questões, quatro respostas próximas, seis pausas',()=>{
 const q=book.r3.filter(s=>s.type==='mcq');
 assert.equal(q.length,60);assert.equal(book.r3.length,66);
 assert.equal(book.r3.filter(s=>s.type==='pause').length,6);
 assertQuestions(q);
 for(const [level,count] of [['Básico',20],['Intermediário',20],['Avançado',20]])assert.equal(q.filter(x=>x.level===level).length,count);
 assert.equal(new Set(q.map(x=>x.prompt)).size,60);
 for(let i=0;i<4;i++)assert.equal(q.filter(x=>x.correct===i).length,15);
});
test('Conteúdo contempla os 13 blocos do programa escolar',()=>{
 const topics=['Razão','Escala','Velocidade média','Densidade','Densidade demográfica','Aceleração','Proporção','Diretamente proporcionais','Inversamente proporcionais','Não proporcionais','Regra de três','Porcentagem','Juros simples'];
 for(const t of topics){assert.ok(book.r1.some(x=>x.topic===t),'R1 sem '+t);assert.ok(book.r2.some(x=>x.topic===t),'R2 sem '+t);}
});
test('Home preserva bimestres e habilita as seis revisões',()=>{
 assert.match(home,/matematica\/3-bimestre-v2\/revisao-1\/index.html/);
 for(const subject of ['portugues','matematica'])for(let n=1;n<=3;n++){
  assert.ok(home.includes('href="'+subject+'/4-bimestre/revisao-'+n+'/index.html"'),'Link direto ausente: '+subject+' '+n);
 }
 const active=home.slice(home.indexOf('<section class="term current"'),home.indexOf('<details class="term archive">'));
 assert.doesNotMatch(active,/data-(?:port|mat)4-go|aria-disabled="true"/);
 const scripts=[...home.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
 for(const script of scripts)new vm.Script(script,{filename:'home-inline.js'});
});
test('Acesso direto às revisões 2 e 3 sem progresso',()=>{
 const vmContext=(rev,storage)=>{const root={innerHTML:''};const mocks=new Map();const document={
  querySelector(selector){if(selector==='#application')return root;
   if(!mocks.has(selector))mocks.set(selector,{disabled:false,textContent:'',style:{},classList:{add(){},remove(){}},onclick:null,addEventListener(){},querySelector(){return {disabled:false,style:{},addEventListener(){}}},querySelectorAll(){return []}});
   return mocks.get(selector);},
  addEventListener(){},visibilityState:'hidden',activeElement:{tagName:'BODY'}
 };
 const fakeStorage={getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]};
 const ctxt={window:{M4CURRICULUM:book,scrollTo(){}},document,localStorage:fakeStorage,SpeechSynthesisUtterance:class{},setInterval(){},setTimeout(){},confirm(){return true},alert(){},console};
 ctxt.document.body={dataset:{revisao:String(rev)}};
 new vm.Script(engine).runInNewContext(ctxt);
 return {root,mocks,storage};
 };
 const available2clean=vmContext(2,{});assert.match(available2clean.root.innerHTML,/Academia dos Padrões/);
 const available3clean=vmContext(3,{});assert.match(available3clean.root.innerHTML,/Questão 1/);
 const available1=vmContext(1,{});assert.match(available1.root.innerHTML,/Laboratório das Relações Matemáticas/);
 const available2=vmContext(2,{'hs-mat4-v1-r1-done':'1'});assert.match(available2.root.innerHTML,/Academia dos Padrões/);
 const available3=vmContext(3,{'hs-mat4-v1-r2-done':'1'});assert.match(available3.root.innerHTML,/Questão 1/);
});
