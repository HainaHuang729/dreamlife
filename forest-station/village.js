import * as THREE from 'three';
import { buildLayout } from './new-layouts.js';

export function createVillage({scene,player,box,sign,texture,mat,leafWind,say,reset,keys}) {
  const station=new THREE.Group();station.name='station';
  const stationLights=scene.children.filter(child=>child.isPointLight||child.isSpotLight);
  for(const child of [...scene.children])if(!child.isLight&&child!==player.g)station.add(child);
  scene.add(station);
  const titles=['青苔小站','老宅农场','村口主街','河湾竹桥','梯田民宿','老宅室内'];
  const subtitles=['MOSS STATION','HOME & HARVEST','VILLAGE DAYS','RIVER & BAMBOO','ABOVE THE FIELDS','A PLACE CALLED HOME'];
  const descriptions=['山里没有时间，只有下一班列车。','种下一点希望，慢慢等它长大。','街坊的招呼，比清晨的茶还暖。','过了这座桥，再听一会儿流水。','沿着田埂向上，晚风会找到你。','灯下有热茶，门外是故乡。'];
  const worlds=new Map();let active=0,current=null,isNight=false;const inventory={produce:0};
  const selector=document.createElement('nav');selector.className='scene-nav';selector.setAttribute('aria-label','村庄场景');
  titles.forEach((title,id)=>{const button=document.createElement('button');button.textContent=title;button.onclick=()=>select(id);selector.append(button)});document.body.append(selector);
  const interact=document.createElement('button');interact.id='interact';interact.innerHTML='E <span>附近互动</span>';interact.onclick=()=>act();document.querySelector('footer nav').prepend(interact);
  const note=document.createElement('div');note.className='scene-note';document.body.append(note);
  const unit=new THREE.BoxGeometry(1,1,1);
  function build(id){
    const root=new THREE.Group(),blocks=[],actions=[],motions=[],lights=[],glowing=[];root.name=titles[id];scene.add(root);
    const b=(x,y,z,w,h,d,c,parent=root)=>box(x,y,z,w,h,d,c,parent);
    const label=(text,x,y,z,w=2,h=.5,bg='#d3c69b',fg='#405848',size=32)=>sign(text,x,y,z,w,h,bg,fg,size,root);
    let randomSeed=425+id;const r=(a=0,b=1)=>{randomSeed=(randomSeed*1664525+1013904223)>>>0;return a+(randomSeed/4294967296)*(b-a)};
    function obstacle(x,z,w,d){blocks.push({x,z,w,d})}
    function action(x,z,name,run){actions.push({x,z,name,run})}
    function patch(base,colors){return new THREE.MeshStandardMaterial({roughness:1,map:texture(64,64,c=>{c.fillStyle=base;c.fillRect(0,0,64,64);for(let i=0;i<650;i++){c.fillStyle=colors[i%colors.length];c.fillRect(r(0,64),r(0,64),r(1,5),1)}})})}
    const grass=patch('#8f9e62',['#9da969','#7e9161','#a8af77']),wood=patch('#9b8057',['#b59a68','#7e704f','#958257']),stone=patch('#858e7f',['#9aa18c','#738578','#adb19a']);
    b(0,-.3,0,90,.5,80,grass);
    const detail=[];
    function tree(x,z,s=1){const h=r(3.5,5.4)*s;b(x,h/2,z,.42*s,h,.45*s,'#7b704b');b(x-.13*s,h/2,z+.24*s,.07,h*.95,.04,'#b79c61');for(let i=0;i<125;i++){const a=r(0,Math.PI*2),rad=Math.sqrt(r())*1.65*s;detail.push({x:x+Math.cos(a)*rad,y:h+r(-.6,.8)*s+(1-rad/(2*s))*.55,z:z+Math.sin(a)*rad,w:r(.22,.55)*s,h:r(.14,.35)*s,d:r(.23,.58)*s,c:['#415f56','#567853','#779450','#9caa60'][Math.floor(r(0,4))]})}}
    if(id!==5){for(let x=-24;x<=24;x+=2.6)for(const z of [-12,-15,-18]){if(id!==3||Math.abs(x)>6)tree(x+r(-.4,.4),z+r(-1,1),r(.8,1.2))}for(const x of [-18,18,-21,21])for(let z=-9;z<=16;z+=3.3)tree(x+r(-.5,.5),z,r(.8,1.1));for(let i=0;i<80;i++){const x=r(-17,17),z=r(-11,12);if(Math.abs(x)<12)continue;b(x,.15,z,.045,.3,.06,'#759153');b(x+.07,.29,z,.12,.07,.11,i%3?'#c6bc7c':'#c592a1')}}
    function path(x,z,w,d){b(x,.005,z,w,.05,d,patch('#b6ae86',['#a79f7b','#c5bc93','#b7b18b']))}
    function fence(x,z,w){for(let p=x-w/2;p<=x+w/2;p+=.8){b(p,.57,z,.1,1.1,.11,'#857e59');b(p,.52,z,.03,.8,.16,'#b2a477')}for(const y of [.35,.78])b(x,y,z,w,.09,.1,'#a89a6a')}
    function lamp(x,z,y=3.2){b(x,y/2,z,.09,y,.09,'#52685b');b(x,y,z,.44,.1,.42,'#506459');const m=new THREE.MeshStandardMaterial({color:'#f2d6a0',emissive:'#ffd18d',emissiveIntensity:.1});b(x,y-.2,z,.22,.25,.2,m);glowing.push(m);const l=new THREE.PointLight('#ffd393',0,8,2);l.position.set(x,y-.35,z+.2);root.add(l);lights.push(l)}
    function house(x,z,w=6,d=4,name='晨谷人家',base=0){obstacle(x,z,w,d);b(x,base+1.65,z,w,3.3,d,stone);for(let y=.2;y<3.2;y+=.32)b(x,base+y,z+d/2+.035,w,.24,.08,wood);for(const dx of [-w/2,w/2])b(x+dx,base+1.6,z+d/2+.08,.16,3.2,.16,'#536255');
      b(x,base+1.2,z+d/2+.09,1.25,2.4,.12,'#40554f');b(x+.4,base+1.2,z+d/2+.17,.07,.16,.04,'#b8aa73');
      for(const dx of [-w*.31,w*.31]){b(x+dx,base+1.9,z+d/2+.08,1.15,1.2,.12,'#495f58');const win=new THREE.MeshStandardMaterial({color:'#71908a',emissive:'#d8ac69',emissiveIntensity:0});b(x+dx,base+1.9,z+d/2+.16,.98,1.02,.06,win);glowing.push(win);b(x+dx,base+1.9,z+d/2+.21,1.05,.06,.05,'#b4b082');b(x+dx,base+1.9,z+d/2+.21,.06,1.07,.05,'#b4b082')}
      for(const side of [-1,1])for(let row=0;row<7;row++)for(let col=0;col<Math.ceil(w/.38)+2;col++){const tile=b(x-w/2-.27+col*.38,base+4.1-row*.16,z+side*row*.39,.37,.12,.48,['#4c5d66','#5a6970','#69766e'][col%3]);tile.rotation.x=side*.39;if((row*7+col)%13===0)b(tile.position.x,base+4.18-row*.16,tile.position.z,.17,.035,.2,'#84915f')}
      b(x,base+4.17,z,w+.8,.17,.25,'#819083');b(x,base+2.98,z+d/2+.42,2.9,.68,.14,'#6f694f');label(name,x,base+2.98,z+d/2+.52,2.75,.55);b(x,base+.12,z+d/2+.42,1.7,.24,.7,'#a1a58a');
    }
    function npc(x,z,hat='#b58d61'){const g=new THREE.Group();g.position.set(x,0,z);root.add(g);b(0,.8,0,.42,.62,.32,'#768781',g);b(0,1.32,0,.38,.38,.36,'#c8ac84',g);b(0,1.53,0,.52,.11,.44,hat,g);for(const dx of [-.13,.13]){b(dx,.27,0,.14,.5,.16,'#4e6260',g);b(dx,1.32,.19,.05,.055,.025,'#3d5149',g)}motions.push(t=>{g.rotation.y=Math.sin(t*.3)*.12});return g}
    function smoke(x,y,z){for(let i=0;i<7;i++){const p=b(x,y+i*.22,z,.22+i*.035,.16+i*.03,.2,new THREE.MeshBasicMaterial({color:'#d5d3b5',transparent:true,opacity:.16,depthWrite:false}));p.castShadow=false;motions.push(t=>{const a=(t*.35+i*.25)%2;p.position.set(x+Math.sin(t+i)*.14,y+a,z);p.material.opacity=(1-a/2)*.2})}}
    function water(x,z,w,d,y=.02){const m=new THREE.MeshStandardMaterial({color:'#4e8f8b',roughness:.27,metalness:.25,transparent:true,opacity:.88});b(x,y-.12,z,w,.22,d,m);for(let i=0;i<Math.min(100,Math.max(2,Math.round(w*d*1.7)));i++){const sx=x+r(-w/2,w/2),sz=z+r(-d/2,d/2);const p=b(sx,y+.008,sz,r(.12,.5),.01,.025,'#a0c6af');p.castShadow=false;motions.push(t=>{p.position.x=sx+Math.sin(t*.7+i)*.14;p.scale.x=.18+(Math.sin(t+i)+1)*.18})}}
    const {spawn,height,blocked:terrainBlocked}=buildLayout(id,{b,label,house,tree,water,lamp,npc,smoke,fence,obstacle,action,root,motions,glowing,lights,wood,stone,grass,r,mat,say,select,inventory,player});
    if(detail.length){const leaves=new THREE.InstancedMesh(unit,mat('#ffffff').clone(),detail.length),o=new THREE.Object3D();detail.forEach((p,i)=>{o.position.set(p.x,p.y,p.z);o.scale.set(p.w,p.h,p.d);o.updateMatrix();leaves.setMatrixAt(i,o.matrix);leaves.setColorAt(i,new THREE.Color(p.c))});leafWind(leaves.material);leaves.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking});leafWind(leaves.customDepthMaterial);leaves.customDistanceMaterial=new THREE.MeshDistanceMaterial();leafWind(leaves.customDistanceMaterial);leaves.castShadow=true;leaves.receiveShadow=true;root.add(leaves)}
    return {root,blocks,actions,motions,lights,glowing,spawn,height,terrainBlocked};
  }
  function select(id){active=id;keys.clear();station.visible=id===0;for(const world of worlds.values())world.root.visible=false;current=id===0?null:worlds.get(id);if(id&&!current){current=build(id);worlds.set(id,current)}if(current)current.root.visible=true;player.g.position.set(...(current?[current.spawn[0],current.height(...current.spawn),current.spawn[1]]:[-.8,.9,2.3]));player.g.rotation.y=0;reset(id===5?1.45:id?1.08:1);document.querySelector('h1').innerHTML=`${titles[id]}<span>${subtitles[id]}</span>`;document.querySelector('header p').textContent=descriptions[id];document.title=`${titles[id]} · 晨谷生活`;document.querySelector('.ticket').style.display=id?'none':'';document.querySelector('#train').style.display=id?'none':'';document.querySelector('#world').setAttribute('aria-label',titles[id]+'，WASD 移动，E 互动');[...selector.children].forEach((b,i)=>{b.setAttribute('aria-current',String(i===id))});setNight(isNight);say(descriptions[id]);}
  function setNight(value){isNight=value;stationLights.forEach(l=>l.visible=active===0);for(const w of worlds.values()){w.lights.forEach(l=>l.intensity=value?24:0);w.glowing.forEach(m=>m.emissiveIntensity=value?1.2:0)}}
  function nearby(){if(!current)return null;return current.actions.map(a=>({...a,d:Math.hypot(player.g.position.x-a.x,player.g.position.z-a.z)})).sort((a,b)=>a.d-b.d)[0]}
  function act(){if(!active)return false;const a=nearby();if(a&&a.d<2.1)a.run();else say('沿小路走近设施，右下角会显示可互动内容。');return true}
  function move(dx,dz,dt){if(!active)return false;const n=Math.hypot(dx,dz)||1,p=player.g.position;let x=THREE.MathUtils.clamp(p.x+dx/n*dt*3,active===5?-8:-14,active===5?8:14),z=THREE.MathUtils.clamp(p.z+dz/n*dt*3,active===5?-6.5:-10,active===5?6.5:10);const blocked=(x,z)=>current.blocks.some(b=>Math.abs(x-b.x)<b.w/2+.24&&Math.abs(z-b.z)<b.d/2+.24)||current.terrainBlocked(x,z);if(!blocked(x,p.z))p.x=x;if(!blocked(p.x,z))p.z=z;p.y=current.height(p.x,p.z);return true}
  function update(t){if(current)current.motions.forEach(fn=>fn(t));const a=nearby();note.textContent=active?(a&&a.d<2.1?`E · ${a.name}`:'沿小路漫步 · 靠近物件按 E'):'';}
  select(1);
  return {act,move,update,setNight,select,get active(){return active}};
}
