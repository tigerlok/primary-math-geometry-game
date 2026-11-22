// 阶段 1：不算也能比（1-1 至 1-4）
/* ---------- 通用：一对、几倍、三图、找等积 ---------- */
function pair(h,step,noSq,form){
  let ts=shuffle(T4).slice(0,2);if(!noSq&&Math.random()<0.2)ts=shuffle(['sq',pick(T4)]);
  const q=1/step,rnd=(lo,hi)=>R(Math.round(lo*q),Math.round(hi*q))/q;
  let w0=ts.includes('sq')?h:rnd(2,4.2),w1=w0;
  if(form==='ne'){do{w1=w0+pick([-1,1])*rnd(step<0.5?0.2:0.5,1.5);}while(w1<1.5);}
  const ws=ts[0]==='sq'?[w0,w1]:ts[1]==='sq'?[w1,w0]:(Math.random()<0.5?[w0,w1]:[w1,w0]);
  return tag([mk(ts[0],ws[0],h,step),mk(ts[1],ws[1],h,step)]);}
function ratioQ(h,hTxt,hLabel,form){const k=pick([2,3,1.5]),ws=k===1.5?2:pick([1.5,2,2.5]),wb=k*ws;
  const big=mk(pick(['rect','para']),wb,h,0.5),small=mk(pick(['tri','trap','rect']),ws,h,0.5);
  const sh=tag(shuffle([big,small])),B=sh.find(s=>s===big),S=sh.find(s=>s===small);
  return {form,kind:'choice',scene:{h,hLabel,shapes:sh},meta:{type:'ratio'},ans:N(k),
    prompt:`${hTxt}面积大的是面积小的几倍？`,options:numOpts(k,[1.5,2,3,4],' 倍'),
    explain:`<p>高相同，面积的倍数就是“底”这一部分的倍数。</p>${list(sh)}<p>${N(eff(B))} ÷ ${N(eff(S))} = <b>${N(k)}</b> 倍。</p>`};}
function threeQ(h,step,hTxt,form){const q=1/step,ts=shuffle(T4).slice(0,3);
  const ws=distinct(3,()=>R(Math.round(1.5*q),Math.round(3.5*q))/q);
  const sh=tag(ts.map((t,i)=>mk(t,ws[i],h,step))),ord=asc(sh);
  return {form,kind:'order',h,shapes:sh,ans:ord,meta:{type:'order'},
    prompt:`${hTxt}按面积从小到大，依次点一点。`,
    explain:`${KEYLINE}${list(sh)}<p>从小到大：<b>${ord.map(i=>sh[i].name).join(' ＜ ')}</b></p>`};}
function pairfindQ(h,step,hTxt,form){const q=1/step,p=R(Math.round(2*q),Math.round(3.5*q))/q,d=()=>R(1,Math.round(q))/q;
  const ws=shuffle([p,p,p+d(),Math.max(1,p-d())]),sh=tag(shuffle(T4).map((t,i)=>mk(t,ws[i],h,step)));
  const ans=sh.map((s,i)=>i).filter(i=>same(eff(sh[i]),p));
  return {form,kind:'pick',need:2,h,shapes:sh,ans,meta:{type:'eqpair'},
    prompt:`${hTxt}其中有两个面积相等，把它们点出来。`,
    explain:`${KEYLINE}${list(sh)}<p>相等的是 <b>${ans.map(i=>sh[i].name).join(' 和 ')}</b>。</p>`};}

/* ---------- 1-1 两两比较 ---------- */
const F11=['eq','eq','ne','ne','ne','diff','ratio','three','pairfind','biggest'];
const UGLY=[2.3,2.7,3.4,3.7,4.3,4.6];
function g11(form){form=form||pick(F11);const h=pick(UGLY),hT=`图形的高都是 ${N(h)}。`;
  if(form==='ratio')return ratioQ(h,hT,['高',N(h)],form);
  if(form==='three')return threeQ(h,0.1,hT,form);
  if(form==='pairfind')return pairfindQ(h,0.1,`四个${hT}`,form);
  if(form==='biggest'){const q=threeQ(h,0.1,hT,form);const top=q.ans[2];
    return Object.assign(q,{kind:'pick',need:1,ans:[top],meta:{type:'kth',k:1},prompt:`${hT}面积最大的是哪一个？点出来。`,
      explain:`${KEYLINE}${list(q.shapes)}<p>最大的是 <b>${q.shapes[top].name}</b>。</p>`});}
  if(form==='diff'){const hh=R(2,5);let sh;do{sh=pair(hh,0.5,true,'ne');}while(false);
    const d=Math.abs(eff(sh[0])-eff(sh[1]));
    return {form,kind:'num',scene:{h:hh,hLabel:['高',N(hh)],shapes:sh},ans:d*hh,meta:{type:'diff'},
      prompt:`甲和乙的高都是 ${hh}。面积大的比面积小的大多少？`,
      explain:`<p>不用分别算两个面积。高相同，面积的差 = “底”这一部分的差 × 高。</p>${list(sh)}<p>差是 ${N(d)}，${N(d)} × ${hh} = <b>${N(d*hh)}</b>。</p>`};}
  const sh=pair(h,0.1,false,form),ans=verdict(sh);
  return {form,kind:'choice',scene:{h,hLabel:['高',N(h)],shapes:sh},meta:{type:'cmp'},
    prompt:`甲和乙的高都是 ${N(h)}。谁的面积大？`,options:CMP,ans,
    explain:`${KEYLINE}${list(sh)}<p>${concl(ans)}</p>`};}

/* ---------- 1-2 多图排序 ---------- */
const F12=['asc5','desc5','asc4','asc3','maxmin','kth2','tiepair'];
function g12(form){form=form||pick(F12);
  const h=pick([3,4,3.5]),po={3:[4,'5'],4:[3,'5'],3.5:[1.2,'3.7']}[h];
  const n=form==='asc4'?4:form==='asc3'?3:5,tie=form==='tiepair';
  const ws=distinct(4,()=>R(6,13)/4,[h]);if(tie)ws[pick([1,2,3])]=ws[0];
  const build={rect:w=>({t:'rect',a:w,b:w,off:0}),para:w=>({t:'para',a:w,b:w,off:po[0],ls:po[1]}),
    tri:w=>({t:'tri',a:0,b:2*w,off:R(0,Math.round(4*w))/2}),
    trap:w=>{const a=0.5*R(1,Math.ceil(2*w)-1),b=2*w-a;return {t:'trap',a,b,off:R(0,Math.round((b-a)*2))/2};}};
  let ss=shuffle(T4).map((t,i)=>build[t](ws[i]));
  if(n===5)ss.push({t:'sq',a:h,b:h,off:0});else if(n===3)ss=ss.slice(0,3);
  const sh=tag(shuffle(ss)),useF=Math.random()<0.6;
  sh.forEach(s=>{const f=useF&&Math.random()<0.6?NF:N;s.lb=f(s.b);if(s.t==='trap')s.la=f(s.a);});
  const ord=asc(sh),hT=`${['','','','三','四','五'][n]}个图形的高都是 ${NF(h)}。`,L=`${KEYLINE}${list(sh,NF)}`,nm=i=>sh[i].name;
  const base={form,h,shapes:sh,cols:true};
  if(tie){const v=ws[0],ans=sh.map((s,i)=>i).filter(i=>same(eff(sh[i]),v));
    return Object.assign(base,{kind:'pick',need:2,ans,meta:{type:'eqpair'},prompt:`${hT}其中有两个面积相等，把它们点出来。`,explain:`${L}<p>相等的是 <b>${ans.map(nm).join(' 和 ')}</b>。</p>`});}
  if(form==='maxmin')return Object.assign(base,{kind:'order',need:2,ans:[ord[n-1],ord[0]],meta:{type:'maxmin'},prompt:`${hT}先点面积最大的，再点面积最小的。`,explain:`${L}<p>最大的是 <b>${nm(ord[n-1])}</b>，最小的是 <b>${nm(ord[0])}</b>。</p>`});
  if(form==='kth2')return Object.assign(base,{kind:'pick',need:1,ans:[ord[n-2]],meta:{type:'kth',k:2},prompt:`${hT}面积第二大的是哪一个？点出来。`,explain:`${L}<p>从大到小：${ord.slice().reverse().map(nm).join(' ＞ ')}。第二大的是 <b>${nm(ord[n-2])}</b>。</p>`});
  if(form==='desc5'){const d=ord.slice().reverse();return Object.assign(base,{kind:'order',ans:d,meta:{type:'order',desc:true},prompt:`${hT}按面积从大到小，依次点一点。`,explain:`${L}<p>从大到小：<b>${d.map(nm).join(' ＞ ')}</b></p>`});}
  return Object.assign(base,{kind:'order',ans:ord,meta:{type:'order'},prompt:`${hT}按面积从小到大，依次点一点。`,explain:`${L}<p>从小到大：<b>${ord.map(nm).join(' ＜ ')}</b></p>`});}

/* ---------- 1-3 倒推底边 ---------- */
const F13=['tri=rp','rp=tri','trapB=rp','trapA=rp','tri=trap','trapB=tri','sq=tri','x2tri','x2rp'];
function g13(form){form=form||pick(F13);
  const h=pick([3,4,2.5,3.6]),hf=()=>R(4,10)/2,rp=()=>pick(['rect','para']);
  const mkrp=(t,p)=>t==='rect'?{t,a:p,b:p,off:0}:{t,a:p,b:p,off:1.5};
  let A,B,ans,what,why,k=1;
  if(form==='tri=rp'){const p=hf(),t=rp();A=mkrp(t,p);ans=2*p;B={t:'tri',a:0,b:ans,off:R(1,3),lb:'?'};what='底';
    why=`三角形的面积要 ÷ 2，想和底 ${N(p)} 的${TN[t]}相等，底必须是它的 2 倍：${N(p)} × 2 = <b>${N(ans)}</b>。`;}
  else if(form==='rp=tri'){const tb=R(4,10),t=rp();A={t:'tri',a:0,b:tb,off:R(1,3)};ans=tb/2;B=mkrp(t,ans);B.lb='?';what='底';
    why=`三角形相当于底只算一半：${tb} ÷ 2 = <b>${N(ans)}</b>。${TN[t]}的底就是这个数。`;}
  else if(form==='trapB=rp'){const a=R(2,6)/2,p=a+R(2,5)/2,t=rp();A=mkrp(t,p);ans=2*p-a;B={t:'trap',a,b:ans,off:0.5,lb:'?'};what='下底';
    why=`梯形的（上底 + 下底）÷ 2 要等于 ${N(p)}，所以上底 + 下底 = ${N(2*p)}。下底 = ${N(2*p)} − ${N(a)} = <b>${N(ans)}</b>。`;}
  else if(form==='trapA=rp'){const b=R(8,14)/2;let p;do{p=R(Math.round(b)+1,Math.round(2*b)-1)/2;}while(p<=b/2||p>=b);const t=rp();A=mkrp(t,p);ans=2*p-b;B={t:'trap',a:ans,b,off:0.5,la:'?'};what='上底';
    why=`梯形的（上底 + 下底）÷ 2 要等于 ${N(p)}，所以上底 + 下底 = ${N(2*p)}。上底 = ${N(2*p)} − ${N(b)} = <b>${N(ans)}</b>。`;}
  else if(form==='tri=trap'){const a=R(2,6)/2,b=a+R(2,6)/2;A={t:'trap',a,b,off:0.5};ans=a+b;B={t:'tri',a:0,b:ans,off:R(1,3),lb:'?'};what='底';
    why=`梯形是（上底 + 下底）× 高 ÷ 2，三角形是底 × 高 ÷ 2。高相同，所以三角形的底 = 上底 + 下底 = ${N(a)} + ${N(b)} = <b>${N(ans)}</b>。`;}
  else if(form==='trapB=tri'){const a=R(2,6)/2,tb=2*a+R(1,6)/2;A={t:'tri',a:0,b:tb,off:R(1,3)};ans=tb-a;B={t:'trap',a,b:ans,off:0.5,lb:'?'};what='下底';
    why=`高相同，梯形的上底 + 下底要等于三角形的底 ${N(tb)}。下底 = ${N(tb)} − ${N(a)} = <b>${N(ans)}</b>。`;}
  else if(form==='sq=tri'){A={t:'sq',a:h,b:h,off:0};ans=2*h;B={t:'tri',a:0,b:ans,off:R(1,3),lb:'?'};what='底';
    why=`正方形的边长等于高，是 ${N(h)}，相当于底 ${N(h)} 的矩形。三角形的底要是它的 2 倍：${N(h)} × 2 = <b>${N(ans)}</b>。`;}
  else if(form==='x2tri'){const p=pick([2,2.5,3]),t=rp();A=mkrp(t,p);ans=4*p;B={t:'tri',a:0,b:ans,off:R(1,4),lb:'?'};what='底';k=2;
    why=`和甲相等需要底 ${N(p)} × 2 = ${N(2*p)}；要达到甲的 2 倍，底再乘 2：${N(2*p)} × 2 = <b>${N(ans)}</b>。`;}
  else{const tb=R(4,8),t=rp();A={t:'tri',a:0,b:tb,off:R(1,3)};ans=tb;B=mkrp(t,ans);B.lb='?';what='底';k=2;
    why=`三角形相当于底 ${tb} ÷ 2 = ${N(tb/2)} 的矩形。乙要是它的 2 倍，底 = ${N(tb/2)} × 2 = <b>${N(ans)}</b>，正好和三角形的底一样长。`;}
  return {form,kind:'num',scene:{h,hLabel:['高',N(h)],shapes:tag([A,B])},ans,meta:{type:'inv',factor:k},
    prompt:`甲和乙的高都是 ${N(h)}，${k===1?'面积也相等':'乙的面积是甲的 2 倍'}。乙的${what}是多少？`,explain:`<p>${why}</p>`};}

/* ---------- 1-4 不知道高 ---------- */
const F14=['eq','ne','ne','miss','mtU','mtSure','extra','three','ratio','diffH'];
function g14(form){form=form||pick(F14);const HL=['高相等','没给数'],hT='图形的高相等，但没有告诉你高是多少。';
  const PR='甲和乙的高相等，但没有告诉你高是多少。只根据标出的数判断：谁的面积大？';
  const lead='<p>高虽然不知道是多少，但两个图形的高一样，谁大只由“底”这一部分决定。</p>';
  if(form==='three')return threeQ(4,0.5,hT,form);
  if(form==='ratio')return ratioQ(4,hT,HL,form);
  if(form==='mtU'||form==='mtSure'){const b=R(4,7),a=R(1,2),p=form==='mtU'?b/2+pick([0.5,1,1.5]):Math.max(1,b/2-pick([0,0.5,1]));
    const T={t:'trap',a,b,off:R(0,b-a),hideA:true},Rr={t:'rect',a:p,b:p,off:0},sh=tag(Math.random()<0.5?[T,Rr]:[Rr,T]);
    const ans=form==='mtU'?'U':(sh[0]===T?'L':'R');
    return {form,kind:'choice',scene:{h:4,hLabel:HL,shapes:sh},meta:{type:form==='mtU'?'text':'cmp'},prompt:PR,options:CMP4,ans,
      explain:form==='mtU'?`<p>${T.name}的上底没有标。上底很短时，它的“底”这一部分只比 ${b} ÷ 2 = ${N(b/2)} 多一点，比矩形的 ${N(p)} 小；上底够长时又会超过 ${N(p)}。两种都可能，所以无法确定。</p>`
        :`<p>${T.name}的上底没有标，但这次不影响结论。就算上底短到快没有了，它的“底”这一部分也比 ${b} ÷ 2 = ${N(b/2)} 大，而矩形只有 ${N(p)}。所以${T.name}一定大。</p>`};}
  if(form==='diffH'){let sh,d;do{sh=pair(4,0.5,true,'ne');d=Math.abs(eff(sh[0])-eff(sh[1]));}while(same(d,Math.abs(sh[0].b-sh[1].b)));
    const bd=Math.abs(sh[0].b-sh[1].b),alt=bd>0?bd:2*d;
    return {form,kind:'choice',long:true,scene:{h:4,hLabel:HL,shapes:sh},meta:{type:'diffH',d},ans:'a',
      prompt:'甲和乙的高相等，但没有告诉你高是多少。面积大的比面积小的大多少？',
      options:shuffle([{k:'a',text:`${N(d)} × 高`},{k:'b',text:`${N(d)}`},{k:'c',text:`${N(alt)} × 高`},{k:'d',text:'条件不够，什么也说不出来'}]),
      explain:`${list(sh)}<p>“底”这一部分相差 ${N(d)}。每一份高都多出这么多，所以面积相差 <b>${N(d)} × 高</b>。高不知道，结果就写成一个式子，不必是一个数。</p>`};}
  const sh=pair(4,0.5,true,form==='ne'?'ne':form==='eq'?'eq':pick(['eq','ne']));let ans=verdict(sh),ex;
  if(form==='extra'){const s=sh.find(x=>x.t==='para')||sh.find(x=>x.t==='tri')||sh[0];s.ls=pick(['5','6','7']);if(s.t!=='para')s.ls=null;
    if(!sh.some(x=>x.ls)){const i=sh[0].t==='trap'?1:0,w=eff(sh[i]);sh[i]=Object.assign(mk('para',w,4,0.5),{name:sh[i].name,c:sh[i].c,ls:pick(['5','6','7'])});ans=verdict(sh);}}
  if(form==='miss'){const s=pick(sh.filter(x=>x.t!=='trap'));s.hideB=true;ans='U';
    ex=`<p>${s.name}的底没有标出来。高相等时面积由底决定，底不知道，就无法比较。不能凭眼睛估计。</p>`;}
  else ex=`${lead}${list(sh)}<p>${concl(ans)}</p>`;
  return {form,kind:'choice',scene:{h:4,hLabel:HL,shapes:sh},meta:{type:ans==='U'?'text':'cmp'},prompt:PR,options:CMP4,ans,explain:ex};}

