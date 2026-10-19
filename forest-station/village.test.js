import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createVillage } from './village.js';

// Exercise real scene generation and navigation without requiring a GPU or a browser.
const elements=new Map();
const element=()=>({children:[],style:{},append(x){this.children.push(x)},prepend(x){this.children.unshift(x)},setAttribute(){},click(){this.onclick?.()}});
globalThis.document={body:element(),createElement:element,querySelector(s){if(!elements.has(s))elements.set(s,element());return elements.get(s)}};
const scene=new THREE.Scene(),player={g:new THREE.Group()};scene.add(player.g);scene.add(new THREE.SpotLight());
const geometry=new THREE.BoxGeometry(1,1,1),materials=new Map();
function mat(c){if(!materials.has(c))materials.set(c,new THREE.MeshStandardMaterial({color:c}));return materials.get(c)}
function box(x,y,z,w,h,d,c,parent=scene){const m=new THREE.Mesh(geometry,typeof c==='string'?mat(c):c);m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);return m}
const messages=[];
const village=createVillage({scene,player,box,sign(){},texture:()=>new THREE.Texture(),mat,leafWind(){},say:t=>messages.push(t),reset(){},keys:new Set()});
function position(x,z,y=.07){player.g.position.set(x,y,z)}
function walk(dx,dz,frames){for(let i=0;i<frames;i++)village.move(dx,dz,.02)}

assert.equal(village.active,1);
position(2.5,5.6);village.act();assert.match(messages.at(-1),/浇透/);
village.act();assert.match(messages.at(-1),/一篮/);
village.select(2);position(5.4,7.1);village.act();assert.match(messages.at(-1),/摆上摊位/);
village.act();assert.match(messages.at(-1),/下次再来/);
village.select(1);position(2.5,5.6);village.act();assert.match(messages.at(-1),/已经收完/);

village.select(3);position(-7,6);walk(1,0,250);assert.ok(player.g.position.x<1,'River bank must stop the player');
position(-5,1.2);walk(1,0,180);assert.ok(player.g.position.x>5,'Bridge must connect both banks');
assert.ok(Math.abs(player.g.position.y-.07)<.01,'Player returns to ground beyond bridge');
position(-5.3,7.8);village.act();assert.match(messages.at(-1),/升起/);village.act();assert.match(messages.at(-1),/落下/);

village.select(4);
for(let z=8.4;z>-7;z-=.025){const desiredX=-1+Math.sin(z*.35)*2.1;const dx=desiredX-player.g.position.x;village.move(dx,-.025,Math.hypot(dx,.025)/3)}
assert.ok(player.g.position.y>2.9,'Winding stairs must reach upper terrace');

village.select(5);position(-7.5,.5,.17);village.act();assert.match(messages.at(-1),/手心/);
position(7,5.5,.17);walk(1,0,200);assert.ok(player.g.position.x<=8,'Interior wall bounds hold');
position(1,4.7,.17);village.act();assert.match(messages.at(-1),/坐一会儿/);village.move(1,0,.02);assert.equal(player.g.position.y,.17);
for(let id=0;id<=5;id++){village.select(id);village.setNight(true);village.update(2);village.setNight(false);village.update(3);assert.equal(village.active,id);assert.ok(Number.isFinite(player.g.position.y))}
console.log('PASS: 5 layouts, crop delivery, repeat visits, river collision, bridge, terrace ascent, interior interaction/bounds, day/night.');
