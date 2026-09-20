(()=>{
  if(document.getElementById('hs-study-clock')) return;

  const style=document.createElement('style');
  style.textContent=`
    #hs-study-clock{display:flex;align-items:center;gap:6px;padding:7px 9px;border-radius:12px;border:1px solid rgba(127,127,127,.25);background:rgba(255,255,255,.09);font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap}
    #hs-study-clock .hs-time{min-width:66px;text-align:center}
    #hs-study-clock button{border:1px solid rgba(127,127,127,.28);background:rgba(127,127,127,.12);color:inherit;border-radius:8px;padding:5px 7px;font:inherit;font-size:.78rem;font-weight:850;cursor:pointer;margin:0}
    #hs-study-clock button:focus-visible{outline:2px solid currentColor;outline-offset:2px}
    @media(max-width:680px){#hs-study-clock{gap:4px;padding:6px 7px;font-size:.78rem}#hs-study-clock .hs-time{min-width:58px}#hs-study-clock button{padding:4px 6px;font-size:.7rem}}
  `;
  document.head.appendChild(style);

  const clock=document.createElement('div');
  clock.id='hs-study-clock';
  clock.setAttribute('aria-label','Relógio de estudo');
  clock.innerHTML='<span aria-hidden="true">⏱</span><span class="hs-time" id="hs-study-time">00:00</span><button type="button" id="hs-study-pause">Pausar</button><button type="button" id="hs-study-reset">Zerar</button>';

  const candidates=[
    document.querySelector('header .top .sp'),
    document.querySelector('.top .row .sp'),
    document.querySelector('.row .sp'),
    document.querySelector('header .top'),
    document.querySelector('.top .row'),
    document.querySelector('.top')
  ];
  const anchor=candidates.find(Boolean);
  if(!anchor) return;

  if(anchor.classList && anchor.classList.contains('sp')) anchor.insertAdjacentElement('afterend',clock);
  else anchor.appendChild(clock);

  const timeEl=document.getElementById('hs-study-time');
  const pauseBtn=document.getElementById('hs-study-pause');
  const resetBtn=document.getElementById('hs-study-reset');
  let accumulated=0;
  let startedAt=Date.now();
  let paused=false;

  const elapsed=()=>accumulated+(paused?0:Date.now()-startedAt);
  const render=()=>{
    const total=Math.floor(elapsed()/1000);
    const h=Math.floor(total/3600);
    const m=Math.floor((total%3600)/60);
    const s=total%60;
    timeEl.textContent=h>0?`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  pauseBtn.addEventListener('click',()=>{
    if(paused){
      startedAt=Date.now();
      paused=false;
      pauseBtn.textContent='Pausar';
    }else{
      accumulated+=Date.now()-startedAt;
      paused=true;
      pauseBtn.textContent='Continuar';
    }
    render();
  });

  resetBtn.addEventListener('click',()=>{
    accumulated=0;
    startedAt=Date.now();
    paused=false;
    pauseBtn.textContent='Pausar';
    render();
  });

  render();
  setInterval(render,500);
})();
