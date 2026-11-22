// 阶段 0：想清楚公式（0-1 割补说理、0-2 别被样子骗了）
/* ---------- 0-1 割补说理 ---------- */
const F01=['cut','conserve','tri2n','tri2w','trap2b','trap2a','count','rect2tri','trapdiag','midcut'];
function g01(form){form=form||pick(F01);
  const G=(h,s)=>({h,grid:true,hLabel:['高',h+' 格'],shapes:tag([s])});
  if(form==='cut'||form==='conserve'){
    const [off,h]=pick([[3,4],[4,3]]),b=R(Math.max(5,off+1),8);
    const scene=G(h,{t:'para',a:b,b,off,ls:'5',cut:{seam:true}});
    if(form==='cut')return {form,kind:'choice',scene,meta:{type:'area'},
      prompt:'沿虚线切下左边的三角形，平移到右边，正好拼成一个矩形。这个矩形的面积是多少格？',
      options:numOpts(b*h,[b*5,(b+off)*h,(b-off)*h],' 格'),ans:N(b*h),
      explain:`<p>三角形向右平移 ${b} 格后，矩形的长还是 ${b}，宽就是高 ${h}。</p><p>面积 = ${b} × ${h} = <b>${b*h}</b> 格。斜边 5 没有用到，所以平行四边形面积是底 × 高，不是底 × 斜边。</p>`};
    return {form,kind:'choice',long:true,scene,meta:{type:'text'},
      prompt:'沿虚线切下左边的三角形，平移到右边拼成矩形。和原来的平行四边形相比，面积和周长怎样变化？',
      options:shuffle([{k:'a',text:'面积不变，周长变小'},{k:'b',text:'面积不变，周长也不变'},{k:'c',text:'面积变小，周长变小'},{k:'d',text:'面积变大，周长不变'}]),ans:'a',
      explain:`<p>只是把一块挪了位置，没有多也没有少，面积不变。</p><p>周长变了：原来两条斜边各长 5，现在换成两条竖边各长 ${h}。周长从 ${2*(b+5)} 变成 <b>${2*(b+h)}</b>。</p>`};}
  if(form==='tri2n'||form==='tri2w'){
    const h=pick([3,4]),b=pick([4,6,8]),off=R(1,3);
    const scene=G(h,{t:'tri',a:0,b,off,ghost:[[b,0],[off,h],[b+off,h]]});
    if(form==='tri2n')return {form,kind:'choice',scene,meta:{type:'area'},
      prompt:'两个一样的三角形拼成了一个平行四边形（虚线是第二个）。一个三角形的面积是多少格？',
      options:numOpts(b*h/2,[b*h,b*h*2,b+h],' 格'),ans:N(b*h/2),
      explain:`<p>拼成的平行四边形底 ${b}、高 ${h}，面积 ${b} × ${h} = ${b*h} 格。</p><p>它由两个一样的三角形组成，一个是它的一半：${b*h} ÷ 2 = <b>${b*h/2}</b> 格。这就是公式里 ÷ 2 的来历。</p>`};
    return {form,kind:'choice',long:true,scene,meta:{type:'text'},
      prompt:'两个一样的三角形拼成了一个平行四边形（虚线是第二个）。看图，三角形面积公式里为什么要 ÷ 2？',
      options:shuffle([{k:'a',text:'三角形和这个平行四边形同底同高，面积是它的一半'},{k:'b',text:'三角形的高只有平行四边形的一半'},{k:'c',text:'三角形的底只有平行四边形的一半'},{k:'d',text:'拼起来以后，面积缩小了一半'}]),ans:'a',
      explain:`<p>图里三角形和平行四边形的底都是 ${b}，高都是 ${h}，底和高都没有减半。</p><p>平行四边形由两个一样的三角形组成，所以三角形面积 = 底 × 高 ÷ 2。</p>`};}
  if(form==='trap2b'||form==='trap2a'){
    let a,b,h;do{a=R(2,4);b=R(a+1,7);h=pick([2,3,4]);}while(((a+b)*h)%2);
    const off=R(0,2),scene=G(h,{t:'trap',a,b,off,ghost:[[b,0],[b+a,0],[off+a+b,h],[off+a,h]]});
    if(form==='trap2b')return {form,kind:'choice',scene,meta:{type:'text',val:a+b},
      prompt:'两个一样的梯形，一正一倒，拼成了一个平行四边形（虚线是第二个）。这个平行四边形的底是多少格？',
      options:numOpts(a+b,[2*b,2*a,b],' 格'),ans:N(a+b),
      explain:`<p>倒过来的梯形把上底 ${a} 接在了下底 ${b} 的旁边，所以平行四边形的底是 ${a} + ${b} = <b>${a+b}</b> 格。</p><p>这就是梯形公式里“上底 + 下底”的来历。</p>`};
    return {form,kind:'choice',scene,meta:{type:'area'},
      prompt:'两个一样的梯形，一正一倒，拼成了一个平行四边形（虚线是第二个）。一个梯形的面积是多少格？',
      options:numOpts((a+b)*h/2,[(a+b)*h,b*h,a*h],' 格'),ans:N((a+b)*h/2),
      explain:`<p>平行四边形的底是 ${a} + ${b} = ${a+b}，高 ${h}，面积 ${(a+b)*h} 格。</p><p>一个梯形是它的一半：${(a+b)*h} ÷ 2 = <b>${(a+b)*h/2}</b> 格。</p>`};}
  if(form==='count'){
    const t=pick(['rect','para','tri','trap','sq']),h=R(2,4);let s,how;
    if(t==='rect'){const b=R(3,7);s={t,a:b,b,off:0};how=`每行 ${b} 格，共 ${h} 行：${b} × ${h}`;}
    else if(t==='sq'){s={t,a:h,b:h,off:0};how=`每行 ${h} 格，共 ${h} 行：${h} × ${h}`;}
    else if(t==='para'){const b=R(3,6);s={t,a:b,b,off:R(1,2)};how=`把左边伸出的三角形补到右边，就是每行 ${b} 格、共 ${h} 行的矩形：${b} × ${h}`;}
    else if(t==='tri'){let b;do{b=R(3,7);}while((b*h)%2);s={t,a:0,b,off:R(0,b)};how=`它是底 ${b}、高 ${h} 的平行四边形的一半：${b} × ${h} ÷ 2`;}
    else{let a,b;do{a=R(1,3);b=R(a+1,7);}while(((a+b)*h)%2);s={t,a,b,off:R(0,b-a)};how=`两个这样的梯形拼成底 ${a+b}、高 ${h} 的平行四边形，取一半：(${a} + ${b}) × ${h} ÷ 2`;}
    const A=eff(s)*h;
    return {form,kind:'choice',scene:G(h,s),meta:{type:'area'},
      prompt:`数一数：这个${TN[t]}的面积是多少格？不满一格的可以拼起来数。`,
      options:numOpts(A,[A*2,s.b*h,A+h,(s.a+s.b)*h],' 格'),ans:N(A),
      explain:`<p>${how} = <b>${N(A)}</b> 格。</p>`};}
  if(form==='rect2tri'){let b,h;do{b=R(3,7);h=R(2,4);}while((b*h)%2||b===h);
    return {form,kind:'choice',scene:G(h,{t:'rect',a:b,b,off:0,lines:[[0,0,b,h]]}),meta:{type:'area',factor:0.5},
      prompt:'对角线把矩形分成两个一样的三角形。其中一个三角形的面积是多少格？',
      options:numOpts(b*h/2,[b*h,b+h,b*h/2+h],' 格'),ans:N(b*h/2),
      explain:`<p>矩形面积 ${b} × ${h} = ${b*h} 格。两个三角形一样大，各占一半：${b*h} ÷ 2 = <b>${b*h/2}</b> 格。</p>`};}
  if(form==='trapdiag'){const h=pick([2,4]),a=R(2,4),b=R(a+1,7),off=R(0,2);
    const scene=G(h,{t:'trap',a,b,off,lines:[[0,0,off+a,h]]});
    const o=(x,y)=>`上面 ${N(x)} 格，下面 ${N(y)} 格`;
    return {form,kind:'choice',long:true,scene,meta:{type:'text'},
      prompt:'一条对角线把梯形分成上、下两个三角形。它们的面积各是多少格？',
      options:shuffle([{k:'a',text:o(a*h/2,b*h/2)},{k:'b',text:o(a*h,b*h)},{k:'c',text:o(b*h/2,a*h/2)},{k:'d',text:o((a+b)*h/4,(a+b)*h/4)}]),ans:'a',
      explain:`<p>上面的三角形以上底 ${a} 为底，下面的以下底 ${b} 为底，高都是 ${h}。</p><p>上面 ${a} × ${h} ÷ 2 = <b>${a*h/2}</b>，下面 ${b} × ${h} ÷ 2 = <b>${b*h/2}</b>。加起来正是 (${a} + ${b}) × ${h} ÷ 2，这是梯形公式的另一种来历。</p>`};}
  const h=4,off=pick([2,4]),b=R(4,6);
  const scene=G(h,{t:'tri',a:0,b,off,lines:[[off/2,2,(b+off)/2,2]],ghost:[[b,0],[(b+off)/2,2],[b+off/2,2]]});
  if(Math.random()<0.5)return {form,kind:'choice',scene,meta:{type:'text',val:2},
    prompt:'沿虚线（两条边的中点连线）切下上面的小三角形，转到右下方虚线的位置，拼成一个平行四边形。这个平行四边形的高是多少格？',
    options:numOpts(2,[4,1,8],' 格'),ans:'2',
    explain:`<p>虚线在正中间，所以平行四边形的高是三角形高的一半：${h} ÷ 2 = <b>2</b> 格，底还是 ${b}。</p><p>这样看，÷ 2 也可以理解成“高减半”：${b} × (${h} ÷ 2)。</p>`};
  return {form,kind:'choice',scene,meta:{type:'area'},
    prompt:'沿虚线（两条边的中点连线）切下上面的小三角形，转到右下方虚线的位置，拼成一个平行四边形。原来的三角形面积是多少格？',
    options:numOpts(b*2,[b*4,b*8,b+4],' 格'),ans:N(b*2),
    explain:`<p>拼成的平行四边形底 ${b}、高 2，面积 ${b} × 2 = <b>${b*2}</b> 格。割补不改变面积，三角形也是 ${b*2} 格。</p>`};}

/* ---------- 0-2 别被样子骗了 ---------- */
const F02=['rp_eq','rp_less','tt_eq','tt_diff','pp_eq','tr_eq','tr_less','trr_eq','trr_less','three','pairfind'];
function g02(form){form=form||pick(F02);
  const h=4,b=R(3,5);let A,B,why;
  if(form==='three'){
    const sh=tag(shuffle([{t:'rect',a:b,b,off:0},{t:'para',a:b-1,b:b-1,off:b-1},{t:'tri',a:0,b:2*b-1,off:2*b+1}]));const ord=asc(sh);
    return {form,kind:'order',h,shapes:sh,ans:ord,meta:{type:'order'},
      prompt:'三个图形夹在同一组平行线之间。按面积从小到大，依次点一点。',
      explain:`<p>高相同，样子不算数，只比“底”这一部分：</p>${list(sh)}<p>从小到大：<b>${ord.map(i=>sh[i].name).join(' ＜ ')}</b></p>`};}
  if(form==='pairfind'){const p=R(4,8)/2,ts=shuffle(T4),ws=shuffle([p,p,p+pick([0.5,1]),Math.max(1,p-pick([0.5,1]))]);
    const sh=tag(ts.map((t,i)=>{const s=mk(t,ws[i],h,0.5);if(t==='para')s.off=s.b;if(t==='tri')s.off=s.b+1;return s;}));
    const ans=sh.map((s,i)=>i).filter(i=>same(eff(sh[i]),p));
    return {form,kind:'pick',need:2,h,shapes:sh,ans,meta:{type:'eqpair'},
      prompt:'四个图形夹在同一组平行线之间，其中有两个面积相等。把它们点出来。',
      explain:`<p>高相同，只比“底”这一部分：</p>${list(sh)}<p>相等的是 <b>${ans.map(i=>sh[i].name).join(' 和 ')}</b>。</p>`};}
  if(form==='rp_eq'){A={t:'rect',a:b,b,off:0};B={t:'para',a:b,b,off:b,cut:{}};
    why=`平行四边形看起来更长，但它的底也是 ${b}，高相同。切下左边的三角形移到右边，就是一个底 ${b} 的矩形。`;}
  else if(form==='rp_less'){A={t:'rect',a:b,b,off:0};B={t:'para',a:b-1,b:b-1,off:b-1,cut:{}};
    why=`平行四边形斜着伸得很远，但它的底只有 ${b-1}，割补以后是底 ${b-1} 的矩形，比底 ${b} 的矩形小。`;}
  else if(form==='tt_eq'){A={t:'tri',a:0,b,off:b/2};B={t:'tri',a:0,b,off:b+R(2,3)};
    why=`两个三角形的底都是 ${b}，高相同。顶点沿着上面那条线滑到哪里，面积都是底 × 高 ÷ 2，不会变。`;}
  else if(form==='tt_diff'){A={t:'tri',a:0,b,off:b/2};B={t:'tri',a:0,b:b-1,off:b+2};
    why=`歪着的三角形伸得远，但底只有 ${b-1}。等高时只看底，底 ${b} 的更大。`;}
  else if(form==='pp_eq'){A={t:'para',a:b,b,off:1};B={t:'para',a:b,b,off:b};
    why=`两个平行四边形的底都是 ${b}，高相同。斜得多还是斜得少，面积都是底 × 高。`;}
  else if(form==='tr_eq'||form==='tr_less'){const a=1,bb=2*b-1+(form==='tr_less'?-1:0),p=form==='tr_eq'?b:b;
    A={t:'trap',a,b:bb,off:R(0,2)};B={t:'rect',a:p,b:p,off:0};
    why=form==='tr_eq'?`梯形的下底很长，但上底只有 ${a}。上底加下底的一半是 (${a} + ${bb}) ÷ 2 = ${N((a+bb)/2)}，正好等于矩形的底 ${p}。`
      :`梯形的下底 ${bb} 比矩形的底长，但上底只有 ${a}。上底加下底的一半是 (${a} + ${bb}) ÷ 2 = ${N((a+bb)/2)}，比矩形的底 ${p} 小。`;}
  else{const tb=form==='trr_eq'?2*b:2*b-1;A={t:'tri',a:0,b:tb,off:R(1,tb-1)};B={t:'rect',a:b,b,off:0};
    why=form==='trr_eq'?`三角形的底是 ${tb}，比矩形长一倍，但三角形只算一半：${tb} ÷ 2 = ${b}，和矩形的底相等。`
      :`三角形的底 ${tb} 长得多，但只算一半：${tb} ÷ 2 = ${N(tb/2)}，比矩形的底 ${b} 小。`;}
  const sh=tag(Math.random()<0.5?[B,A]:[A,B]);
  return {form,kind:'choice',scene:{h,hLabel:['高相等'],shapes:sh},meta:{type:'cmp'},
    prompt:'甲和乙夹在同一组平行线之间。谁的面积大？',options:CMP,ans:verdict(sh),explain:`<p>${why}</p>`};}

