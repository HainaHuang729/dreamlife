import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import './style.css';
import { createVillage } from './village.js';

// Every surface and sprite is generated locally; no external image assets.
let seed = 425;
function rand(a=0,b=1){seed=(seed*1664525+1013904223)>>>0;return a+(seed/4294967296)*(b-a)}
const scene=new THREE.Scene();scene.background=new THREE.Color('#a4b677');
const camera=new THREE.OrthographicCamera(-20,20,12,-12,.1,150);
const renderer=new THREE.WebGLRenderer({antialias:false,alpha:false});
renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor('#a4b677');
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.23,.65,1.05);composer.addPass(bloom);composer.addPass(new OutputPass());
scene.fog=new THREE.Fog('#a3ad83',48,90);
document.querySelector('#world').append(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minZoom=.65;controls.maxZoom=2.2;controls.minPolarAngle=.35;controls.maxPolarAngle=1.2;controls.minAzimuthAngle=-.65;controls.maxAzimuthAngle=.65;
function reset(zoom=1){camera.position.set(0,29,35);controls.target.set(0,0,0);camera.zoom=typeof zoom==='number'?zoom:1;camera.updateProjectionMatrix();controls.update()}reset();
const ambient=new THREE.HemisphereLight('#b9cce2','#44445d',.95);scene.add(ambient);
const sun=new THREE.DirectionalLight('#ffe0a0',4.8);sun.position.set(-16,19,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-25,right:25,top:25,bottom:-25,near:1,far:80});sun.shadow.bias=-.00015;sun.shadow.normalBias=.035;sun.shadow.radius=1.4;scene.add(sun);
const rim=new THREE.DirectionalLight('#a6bed5',.55);rim.position.set(9,8,-13);scene.add(rim);
const mats=new Map();function mat(color){if(!mats.has(color))mats.set(color,new THREE.MeshStandardMaterial({color,roughness:1}));return mats.get(color)}
const cube=new THREE.BoxGeometry(1,1,1);
function box(x,y,z,w,h,d,color,parent=scene){const m=new THREE.Mesh(cube,typeof color==='string'?mat(color):color);m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function texture(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;return t}
function wornMaterial(base,colors,wood=false){const map=texture(64,64,c=>{c.fillStyle=base;c.fillRect(0,0,64,64);for(let i=0;i<380;i++){c.fillStyle=colors[i%colors.length];c.fillRect(rand(0,64),rand(0,64),wood?rand(2,19):rand(1,4),wood?1:rand(1,3))}});return new THREE.MeshStandardMaterial({map,roughness:1})}
const timber=wornMaterial('#7c8565',['#707b5e','#8b906f','#67725b'],true);
const concrete=wornMaterial('#a8ae96',['#9aa48c','#b5b89f','#a0a68f']);
const groundTex=texture(256,256,(c,w,h)=>{c.fillStyle='#a4b86e';c.fillRect(0,0,w,h);for(let i=0;i<6500;i++){c.fillStyle=['#a9bd71','#bac77e','#92a772','#899d6b'][i%4];c.fillRect(rand(0,w),rand(0,h),rand(1,4),rand(1,3))}});groundTex.wrapS=groundTex.wrapT=THREE.RepeatWrapping;groundTex.repeat.set(6,6);
box(0,-.22,0,90,.4,70,new THREE.MeshStandardMaterial({map:groundTex,roughness:1}));
// Irregular pale stepping-stone path.
for(let i=0;i<160;i++){const z=rand(-22,21),x=rand(-2.4,2.4)+(z<6?-10:-9);const stone=box(x,.018,z,rand(.25,1.1),.06,rand(.3,.9),['#c5ca92','#bfc38c','#b1bb84'][i%3]);stone.rotation.y=rand(-.5,.5)}
// Raised concrete platform, railway and retaining wall.
box(0,.38,0,15,.8,9.2,'#777f78');box(0,.81,0,14.6,.12,8.9,concrete);
for(let x=-7;x<=7;x+=.52){box(x,.5,4.61,.47,.43,.13,x%2>.5?'#727c75':'#626e69');box(x,.89,3.98,.44,.05,.52,'#d7bb61');for(let j=0;j<3;j++)box(x-.13+j*.13,.924,3.99,.045,.012,.37,'#aa914b')}
for(const x of [-7.45,7.45]){box(x,.94,.2,.17,.28,8.8,'#ced0ae');box(x,.43,4.6,.5,.9,.45,'#8e9786')}
box(0,.05,7.1,70,.18,3.45,'#6d7771');
for(let x=-35;x<35;x+=.65)box(x,.18,7.1,.25,.15,3.25,['#7c7767','#8a8170','#6a746b'][Math.floor((x+35)/.65)%3]);
for(const z of [6.03,8.17]){box(0,.32,z,70,.18,.16,'#a4a69a');box(0,.23,z+.04,70,.13,.32,'#4c5960')}
for(let i=0;i<850;i++){const x=rand(-30,30),z=rand(5.45,8.8);box(x,.18,z,.09,.08,.13,['#94998b','#596566','#7e8478'][i%3])}
// Timber station with tiled pitched roof.
box(.5,2.5,-2.4,12,3.4,4.7,'#858d63');
for(let y=1;y<4.2;y+=.31)box(.5,y,-.015,12,.22,.1,timber);
for(const x of [-5.5,-3.7,-1.3,2.3,4.7,6.5])box(x,2.45,.07,.16,3.45,.2,'#535b57');
for(const x of [-3.4,4.35]){box(x,2.7,.1,2.2,1.65,.18,'#4c5659');box(x,2.72,.21,1.93,1.36,.07,'#607676');box(x,2.72,.26,.09,1.45,.07,'#c1ba88');box(x,2.7,.27,2,.09,.07,'#b4ae82');box(x,1.76,.28,2.45,.15,.45,'#555e59');box(x-.42,2.94,.26,.38,.48,.01,'#7b8b7b')}
box(.5,2.06,.13,2.6,2.48,.2,'#454e59');for(const x of [-.13,1.13]){box(x,2.08,.26,1.18,2.25,.08,'#626c65');box(x,2.58,.32,.87,.92,.05,'#788982');box(x+(x<0?.37:-.37),1.98,.36,.08,.27,.08,'#c4b96e')}
box(.5,.95,.63,3,.22,1.1,'#5e6861');box(.5,.49,4.87,3,.25,.6,'#9a9f8a');box(.5,.22,5.15,3,.24,.6,'#909985');
const roofMat=wornMaterial('#57626b',['#606d73','#495764','#768075']);
for(const side of [-1,1]){const roof=box(.5,4.67,-2.4+side*1.5,13.3,.16,3.3,'#3c4856');roof.rotation.x=side*.39;
for(let row=0;row<9;row++)for(let col=0;col<40;col++){const z=-2.4+side*(row*.355+.025),y=5.31-row*.146;const tile=box(-6.03+col*.335,y,z,.322,.095,.41,roofMat);tile.rotation.x=side*.39;const lip=box(tile.position.x,y+.025,z+side*.16,.3,.065,.045,'#758077');lip.rotation.x=side*.39;if(rand()<.2){const moss=box(tile.position.x+rand(-.08,.08),y+.065,z,.15,.02,.18,['#81905d','#718257'][col%2]);moss.rotation.x=side*.39}}}
box(.5,5.42,-2.4,13.6,.22,.34,'#7e8370');box(.5,3.95,1.03,13.35,.27,.26,'#515650');
// Roof vent and old antenna.
box(3.6,5.45,-2.8,1.2,.75,.8,'#8e9278');box(3.6,5.86,-2.8,1.45,.13,1,'#646e65');for(let x=3.2;x<4.1;x+=.18)box(x,5.48,-2.37,.05,.41,.03,'#596b62');box(-3.5,6,-2.6,.055,2,.055,'#646c63');box(-3.5,6.85,-2.6,1.8,.055,.05,'#7d8173');
function sign(text,x,y,z,w,h,bg='#d8d2a1',fg='#354d40',size=36,parent=scene){const tex=texture(256,64,(c)=>{c.fillStyle=bg;c.fillRect(0,0,256,64);c.strokeStyle=fg;c.lineWidth=2;c.strokeRect(4,4,248,56);c.fillStyle=fg;c.font=`bold ${size}px "Microsoft YaHei",sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(text,128,32,238)});const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide,toneMapped:false}));m.position.set(x,y,z+.045);parent.add(m);return m}
box(.5,3.53,1.3,4.7,.85,.3,'#66594e');sign('青 苔 车 站',.5,3.53,1.46,4.4,.65);
sign('M O S S   •   0 4 2 5',.5,4.17,1.1,3.7,.27,'#484e48','#d9b976',19);
// Station props: vending machine, bench, noticeboard, pots.
box(4.65,1.76,1.4,.87,1.8,.7,'#b78b64');box(4.65,2.06,1.78,.66,.79,.04,'#455e61');
for(let row=0;row<3;row++)for(let col=0;col<3;col++){box(4.44+col*.2,1.81+row*.23,1.82,.1,.15,.05,['#d1b475','#a4bcb0','#d78469'][col])}
box(4.64,1.24,1.78,.48,.17,.05,'#3e5153');box(4.95,1.68,1.8,.1,.13,.05,'#e8d188');sign('つめたい',4.65,2.54,1.77,.76,.25,'#6d8571','#ebe6b8',26);
for(const x of [-3.8,-2.1])box(x,1.1,1.35,.12,.55,.6,'#485b59');for(let i=0;i<3;i++)box(-2.95,1.35,1.1+i*.2,2.4,.13,.15,'#b59b65');for(let i=0;i<2;i++)box(-2.95,1.65+i*.22,.94,2.4,.17,.12,'#b59b65');
box(-5.2,2.3,.29,.86,1.3,.15,'#485f5b');sign('時 刻 表',-5.2,2.73,.38,.74,.22,'#b6bea0','#4b655a',26);for(let i=0;i<5;i++)box(-5.2,2.46-i*.16,.38,.61,.035,.02,'#a9b29a');
for(const x of [-5.9,6]){box(x,1.09,1.03,.51,.44,.51,'#9c8060');for(let j=0;j<7;j++)box(x+rand(-.24,.24),1.48+rand(0,.3),1.03+rand(-.2,.2),.26,.3,.22,'#6e8955')}
// Fabric banners and flower decorations.
for(const [x,color] of [[-4.75,'#b67465'],[5.8,'#797ca4']]){box(x,.97,2.6,.55,.13,.55,'#788b79');box(x,2.28,2.6,.07,2.6,.07,'#b0b198');box(x+.31,3.49,2.6,.77,.065,.07,'#697c6b');box(x+.3,2.67,2.6,.67,1.65,.07,color);sign('旅\u3000',x+.3,2.76,2.65,.51,.57,color,'#e2ddab',38);sign('日 和',x+.3,2.16,2.65,.52,.35,color,'#e2ddab',28)}
for(const x of [-2.2,3.2]){for(let i=0;i<4;i++)box(x+Math.sin(i*Math.PI/2)*.23,4.05+Math.cos(i*Math.PI/2)*.23,.65,.3,.3,.16,'#c488a2');box(x,4.05,.76,.19,.19,.1,'#e6d275');for(let i=0;i<3;i++)box(x+Math.sin(i*2)*.1,3.68-i*.2,.65,.18,.2,.12,'#78918a')}
// Weathered station name beside a gently moving flag.
for(const x of [9.3,11.5])box(x,1.12,3.5,.13,2.25,.13,'#596f62');box(10.4,2.05,3.5,2.8,1.18,.22,'#707966');sign('青 苔',10.4,2.08,3.62,2.6,.96,'#c5c5a0','#4c645d',45);box(10.4,2.69,3.5,3,.16,.4,'#c1bea1');
box(8.6,2.16,2.8,.1,4.4,.1,'#6a7c67');const flag=box(9.4,3.93,2.8,1.6,.65,.035,'#48596a');
// Railroad crossing, yellow-black boom and signal lamps.
const signals=[];
for(const [x,z] of [[-9.4,4.7],[-6.2,9.65]]){box(x,.3,z,.6,.55,.6,'#8d9276');box(x,1.7,z,.15,3,.15,'#dbbb61');for(let y=.7;y<2.7;y+=.45)box(x,y,z+.085,.17,.2,.02,'#596259');for(const r of [-.78,.78]){const b=box(x,3.15,z,.15,1.25,.14,'#e4c871');b.rotation.z=r}box(x,2.22,z+.13,.91,.36,.22,'#505a5c');for(const dx of [-.28,.28]){const light=box(x+dx,2.24,z+.27,.19,.2,.06,'#c97277');signals.push(light)}box(x,.84,z+.2,.46,.52,.3,'#718777')}
const boom=box(-8,1.18,4.7,3,.12,.13,'#d7be70');for(let i=0;i<6;i++)box(-9.4+i*.52,1.185,4.7,.2,.14,.15,'#647366');
// Perimeter wire fence.
for(let x=-27;x<28;x+=1.9){if(x>-11&&x<-6)continue;box(x,1,10,.085,1.8,.085,'#64796c');for(const y of [.55,1.3,1.8])box(x+.9,y,10,1.8,.035,.025,'#809181');for(let j=0;j<6;j++){const m=box(x+j*.31,.98,10,.018,1.5,.018,'#8c9b82');m.rotation.z=.38}}
// Dense, individually shaded pixel-block canopies, batched into one mesh.
const leaves=[];const leafColors=['#405c63','#456b5e','#4f775b','#638a59','#749555','#8ca453','#a0b157'];
function tree(x,z,s=1){const h=rand(3,5.3)*s;box(x,h/2,z,.46*s,h,.48*s,'#786e4d');box(x-.17*s,h/2,z+.25*s,.09*s,h*.95,.03,'#b39a57');for(let i=0;i<4;i++){const b=box(x+rand(-.3,.3),h*.7,z,.19*s,1.6*s,.2*s,'#7f7750');b.rotation.z=rand(-.7,.7)}for(let i=0;i<190;i++){const a=rand(0,Math.PI*2),r=Math.sqrt(rand())*2.2*s,dy=rand(-.9,1.15)*s;const lx=x+Math.cos(a)*r,lz=z+Math.sin(a)*r;leaves.push({x:lx,y:h+dy+(1-r/(2.5*s))*.8*s,z:lz,w:rand(.18,.52)*s,h:rand(.14,.38)*s,d:rand(.2,.58)*s,color:leafColors[Math.max(0,Math.min(6,Math.floor(3+(-lx+x)/s*.7+dy/s+rand(-1.5,1.5))))]})}}
for(let x=-25;x<=25;x+=2.4)for(let z=-15;z<=-8;z+=2.6)tree(x+rand(-.7,.7),z+rand(-.7,.7),rand(.8,1.2));
for(const side of [-1,1])for(let x=13;x<26;x+=2.6)for(let z=-6;z<17;z+=3)tree(side*x+rand(-.5,.5),z,rand(.8,1.25));
for(let x=-24;x<26;x+=2.3){if(x>-11&&x<-6)continue;tree(x,rand(16.5,18),rand(.65,.85))}
tree(-7.2,-3,1.12);tree(8,-4,1.3);
const foliage=new THREE.InstancedMesh(cube,mat('#ffffff'),leaves.length);const transform=new THREE.Object3D();leaves.forEach((l,i)=>{transform.position.set(l.x,l.y,l.z);transform.scale.set(l.w,l.h,l.d);transform.updateMatrix();foliage.setMatrixAt(i,transform.matrix);foliage.setColorAt(i,new THREE.Color(l.color))});foliage.castShadow=true;foliage.receiveShadow=true;scene.add(foliage);
for(let i=0;i<270;i++){const x=rand(-24,24),z=rand(-13,18);if(Math.abs(x)<8&&z<5&&z>-6||z>5.3&&z<10)continue;for(let j=0;j<3;j++){const grass=box(x+j*.09,.15,z,.055,rand(.15,.38),.05,['#7c9858','#92a45e','#c1c17a'][i%3]);grass.rotation.z=(j-1)*.4}}
for(let i=0;i<36;i++){const x=rand(-17,17),z=rand(-7,12);if(Math.abs(x)<8||z>5&&z<10)continue;box(x,.16,z,rand(.3,.7),rand(.25,.5),rand(.3,.7),'#8e9d7c')}
// Two-coach local train.
const train=new THREE.Group();scene.add(train);train.position.set(-16,0,7.12);
for(let car=0;car<2;car++){const x=car*8.2;box(x,1.4,0,7.8,1.95,2.4,'#577e67',train);box(x,2.46,0,7.9,.29,2.5,'#5c6866',train);box(x,2.65,0,7.1,.16,2.13,'#879084',train);box(x,1.02,1.22,7.6,.16,.06,'#d0ba73',train);box(x,.55,0,7.7,.35,2.2,'#424e55',train);
for(let j=0;j<6;j++){box(x-3.1+j*1.23,1.93,1.22,.94,.68,.06,'#b1b695',train);box(x-3.1+j*1.23,1.95,1.26,.79,.51,.035,'#3e5b62',train);box(x-3.1+j*1.23,2.13,1.285,.7,.035,.01,'#8baba0',train);box(x-3.1+j*1.23,1.94,-1.22,.87,.61,.05,'#425d62',train)}
for(const wx of [-2.5,2.5])for(const wz of [-1,1]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.18,10),mat('#394953'));wheel.rotation.x=Math.PI/2;wheel.position.set(x+wx,.46,wz*1.15);train.add(wheel)}sign(car?'森 林 鉄 道':'ワンマン  122',x,.78,1.255,2,.26,'#577e67','#ded4a0',22,train);box(x+2.7,2.86,0,1.1,.35,.8,'#687870',train)}
// Small block characters with articulated walking legs.
function character(x,z,white=false){const g=new THREE.Group();g.position.set(x,.9,z);scene.add(g);box(0,.77,0,.43,.57,.32,white?'#566967':'#ab7651',g);box(0,1.26,0,.4,.39,.37,'#d3b18a',g);box(0,1.49,0,.53,.21,.46,white?'#e4e3d2':'#4c6050',g);box(-.23,1.28,0,.13,.35,.4,white?'#dedfcd':'#4c6050',g);if(white){box(.24,1.1,-.07,.21,.7,.38,'#dedfcd',g);box(.24,.73,-.1,.27,.34,.3,'#ced5c3',g)}else{box(0,.82,-.25,.42,.47,.21,'#738859',g);box(0,1.5,.2,.64,.07,.17,'#4c6050',g)}box(-.1,1.27,.195,.065,.07,.04,'#3d4c4b',g);box(.12,1.27,.195,.065,.07,.04,'#3d4c4b',g);for(const a of [-1,1])box(a*.29,.77,0,.12,.49,.14,white?'#60716b':'#a58c60',g);const legs=[box(-.13,.32,0,.15,.39,.17,'#415c5b',g),box(.13,.32,0,.15,.39,.17,'#415c5b',g)];for(const l of legs)box(l.position.x,.1,.07,.22,.13,.31,'#615a43',g);return {g,legs}}
const player=character(-.8,2.3),friend=character(.55,2.7,true);
// Small signs of daily life, kept below the main sign and clear of the walking lane.
for(const x of [-5.65,6.6]){box(x,2.35,.32,.1,3.15,.11,'#65746b');box(x,1.03,.43,.13,.22,.33,'#53665f');for(const y of [1.6,2.8])box(x,y,.34,.17,.08,.16,'#a4aa91')}
for(let x=-6.6;x<7;x+=.39){box(x,.894,3.5,.32,.018,.16,'#616f67');for(let j=0;j<3;j++)box(x-.1+j*.09,.908,3.5,.025,.014,.13,'#929e8b')}
for(let i=0;i<65;i++){const x=rand(-6.9,6.9),z=rand(.6,3.3);if(Math.abs(x)<1.8)continue;const chip=box(x,.883,z,rand(.035,.11),.008,rand(.04,.15),['#a8996a','#8b957b','#c1b487'][i%3]);chip.rotation.y=rand(0,6)}
for(const x of [-6.8,6.9])for(let i=0;i<12;i++)box(x+rand(-.1,.1),.91,rand(-3,3.6),rand(.07,.2),.025,rand(.12,.27),'#80945e');
// Old paper notices, fasteners, a suitcase and a forgotten cup.
box(2.66,2.23,.16,.6,.83,.045,'#b8b99a');sign('沿 线 散 步',2.66,2.46,.2,.52,.22,'#c5c5a8','#5c6f61',26);sign('04 — 25',2.66,2.15,.2,.48,.18,'#c5c5a8','#6d785e',23);
for(const x of [-1.65,2.65])for(const y of [3.23,3.83])box(x,y,1.48,.06,.06,.025,'#a3a087');
box(-2.3,1.64,1.25,.45,.49,.3,'#876a50');for(const x of [-2.44,-2.17])box(x,1.64,1.411,.045,.46,.02,'#bba373');box(-2.3,1.93,1.25,.21,.05,.07,'#4d5e56');
box(-3.55,1.47,1.34,.13,.2,.13,'#e3d5af');box(-3.55,1.58,1.34,.1,.013,.1,'#6a7460');
// Station clock with individually placed minute marks.
const clockFace=new THREE.Mesh(new THREE.CylinderGeometry(.31,.31,.09,16),mat('#d5d4b5'));clockFace.rotation.x=Math.PI/2;clockFace.position.set(-1.98,2.68,.24);scene.add(clockFace);
for(let i=0;i<12;i++){const a=i*Math.PI/6;box(-1.98+Math.sin(a)*.24,2.68+Math.cos(a)*.24,.3,.024,.035,.012,'#4a6059')}
box(-1.98,2.76,.32,.022,.17,.012,'#435952');const hand=box(-1.9,2.65,.33,.18,.025,.014,'#435952');hand.rotation.z=-.4;
// Wildflowers, fern fronds, and tufts at the foot of the sign.
for(const [x,z] of [[8.4,4.1],[11.5,4],[-7.9,2.7],[8.9,-1.4],[-11.8,1]])for(let i=0;i<9;i++){const px=x+rand(-.65,.65),pz=z+rand(-.45,.45),h=rand(.18,.47);box(px,h/2,pz,.028,h,.028,'#73895a');box(px,h,pz,.1,.065,.1,['#d5bc7c','#c3a1aa','#ddd3a1'][i%3]);for(const side of [-1,1]){const frond=box(px+side*.065,h*.6,pz,.14,.035,.07,'#8ba064');frond.rotation.z=side*.35}}
// Character tailoring, hair strands, scarf, straps and small metal buckles.
for(const [actor,white] of [[player,false],[friend,true]]){for(const x of [-.16,.16]){box(x,.83,.18,.045,.47,.025,white?'#9ba79a':'#c4ae72',actor.g);box(x,.63,.2,.065,.055,.025,'#d6c795',actor.g)}box(0,1.02,.19,.39,.1,.04,white?'#9b7374':'#708269',actor.g);box(.12,.89,.21,.1,.22,.035,white?'#a67f7b':'#7c9072',actor.g);for(let i=0;i<5;i++)box(-.2+i*.1,1.43+Math.sin(i*2)*.045,.222,.08,.15,.05,white?'#cdd4c8':'#46594e',actor.g)}
// Fine leaf markings are shared by all instanced canopy blocks.
foliage.material=new THREE.MeshStandardMaterial({map:texture(16,16,c=>{c.fillStyle='#ddddce';c.fillRect(0,0,16,16);for(let i=0;i<38;i++){c.fillStyle=i%3?'#f7f4d8':'#a9b6a2';c.fillRect(rand(0,16),rand(0,16),2,1)}}),roughness:1});
// Animate on the GPU, retaining one instanced draw for the whole forest.
// The same deformation in the shadow pass keeps moving leaves and shadows aligned.
const windTime={value:0};
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
function leafWind(material){
  material.onBeforeCompile=shader=>{
    shader.uniforms.windTime=windTime;
    shader.vertexShader='uniform float windTime;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`
      #include <begin_vertex>
      vec3 leafCenter = instanceMatrix[3].xyz;
      float phase = leafCenter.x * 0.38 + leafCenter.z * 0.29;
      float heightWeight = smoothstep(1.0, 7.5, leafCenter.y);
      float gust = 0.65 + 0.35 * sin(windTime * 0.37 + phase * 0.45);
      float sway = sin(windTime * 1.45 + phase) * (0.06 + heightWeight * 0.16) * gust;
      float flutter = sin(windTime * 3.6 + leafCenter.x * 2.7 + leafCenter.z * 1.8) * 0.025;
      vec3 displacement = vec3(sway + flutter, sin(windTime * 1.9 + phase) * 0.025 * heightWeight, sway * 0.42);
      vec3 leafScale = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
      transformed += displacement / leafScale;
    `);
  };
  material.customProgramCacheKey=()=> 'leaf-wind-v1';
}
leafWind(foliage.material);
foliage.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking});
foliage.customDistanceMaterial=new THREE.MeshDistanceMaterial();
leafWind(foliage.customDepthMaterial);leafWind(foliage.customDistanceMaterial);
foliage.computeBoundingSphere();foliage.boundingSphere.radius+=.35;
// Floating seeds and warm lights.
const motes=[];for(let i=0;i<65;i++){const m=box(rand(-18,18),rand(.7,6),rand(-8,13),.045,.045,.045,new THREE.MeshBasicMaterial({color:'#eef0b4'}));m.castShadow=false;motes.push(m)}
const lampMaterial=new THREE.MeshStandardMaterial({color:'#fff0b3',emissive:'#ffcc7b',emissiveIntensity:.2});
const lamps=[];for(const x of [-5.2,6.2]){box(x,3.53,.71,.18,.23,.18,lampMaterial);box(x,3.69,.71,.36,.07,.31,'#4e655d');const light=new THREE.SpotLight('#ffc77a',0,10,1.1,.8,1.5);light.position.set(x,3.4,.95);light.target.position.set(x,.8,2);light.castShadow=true;light.shadow.mapSize.set(512,512);light.shadow.normalBias=.03;scene.add(light,light.target);lamps.push(light)}
let night=false,arrival=null,audio=null,audioGain=null,soundOn=false,toastTimer;
const toast=document.querySelector('#toast');function say(text){toast.textContent=text;toast.style.opacity='1';clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.style.opacity='0',5500)}say('欢迎来到青苔站。慢一点，也没关系。');
document.querySelector('#reset').onclick=reset;
document.querySelector('#night').onclick=()=>{night=!night;ambient.intensity=night?.48:.95;sun.intensity=night?.75:4.8;sun.color.set(night?'#9baeda':'#ffe0a0');ambient.color.set(night?'#91a6cf':'#b9cce2');scene.background.set(night?'#28394d':'#a4b677');scene.fog.color.set(night?'#28394d':'#a3ad83');rim.intensity=night?.3:.55;lamps.forEach(l=>l.intensity=night?32:0);lampMaterial.emissiveIntensity=night?6:.2;bloom.strength=night?.45:.23;document.querySelector('#night').innerHTML=night?'☀ <span>天亮</span>':'☾ <span>入夜</span>';document.querySelector('#time').textContent=night?'19:42':'16:24';document.querySelector('#weather').textContent=night?'夜 · 微风':'晴 · 初秋';say(night?'灯亮了。晚归的人，还有一站就到家。':'阳光落在站台上，今天也适合无所事事。')};
document.querySelector('#train').onclick=()=>{if(arrival!==null)return;arrival=0;document.querySelector('#train').disabled=true;say('叮——开往远方的森林线，即将进站。')};
const keys=new Set();window.addEventListener('keydown',e=>{if(['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase());if(e.key.toLowerCase()==='e')talk()});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
document.querySelectorAll('[data-move]').forEach(b=>{b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);keys.add(b.dataset.move)};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.move)});
let line=0;function talk(){if(village.act())return;if(player.g.position.distanceTo(friend.g.position)<2.8){say(['「你也在等车吗？听说下一站，可以看见海。」','「站长说，这片森林的树，记得每一个旅人。」','「不着急。我们可以再听一会儿风。」'][line++%3])}else say('走近站台上的白发旅人，按 E 聊聊天。')}
renderer.domElement.addEventListener('dblclick',talk);
document.querySelector('#sound').onclick=async()=>{if(!audio){audio=new AudioContext();audioGain=audio.createGain();audioGain.gain.value=0;audioGain.connect(audio.destination);const buffer=audio.createBuffer(1,audio.sampleRate*4,audio.sampleRate),data=buffer.getChannelData(0);let v=0;for(let i=0;i<data.length;i++){v=(v+(Math.random()*2-1)*.025)/1.025;data[i]=v}const noise=audio.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=700;noise.connect(filter);filter.connect(audioGain);noise.start()}await audio.resume();soundOn=!soundOn;audioGain.gain.setTargetAtTime(soundOn?.45:0,audio.currentTime,.5);document.querySelector('#sound').innerHTML=soundOn?'♫ <span>声音开启</span>':'♫ <span>声音关闭</span>'};
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(Math.round(w/1.8),Math.round(h/1.8),false);composer.setSize(Math.round(w/1.8),Math.round(h/1.8));const half= h>w?19:12.5;camera.left=-half*w/h;camera.right=half*w/h;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix()}window.addEventListener('resize',resize);resize();
const clock=new THREE.Clock();let elapsed=0;
const village=createVillage({scene,player,box,sign,texture,mat,leafWind,say,reset,keys});
document.querySelector('#night').addEventListener('click',()=>village.setNight(night));
renderer.setAnimationLoop(()=>{const dt=Math.min(clock.getDelta(),.05);elapsed+=dt;let dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),dz=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);if(dx||dz){if(!village.move(dx,dz,dt)){const norm=Math.hypot(dx,dz);player.g.position.x=THREE.MathUtils.clamp(player.g.position.x+dx/norm*dt*2.5,-6.6,6.6);player.g.position.z=THREE.MathUtils.clamp(player.g.position.z+dz/norm*dt*2.5,.9,3.65);}player.g.rotation.y=Math.atan2(dx,dz);player.legs.forEach((l,i)=>l.rotation.x=Math.sin(elapsed*12+i*Math.PI)*.45)}else player.legs.forEach(l=>l.rotation.x=0);
village.update(elapsed);
flag.rotation.y=Math.sin(elapsed*2)*.16;flag.scale.y=.65+Math.sin(elapsed*3)*.035;
if(!reducedMotion.matches)windTime.value=elapsed;
motes.forEach((m,i)=>{m.position.x+=Math.sin(elapsed*.35+i)*dt*.12;m.position.y+=Math.sin(elapsed+i)*dt*.05});
if(arrival!==null){arrival+=dt;if(arrival<9){const t=arrival/9;train.position.x=-16+17*(1-Math.pow(1-t,3))}else if(arrival<15){train.position.x=1;if(arrival-dt<9)say('青苔站到了。停靠片刻，然后继续向远方。')}else {train.position.x=1+Math.pow(arrival-15,2)*.48;if(arrival>27){arrival=null;train.position.x=-16;document.querySelector('#train').disabled=false;say('列车走远了，森林又安静下来。')}}signals.forEach((m,i)=>m.material=mat(Math.floor(elapsed*3+i)%2?'#eb918b':'#965e71'))}else signals.forEach(m=>m.material=mat('#b76b76'));
controls.update();composer.render()});
// Small public snapshot for smoke checks without exposing mutable scene objects.
window.stationState=()=>({ready:true,trees:leaves.length,night,trainMoving:arrival!==null,player:{x:player.g.position.x,z:player.g.position.z},meshes:scene.children.length});
