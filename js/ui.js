// 界面：首页、答题页、进度保存
/* ---------- 界面 ---------- */
const app=document.getElementById('app');
const KEY='pxzj-v1';
const blank=()=>LV.map(()=>0);
let P={passed:blank(),all:false};
try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Array.isArray(s.passed)){P={passed:blank().map((x,i)=>s.passed[i]?1:0),all:!!s.all};}}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(P));}catch(e){}};
let G=null,armed=false,tick=null;
const open=i=>P.all||i===0||P.passed[i-1];
const ROT='<div class="rot">请把平板横过来，图会更大，讲解不用往下滑。</div>';

function home(){G=null;clearInterval(tick);
  const tile=(l,i)=>{const o=open(i),d=P.passed[i];
    return `<button class="tile ${d?'done':o?'open':'lock'}" ${o?`data-act="start" data-i="${i}"`:'disabled'}>
      <span class="id">${l.id}</span><span><span class="nm">${l.name}</span><br><span class="gl">${l.goal}</span></span>
      <span class="st">${d?'已过关':o?'开始':'未解锁'}</span></button>`;};
  app.innerHTML=`${ROT}<header class="mast"><h1>平行线之间</h1><p>所有图形都夹在两条平行线之间，高相等。先用数比，再用字母比。每关连续答对 5 题过关。</p></header>
  ${STAGES.map(S=>`<div class="stage">${S[0]}</div><div class="lv">${LV.slice(S[1],S[2]).map((l,i)=>tile(l,i+S[1])).join('')}</div>`).join('')}
  <div class="foot"><span>教师与家长：</span><button data-act="all">${P.all?'恢复按顺序解锁':'解锁全部关卡'}</button><button data-act="reset">${armed?'再点一次确认清空':'清空进度'}</button>
    <span>进度码 <b style="color:var(--ink);font-size:18px">${progCode()}</b></span><input id="impin" class="impin" placeholder="输入进度码" maxlength="6" autocomplete="off" autocapitalize="off"><button data-act="imp">导入</button><span id="impmsg"></span></div>`;}
// 进度码：把各关是否过关压成一小段字母数字，换设备或换网址时抄过去即可
function progCode(){let v=0;P.passed.forEach((x,i)=>{if(x)v+=2**i;});return v.toString(36);}
function importCode(t){t=(t||'').trim().toLowerCase();if(!/^[0-9a-z]{1,6}$/.test(t))return false;const v=parseInt(t,36);if(!(v<2**LV.length))return false;
  P.passed=LV.map((l,i)=>Math.floor(v/2**i)%2);save();return true;}

function start(i){armed=false;G={lvl:i,streak:0,retry:null,done:false,sel:[],input:'',toks:[],last:''};
  if(LV[i].boss){G.list=bossList(i);G.n=0;G.right=0;G.q=G.list[0];}else{G.q=make(i);G.last=G.q.form;}
  play();}

function fresh(i){let q,t=0;do{q=make(i);}while(q.form===G.last&&t++<6);return q;}
function nextQ(){const g=G;g.done=false;g.sel=[];g.input='';g.toks=[];g.pick=null;g.timeout=false;
  if(LV[g.lvl].boss){g.n++;g.q=g.list[g.n];}
  else{if(g.retry){g.q=make(g.retry.src,g.retry.form);g.q.review=g.retry.src!==g.lvl;g.retry=null;}
    else if(g.lvl>=2&&Math.random()<0.2){const lo=g.lvl>=7?7:0,c=[];for(let j=lo;j<g.lvl;j++)if(!LV[j].boss)c.push(j);if(g.lvl>=7)c.push(5);g.q=fresh(pick(c));g.q.review=true;}
    else g.q=fresh(g.lvl);
    g.last=g.q.form;}
  play();}

const need=q=>q.need||q.shapes.length;
const show=t=>t.map(k=>'+−×÷'.includes(k)?` ${k} `:k).join('');
function cards(q){const g=G,n=q.shapes.length,avail=Math.min(window.innerWidth,1180)-96;
  const sum=q.shapes.reduce((t,s)=>{const e=extOf(s,q.h);return t+e[1]-e[0];},0);
  const u=Math.max(12,Math.min(34,(avail-n*40-(n-1)*12-26)/sum,150/q.h));
  const tap=q.kind==='order'||q.kind==='pick';
  return `<div class="cards">${q.shapes.map((s,i)=>{const k=g.sel.indexOf(i),hit=g.done&&q.kind==='pick'&&q.ans.includes(i);
    return `<button class="cardb${k>=0?' sel':''}${hit?' hit':''}" data-act="card" data-i="${i}" ${g.done||!tap?'disabled':''}>${draw({h:q.h,shapes:[s]},{card:true,u})}<span class="nmh">${s.name}</span>${k>=0?`<span class="bd">${q.kind==='order'?k+1:'✓'}</span>`:''}</button>`;}).join('')}</div>`;}

function answers(q){const g=G;
  if(q.kind==='choice')return `<div class="opts${q.long?' long':''}">${q.options.map(o=>{
    let c='';if(g.done){if(o.k===q.ans)c=' right';else if(o.k===g.pick)c=' wrong';}
    return `<button class="opt${c}" data-act="ans" data-k="${o.k}" ${g.done?'disabled':''}>${o.text}</button>`;}).join('')}</div>`;
  if(g.done)return q.kind==='expr'?`<p class="mine">你拼的式子：<b>${show(g.toks)||'（空）'}</b></p>`:'';
  if(q.kind==='expr')return `<div class="disp wide" id="disp">${show(g.toks)}</div><div class="tiles">${q.tiles.map(k=>`<button class="let" data-act="tile" data-k="${k}">${k}</button>`).join('')}${['+','−','×','÷','(',')'].map(k=>`<button class="op" data-act="tile" data-k="${k}">${k}</button>`).join('')}<button class="op" data-act="tile" data-k="⌫">⌫</button></div>
    <div class="tiles">${['1','2','3','4','5','6','7','8','9','0','.'].map(k=>`<button data-act="tile" data-k="${k}">${k}</button>`).join('')}</div>
    <div class="row"><button class="btn ghost" data-act="tclear">清空</button><button class="btn" data-act="submit" ${g.toks.length?'':'disabled'}>确定</button><span id="msg" style="color:var(--no);font-weight:700"></span></div>`;
  if(q.kind==='order'||q.kind==='pick')return `<div class="row" id="ansrow"><button class="btn ghost" data-act="clear">重选</button><button class="btn" data-act="submit" ${g.sel.length===need(q)?'':'disabled'}>提交</button><span style="color:var(--mute)">已选 ${g.sel.length} / ${need(q)}</span></div>`;
  return `<div class="numrow"><div><div class="disp" id="disp">${g.input}</div><div class="row"><button class="btn" data-act="submit" ${g.input?'':'disabled'}>确定</button></div></div>
    <div class="pad">${['7','8','9','4','5','6','1','2','3','.','0','⌫'].map(k=>`<button data-act="key" data-k="${k}">${k}</button>`).join('')}</div></div>`;}

function play(){const g=G,q=g.q,L=LV[g.lvl];clearInterval(tick);
  let status;
  if(L.boss)status=`<div class="dots">第 ${g.n+1} / 10 题　已对 ${g.right}</div><div class="clock"><i id="clk" style="width:100%"></i></div>`;
  else status=`<div class="dots">连对${[0,1,2,3,4].map(i=>`<span class="dot${i<g.streak?' on':''}"></span>`).join('')}</div>`;
  let fb='';
  if(g.done){const last=L.boss?g.n===9:g.streak>=5;
    const right=q.kind==='num'?`正确答案是 <b>${N(q.ans)}</b>。`:q.kind==='expr'?`正确答案可以写成 <b>${q.ansText.replace(/([+−×÷])/g,' $1 ')}</b>。`:'';
    fb=`<div class="fb ${g.ok?'ok':'no'}${q.cols?' cols':''}"><h3>${g.ok?'对了':g.timeout?'时间到':'不对'}</h3>${g.ok?'':`<p>${right}${L.boss?'':'连对数清零，下一题是同一类。'}</p>`}${q.explain}
      <div class="row"><button class="btn" data-act="next">${last?(L.boss?'看结果':'过关'):'下一题'}</button></div></div>`;}
  const pr=`<p class="prompt">${q.review?'<span class="tag">回顾</span>':''}${q.prompt}</p>`;
  const body=q.scene?`<div class="split"><div class="figcol"><div><div id="figbox">${draw(q.scene)}</div>${q.note?`<p class="note" style="text-align:center">${q.note}</p>`:''}</div></div><div>${pr}${answers(q)}${fb}</div></div>`
    :`${pr}<div id="figbox">${cards(q)}</div>${q.note?`<p class="note" style="text-align:center">${q.note}</p>`:''}${answers(q)}${fb}`;
  app.innerHTML=`${ROT}<div class="bar"><button class="back" data-act="home">返回</button><div class="ttl"><span>${L.id}</span>${L.name}</div>${status}</div><div class="sheet${g.done?' done':''}">${body}</div>`;
  if(g.done){const s=app.querySelector('svg.fig');if(s)requestAnimationFrame(()=>requestAnimationFrame(()=>s.classList.add('go')));}
  else if(L.boss){g.left=g.total=q.kind==='expr'?75:q.scene?(q.kind==='num'?45:30):60;
    tick=setInterval(()=>{g.left--;const c=document.getElementById('clk');if(c)c.style.width=(100*g.left/g.total)+'%';
      if(g.left<=0){g.timeout=true;settle(false);}},1000);}}

function settle(ok){const g=G;clearInterval(tick);g.done=true;g.ok=ok;
  if(LV[g.lvl].boss){if(ok)g.right++;}
  else if(ok)g.streak++;else{g.streak=0;g.retry={src:g.q.src,form:g.q.form};}
  play();}

function finish(){const g=G,L=LV[g.lvl];let ok=true,msg;
  if(L.boss){ok=g.right>=8;msg=`10 题答对 ${g.right} 题。${ok?L.done:'需要对 8 题，再来一次。'}`;}
  else msg=`${L.id} ${L.name}：连续答对 5 题。`;
  if(ok){P.passed[g.lvl]=1;save();}
  const nx=g.lvl+1<LV.length;
  app.innerHTML=`<div class="sheet end"><h2 style="color:${ok?'var(--ok)':'var(--no)'}">${ok?'过关':'还差一点'}</h2><p>${msg}</p>
    <div class="row">${ok&&nx?`<button class="btn" data-act="start" data-i="${g.lvl+1}">下一关</button>`:''}${ok?'':`<button class="btn" data-act="start" data-i="${g.lvl}">再来一次</button>`}<button class="btn ghost" data-act="home">回到地图</button></div></div>`;}

function redrawCards(){document.getElementById('figbox').innerHTML=cards(G.q);const r=document.getElementById('ansrow');if(r)r.outerHTML=answers(G.q);}
app.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const a=b.dataset.act,g=G;
  if(a!=='reset')armed=false;
  if(a==='home')home();
  else if(a==='start')start(+b.dataset.i);
  else if(a==='all'){P.all=!P.all;save();home();}
  else if(a==='reset'){if(armed){P={passed:blank(),all:false};save();armed=false;}else armed=true;home();}
  else if(a==='imp'){if(importCode(document.getElementById('impin').value))home();else document.getElementById('impmsg').textContent='进度码不对，请核对后重输。';}
  else if(a==='ans'){if(g.done)return;g.pick=b.dataset.k;settle(g.pick===g.q.ans);}
  else if(a==='card'){if(g.done)return;const i=+b.dataset.i,k=g.sel.indexOf(i);
    if(k>=0)g.sel.splice(k,1);else if(g.sel.length<need(g.q))g.sel.push(i);else if(need(g.q)===1)g.sel=[i];redrawCards();}
  else if(a==='clear'){g.sel=[];redrawCards();}
  else if(a==='key'){const k=b.dataset.k;if(k==='⌫')g.input=g.input.slice(0,-1);else if(k==='.'){if(!g.input.includes('.'))g.input+=g.input?'.':'0.';}else if(g.input.length<6)g.input+=k;
    document.getElementById('disp').textContent=g.input;app.querySelector('[data-act="submit"]').disabled=!g.input;}
  else if(a==='tile'){const k=b.dataset.k;if(k==='⌫')g.toks.pop();else if(g.toks.length<24)g.toks.push(k);
    document.getElementById('disp').textContent=show(g.toks);document.getElementById('msg').textContent='';app.querySelector('[data-act="submit"]').disabled=!g.toks.length;}
  else if(a==='tclear'){g.toks=[];document.getElementById('disp').textContent='';document.getElementById('msg').textContent='';app.querySelector('[data-act="submit"]').disabled=true;}
  else if(a==='submit'){const q=g.q;
    if(q.kind==='expr'){const f=parseExpr(g.toks.join(''));if(!f){document.getElementById('msg').textContent='式子还不完整，检查一下符号和括号。';return;}settle(equiv(f,q.target));return;}
    if(q.kind==='order')settle(g.sel.join()===q.ans.join());
    else if(q.kind==='pick')settle(g.sel.slice().sort().join()===q.ans.slice().sort().join());
    else settle(same(parseFloat(g.input),q.ans));}
  else if(a==='next'){const L=LV[g.lvl];if(L.boss?g.n===9:g.streak>=5)finish();else nextQ();}
});
let rz;window.addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{if(G&&G.q&&!G.q.scene&&!G.done)redrawCards();},200);});
home();
