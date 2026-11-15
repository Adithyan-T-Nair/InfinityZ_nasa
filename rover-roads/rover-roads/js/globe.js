// 3D world: scene, textures, markers, rings, camera controls, picking.
const $=s=>document.querySelector(s),cl=(v,a,b)=>Math.max(a,Math.min(b,v)),byId=i=>RV.find(r=>r.id==i),pn=r=>r.pl!="deep"&&r.pin!==0;
let mi=true,pinMode=false,cur="moon",dist=3.4,tw=null,sel=null,pins=[],Wd={},R,S,C,vm=null;
const fmt=km=>km==null?"unavailable":mi?(km*.621371).toFixed(2)+" mi":km.toFixed(2)+" km";
const cd=(a,o)=>Math.abs(a).toFixed(2)+"° "+(a<0?"S":"N")+", "+Math.abs(o).toFixed(2)+"° "+(o<0?"W":"E");
const ll=(a,b)=>{a*=Math.PI/180;b*=Math.PI/180;return new THREE.Vector3(Math.cos(a)*Math.cos(b),Math.sin(a),-Math.cos(a)*Math.sin(b))};
function ring(lat,lon,km,pl,col){const r=km/RAD[pl],c=ll(lat,lon),u=new THREE.Vector3(0,1,0).cross(c).normalize(),v=c.clone().cross(u),p=[];
for(let i=0;i<96;i++){const t=i/96*6.2832;p.push(c.clone().multiplyScalar(Math.cos(r)).add(u.clone().multiplyScalar(Math.cos(t)*Math.sin(r))).add(v.clone().multiplyScalar(Math.sin(t)*Math.sin(r))).multiplyScalar(1.003))}
return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(p),new THREE.LineBasicMaterial({color:col}))}
function dot(col,s){const g=new THREE.Mesh(new THREE.SphereGeometry(.02*s,16,12),new THREE.MeshBasicMaterial({color:col}));g.add(new THREE.Mesh(new THREE.SphereGeometry(.05*s,16,12),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.22,depthWrite:false})));return g}
function init(){
R=new THREE.WebGLRenderer({canvas:$("#c"),antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.outputEncoding=THREE.sRGBEncoding;
S=new THREE.Scene();C=new THREE.PerspectiveCamera(45,1,.01,200);
S.add(new THREE.AmbientLight(0x8899bb,.4));const sun=new THREE.DirectionalLight(0xffffff,1.3);sun.position.set(-4,2,5);S.add(sun);
const sp=[];for(let i=0;i<1500;i++){const a=Math.random()*6.2832,z=Math.random()*2-1,r=Math.sqrt(1-z*z);sp.push(60*r*Math.cos(a),60*r*Math.sin(a),60*z)}
const sg=new THREE.BufferGeometry();sg.setAttribute("position",new THREE.Float32BufferAttribute(sp,3));S.add(new THREE.Points(sg,new THREE.PointsMaterial({size:.2,color:0xcfe6ff})));
for(const k of["moon","mars"]){const pv=new THREE.Group(),m=new THREE.Mesh(new THREE.SphereGeometry(1,128,96),new THREE.MeshStandardMaterial({color:0x777777,roughness:1}));pv.add(m);
new THREE.TextureLoader().load(IMG[k],t=>{t.encoding=THREE.sRGBEncoding;t.anisotropy=R.capabilities.getMaxAnisotropy();const M=m.material;M.map=t;M.bumpMap=t;M.bumpScale=k=="moon"?.05:.025;M.color.set(0xffffff);M.needsUpdate=true});
if(k=="mars")pv.add(new THREE.Mesh(new THREE.SphereGeometry(1.06,64,48),new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false,vertexShader:"varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"varying vec3 n;void main(){float i=pow(max(0.,.7+n.z),3.)*1.8;gl_FragColor=vec4(1.,.55,.35,1.)*i;}"})));
const mk=[];RV.filter(r=>r.pl==k&&pn(r)).forEach(r=>{const g=dot(0x5ee1ff,1);g.position.copy(ll(r.lat,r.lon).multiplyScalar(1.01));g.userData.id=r.id;pv.add(g);mk.push(g);if(r.km>1)pv.add(ring(r.lat,r.lon,r.km,k,k=="moon"?0xffffff:0xff9a5a))});
S.add(pv);pv.rotation.set(.2,-.5,0);Wd[k]={pv,m,mk,pg:[]}}
addEventListener("resize",rz);rz();home();loop()}
function rz(){R.setSize(innerWidth,innerHeight,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()}
function loop(){requestAnimationFrame(loop);for(const k in Wd){const p=Wd[k].pv,t=tg[k];if(t){p.position.lerp(t.p,.06);p.scale.setScalar(p.scale.x+(t.s-p.scale.x)*.06)}}if(mode=="home"){dist+=(5-dist)*.06;Wd.moon.pv.rotateY(.002);Wd.mars.pv.rotateY(-.002)}if(tw){Wd[cur].pv.quaternion.slerp(tw.q,.07);dist+=(tw.d-dist)*.07}
const s=cl((dist-1)/2.4,.1,1);Wd[cur].mk.concat(Wd[cur].pg).forEach(g=>g.scale.setScalar(s));C.position.set(0,0,dist);R.render(S,C);vloop()}
const ptr=new Map();let down=null,pd=0;const pdist=()=>{const a=[...ptr.values()];return Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1},cv=$("#c");
cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);ptr.set(e.pointerId,[e.clientX,e.clientY]);down=ptr.size==1?[e.clientX,e.clientY]:null;tw=null;if(ptr.size==2)pd=pdist()};
cv.onpointermove=e=>{if(!ptr.has(e.pointerId))return;const o=ptr.get(e.pointerId),dx=e.clientX-o[0],dy=e.clientY-o[1];ptr.set(e.pointerId,[e.clientX,e.clientY]);
if(ptr.size==2){const n=pdist();dist=cl(dist*pd/n,1.06,7);pd=n}else if(mode=="explore"){const k=.005*Math.max(dist-1,.1)/2.4,p=Wd[cur].pv;p.rotateOnWorldAxis(new THREE.Vector3(0,1,0),dx*k);p.rotateOnWorldAxis(new THREE.Vector3(1,0,0),dy*k)}};
cv.onpointerup=cv.onpointercancel=e=>{ptr.delete(e.pointerId);if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<5)pick(e);down=null};
cv.addEventListener("wheel",e=>{e.preventDefault();dist=cl(1+(dist-1)*(1+e.deltaY*.001),1.06,7)},{passive:false});
function pick(e){if(mode=="home"){const k=hit(e);if(k)enter(k);return}if(mode!="explore")return;const rc=new THREE.Raycaster(),w=Wd[cur];rc.setFromCamera(new THREE.Vector2(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1),C);
const h=rc.intersectObjects(w.mk,true)[0];if(h){const g=h.object.userData.id?h.object:h.object.parent;return pickR(g.userData.id)}
const hp=rc.intersectObject(w.m)[0];if(hp&&pinMode){const l=w.pv.worldToLocal(hp.point.clone()).normalize();addPin(Math.asin(l.y)*180/Math.PI,Math.atan2(-l.z,l.x)*180/Math.PI)}}
function focus(lat,lon,d){tw={q:new THREE.Quaternion().setFromUnitVectors(ll(lat,lon),new THREE.Vector3(0,0,1)),d}}
function gc(a,b,c,d,pl){const r=x=>x*Math.PI/180,h=Math.sin(r(c-a)/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;return 2*Math.asin(Math.sqrt(h))*RAD[pl]}
