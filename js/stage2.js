// 阶段 2：用字母说话（2-1 至 2-7），含拼式子的识别
/* ================= 阶段 2：字母作为任意数 ================= */
const E0={a:2,b:3,c:3,h:4},HL2=['高','h'];
const ka=(k,v)=>(same(k,1)?'':N(k))+(v||'a');
const sR=(w,lb)=>({t:'rect',a:w,b:w,off:0,lb});
const sP=(w,lb)=>({t:'para',a:w,b:w,off:1.2,lb});
const sT=(w,lb)=>({t:'tri',a:0,b:w,off:w*0.35,lb});
const sZ=(a,b,la,lb)=>({t:'trap',a,b,off:(b-a)*0.3,la,lb});
const NOTE='字母可以代表任何数，图只画了其中一种情况。';
function Q2(o){o.env0=Object.assign({},E0,o.env0||{});if(o.fix)o.fix(o.env0);const sh=tag(o.geo(o.env0));
  if(o.cards){o.h=o.env0.h;o.shapes=sh;}else o.scene={h:o.env0.h,hLabel:HL2,shapes:sh};o.note=NOTE;return o;}
function exprOpts(cands){const out=[],tv={a:1.37,b:2.91,c:4.13,h:1.73,x:0.77};
  cands.forEach(c=>{if(out.length<4&&!out.some(o=>o.text===c.text||same(o.fn(tv),c.fn(tv))))out.push(c);});
  return shuffle(out.map((c,i)=>({k:i?'w'+i:'ok',text:c.text,fn:c.fn})));}
function parseExpr(s){const tk=s.match(/\d+(?:\.\d+)?|[abchx]|[+−×÷()]/g)||[];if(!s||tk.join('')!==s)return null;let i=0;
  const fac=()=>{const t=tk[i];if(t==null)return null;if(t==='('){i++;const e=exp();if(!e||tk[i]!==')')return null;i++;return e;}
    if(/^\d/.test(t)){i++;const n=parseFloat(t);return ()=>n;}if(/^[abchx]$/.test(t)){i++;return v=>v[t];}return null;};
  const term=()=>{let f=fac();if(!f)return null;for(;;){const t=tk[i];
    if(t==='×'||t==='÷'){i++;const g=fac();if(!g)return null;const p=f;f=t==='×'?v=>p(v)*g(v):v=>p(v)/g(v);}
    else if(t!=null&&(t==='('||/^[abchx\d]/.test(t))){const g=fac();if(!g)return null;const p=f;f=v=>p(v)*g(v);}
    else return f;}};
  function exp(){let f=term();if(!f)return null;for(;;){const t=tk[i];if(t==='+'||t==='−'){i++;const g=term();if(!g)return null;const p=f;f=t==='+'?v=>p(v)+g(v):v=>p(v)-g(v);}else return f;}}
  const e=exp();return e&&i===tk.length?e:null;}
function equiv(f,t){for(let k=0;k<6;k++){const v={a:0.61+1.13*k,b:5.47-0.71*k,c:2.03+0.59*k,h:1.31+0.43*k,x:3.77-0.37*k};
  const x=f(v),y=t(v);if(!isFinite(x)||Math.abs(x-y)>1e-6*(1+Math.abs(y)))return false;}return true;}

function shA(t,e){
  if(t==='rect')return {t,e,geo:v=>sR(e*v.a,ka(e)),line:n=>`${n}（矩形）看底：<b>${ka(e)}</b>`};
  if(t==='para')return {t,e,geo:v=>sP(e*v.a,ka(e)),line:n=>`${n}（平行四边形）看底：<b>${ka(e)}</b>`};
  if(t==='tri')return {t,e,geo:v=>sT(2*e*v.a,ka(2*e)),line:n=>`${n}（三角形）看底的一半：${ka(2*e)} ÷ 2 = <b>${ka(e)}</b>`};
  const k1=2*e>=3?pick(2*e>=5?[1,2]:[1]):0.5,k2=2*e-k1;
  return {t,e,geo:v=>sZ(k1*v.a,k2*v.a,ka(k1),ka(k2)),line:n=>`${n}（梯形）看上底加下底的一半：(${ka(k1)} + ${ka(k2)}) ÷ 2 = <b>${ka(e)}</b>`};}
const EA={rect:[1,1.5,2,2.5],para:[1,1.5,2,2.5],tri:[0.5,1,1.5,2,2.5],trap:[1,1.5,2,2.5]};
const randA=t=>{t=t||pick(T4);return shA(t,pick(EA[t]));};
function pairA(mode){const ts=shuffle(T4).slice(0,2);let A,B,g=0;
  do{A=randA(ts[0]);B=mode==='eq'?shA(ts[1],A.e>=1?A.e:1):randA(ts[1]);if(mode==='eq'&&A.e<1)A=shA(ts[0],1);}while(g++<99&&((mode==='ne'&&same(A.e,B.e))));
  return [A,B];}
const linesA=arr=>`<ul>${arr.map((s,i)=>`<li>${s.line(NAMES[i])}</li>`).join('')}</ul>`;
const EA0={a:1.6};

/* ---------- 2-1 高是字母 ---------- */
const F21=['area','pickexpr','cmp','diff','sum'];
function numShape(){const t=pick(T4);if(t==='rect')return sR(R(2,6));if(t==='para')return sP(R(2,6));if(t==='tri')return sT(R(3,9));const a=R(1,3);return sZ(a,a+R(1,4));}
function how21(s){const e=eff(s);if(s.t==='rect'||s.t==='para')return `底 ${N(s.b)} × 高 h = <b>${N(e)}h</b>`;
  if(s.t==='tri')return `底 ${N(s.b)} × 高 h ÷ 2 = <b>${N(e)}h</b>`;return `(${N(s.a)} + ${N(s.b)}) × h ÷ 2 = <b>${N(e)}h</b>`;}
function g21(form){form=form||pick(F21);const cp=a=>()=>a.map(s=>Object.assign({},s));
  if(form==='area'||form==='pickexpr'){const s0=numShape(),e=eff(s0);
    const q=Q2({form,geo:cp([s0]),meta:{type:'area0'},target:v=>e*v.h,ansText:`${N(e)}h`});
    q.explain=`<p>高不知道是多少，就用 h 代替，照样套公式：${how21(s0)}。</p><p>h 是几，面积就是它的 ${N(e)} 倍。</p>`;
    if(form==='area')return Object.assign(q,{kind:'expr',tiles:['h'],prompt:`这个${TN[s0.t]}的高是 h。用含 h 的式子表示它的面积。`});
    return Object.assign(q,{kind:'choice',ans:'ok',prompt:`这个${TN[s0.t]}的高是 h。哪个式子表示它的面积？`,
      options:exprOpts([{text:`${N(e)}h`,fn:v=>e*v.h},{text:`${N(2*e)}h`,fn:v=>2*e*v.h},{text:`${N(e)} + h`,fn:v=>e+v.h},{text:`${N(e/2)}h`,fn:v=>e/2*v.h},{text:`${N(e+1)}h`,fn:v=>(e+1)*v.h},{text:`${N(e)}`,fn:v=>e}])});}
  const sh=pair(4,0.5,true,form==='cmp'?pick(['eq','ne','ne']):'ne'),e0=eff(sh[0]),e1=eff(sh[1]);
  const q=Q2({form,geo:cp(sh)}),L=list(q.scene.shapes);
  if(form==='cmp'){const ans=verdict(sh);return Object.assign(q,{kind:'choice',meta:{type:'cmp'},options:CMP,ans,prompt:'甲和乙的高都是 h。谁的面积大？',
    explain:`<p>两个面积分别是 ${N(e0)}h 和 ${N(e1)}h。h 是同一个数，所以只比 h 前面的数。</p>${L}<p>${concl(ans)}</p>`});}
  if(form==='diff'){const d=Math.abs(e0-e1);return Object.assign(q,{kind:'expr',tiles:['h'],meta:{type:'diff'},target:v=>d*v.h,ansText:`${N(d)}h`,
    prompt:'甲和乙的高都是 h。面积大的比面积小的大多少？用含 h 的式子表示。',
    explain:`<p>两个面积分别是 ${N(e0)}h 和 ${N(e1)}h。</p><p>相减：${N(Math.max(e0,e1))}h − ${N(Math.min(e0,e1))}h = <b>${N(d)}h</b>。</p>`});}
  return Object.assign(q,{kind:'expr',tiles:['h'],meta:{type:'sum'},target:v=>(e0+e1)*v.h,ansText:`${N(e0+e1)}h`,
    prompt:'甲和乙的高都是 h。两个图形的面积一共是多少？用含 h 的式子表示。',
    explain:`<p>两个面积分别是 ${N(e0)}h 和 ${N(e1)}h。</p><p>相加：${N(e0)}h + ${N(e1)}h = <b>${N(e0+e1)}h</b>。</p>`});}

/* ---------- 2-2 底用同一个字母 ---------- */
const F22=['area','pickexpr','cmp','diff','ratio','eqfind'];
function g22(form){form=form||pick(F22);
  if(form==='area'||form==='pickexpr'){const A=randA(),e=A.e;
    const q=Q2({form,env0:EA0,geo:v=>[A.geo(v)],meta:{type:'area0'},target:v=>e*v.a*v.h,ansText:`${ka(e)}h`,
      explain:`<ul><li>${A.line('甲')}</li></ul><p>再乘高 h，面积是 <b>${ka(e)}h</b>。a 和 h 都不知道，式子照样能写出来。</p>`});
    if(form==='area')return Object.assign(q,{kind:'expr',tiles:['a','h'],prompt:`这个${TN[A.t]}的高是 h，底用 a 表示。用含 a 和 h 的式子表示它的面积。`});
    return Object.assign(q,{kind:'choice',ans:'ok',prompt:`这个${TN[A.t]}的高是 h，底用 a 表示。哪个式子表示它的面积？`,
      options:exprOpts([{text:`${ka(e)}h`,fn:v=>e*v.a*v.h},{text:`${ka(2*e)}h`,fn:v=>2*e*v.a*v.h},{text:`${ka(e)} + h`,fn:v=>e*v.a+v.h},{text:`${ka(e/2)}h`,fn:v=>e/2*v.a*v.h},{text:`${ka(e+1)}h`,fn:v=>(e+1)*v.a*v.h}])});}
  if(form==='eqfind'){const p=pick([1.5,2]),es=shuffle([p,p,p+0.5,p-0.5]),S=shuffle(T4).map((t,i)=>shA(t,es[i]));
    const ans=S.map((s,i)=>i).filter(i=>same(S[i].e,p));
    return Q2({form,cards:true,env0:{a:1.3},kind:'pick',need:2,geo:v=>S.map(s=>s.geo(v)),ans,meta:{type:'eqpair'},
      prompt:'四个图形的高都是 h，底都用 a 表示。其中有两个面积相等，把它们点出来。',
      explain:`<p>高相同，只比“底”这一部分，结果都是 a 的几倍：</p>${linesA(S)}<p>相等的是 <b>${ans.map(i=>NAMES[i]).join(' 和 ')}</b>。不管 a 是多少，它们都相等。</p>`});}
  let A,B,g=0;
  do{[A,B]=pairA(form==='cmp'?pick(['eq','ne','ne']):'ne');}while(g++<200&&form==='ratio'&&![1.5,2,2.5,3,4,5].some(r=>same(r,Math.max(A.e,B.e)/Math.min(A.e,B.e))));
  const q=Q2({form,env0:EA0,geo:v=>[A.geo(v),B.geo(v)]}),L=linesA([A,B]),hi=Math.max(A.e,B.e),lo=Math.min(A.e,B.e);
  if(form==='cmp'){const ans=same(A.e,B.e)?'E':A.e>B.e?'L':'R';return Object.assign(q,{kind:'choice',meta:{type:'cmp'},options:CMP4,ans,
    prompt:'甲和乙的高都是 h，底都用 a 表示。谁的面积大？',
    explain:`${L}<p>${ans==='E'?'两边都是同样多的 a，不管 a 是多少，面积都相等。':`${ka(hi)} 一定比 ${ka(lo)} 大，不管 a 是多少。${ans==='L'?'甲':'乙'}大。`}</p>`});}
  if(form==='diff'){const d=hi-lo;return Object.assign(q,{kind:'expr',tiles:['a','h'],meta:{type:'diff'},target:v=>d*v.a*v.h,ansText:`${ka(d)}h`,
    prompt:'甲和乙的高都是 h，底都用 a 表示。面积大的比面积小的大多少？用式子表示。',
    explain:`${L}<p>“底”这一部分相差 ${ka(hi)} − ${ka(lo)} = ${ka(d)}，再乘高 h：<b>${ka(d)}h</b>。</p>`});}
  const k=hi/lo;return Object.assign(q,{kind:'choice',meta:{type:'ratio'},ans:N(k),options:numOpts(k,[1.5,2,3,4],' 倍'),
    prompt:'甲和乙的高都是 h，底都用 a 表示。面积大的是面积小的几倍？',
    explain:`${L}<p>${ka(hi)} ÷ ${ka(lo)} = <b>${N(k)}</b> 倍。a 被约掉了，所以不管 a 是多少，倍数都一样。</p>`});}

/* ---------- 2-3 两个字母 ---------- */
const F23=['area2','cond','given','diffab','sumab'];
function g23(form){form=form||pick(F23);
  if(form==='area2'){const c=pick([
    {t:'trap',geo:v=>[sZ(v.a,v.b,'a','b')],f:v=>(v.a+v.b)*v.h/2,tx:'(a+b)h÷2',how:'（上底 + 下底）× 高 ÷ 2 = (a + b) × h ÷ 2'},
    {t:'tri',geo:v=>[sT(v.b,'b')],f:v=>v.b*v.h/2,tx:'bh÷2',how:'底 × 高 ÷ 2 = b × h ÷ 2'},
    {t:'rect',geo:v=>[sR(v.a,'a')],f:v=>v.a*v.h,tx:'ah',how:'底 × 高 = a × h'},
    {t:'para',geo:v=>[sP(v.b,'b')],f:v=>v.b*v.h,tx:'bh',how:'底 × 高 = b × h'}]);
    return Q2({form,kind:'expr',tiles:['a','b','h'],geo:c.geo,meta:{type:'area0'},target:c.f,ansText:c.tx,
      prompt:`这个${TN[c.t]}的高是 h，其他长度标在图上。用式子表示它的面积。`,
      explain:`<p>公式照用，把数换成字母：${c.how}，写作 <b>${c.tx}</b>。</p><p>乘号可以省略，ah 就是 a × h。</p>`});}
  if(form==='cond'){const k=R(1,3),t=pick(['rect','para']),mk2=t==='rect'?sR:sP;
    return Q2({form,kind:'choice',env0:{a:1.5,b:3*k},geo:v=>[sT(v.b,'b'),mk2(k*v.a,ka(k))],meta:{type:'cond'},ans:'ok',
      prompt:`甲是三角形，底是 b；乙是${TN[t]}，底是 ${ka(k)}。高都是 h。b 和 a 满足什么关系时，两个面积相等？`,
      options:shuffle([{k:'ok',text:`b = ${ka(2*k)}`,rel:a=>2*k*a},{k:'w1',text:`b = ${ka(k)}`,rel:a=>k*a},{k:'w2',text:`a = ${ka(2*k,'b')}`,rel:a=>a/(2*k)},{k:'w3',text:`b = ${ka(k)} + 2`,rel:a=>k*a+2}]),
      explain:`<p>三角形看底的一半：b ÷ 2。${TN[t]}看底：${ka(k)}。</p><p>要相等，就要 b ÷ 2 = ${ka(k)}，也就是 <b>b = ${ka(2*k)}</b>。三角形的底要长一倍才够。</p>`});}
  if(form==='given'){const c=pick([
    {m:2,ans:'E',geo:v=>[sT(v.b,'b'),sR(v.a,'a')],d:'甲是底为 b 的三角形，乙是底为 a 的矩形',why:m=>`三角形看底的一半：b ÷ 2 = ${ka(m)} ÷ 2 = ${ka(m/2)}。矩形看底：a。`},
    {m:3,ans:'L',geo:v=>[sT(v.b,'b'),sR(v.a,'a')],d:'甲是底为 b 的三角形，乙是底为 a 的矩形',why:m=>`三角形看底的一半：b ÷ 2 = ${ka(m)} ÷ 2 = ${ka(m/2)}。矩形看底：a。`},
    {m:1,ans:'R',geo:v=>[sT(v.b,'b'),sP(v.a,'a')],d:'甲是底为 b 的三角形，乙是底为 a 的平行四边形',why:m=>`三角形看底的一半：b ÷ 2 = a ÷ 2 = 0.5a。平行四边形看底：a。`},
    {m:4,ans:'L',geo:v=>[sT(v.b,'b'),sP(v.a,'a')],d:'甲是底为 b 的三角形，乙是底为 a 的平行四边形',why:m=>`三角形看底的一半：b ÷ 2 = 4a ÷ 2 = 2a。平行四边形看底：a。`},
    {m:3,ans:'E',geo:v=>[sZ(v.a,v.b,'a','b'),sR(2*v.a,'2a')],d:'甲是上底 a、下底 b 的梯形，乙是底为 2a 的矩形',why:m=>`梯形看上底加下底的一半：(a + 3a) ÷ 2 = 2a。矩形看底：2a。`},
    {m:3,ans:'L',geo:v=>[sZ(v.a,v.b,'a','b'),sR(v.a,'a')],d:'甲是上底 a、下底 b 的梯形，乙是底为 a 的矩形',why:m=>`梯形看上底加下底的一半：(a + 3a) ÷ 2 = 2a。矩形看底：a。`}]);
    return Q2({form,kind:'choice',env0:{a:1.5},fix:v=>{v.b=c.m*v.a;},geo:c.geo,meta:{type:'cmp'},options:CMP4,ans:c.ans,
      prompt:`${c.d}，高都是 h。已知 b = ${ka(c.m)}。谁的面积大？`,
      explain:`<p>把 b 换成 ${ka(c.m)}，两边就都只剩 a 了。</p><p>${c.why(c.m)}</p><p>${c.ans==='E'?'两边相等，面积一样大。':`${c.ans==='L'?'甲':'乙'}大。`}</p>`});}
  if(form==='diffab'){const c=pick([
    {geo:v=>[sR(v.a,'a'),sP(v.b,'b')],giv:'a 比 b 大',fix:v=>{if(v.a<=v.b)v.a=v.b+0.7+v.a/9;},f:v=>(v.a-v.b)*v.h,tx:'(a−b)h',how:'两个面积是 ah 和 bh，相减得 ah − bh，也可以写成 (a − b)h'},
    {geo:v=>[sT(v.b,'b'),sR(v.a,'a')],giv:'b 比 2a 大',fix:v=>{if(v.b<=2*v.a)v.b=2*v.a+0.9+v.b/9;},f:v=>(v.b/2-v.a)*v.h,tx:'bh÷2−ah',how:'三角形面积是 bh ÷ 2，矩形面积是 ah。b 比 2a 大，所以三角形大，相减得 bh ÷ 2 − ah'},
    {geo:v=>[sP(v.a,'a'),sT(v.b,'b')],giv:'b 比 2a 小',fix:v=>{if(v.b>=2*v.a)v.a=v.b/2+0.6+v.a/9;},f:v=>(v.a-v.b/2)*v.h,tx:'ah−bh÷2',how:'平行四边形面积是 ah，三角形面积是 bh ÷ 2。b 比 2a 小，所以平行四边形大，相减得 ah − bh ÷ 2'}]);
    return Q2({form,kind:'expr',tiles:['a','b','h'],env0:{a:3,b:2},fix:c.fix,geo:c.geo,meta:{type:'diff'},target:c.f,ansText:c.tx,
      prompt:`甲和乙的高都是 h，底标在图上。已知 ${c.giv}。面积大的比面积小的大多少？用式子表示。`,
      explain:`<p>${c.how}：<b>${c.tx}</b>。</p>`});}
  const P=shuffle([{g:v=>sR(v.a,'a'),f:v=>v.a*v.h,tx:'ah'},{g:v=>sP(v.b,'b'),f:v=>v.b*v.h,tx:'bh'},{g:v=>sT(v.b,'b'),f:v=>v.b*v.h/2,tx:'bh÷2'},{g:v=>sT(v.a,'a'),f:v=>v.a*v.h/2,tx:'ah÷2'}]);
  let A=P[0],B=P.find(p=>p.tx[0]!==A.tx[0]);
  return Q2({form,kind:'expr',tiles:['a','b','h'],geo:v=>[A.g(v),B.g(v)],meta:{type:'sum'},target:v=>A.f(v)+B.f(v),ansText:`${A.tx}+${B.tx}`,
    prompt:'甲和乙的高都是 h，底标在图上。两个图形的面积一共是多少？用式子表示。',
    explain:`<p>甲的面积是 ${A.tx}，乙的面积是 ${B.tx}。</p><p>a 和 b 是不同的数，合不到一起，就写成 <b>${A.tx} + ${B.tx}</b>。</p>`});}

/* ---------- 2-4 梯形 ---------- */
const F24=['rectbase','tribase','coefA','cmpTrap','missing','pick'];
function g24(form){form=form||pick(F24);const E={a:1.5,b:3.5};
  if(form==='rectbase'||form==='tribase'){const r=form==='rectbase',t=r?pick(['rect','para']):'tri',f=r?(v=>(v.a+v.b)/2):(v=>v.a+v.b);
    return Q2({form,kind:'expr',tiles:['a','b'],env0:E,geo:v=>[sZ(v.a,v.b,'a','b'),(t==='rect'?sR:t==='para'?sP:sT)(f(v),'?')],meta:{type:'len',factor:1},target:f,ansText:r?'(a+b)÷2':'a+b',
      prompt:`甲是梯形，上底 a、下底 b。乙是${TN[t]}，和甲等高，面积也相等。乙的底是多少？用式子表示。`,
      explain:r?`<p>梯形面积是 (a + b) × h ÷ 2，${TN[t]}面积是底 × h。</p><p>要相等，底就是 <b>(a + b) ÷ 2</b>，也就是上底和下底的平均数。</p>`
        :`<p>梯形面积是 (a + b) × h ÷ 2，三角形面积是底 × h ÷ 2。</p><p>两边都有 × h ÷ 2，所以底就是 <b>a + b</b>。</p>`});}
  if(form==='coefA'){const k=pick([2,3,5]),r=Math.random()<0.5,t=r?pick(['rect','para']):'tri',m=r?(1+k)/2:1+k;
    return Q2({form,kind:'expr',tiles:['a'],env0:{a:k===5?1:1.5},geo:v=>[sZ(v.a,k*v.a,'a',ka(k)),(t==='rect'?sR:t==='para'?sP:sT)(m*v.a,'?')],meta:{type:'len',factor:1},target:v=>m*v.a,ansText:ka(m),
      prompt:`甲是梯形，上底 a、下底 ${ka(k)}。乙是${TN[t]}，和甲等高，面积也相等。乙的底是多少？用含 a 的式子表示。`,
      explain:`<p>上底加下底：a + ${ka(k)} = ${ka(1+k)}。</p><p>${r?`${TN[t]}的底是它的一半：${ka(1+k)} ÷ 2 = <b>${ka(m)}</b>。`:`三角形和梯形都要 ÷ 2，所以三角形的底就是 <b>${ka(m)}</b>。`}</p>`});}
  if(form==='cmpTrap'){let A,B;const eq=Math.random()<0.4;A=randA('trap');B=eq?shA(pick(['rect','para','tri']),A.e):randA(pick(['rect','para','tri']));
    const S=Math.random()<0.5?[A,B]:[B,A],ans=same(S[0].e,S[1].e)?'E':S[0].e>S[1].e?'L':'R';
    return Q2({form,kind:'choice',env0:EA0,geo:v=>S.map(s=>s.geo(v)),meta:{type:'cmp'},options:CMP4,ans,
      prompt:'甲和乙的高都是 h，底都用 a 表示。谁的面积大？',
      explain:`${linesA(S)}<p>${ans==='E'?'两边都是同样多的 a，面积相等。':`${ans==='L'?'甲':'乙'}大，不管 a 是多少。`}</p>`});}
  if(form==='missing'){return Q2({form,kind:'expr',tiles:['a','c'],env0:{a:1.5,c:3},fix:v=>{if(2*v.c-v.a<=v.a)v.c=v.a+0.4+v.c/9;},
      geo:v=>[sR(v.c,'c'),sZ(v.a,2*v.c-v.a,'a','?')],meta:{type:'len',factor:1},target:v=>2*v.c-v.a,ansText:'2c−a',
      prompt:'甲是矩形，底是 c。乙是梯形，上底是 a，和甲等高，面积也相等。乙的下底是多少？用式子表示。',
      explain:`<p>梯形的上底加下底的一半要等于 c，所以上底 + 下底 = 2c。</p><p>下底 = 2c 减去上底 a：<b>2c − a</b>。</p>`});}
  const v1=Math.random()<0.5;
  return Q2({form,kind:'choice',long:true,env0:E,geo:v=>[sZ(v.a,v.b,'a','b')],meta:{type:'text'},ans:'a',
    prompt:'梯形的上底是 a、下底是 b、高是 h。下面哪个图形和它等高，面积也一定相等？',
    options:shuffle(v1?[{k:'a',text:'底是 a + b 的三角形'},{k:'b',text:'底是 a + b 的矩形'},{k:'c',text:'底是 (a + b) ÷ 2 的三角形'},{k:'d',text:'底是 b 的平行四边形'}]
      :[{k:'a',text:'底是 (a + b) ÷ 2 的矩形'},{k:'b',text:'底是 a + b 的平行四边形'},{k:'c',text:'底是 (a + b) ÷ 2 的三角形'},{k:'d',text:'底是 a 的矩形'}]),
    explain:v1?`<p>梯形面积是 (a + b) × h ÷ 2。底是 a + b 的三角形，面积也是 (a + b) × h ÷ 2，式子一模一样。</p>`
      :`<p>梯形面积是 (a + b) × h ÷ 2，可以看成 [(a + b) ÷ 2] × h，正是底为 (a + b) ÷ 2 的矩形。</p>`});}

/* ---------- 2-5 差与倍 ---------- */
const F25=['sum3','diffTrap','howmany','frac','diffNum','diffCoef'];
const gcd=(x,y)=>y?gcd(y,x%y):x;
function g25(form){form=form||pick(F25);
  if(form==='diffCoef')return Object.assign(g22('diff'),{form});
  if(form==='sum3'){const S=shuffle(T4).slice(0,3).map(t=>randA(t)),e=S.reduce((t,s)=>t+s.e,0);
    return Q2({form,cards:true,env0:{a:1.3},kind:'expr',tiles:['a','h'],geo:v=>S.map(s=>s.geo(v)),meta:{type:'sum'},target:v=>e*v.a*v.h,ansText:`${ka(e)}h`,
      prompt:'三个图形的高都是 h，底都用 a 表示。三个面积一共是多少？用式子表示。',
      explain:`${linesA(S)}<p>加起来：${S.map(s=>ka(s.e)).join(' + ')} = ${ka(e)}，再乘高 h：<b>${ka(e)}h</b>。</p>`});}
  if(form==='diffTrap'){const r=Math.random()<0.5;
    return Q2({form,kind:'expr',tiles:['a','b','h'],env0:{a:1.5,b:3.5},fix:v=>{if(v.b<=v.a)v.b=v.a+0.8+v.b/9;},
      geo:v=>r?[sZ(v.a,v.b,'a','b'),sR(v.a,'a')]:[sR(v.b,'b'),sZ(v.a,v.b,'a','b')],meta:{type:'diff'},target:v=>(v.b-v.a)*v.h/2,ansText:'(b−a)h÷2',
      prompt:`${r?'甲是梯形（上底 a、下底 b），乙是底为 a 的矩形':'甲是底为 b 的矩形，乙是梯形（上底 a、下底 b）'}，高都是 h。已知 b 比 a 大。面积大的比面积小的大多少？用式子表示。`,
      explain:r?`<p>梯形比矩形多出来的部分，可以拼成一个底为 b − a 的三角形。</p><p>它的面积是 <b>(b − a)h ÷ 2</b>。用式子算也一样：(a + b)h ÷ 2 − ah。</p>`
        :`<p>矩形比梯形多出来的部分，可以拼成一个底为 b − a 的三角形。</p><p>它的面积是 <b>(b − a)h ÷ 2</b>。用式子算也一样：bh − (a + b)h ÷ 2。</p>`});}
  if(form==='howmany'){const c=pick([{s:shA('tri',0.5),n:[2,3,4]},{s:shA('tri',1),n:[2]},{s:shA('rect',1),n:[2]},{s:shA('tri',0.5),n:[4,5]}]),n=pick(c.n),B=shA(pick(['rect','para']),c.s.e*n);
    return Q2({form,kind:'num',env0:EA0,geo:v=>[c.s.geo(v),B.geo(v)],meta:{type:'howmany'},ans:n,
      prompt:'甲和乙的高都是 h，底都用 a 表示。几个甲的面积合起来，正好等于一个乙？',
      explain:`${linesA([c.s,B])}<p>${ka(B.e)} ÷ ${ka(c.s.e)} = <b>${n}</b>。需要 ${n} 个甲。</p>`});}
  if(form==='frac'){let k,m,g2;do{k=R(1,5);m=R(1,3);}while(k>=2*m);g2=gcd(k,2*m);const nu=k/g2,de=2*m/g2,B=pick(['rect','para']);
    const fr=(x,y)=>`${x}/${y}`,cand=[[nu,de],[1,2],[1,3],[1,4],[2,3],[3,4],[1,6],[5,6]].filter((p,i,arr)=>arr.findIndex(q=>q[0]*p[1]===q[1]*p[0])===i).slice(0,4);
    return Q2({form,kind:'choice',env0:{a:1.6},geo:v=>[sT(k*v.a,ka(k)),(B==='rect'?sR:sP)(m*v.a,ka(m))],meta:{type:'frac',val:nu/de},ans:fr(nu,de),
      options:shuffle(cand.map(p=>({k:fr(p[0],p[1]),text:fr(p[0],p[1])}))),
      prompt:`甲是底为 ${ka(k)} 的三角形，乙是底为 ${ka(m)} 的${TN[B]}，高都是 h。甲的面积是乙的几分之几？`,
      explain:`<p>甲看底的一半：${ka(k)} ÷ 2 = ${ka(k/2)}。乙看底：${ka(m)}。</p><p>${ka(k/2)} ÷ ${ka(m)} = <b>${fr(nu,de)}</b>。a 被约掉了。</p>`});}
  const k=R(1,4),t=pick(['rect','para']),tri=Math.random()<0.4;
  return Q2({form,kind:'expr',tiles:['a','h'],env0:{a:2},geo:v=>tri?[sT(2*v.a+2*k,`2a + ${2*k}`),sR(v.a,'a')]:[sR(v.a+k,`a + ${k}`),(t==='rect'?sR:sP)(v.a,'a')],meta:{type:'diff'},target:v=>k*v.h,ansText:`${k}h`,
    prompt:'甲和乙的高都是 h，底标在图上。面积大的比面积小的大多少？用式子表示。',
    explain:tri?`<p>三角形看底的一半：(2a + ${2*k}) ÷ 2 = a + ${k}。矩形看底：a。</p><p>相差 ${k}，再乘高：<b>${k}h</b>。a 是多少都不影响，式子里没有 a。</p>`
      :`<p>“底”这一部分一个是 a + ${k}，一个是 a，相差 ${k}。</p><p>再乘高：<b>${k}h</b>。a 是多少都不影响，式子里没有 a。</p>`});}

/* ---------- 2-6 能不能确定 ---------- */
const F26=['ab_free','ab_rel','a_plus','a_vs_num','twoA','aplus_vs_2a','trap_ineq'];
function g26(form){form=form||pick(F26);const PR=d=>`${d}高都是 h。谁的面积大？`;
  const base={form,kind:'choice',options:CMP4};
  if(form==='ab_free'){const tri=Math.random()<0.6,t=pick(['rect','para']);
    return Q2(Object.assign(base,{geo:v=>[(t==='rect'?sR:sP)(v.a,'a'),tri?sT(v.b,'b'):sR(v.b,'b')],meta:{type:'U'},ans:'U',
      prompt:PR(`甲是底为 a 的${TN[t]}，乙是底为 b 的${tri?'三角形':'矩形'}，`),
      explain:tri?`<p>a 和 b 之间没有给任何关系。</p><p>如果 a = 3、b = 4：乙看底的一半是 2，甲大。如果 a = 3、b = 8：乙看底的一半是 4，乙大。两种都可能，所以无法确定。</p>`
        :`<p>a 和 b 之间没有给任何关系。</p><p>如果 a = 3、b = 2，甲大；如果 a = 3、b = 5，乙大。两种都可能，所以无法确定。</p>`}));}
  if(form==='ab_rel'){const c=pick([
    {giv:'b = 2a',fix:v=>{v.b=2*v.a;},ans:'E',why:'三角形看底的一半：2a ÷ 2 = a，和矩形的底相等。'},
    {giv:'b 比 2a 大',fix:v=>{if(v.b<=2*v.a)v.b=2*v.a+0.5+v.b/7;},ans:'L',why:'三角形看底的一半：b ÷ 2。b 比 2a 大，b ÷ 2 就比 a 大，三角形大。'},
    {giv:'b 比 a 大',fix:v=>{if(v.b<=v.a)v.b=v.a*(1.05+v.b/4);},ans:'U',why:'只知道 b 比 a 大，不够。如果 a = 3、b = 4：b ÷ 2 = 2，比 3 小，矩形大。如果 a = 3、b = 10：b ÷ 2 = 5，三角形大。要 b 比 2a 大才能确定。'}]);
    return Q2(Object.assign(base,{env0:{a:2,b:4},fix:c.fix,geo:v=>[sT(v.b,'b'),sR(v.a,'a')],meta:{type:c.ans==='U'?'U':'cmp'},ans:c.ans,
      prompt:PR(`甲是底为 b 的三角形，乙是底为 a 的矩形，已知 ${c.giv}。`),explain:`<p>${c.why}</p>`}));}
  if(form==='a_plus'){const k=R(1,4);if(Math.random()<0.5){let m;do{m=R(1,5);}while(m===k);
      return Q2(Object.assign(base,{geo:v=>[sR(v.a+k,`a + ${k}`),sP(v.a+m,`a + ${m}`)],meta:{type:'cmp'},ans:k>m?'L':'R',
        prompt:PR(`甲是底为 a + ${k} 的矩形，乙是底为 a + ${m} 的平行四边形，`),
        explain:`<p>虽然不知道 a，但两边都是在 a 上加一个数。加 ${Math.max(k,m)} 的一定比加 ${Math.min(k,m)} 的大，不管 a 是多少。</p>`}));}
    return Q2(Object.assign(base,{geo:v=>[sT(2*v.a+2*k,`2a + ${2*k}`),sR(v.a,'a')],meta:{type:'cmp'},ans:'L',
      prompt:PR(`甲是底为 2a + ${2*k} 的三角形，乙是底为 a 的矩形，`),
      explain:`<p>三角形看底的一半：(2a + ${2*k}) ÷ 2 = a + ${k}。矩形看底：a。</p><p>a + ${k} 一定比 a 大，不管 a 是多少。甲大。</p>`}));}
  if(form==='a_vs_num'){const n=R(3,6),t=pick(['rect','para']);
    return Q2(Object.assign(base,{env0:{a:n-1},geo:v=>[sR(v.a,'a'),(t==='rect'?sR:sP)(n,String(n))],meta:{type:'U'},ans:'U',
      prompt:PR(`甲是底为 a 的矩形，乙是底为 ${n} 的${TN[t]}，`),
      explain:`<p>a 可以是任何数。如果 a = ${n-2}，乙大；如果 a = ${n+3}，甲大；如果 a = ${n}，一样大。所以无法确定。</p>`}));}
  if(form==='twoA'){const [A,B]=pairA(pick(['eq','ne','ne'])),ans=same(A.e,B.e)?'E':A.e>B.e?'L':'R';
    return Q2(Object.assign(base,{env0:EA0,geo:v=>[A.geo(v),B.geo(v)],meta:{type:'cmp'},ans,
      prompt:'甲和乙的高都是 h，底都用 a 表示。谁的面积大？',
      explain:`${linesA([A,B])}<p>两边都是 a 的几倍，可以确定：${ans==='E'?'一样大':(ans==='L'?'甲':'乙')+'大'}。虽然有字母，但不是“无法确定”。</p>`}));}
  if(form==='aplus_vs_2a'){const k=R(2,4);
    return Q2(Object.assign(base,{env0:{a:2},geo:v=>[sR(v.a+k,`a + ${k}`),sR(2*v.a,'2a')],meta:{type:'U'},ans:'U',
      prompt:PR(`甲是底为 a + ${k} 的矩形，乙是底为 2a 的矩形，`),
      explain:`<p>一个是加 ${k}，一个是乘 2，谁大要看 a。</p><p>如果 a = 1：甲的底是 ${1+k}，乙的底是 2，甲大。如果 a = ${k+3}：甲的底是 ${2*k+3}，乙的底是 ${2*k+6}，乙大。所以无法确定。</p>`}));}
  const c=pick([
    {g:v=>sR(v.a,'a'),d:'底为 a 的矩形',ans:'L',why:'梯形看上底加下底的一半。b 比 a 大，所以 (a + b) ÷ 2 比 a 大。梯形大。'},
    {g:v=>sR(v.b,'b'),d:'底为 b 的矩形',ans:'R',why:'梯形看上底加下底的一半。a 比 b 小，所以 (a + b) ÷ 2 比 b 小。矩形大。'},
    {g:v=>sT(2*v.a,'2a'),d:'底为 2a 的三角形',ans:'L',why:'三角形看底的一半：2a ÷ 2 = a。梯形是 (a + b) ÷ 2，b 比 a 大，所以它比 a 大。梯形大。'},
    {g:v=>sT(v.a+v.b,'a + b'),d:'底为 a + b 的三角形',ans:'E',why:'三角形看底的一半：(a + b) ÷ 2，和梯形的一模一样。面积相等。'}]);
  return Q2(Object.assign(base,{env0:{a:1.5,b:3.5},fix:v=>{if(v.b<=v.a)v.b=v.a+0.6+v.b/8;},geo:v=>[sZ(v.a,v.b,'a','b'),c.g(v)],meta:{type:'cmp'},ans:c.ans,
    prompt:PR(`甲是梯形（上底 a、下底 b），乙是${c.d}，已知 b 比 a 大。`),explain:`<p>${c.why}</p>`}));}

/* ---------- 2-7 列方程 ---------- */
const F27=['pickeq','numx','L_tri=trap','L_rp=tri','L_trapB','L_trapA','L_x2'];
function g27(form){form=form||pick(F27);
  if(form==='numx'){const q=g13();q.scene.shapes.forEach(s=>{if(s.lb==='?')s.lb='x';if(s.la==='?')s.la='x';});
    q.prompt=q.prompt.replace(/乙的(.+?)是多少？/,'乙的$1是 x。求 x。');q.form=form;return q;}
  if(form==='pickeq'){if(Math.random()<0.5){const p=R(2,4),qq=p+R(1,4);
      return Q2({form,kind:'choice',long:true,env0:{x:p+qq},geo:v=>[sZ(p,qq),sT(p+qq,'x')],meta:{type:'text'},ans:'a',
        prompt:`甲是梯形（上底 ${p}、下底 ${qq}），乙是底为 x 的三角形。高相同，面积相等。哪个方程是对的？`,
        options:shuffle([{k:'a',text:`x ÷ 2 = (${p} + ${qq}) ÷ 2`},{k:'b',text:`x = (${p} + ${qq}) ÷ 2`},{k:'c',text:`x ÷ 2 = ${p} + ${qq}`},{k:'d',text:`x × 2 = ${p} + ${qq}`}]),
        explain:`<p>高相同，只要“底”这一部分相等。三角形是 x ÷ 2，梯形是 (${p} + ${qq}) ÷ 2。</p><p>方程：x ÷ 2 = (${p} + ${qq}) ÷ 2，解得 x = ${p+qq}。</p>`});}
    const t=2*R(2,5);
    return Q2({form,kind:'choice',long:true,env0:{x:t/2},geo:v=>[sT(t),sR(t/2,'x')],meta:{type:'text'},ans:'a',
      prompt:`甲是底为 ${t} 的三角形，乙是底为 x 的矩形。高相同，面积相等。哪个方程是对的？`,
      options:shuffle([{k:'a',text:`x = ${t} ÷ 2`},{k:'b',text:`x ÷ 2 = ${t}`},{k:'c',text:`x = ${t}`},{k:'d',text:`x + 2 = ${t}`}]),
      explain:`<p>高相同，只要“底”这一部分相等。矩形是 x，三角形是 ${t} ÷ 2。</p><p>方程：x = ${t} ÷ 2，解得 x = ${t/2}。</p>`});}
  const PR=(d,w)=>`${d}高相同，${w||'面积相等'}。用式子表示 x。`,B={form,kind:'expr'};
  if(form==='L_tri=trap')return Q2(Object.assign(B,{tiles:['a','b'],env0:{a:1.5,b:3},geo:v=>[sZ(v.a,v.b,'a','b'),sT(v.a+v.b,'x')],meta:{type:'len',factor:1},target:v=>v.a+v.b,ansText:'a+b',
    prompt:PR('甲是梯形（上底 a、下底 b），乙是底为 x 的三角形。'),explain:'<p>方程：x ÷ 2 = (a + b) ÷ 2。</p><p>两边同时乘 2：<b>x = a + b</b>。</p>'}));
  if(form==='L_rp=tri'){const t=pick(['rect','para']);return Q2(Object.assign(B,{tiles:['b'],env0:{b:5},geo:v=>[sT(v.b,'b'),(t==='rect'?sR:sP)(v.b/2,'x')],meta:{type:'len',factor:1},target:v=>v.b/2,ansText:'b÷2',
    prompt:PR(`甲是底为 b 的三角形，乙是底为 x 的${TN[t]}。`),explain:'<p>方程：x = b ÷ 2。</p><p>这次不用再解，<b>x = b ÷ 2</b> 就是答案。</p>'}));}
  if(form==='L_trapB')return Q2(Object.assign(B,{tiles:['a','c'],env0:{a:1.5,c:3},fix:v=>{if(2*v.c-v.a<=v.a)v.c=v.a+0.4+v.c/9;},geo:v=>[sR(v.c,'c'),sZ(v.a,2*v.c-v.a,'a','x')],meta:{type:'len',factor:1},target:v=>2*v.c-v.a,ansText:'2c−a',
    prompt:PR('甲是底为 c 的矩形，乙是梯形（上底 a、下底 x）。'),explain:'<p>方程：(a + x) ÷ 2 = c。</p><p>两边乘 2：a + x = 2c。两边减 a：<b>x = 2c − a</b>。</p>'}));
  if(form==='L_trapA'){const c=pick([[3,2],[4,3],[5,3],[5,4],[3,2.5]]),k=c[0],m=c[1],r=2*m-k;
    return Q2(Object.assign(B,{tiles:['a'],env0:{a:1.4},geo:v=>[sR(m*v.a,ka(m)),sZ(r*v.a,k*v.a,'x',ka(k))],meta:{type:'len',factor:1},target:v=>r*v.a,ansText:ka(r),
      prompt:PR(`甲是底为 ${ka(m)} 的矩形，乙是梯形（上底 x、下底 ${ka(k)}）。`),explain:`<p>方程：(x + ${ka(k)}) ÷ 2 = ${ka(m)}。</p><p>两边乘 2：x + ${ka(k)} = ${ka(2*m)}。两边减 ${ka(k)}：<b>x = ${ka(r)}</b>。</p>`}));}
  const t=pick(['rect','para']);
  return Q2(Object.assign(B,{tiles:['a'],env0:{a:1.5},geo:v=>[(t==='rect'?sR:sP)(v.a,'a'),sT(4*v.a,'x')],meta:{type:'len',factor:2},target:v=>4*v.a,ansText:'4a',
    prompt:PR(`甲是底为 a 的${TN[t]}，乙是底为 x 的三角形。`,'乙的面积是甲的 2 倍'),explain:'<p>方程：x ÷ 2 = 2 × a。</p><p>两边乘 2：<b>x = 4a</b>。</p>'}));}

