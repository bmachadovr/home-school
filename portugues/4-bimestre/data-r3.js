window.P4R3=(function(){
 const levels=[['Básico',window.P4BASIC],['Intermediário',window.P4INTERMEDIATE],['Avançado',window.P4ADVANCED]];
 const questions=levels.flatMap(([level,questions])=>questions.map(x=>({level,topic:x[0],prompt:x[1],answer:x[2],wrong:x[3],explain:x[4]})));
 if(questions.length!==60)throw new Error('O simulado precisa conter 60 questões.');
 const slides=[];
 for(let i=0;i<questions.length;i++){
   const q=questions[i];if(q.wrong.length!==3)throw new Error('Distratores ausentes em '+i);
   const slot=(i*3+1)%4,answers=[],w=q.wrong.slice();
   for(let j=0;j<4;j++)answers.push(j===slot?q.answer:w.shift());
   if(new Set(answers).size!==4)throw new Error('Alternativas repetidas '+i);
   slides.push({type:'mcq',level:q.level,topic:q.topic,title:'Questão '+(i+1)+' • '+q.level,prompt:q.prompt,options:answers,correct:slot,explain:q.explain,minutes:1});
   if((i+1)%10===0)slides.push({type:'pause',topic:'Intervalo estratégico',title:'Pausa '+(i+1)/10+' • Recuperar energia',prompt:i<20?'Levante por 20 segundos e relembre a diferença entre verbete e texto científico.':i<40?'Descanse os olhos. Diga uma conjunção de cada grupo e retome.':'Faça uma pausa curta e releia as palavras exatas de cada questão, especialmente limites e conectivos.',minutes:1,link:['https://www.youtube.com/watch?v=o5tjKiWG5_M','https://www.youtube.com/watch?v=3oO_ejhW7yM','https://www.portugues.com.br/gramatica/oracoes-coordenadas.html','https://brasilescola.uol.com.br/gramatica/mas-ou-mais.htm','https://novaescola.org.br/planos-de-aula/fundamental/7ano/lingua-portuguesa/revisao-de-reportagem-de-divulgacao-cientifica/4392','https://www.portugues.com.br/gramatica/a-virgula-entre-as-oracoes-coordenadas-.html'][i/10]});
 }
 return slides;
})();
