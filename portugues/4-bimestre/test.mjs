import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const folder=path.resolve('portugues/4-bimestre');
const scripts=['data-r1.js','data-r2.js','bank-basic.js','bank-intermediate.js','bank-advanced.js','data-r3.js','curriculum.js'];
const ctx={window:{}};
for(const f of scripts)new vm.Script(fs.readFileSync(path.join(folder,f),'utf8'),{filename:f}).runInNewContext(ctx);
const book=ctx.window.P4CURRICULUM;
const engine=fs.readFileSync(path.join(folder,'engine.js'),'utf8');
new vm.Script(engine,{filename:'engine.js'});
const home=fs.readFileSync('index.html','utf8');
test('Todos os scripts e paginas da revisao existem',()=>{
 for(let n=1;n<=3;n++){
  const text=fs.readFileSync(path.join(folder,'revisao-'+n,'index.html'),'utf8');
  assert.match(text,new RegExp('data-revisao="'+n+'"'));
  for(let name of [...scripts,'engine.js'])assert.ok(text.includes('../'+name),'sem '+name);
  assert.match(text,/\.\.\/style\.css/);
 }
});
test('Revisao 1 sem exercicios tradicionais, com jogos e escrita',()=>{
 assert.equal(book.r1.length,53);
 assert.equal(book.r1.filter(s=>['mcq','numeric','fill','tf'].includes(s.type)).length,0);
 assert.equal(book.r1.filter(s=>s.type==='explore').length,14);
 assert.ok(book.r1.filter(s=>s.type==='game').length>=14);
 assert.ok(book.r1.filter(s=>s.type==='write').length>=2);
 assert.ok(book.r1.filter(s=>s.type==='pairs'||s.type==='order').length>=5);
});
test('Revisao 2 com teoria e varios formatos interativos',()=>{
 assert.equal(book.r2.length,49);
 for(let t of ['explain','mcq','fill','pairs','write','pause'])assert.ok(book.r2.some(s=>s.type===t),t);
 for(let s of book.r2.filter(s=>s.type==='mcq'))assert.equal(new Set(s.options).size,4);
});
test('Revisao 3: 60 itens exclusivos, 20/20/20, pausas e gabarito balanceado',()=>{
 const q=book.r3.filter(s=>s.type==='mcq');
 assert.equal(q.length,60);
 assert.equal(book.r3.length,66);
 assert.equal(book.r3.filter(s=>s.type==='pause').length,6);
 assert.equal(new Set(q.map(s=>s.prompt)).size,60);
 for(let level of ['Básico','Intermediário','Avançado'])assert.equal(q.filter(x=>x.level===level).length,20);
 for(let i=0;i<4;i++)assert.equal(q.filter(x=>x.correct===i).length,15);
 for(let x of q){assert.equal(x.options.length,4);assert.equal(new Set(x.options).size,4);assert.ok(x.explain.length>=15);}
});
test('Escopo do calendario e fotos consta em todas as revisoes',()=>{
 for(let q of ['Verbetes','Período','Assindéticas','Mas e mais','Divulgação científica','Pontuação']){
  assert.ok(book.r1.some(s=>s.topic.includes(q)),q+' falta na R1');
  assert.ok(book.r2.some(s=>s.topic.includes(q)),q+' falta na R2');
 }
 const t=JSON.stringify(book.r3).toLowerCase();
 for(let x of ['samba','sono','pois','vírgula','verbete'])assert.ok(t.includes(x),x);
});
test('Home: Portugues primeiro, demais materias preservadas e bloqueios presentes',()=>{
 const start=home.indexOf('<section class="term current"'),end=home.indexOf('<details class="term archive">');
 const section=home.slice(start,end);
 const order=[...section.matchAll(/<h4>(Português|Matemática|Inglês|História)<\/h4>/g)].map(x=>x[1]);
 assert.deepEqual(order,['Português','Matemática','Inglês','História']);
 assert.match(home,/data-port4-go="2" aria-disabled="true"/);
 assert.match(home,/data-port4-go="3" aria-disabled="true"/);
 assert.match(home,/hs-port4-v1-r/);
 assert.match(home,/matematica\/3-bimestre-v2\/revisao-1\/index.html/);
 for(const [,body] of home.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(body,{filename:'home inline'});
});
test('Protecao contra acesso direto às revisoes 2 e 3',()=>{
 function open(rev,storage){
  const root={innerHTML:'',textContent:''};
  const document={body:{dataset:{revisao:String(rev)}},querySelector:s=>s==='#application'?root:null,visibilityState:'hidden'};
  const localStorage={getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]};
  const fake={window:{P4CURRICULUM:book},document,localStorage,setInterval(){}};
  new vm.Script(engine).runInNewContext(fake);
  return root.innerHTML;
 }
 assert.match(open(2,{}),/ainda está trancada/);
 assert.match(open(3,{'hs-port4-v1-r1-done':'1'}),/ainda está trancada/);
});
