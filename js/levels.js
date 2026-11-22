// 关卡表：关卡顺序、名称、所属阶段
/* ---------- 关卡表 ---------- */
const LV=[
 {id:'0-1',name:'割补说理',goal:'公式里的每一步是从哪里来的',gen:g01,forms:F01},
 {id:'0-2',name:'别被样子骗了',goal:'看起来大，不一定真的大',gen:g02,forms:F02},
 {id:'1-1',name:'两两比较',goal:'高相同，不用算面积也能比',gen:g11,forms:F11},
 {id:'1-2',name:'多图排序',goal:'几种图形排队，有的数用不上',gen:g12,forms:F12},
 {id:'1-3',name:'倒推底边',goal:'知道面积关系，反过来求底',gen:g13,forms:F13},
 {id:'1-4',name:'不知道高',goal:'高没给数，还能比吗',gen:g14,forms:F14},
 {id:'大关一',name:'限时挑战',goal:'阶段 0–1 综合，10 题对 8 题',boss:true,pool:[0,1,1,2,2,2,4,4,5,5],done:'阶段 0–1 全部完成。'},
 {id:'2-1',name:'高是字母',goal:'高不知道，就用 h 写出面积',gen:g21,forms:F21},
 {id:'2-2',name:'底也是字母',goal:'底用 a 表示，照样能比',gen:g22,forms:F22},
 {id:'2-3',name:'两个字母',goal:'a 和 b 是什么关系时面积相等',gen:g23,forms:F23},
 {id:'2-4',name:'梯形的式子',goal:'上底 a、下底 b，和谁一样大',gen:g24,forms:F24},
 {id:'2-5',name:'差与倍',goal:'答案是一个式子，不是一个数',gen:g25,forms:F25},
 {id:'2-6',name:'能不能确定',goal:'有字母不等于无法确定',gen:g26,forms:F26},
 {id:'2-7',name:'列方程',goal:'把未知的底设为 x',gen:g27,forms:F27},
 {id:'大关二',name:'限时挑战',goal:'阶段 2 综合，10 题对 8 题',boss:true,pool:[7,8,8,9,10,10,11,12,12,13],done:'阶段 2 全部完成。'}
];
const STAGES=[['阶段 0　想清楚公式',0,2],['阶段 1　不算也能比',2,7],['阶段 2　用字母说话',7,15]];
function make(i,form){const q=LV[i].gen(form);q.src=i;return q;}
function bossList(i){return shuffle(LV[i].pool).map(j=>make(j));}

