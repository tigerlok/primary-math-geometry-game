// 工具函数与画图。所有文件共用这里的函数。
/* ---------- 工具 ---------- */
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[R(0,a.length-1)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=R(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
const N=v=>String(Math.round(v*100)/100);
const NF=v=>{const q=Math.round(v*4);if(Math.abs(v*4-q)>1e-9||q%4===0)return N(v);const w=Math.floor(q/4);return (w?w:'')+['','¼','½','¾'][q%4];};
const same=(x,y)=>Math.abs(x-y)<1e-9;
const NAMES=['甲','乙','丙','丁','戊'];
const TN={rect:'矩形',sq:'正方形',para:'平行四边形',tri:'三角形',trap:'梯形'};
const T4=['rect','para','tri','trap'];
const eff=s=>(s.a+s.b)/2;
const P4=(s,h)=>s.t==='tri'?[[0,0],[s.b,0],[s.off,h]]:[[0,0],[s.b,0],[s.off+s.a,h],[s.off,h]];
const extOf=(s,h)=>{const xs=P4(s,h).map(p=>p[0]);(s.ghost||[]).forEach(p=>xs.push(p[0]));return [Math.min(...xs),Math.max(...xs)];};

function say(s,f){f=f||N;const n=`${s.name}（${TN[s.t]}）`;
  if(s.t==='rect')return `${n}看底：<b>${f(s.b)}</b>`;
  if(s.t==='sq')return `${n}的边长就是高，相当于底是 <b>${f(s.b)}</b>`;
  if(s.t==='para')return `${n}看底：<b>${f(s.b)}</b>`+(s.ls?`（斜边 ${s.ls} 用不上）`:'');
  if(s.t==='tri')return `${n}看底的一半：${f(s.b)} ÷ 2 = <b>${f(s.b/2)}</b>`;
  return `${n}看上底加下底的一半：(${f(s.a)} + ${f(s.b)}) ÷ 2 = <b>${f(eff(s))}</b>`;}
const list=(sh,f)=>`<ul>${sh.map(s=>`<li>${say(s,f)}</li>`).join('')}</ul>`;
const KEYLINE='<p>高相同，不用乘出面积，只比“底”这一部分。</p>';

function mk(t,w,h,step){step=step||0.1;
  const r=(lo,hi)=>Math.round((lo+Math.random()*(hi-lo))/step)*step;
  if(t==='rect')return {t,a:w,b:w,off:0};
  if(t==='sq')return {t,a:h,b:h,off:0};
  if(t==='para')return {t,a:w,b:w,off:pick([1,1.5,2,-1.5])};
  if(t==='tri')return {t,a:0,b:2*w,off:r(0.2*w,1.8*w)};
  let a=r(0.3*w,0.8*w);if(a<step)a=step;if(a>w-step)a=w-step;const b=2*w-a;return {t,a,b,off:r(0,b-a)};}

function numOpts(c,ds,suf){suf=suf||'';const set=[c];
  ds.forEach(d=>{if(d>0&&!set.some(x=>same(x,d)))set.push(d);});
  let k=1;while(set.length<4){const d=c+k;if(!set.some(x=>same(x,d)))set.push(d);k++;}
  return shuffle(set.slice(0,4)).map(v=>({k:N(v),text:N(v)+suf}));}

const CMP=[{k:'L',text:'甲大'},{k:'R',text:'乙大'},{k:'E',text:'一样大'}];
const CMP4=CMP.concat([{k:'U',text:'条件不够，无法确定'}]);
function tag(shapes){shapes.forEach((s,i)=>{s.name=NAMES[i];s.c=s.c==null?i:s.c;});return shapes;}
const verdict=sh=>{const d=eff(sh[0])-eff(sh[1]);return same(d,0)?'E':d>0?'L':'R';};
const concl=a=>a==='E'?'两个数相等，面积一样大。':`${a==='L'?'甲':'乙'}的数大，面积就大。`;
const asc=sh=>sh.map((s,i)=>i).sort((i,j)=>eff(sh[i])-eff(sh[j]));
function distinct(n,gen,ban){const ws=[];let g=0;while(ws.length<n&&g++<999){const w=gen();if(!(ban||[]).some(x=>same(x,w))&&!ws.some(x=>same(x,w)))ws.push(w);}return ws;}

/* ---------- 画图 ---------- */
function draw(sc,o){o=o||{};
  const h=sc.h,n=sc.shapes.length,card=!!o.card,L=card?14:(sc.hLabel?92:24),gap=44;
  let Rm=card?14:22;if(card&&sc.shapes[0].ls)Rm+=26;
  const ext=sc.shapes.map(s=>extOf(s,h));
  const sum=ext.reduce((t,e)=>t+e[1]-e[0],0);
  let W=o.W||600,u;
  if(card){u=o.u;W=L+Rm+sum*u;}else u=Math.min((W-L-Rm-gap*(n-1))/sum,210/h,46);
  const top=40,VH=top+h*u+(card?36:72);
  let x0=L+(W-L-Rm-(sum*u+gap*(n-1)))/2;
  const Y=y=>top+(h-y)*u;
  let g='',fill='',lab='';
  sc.shapes.forEach((s,i)=>{
    const ox=x0-ext[i][0]*u,X=x=>ox+x*u;
    const P=a=>a.map(p=>X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1)).join(' ');
    if(sc.grid){const k0=Math.floor(ext[i][0])-1,k1=Math.ceil(ext[i][1])+1;
      for(let k=k0;k<=k1;k++)g+=`<line class="gridT" x1="${X(k)}" y1="${Y(h)}" x2="${X(k)}" y2="${Y(0)}"/>`;
      for(let j=1;j<h;j++)g+=`<line class="gridT" x1="${X(k0)}" y1="${Y(j)}" x2="${X(k1)}" y2="${Y(j)}"/>`;}
    if(s.ghost)fill+=`<polygon class="gh" points="${P(s.ghost)}"/>`;
    if(s.cut){const b=s.b,f=s.off;
      fill+=`<polygon class="pc c${s.c}" points="${P([[f,0],[b,0],[b+f,h],[f,h]])}"/>`;
      fill+=`<polygon class="pc mv c${s.c}" style="--dx:${(b*u).toFixed(1)}px" points="${P([[0,0],[f,0],[f,h]])}"/>`;
      fill+=`<polygon class="ol" points="${P(P4(s,h))}"/>`;
      if(s.cut.seam)lab+=`<line class="seam" x1="${X(f)}" y1="${Y(0)}" x2="${X(f)}" y2="${Y(h)}"/>`;
    }else fill+=`<polygon class="sh c${s.c}" points="${P(P4(s,h))}"/>`;
    (s.lines||[]).forEach(l=>{lab+=`<line class="seam" x1="${X(l[0])}" y1="${Y(l[1])}" x2="${X(l[2])}" y2="${Y(l[3])}"/>`;});
    const lb=s.hideB?'（没标）':(s.lb!=null?s.lb:N(s.b));
    lab+=`<text class="lb${lb==='?'||lb==='x'?' q':''}${s.hideB?' m':''}" text-anchor="middle" x="${X(s.b/2)}" y="${Y(0)+27}">${lb}</text>`;
    if(s.t==='trap'){const la=s.hideA?'（没标）':(s.la!=null?s.la:N(s.a));lab+=`<text class="lb${la==='?'||la==='x'?' q':''}${s.hideA?' m':''}" text-anchor="middle" x="${X(s.off+s.a/2)}" y="${Y(h)-11}">${la}</text>`;}
    if(s.ls)lab+=`<text class="lb m" x="${X((s.b+s.off+s.a)/2)+9}" y="${Y(h/2)+6}">${s.ls}</text>`;
    if(!card)lab+=`<text class="nm" text-anchor="middle" x="${X((ext[i][0]+ext[i][1])/2)}" y="${Y(0)+60}">${s.name}</text>`;
    x0+=(ext[i][1]-ext[i][0])*u+gap;
  });
  let hl='';
  if(sc.hLabel&&!card){const x=L-26,y1=Y(h)+5,y2=Y(0)-5,m=(y1+y2)/2;
    hl+=`<path class="dim" d="M${x} ${y1}V${y2}M${x-6} ${y1+9}L${x} ${y1}L${x+6} ${y1+9}M${x-6} ${y2-9}L${x} ${y2}L${x+6} ${y2-9}"/>`;
    sc.hLabel.forEach((t,j)=>{hl+=`<text class="hl" text-anchor="end" x="${x-10}" y="${m+7+(j-(sc.hLabel.length-1)/2)*22}">${t}</text>`;});}
  const rx1=card?6:L-12,rx2=W-(card?6:10);
  const rails=`<line class="railL" x1="${rx1}" y1="${Y(h)}" x2="${rx2}" y2="${Y(h)}"/><line class="railL" x1="${rx1}" y1="${Y(0)}" x2="${rx2}" y2="${Y(0)}"/>`;
  const size=card?` width="${Math.round(W)}" height="${Math.round(VH)}"`:'';
  return `<svg class="${card?'':'fig'}" viewBox="0 0 ${W.toFixed(0)} ${VH.toFixed(0)}"${size} role="img" aria-label="夹在两条平行线之间的图形">${fill}${g}${rails}${lab}${hl}</svg>`;}

