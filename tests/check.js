// 自动核对：每种问法随机出题，用坐标重算面积，核对答案、选项、“无法确定”的判定和拼式子的识别。
// 运行：node tests/check.js
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'..');
const src=['core','stage0','stage1','stage2','levels'].map(f=>fs.readFileSync(path.join(root,'js',f+'.js'),'utf8')).join('\n')
  +'\n;globalThis.__G={LV,make,P4,N,bossList,draw,parseExpr,equiv};';
vm.runInThisContext(src);
const {LV,make,P4,N,bossList,draw,parseExpr,equiv}=globalThis.__G;
const area=(s,h)=>{const p=P4(s,h);let A=0;for(let i=0;i<p.length;i++){const [x1,y1]=p[i],[x2,y2]=p[(i+1)%p.length];A+=x1*y2-x2*y1;}return Math.abs(A)/2;};
const eq=(a,b)=>Math.abs(a-b)<1e-7*(1+Math.abs(b));
let err=0,n=0,forms=0;
const bad=(m,q)=>{if(err++<20)console.log('错误',m,LV[q.src].id,q.form,'|',q.prompt.slice(0,50),'| 答案',q.ans,q.ansText||'');};
const rnd=()=>0.2+Math.random()*8;
const envs=q=>{const out=[];for(let k=0;k<60;k++){const v={a:rnd(),b:rnd(),c:rnd(),h:0.5+Math.random()*5,x:rnd()};if(q.fix)q.fix(v);out.push(v);}return out;};
const verd=A=>eq(A[0],A[1])?'E':A[0]>A[1]?'L':'R';
const pairsEq=A=>{const ps=[];for(let a=0;a<A.length;a++)for(let b=a+1;b<A.length;b++)if(eq(A[a],A[b]))ps.push([a,b]);return ps;};
const REPS=+process.env.REPS||300;
for(let i=0;i<LV.length;i++){if(LV[i].boss)continue;const fl=[...new Set(LV[i].forms)];forms+=fl.length;
 for(const f of fl)for(let k=0;k<REPS;k++){n++;
  const q=make(i,f),m=q.meta;if(q.form!==f)bad('问法名不符',q);if(!m){bad('缺核对信息',q);continue;}
  const sh0=q.scene?q.scene.shapes:q.shapes,h0=q.scene?q.scene.h:q.h;
  sh0.forEach(s=>{if(!(s.b>0)||s.a<0||!s.name)bad('图形尺寸',q);if(s.t==='trap'&&!(s.a>0&&s.a<s.b))bad('梯形尺寸',q);if(s.t==='sq'&&!eq(s.b,h0))bad('正方形',q);});
  if(q.kind==='choice'){if(q.options.filter(o=>o.k===q.ans).length!==1)bad('正确选项个数',q);if(new Set(q.options.map(o=>o.text)).size!==q.options.length||q.options.length<3)bad('选项重复',q);}
  const svg=q.scene?draw(q.scene):sh0.map(s=>draw({h:h0,shapes:[s]},{card:true,u:24})).join('');
  if(/NaN|undefined|Infinity|null/.test(svg+q.explain+q.prompt+JSON.stringify(q.options||'')+(q.ansText||'')))bad('出现无效文字',q);
  if(q.kind==='expr'){const p=parseExpr(q.ansText);if(!p||!equiv(p,q.target))bad('参考答案式子',q);if(!q.ansText.match(/[abchx]/g).every(c=>q.tiles.includes(c)))bad('缺字母方块',q);}
  if(!q.geo){ // 纯数字题
    const A=sh0.map(s=>area(s,h0));
    if(m.type==='cmp'){if(verd(A)!==q.ans)bad('比较',q);}
    else if(m.type==='area'){if(q.ans!==N(A[0]*(m.factor||1)))bad('面积',q);}
    else if(m.type==='order'){const as=q.ans.map(j=>A[j]);if(as.length!==sh0.length)bad('排序个数',q);for(let j=1;j<as.length;j++)if(!((m.desc?as[j-1]-as[j]:as[j]-as[j-1])>1e-7))bad('排序',q);}
    else if(m.type==='maxmin'){if(!eq(A[q.ans[0]],Math.max(...A))||!eq(A[q.ans[1]],Math.min(...A))||pairsEq(A).length)bad('最大最小',q);}
    else if(m.type==='kth'){const s=A.slice().sort((a,b)=>b-a);if(!eq(A[q.ans[0]],s[m.k-1])||pairsEq(A).length)bad('第几大',q);}
    else if(m.type==='eqpair'){const ps=pairsEq(A);if(ps.length!==1||ps[0].join()!==q.ans.slice().sort().join())bad('找等积',q);}
    else if(m.type==='ratio'){if(q.ans!==N(Math.max(A[0],A[1])/Math.min(A[0],A[1])))bad('几倍',q);}
    else if(m.type==='diff'){if(!eq(Math.abs(A[0]-A[1]),q.ans)||!(q.ans>0))bad('差',q);}
    else if(m.type==='diffH'){if(!eq(Math.abs(A[0]-A[1]),m.d*h0)||!(m.d>0))bad('差乘高',q);}
    else if(m.type==='inv'){if(!eq(A[1],m.factor*A[0]))bad('倒推',q);const B=sh0[1],v=(B.la==='x'||B.la==='?')?B.a:B.b;if(!eq(v,q.ans)||!(q.ans>0))bad('倒推答案',q);}
    else if(m.type==='text'){
      if(f==='mtU'){const T=sh0.find(s=>s.hideA),Rr=sh0.find(s=>!s.hideA);if(!(Rr.b>T.b/2)||q.ans!=='U')bad('上底没标·不能定',q);}
      if(f==='miss'&&!sh0.some(s=>s.hideB))bad('缺条件',q);
      if(m.val!=null&&q.ans!==N(m.val))bad('数值',q);
      if(f==='trapdiag'){const s=sh0[0],o=q.options.find(o=>o.k==='a').text;if(o!==`上面 ${N(s.a*h0/2)} 格，下面 ${N(s.b*h0/2)} 格`)bad('梯形对角线',q);}
    } else bad('未知核对类型',q);
    if(f==='mtSure'){const T=sh0.find(s=>s.hideA),Rr=sh0.find(s=>!s.hideA);if(!(Rr.b<=T.b/2+1e-9))bad('上底没标·能定',q);}
    continue;}
  const seen=new Set(); // 带字母的题：代入多组随机数
  for(const v of envs(q)){const sh=q.geo(v),A=sh.map(s=>area(s,v.h));
    if(sh.some(s=>!(s.b>0)||s.a<0)){bad('代入后图形无效',q);break;}
    if(m.type==='area0'){if(!eq(q.target(v),A[0]))bad('面积式',q);if(q.kind==='choice')q.options.forEach(o=>{if((o.k==='ok')!==eq(o.fn(v),A[0]))bad('式子选项',q);});}
    else if(m.type==='diff'){const t=q.target(v);if(!eq(t,Math.abs(A[0]-A[1]))||!(t>0))bad('差式',q);}
    else if(m.type==='sum'){if(!eq(q.target(v),A.reduce((x,y)=>x+y,0)))bad('和式',q);}
    else if(m.type==='len'){if(!eq(A[1],m.factor*A[0])||!(q.target(v)>0))bad('底的式子',q);}
    else if(m.type==='cmp'){if(verd(A)!==q.ans)bad('字母比较',q);}
    else if(m.type==='U')seen.add(verd(A));
    else if(m.type==='ratio'){if(q.ans!==N(Math.max(...A)/Math.min(...A)))bad('字母几倍',q);}
    else if(m.type==='howmany'){if(!eq(A[1]/A[0],q.ans))bad('几个甲',q);}
    else if(m.type==='frac'){const p=q.ans.split('/');if(!eq(A[0]/A[1],m.val)||!eq(p[0]/p[1],m.val))bad('几分之几',q);}
    else if(m.type==='eqpair'){const ps=pairsEq(A);if(ps.length!==1||ps[0].join()!==q.ans.slice().sort().join())bad('字母找等积',q);}
    else if(m.type==='cond'){q.options.forEach(o=>{const w=Object.assign({},v);w.b=o.rel(w.a);const B=q.geo(w).map(s=>area(s,w.h));if((o.k==='ok')!==eq(B[0],B[1]))bad('等积条件',q);});}
    else if(m.type!=='text')bad('未知核对类型',q);
    if(err>20)break;}
  if(m.type==='U'&&(seen.size<2||q.ans!=='U'))bad('应为无法确定',q);
 }}
// 拼式子的识别
[['3h',v=>3*v.h],['ah÷2',v=>v.a*v.h/2],['(a+b)h÷2',v=>(v.a+v.b)*v.h/2],['h(a+b)÷2',v=>(v.a+v.b)*v.h/2],['a×h÷2+b×h÷2',v=>(v.a+v.b)*v.h/2],['0.5ah',v=>v.a*v.h/2],['2c−a',v=>2*v.c-v.a],['1.5a×h',v=>1.5*v.a*v.h],['h×3',v=>3*v.h],['2(a+1)',v=>2*v.a+2],['ah−bh÷2',v=>v.a*v.h-v.b*v.h/2]]
  .forEach(([s,f])=>{const p=parseExpr(s);if(!p||!equiv(p,f)){err++;console.log('错误 应识别',s);}});
['','+','3+','(a','a)','a++b','.','3..2','×a','a÷'].forEach(s=>{if(parseExpr(s)){err++;console.log('错误 应拒绝',s);}});
if(equiv(parseExpr('ah'),v=>v.a*v.h/2)||equiv(parseExpr('a+h'),v=>v.a*v.h)){err++;console.log('错误 式子判等过松');}
LV.forEach((l,i)=>{if(l.boss)for(let k=0;k<50;k++)bossList(i);});
console.log(`核对完成：${forms} 种问法，${n} 道题，错误 ${err} 处`);
process.exit(err?1:0);
