import * as THREE from 'three';

// Five independently composed places. Shared helpers only supply visual materials.
export function buildLayout(id,k){
  const {b,label,house,tree,water,lamp,npc,smoke,fence,obstacle,action,root,motions,glowing,lights,wood,stone,grass,r,mat,say,select,inventory,player}=k;
  let spawn=[0,7],height=()=>.07,blocked=()=>false;
  function cylinder(x,y,z,radius,h,color,sides=12){const m=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,h,sides),typeof color==='string'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;root.add(m);return m}
  function stones(points,width=1.7,y=.05){for(let i=0;i<points.length-1;i++){const [x,z]=points[i],[xx,zz]=points[i+1],dist=Math.hypot(xx-x,zz-z);for(let a=0;a<dist;a+=.42){const t=a/dist;for(let j=0;j<3;j++){const p=b(x+(xx-x)*t+(j-1)*width*.32,y,z+(zz-z)*t,width*.3,.07,.4,stone);p.rotation.y=r(-.12,.12)}}}}
  function barrel(x,z,y=0){cylinder(x,y+.38,z,.33,.76,wood);for(const h of [.16,.6])cylinder(x,y+h,z,.35,.06,'#667767');obstacle(x,z,.65,.65)}
  function crate(x,z,y=0){b(x,y+.28,z,.68,.55,.57,wood);for(const dx of [-.26,.26])b(x+dx,y+.28,z+.3,.065,.51,.04,'#b9a077')}
  function flowers(x,z,n=12,y=0){for(let i=0;i<n;i++){const px=x+r(-.75,.75),pz=z+r(-.55,.55),h=r(.15,.4);b(px,y+h/2,pz,.035,h,.035,'#708b54');b(px,y+h,pz,.12,.06,.12,['#c2a3a9','#e1cf95','#bca68b'][i%3])}}
  function bench(x,z,y=0){for(const dx of [-.8,.8])b(x+dx,y+.28,z,.1,.55,.55,'#536b5d');for(let i=0;i<3;i++)b(x,y+.6,z-.25+i*.2,2,.1,.16,wood);b(x,y+.95,z-.37,2,.4,.1,wood);obstacle(x,z,2,.7)}
  function cloth(x,y,z,w,h,color){const m=b(x,y,z,w,h,.03,color);motions.push(t=>{m.rotation.x=Math.sin(t*1.5+x)*.09;m.rotation.y=Math.sin(t*.8+z)*.07});return m}
  function lantern(x,y,z){const material=new THREE.MeshStandardMaterial({color:'#d8b37d',emissive:'#ffc77d',emissiveIntensity:0});cylinder(x,y,z,.22,.46,material,8);glowing.push(material);b(x,y+.29,z,.09,.15,.08,'#6b735e');const light=new THREE.PointLight('#ffd396',0,5,2);light.position.set(x,y,z);root.add(light);lights.push(light)}
  function seated(x,z,y=0){player.g.position.set(x,y+.32,z);player.g.rotation.y=0;say('坐一会儿，听听这里的声音。按方向键起身。')}
  function cropBed(x,z,w,d,angle=0,y=0){const group=new THREE.Group();group.position.set(x,y,z);group.rotation.y=angle;root.add(group);const soil=b(0,.08,0,w,.16,d,'#736247',group);for(let row=0;row<3;row++)for(let col=0;col<Math.floor(w/.45);col++){const px=-w/2+.22+col*.45,pz=-d/2+.2+row*(d-.4)/2;for(const side of [-1,1]){const leaf=b(px+side*.08,.3,pz,.24,.09,.2,row%2?'#91a15c':'#688951',group);leaf.rotation.z=side*.6}}motions.push(t=>{group.rotation.z=Math.sin(t*1.5+x)*.014});return {group,soil}}

  if(id===1){
    // A farmhouse wraps a round wash-well court; angled gardens fan out to the east.
    spawn=[-.5,7];
    house(-6,-3.8,8,4.6,'槐 荫 老 宅');house(-10,-.6,3,3,'柴 房');smoke(-7,4.4,-4.5);
    b(-6,.13,-.6,8.8,.22,1.9,wood);for(const x of [-9.7,-2.3])b(x,1.5,0,.13,3,.13,'#66735d');b(-6,3,0,7.7,.13,.18,'#6b785f');
    for(let i=0;i<11;i++){const x=-9.4+i*.65;cloth(x,2.62,.06,.45,.43,i%2?'#969f77':'#9eaa82')}
    stones([[-1,10],[-1,6],[-3,3],[-5,1],[-6,-.8]]);stones([[-3,3],[1,3],[5,1],[10,-2]]);
    cylinder(-2.3,.035,2.7,2.7,.07,stone,24);cylinder(-2.3,.38,2.7,.66,.76,'#8e9880');cylinder(-2.3,.78,2.7,.79,.1,'#b6bba0');cylinder(-2.3,.84,2.7,.54,.015,'#354f50');
    for(const x of [-3.15,-1.45])b(x,1.3,2.7,.1,2.6,.1,'#69755a');b(-2.3,2.55,2.7,2.1,.14,.16,'#687458');b(-2.3,1.9,2.7,.025,1.2,.025,'#b1a27c');obstacle(-2.3,2.7,1.6,1.6);
    action(-2.3,4.4,'打一桶井水',()=>say('木桶落入井里，带上来一桶清凉的水。'));bench(-7,1.4);barrel(-9,1);crate(-4,-.25);crate(-3.2,-.25);
    const beds=[];for(const [x,z,w,d,a] of [[3.6,4.9,3.8,1.5,.3],[5,2.9,4.6,1.5,.3],[6.4,.7,4.7,1.5,.3],[8,-1.5,4.3,1.5,.3]])beds.push(cropBed(x,z,w,d,a));
    let watered=false,harvested=false;
    action(2.5,5.6,'浇水 / 收获青菜',()=>{if(!watered){watered=true;beds.forEach(p=>p.soil.material=mat('#485542'));say('田垄浇透了。再按 E，收一篮已经成熟的青菜。')}else if(!harvested){harvested=true;beds[0].group.visible=false;inventory.produce++;say('收到一篮青菜。去主街的收菜亭交给街坊。')}else say('这一垄已经收完，其他青菜还在慢慢长。')});label('今日菜畦',2.5,.8,5.4,1.7,.37);
    // A shaded rear pond and a small duck landing; no rectangular corner pond.
    for(let j=0;j<8;j++){const z=-8.1+j*.48,w=3.8*Math.sqrt(Math.max(.1,1-Math.pow((j-3.5)/4.3,2)));water(7.8,z,w,.49,.03)}obstacle(7.8,-6.4,3.9,4.2);
    for(let i=0;i<10;i++)b(7.8,.2,-3.9+i*.12,1.5,.12,.1,wood);flowers(5.3,-5);flowers(10,-5);tree(3,-7,.95);tree(11,-8,1.2);
    action(7.8,-3,'看池边的鸭子',()=>say('鸭子拨开水纹，钻进了树荫里。'));
    for(let i=0;i<3;i++){const duck=new THREE.Group();root.add(duck);b(0,.08,0,.42,.2,.24,'#d2d3b0',duck);b(.2,.2,0,.16,.24,.15,'#749073',duck);b(.33,.23,0,.13,.045,.08,'#c1ab62',duck);motions.push(t=>{duck.position.set(7.7+Math.sin(t*.3+i)*.9,.09,-6.4+Math.cos(t*.3+i)*.8);duck.rotation.y=-t*.3-i})}
    for(const [x,z] of [[-11,5],[-8,7],[-5,8.5]]){tree(x,z,.76);flowers(x+.8,z,8)}fence(7,8,10);fence(-10,9,5);lamp(-.4,5.5);lantern(-4,2.3,.15);
    for(let i=0;i<4;i++){const chicken=new THREE.Group();root.add(chicken);b(0,.3,0,.3,.32,.4,'#dfcda4',chicken);b(.15,.52,.1,.17,.2,.17,'#e2d1ae',chicken);b(.15,.64,.1,.1,.07,.07,'#bc7b68',chicken);motions.push(t=>{chicken.position.set(-10+Math.sin(t*.45+i)*.8,0,3+i*.6);chicken.rotation.y=Math.sin(t*.6+i)*.7})}
    label('主街 →',12,1.1,5,2,.4);action(12,5,'去村口主街',()=>select(2));action(-6,.3,'进入老宅',()=>select(5));
  }

  if(id===2){
    // An offset market lane winds around a communal tree court, not a crossroads.
    spawn=[-10,7.5];stones([[-12,9],[-9,6],[-4,3],[1,3],[5,0],[8,-4],[10,-8]],2.5);
    house(-9,-4.2,6,4,'旧 时 杂 货');house(1,-8,6.5,4,'春 山 邮 局');house(9,-1.5,5.5,4,'井 边 茶 铺');
    cylinder(-2,.04,-.1,3.1,.09,stone,24);cylinder(-2,.23,-.1,1.2,.45,'#8b927a');tree(-2,-.1,.88);flowers(-2,-.1,15,.44);obstacle(-2,-.1,2.7,2.7);
    bench(-4,1.6);bench(.3,-1.7);npc(-4.2,3.4);npc(3.3,1.1,'#9c9675');npc(-8,-1.5,'#6d8070');
    // Shop awning, hanging drying baskets, stall roofs and individual parcel crates.
    for(let i=0;i<8;i++){const panel=b(-11.5+i*.7,2.7,-1.4,.66,.12,1.5,i%2?'#b4ac7b':'#7d9277');panel.rotation.x=.12}for(const x of [-11.7,-6.2])b(x,1.4,-.7,.07,2.8,.07,'#67785f');
    function stall(x,z,color){b(x,.9,z,2.8,.17,1.3,wood);for(const dx of [-1.2,1.2])b(x+dx,1.3,z,.09,2.6,.09,'#6b795d');b(x,2.65,z,3.1,.13,1.8,color);for(let j=0;j<9;j++){crate(x-1+j%3*.72,z-.2+Math.floor(j/3)*.3,.98);b(x-1+j%3*.72,1.65,z-.2+Math.floor(j/3)*.3,.25,.18,.23,['#879e59','#bb9863','#c5b179'][j%3])}obstacle(x,z,2.8,1.3)}
    stall(-6,5.5,'#b48b6f');stall(5.4,5.7,'#8d9b72');label('街坊收菜亭',5.4,2.1,6.62,2.7,.4);
    let delivered=false;action(5.4,7.1,'交一篮青菜',()=>{if(inventory.produce){inventory.produce--;delivered=true;crate(7.6,6);label('今日鲜蔬',7.6,1,6.35,1.4,.3);say('青菜摆上摊位，街坊向你招了招手。')}else say(delivered?'「今天这篮菜很新鲜，下次再来呀。」':'「自己种的青菜？收好之后送到这里就行。」')});
    b(-10,1.55,4,2.1,1.5,.14,'#68765c');label('本 周 小 事',-10,1.8,4.13,1.9,.4);label('新茶 / 收菜 / 河湾修闸',-10,1.3,4.14,1.9,.3,'#d4c8a4','#58694f',23);action(-10,5.5,'阅读村口公告',()=>say('周三收菜，周五赶集。桥边水闸修好了，欢迎顺路看看。'));
    for(let i=0;i<8;i++)crate(-.8+i%3*.8,-5.4+Math.floor(i/3)*.65);b(2,1.6,-5.4,.6,1.3,.5,'#6e8774');label('邮',2,1.75,-5.07,.43,.38);barrel(6.2,-3);
    for(let i=0;i<3;i++){b(6.8+i*.8,.68,1.3,.55,.08,.55,wood);b(6.8+i*.8,.35,1.3,.09,.7,.09,'#697960')}smoke(7.6,1.1,1.3);action(7.6,2.5,'和茶铺主人聊聊',()=>say('「过桥往上走，稻田边新开了一家民宿。赶日落正好。」'));
    for(let i=0;i<9;i++){const x=-8+i*1.8;lantern(x,3.4+Math.sin(i*.5)*.3,3.8-i*.25)}
    tree(-13,2,.9);tree(12,5,.8);flowers(1,6.5);flowers(-6,-1.5);lamp(-10,7);lamp(4,3);
    action(-12,8.5,'回农场',()=>select(1));action(11,-7.6,'去河湾竹桥',()=>select(3));label('河湾 ↗',11,1.1,-7.6,2,.4);action(12,7.5,'去梯田民宿',()=>select(4));label('山路 →',12,1.1,7.5,2,.4);
  }

  if(id===3){
    // The river meanders diagonally. A raised humpback bridge crosses the narrow bend.
    spawn=[-7.5,3.2];const center=z=>Math.sin(z*.23)*3.2;const riverWidth=4.3;
    for(let z=-17;z<18;z+=.48){const x=center(z);water(x,z,riverWidth,.5,.015);for(const side of [-1,1])b(x+side*2.32,.1,z,.38,.25,.5,stone)}
    const bridgeZ=1.2,bridgeY=x=>.12+.66*Math.sin(THREE.MathUtils.clamp((x+3.4)/8,0,1)*Math.PI);
    for(let x=-3.4;x<4.7;x+=.24){const y=bridgeY(x);b(x,y,bridgeZ,.23,.16,1.9,wood);for(const z of [bridgeZ-.97,bridgeZ+.97]){b(x,y+.85,z,.25,.065,.065,'#adb28b');if(Math.round((x+3.4)/.24)%4===0)b(x,y+.43,z,.08,.86,.08,'#809575')}}
    height=(x,z)=>x>-3.55&&x<4.85&&Math.abs(z-bridgeZ)<1.2?bridgeY(x)+.09:.07;
    blocked=(x,z)=>Math.abs(x-center(z))<2.4&&!(x>-3.55&&x<4.85&&Math.abs(z-bridgeZ)<.75);
    stones([[-13,7],[-9,5],[-6,2],[-3.7,bridgeZ]],1.8);stones([[4.9,bridgeZ],[8,-.5],[10,-4],[12,-7]],1.8);
    // A raised fishing shelter occupies the inside of the bend.
    const deckX=-7.4,deckZ=-4.3;b(deckX,.24,deckZ,4,.3,3,wood);for(const dx of [-1.7,1.7])for(const dz of [-1.2,1.2])b(deckX+dx,1.7,deckZ+dz,.12,3,.12,'#77896b');for(let i=0;i<12;i++){const roof=b(deckX-2.1+i*.37,3.35,deckZ,.35,.15,3.9,'#66786a');roof.rotation.z=.03}bench(deckX,deckZ+.3,.4);obstacle(deckX,deckZ,4,3);action(-7.4,-2,'坐在听水亭',()=>seated(-7.4,-2,.05));label('听 水 亭',-7.4,2.55,-2.5,2,.5);
    // Split bamboo clumps instead of an evenly planted block.
    for(const [cx,cz] of [[9,5],[11,-6],[-12,-6]])for(let i=0;i<12;i++){const x=cx+r(-1.2,1.2),z=cz+r(-1.5,1.5),h=r(2.8,5);b(x,h/2,z,.085,h,.085,'#779968');for(let y=.5;y<h;y+=.65){b(x,y,z,.115,.05,.115,'#b2bd87');for(const side of [-1,1]){const leaf=b(x+side*.22,y+.14,z,.52,.04,.19,'#699466');leaf.rotation.z=side*.45;motions.push(t=>leaf.rotation.y=Math.sin(t*1.8+x)*.18)}}}
    for(const [x,z] of [[4,6],[5,9],[-4,-9],[-5,-11]])flowers(x,z,18);
    b(-4.5,.3,6.4,2.2,.5,1.8,stone);const gate=b(-3.5,.8,6.4,.15,1.45,1.5,'#71887b');const wheel=new THREE.Group();root.add(wheel);wheel.position.set(-5,1.1,6.4);for(let i=0;i<8;i++){const spoke=b(0,0,0,.08,1.6,.1,'#948865',wheel);spoke.rotation.z=i*Math.PI/4}let open=false;motions.push(t=>wheel.rotation.z=t*(open?1.1:.15));action(-5.3,7.8,'开关支渠水闸',()=>{open=!open;gate.position.y=open?2:.8;say(open?'闸门升起，支渠的水轮转快了。':'闸门落下，河面又慢了下来。')});label('灌溉支渠',-5.3,1.4,7.2,2,.4);
    tree(-12,4,.9);tree(12,9,.9);tree(6,-9,1.1);npc(-10,4.5);lamp(-4,2.8);lamp(5.5,1.5);
    action(-12.5,7.5,'回村口主街',()=>select(2));action(12,-7.8,'沿山路去梯田',()=>select(4));label('主街 ←',-12.5,1.1,7.5,2,.4);label('山路 ↗',12,1.1,-7.8,2,.4);
  }

  if(id===4){
    // Contour-following terraces curl across the hill; a winding stair climbs through them.
    spawn=[-1,8.5];const edge=(level,x)=>[5.6,1.6,-2.5][level]+Math.sin(x*.23)*.8;
    const rawHeight=(x,z)=>z>edge(0,x)?0:z>edge(1,x)?1:z>edge(2,x)?2:3;
    const stairX=z=>-1+Math.sin(z*.35)*2.1;
    height=(x,z)=>{if(Math.abs(x-stairX(z))<1.15){let h=0;for(let l=0;l<3;l++)h+=THREE.MathUtils.clamp((edge(l,x)+.7-z)/1.4,0,1);return h+.1}return rawHeight(x,z)+.1};
    for(let x=-13;x<13;x+=.5)for(let z=-11;z<9;z+=.5){const h=rawHeight(x,z);if(h>0)b(x,h/2-.025,z,.51,h,.51,grass);if(Math.abs(z-edge(h-1,x))<.6&&h>0)b(x,h-.18,z,.51,.36,.51,stone)}
    for(let z=8.5;z>-8;z-=.23){const x=stairX(z),y=height(x,z);b(x,y-.045,z,2.25,.15,.24,stone)}
    blocked=(x,z)=>Math.abs(height(x,z)-player.g.position.y)>.12;
    for(let level=0;level<3;level++)for(const side of [-1,1])for(let col=0;col<18;col++){const x=side*(3.5+col*.46),z=edge(level,x)-1.1,y=level+1;for(let j=0;j<3;j++){const zz=z-j*.4;const stem=b(x,y+.34,zz,.035,.5,.035,'#93a76b');const grain=b(x+.045,y+.59,zz,.1,.1,.08,'#d1bb71');motions.push(t=>{const lean=Math.sin(t*1.8+x*.3+zz*.4)*.12;stem.rotation.z=lean;grain.position.x=x+.045+lean*.3})}}
    house(-7,-7.8,7,4,'望 田 山 舍',3);smoke(-8,7.7,-8);obstacle(-7,-7.8,7,4);b(-7,3.17,-4.8,7.9,.25,1.8,wood);flowers(-10,-4.6,12,3.2);flowers(-4,-4.7,12,3.2);action(-7,-3.8,'喝一杯山茶',()=>say('主人把热茶放在栏边。这里能看见刚刚走过的每一层田。'));
    b(7.5,3.12,-6.5,5,.22,3.5,wood);for(const x of [5.3,9.7])for(const z of [-8,-5])b(x,3.65,z,.08,1.1,.08,'#7e9277');for(const z of [-8,-5])b(7.5,4.1,z,4.5,.08,.08,'#a8b391');bench(7.5,-6.5,3.2);action(7.5,-4.2,'坐下看梯田',()=>seated(7.5,-4.2,3));label('日 落 台',7.5,4.2,-4.6,2,.5);
    for(const [x,z] of [[-12,-9],[12,-7],[-12,6]])tree(x,z,.9);lamp(-3,6);lamp(3,-3,5.4);lantern(-6,5.2,-4.7);
    for(let i=0;i<6;i++){const mountain=new THREE.Mesh(new THREE.ConeGeometry(5.5,6+i%3*2,5),mat(i%2?'#829c98':'#698782'));mountain.position.set(-22+i*9,4,-24-i%2*4);root.add(mountain)}
    action(-1,8.6,'下山到河湾',()=>select(3));label('↓ 河湾',-1,1.1,9.1,2,.4);
  }

  if(id===5){
    // A roofless L-shaped home: a rear reading gallery, stove nook and sleeping alcove.
    spawn=[6,5.5];height=()=>.17;
    b(0,.035,0,18,.25,14,wood);for(let z=-6.8;z<7;z+=.46)b(0,.17,z,18,.012,.025,'#827153');
    b(0,1.7,-7,18,3.4,.24,'#a9ac8c');b(-9,1.7,0,.24,3.4,14,'#a0a78b');b(9,.45,0,.24,.9,14,'#a0a78b');
    // Doorway partition divides the bedroom from the open family room.
    b(-3.4,1.15,3.8,.16,2.3,5.6,'#768775');obstacle(-3.4,3.8,.2,5.6);b(-6.4,.42,4,3.6,.5,4.6,wood);b(-6.4,.76,4,3.5,.18,4.4,'#aeb89d');b(-6.4,.9,4.5,3.5,.15,3.3,'#839c91');b(-6.4,.94,2.2,2.8,.19,.65,'#ded6b1');obstacle(-6.4,4,3.6,4.6);
    // Windows face the central reading area; the lower panes remain visibly framed.
    for(const x of [-6.2,-2.8,1]){b(x,2,-6.82,2.6,1.9,.13,'#506b61');const win=new THREE.MeshStandardMaterial({color:'#9fb6a3',emissive:'#bbaa7c',emissiveIntensity:0});b(x,2,-6.73,2.4,1.65,.07,win);glowing.push(win);for(const dx of [-.8,0,.8])b(x+dx,2,-6.67,.045,1.7,.035,'#ddd0a5');b(x,2,-6.65,2.4,.045,.035,'#ddd0a5')}
    b(-4,1,-4.7,6,.16,1.6,wood);obstacle(-4,-4.7,6,1.6);for(const x of [-6.7,-1.3])b(x,.5,-4.7,.1,1,.1,'#66725c');for(let i=0;i<8;i++)b(-5.8+i*.22,1.19,-4.7,.16,.25,.38,['#8a9780','#b5aa7e','#8b7b66'][i%3]);b(-2.3,1.12,-4.6,.6,.05,.8,'#d5c9a6');
    // Green tiled cooking nook and shelves occupy the far right, not the back-left.
    b(6,1.05,-3.6,4.5,1.9,2.8,'#7f9987');obstacle(6,-3.6,4.5,2.8);for(let x=4;x<8.3;x+=.43)for(let y=.25;y<1.9;y+=.4)b(x,y,-2.17,.4,.37,.025,'#91aa98');b(6,2.06,-3.6,4.7,.16,3,'#5c7066');cylinder(5.1,2.24,-3.6,.5,.25,'#485d56');smoke(5.1,2.5,-3.6);
    b(6,2.7,-6.7,4.5,.14,.65,wood);for(let i=0;i<6;i++)cylinder(4.4+i*.6,2.93,-6.65,.18,.35,['#b9a17c','#a6b295','#c7baa0'][i%3]);
    const rug=b(1,.18,1.2,5.7,.02,4.7,'#8e9e81');for(let z=-.9;z<3.4;z+=.38)b(1,.195,z,5.35,.008,.07,'#b3b38e');
    const table=b(1,1.04,1.2,3.4,.18,2.2,wood);table.rotation.y=.15;obstacle(1,1.2,3.6,2.6);for(const x of [-.4,2.4])for(const z of [.45,1.95])b(x,.55,z,.12,1,.12,'#67765e');cylinder(.5,1.25,1.2,.16,.25,'#dbcfaa');smoke(.5,1.5,1.2);b(1.6,1.18,1.2,.7,.045,.6,'#b8b599');bench(1,3.5);
    b(-7.5,.36,-.8,1.5,.3,1.2,'#a0a989');const cat=new THREE.Group();cat.position.set(-7.5,.52,-.8);root.add(cat);b(0,.2,0,.78,.35,.44,'#c7ad81',cat);b(.33,.3,.1,.32,.3,.3,'#d5bd8f',cat);for(const x of [.23,.43])b(x,.52,.1,.1,.14,.1,'#c7ad81',cat);motions.push(t=>cat.scale.y=1+Math.sin(t*2)*.035);action(-7.5,.5,'摸摸午睡的猫',()=>{cat.rotation.y+=.3;say('它眯起眼睛，把脑袋靠进你的手心。')});
    for(let i=0;i<3;i++){b(-8.82,2,2+i, .1,.75,.6,'#7d7258');label(['故乡','家人','春天'][i],-7.8,2,-6.6+i*.02,.65,.45)}
    action(-3.3,-3.3,'翻看旧相册',()=>say('夹在书页里的车票，已经褪成淡黄色。照片里的村子还没有路灯。'));
    action(-6.4,1,'躺下休息',()=>{document.querySelector('#night').click();say('睡醒后，窗外换了一种颜色。')});action(1,4.7,'坐下喝茶',()=>seated(1,4.5,.2));
    lantern(-4,2.7,-3);lantern(2,3.3,1);lamp(7,-5.9,3.3);flowers(7,3,8,.2);barrel(7.5,4.6,.2);
    action(6,6,'推门回到农场',()=>select(1));label('↓ 院子',6,.8,6.5,1.5,.35);
  }
  return {spawn,height,blocked};
}
