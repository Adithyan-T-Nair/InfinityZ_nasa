// UI panels: mission card + 3D model viewer, detail slides, user pins.
function pickR(id){sel=byId(id);focus(sel.lat,sel.lon,1.5);card()}
function card(){const r=sel,c=$("#card"),al=r.also&&byId(r.also);c.classList.remove("hide");
const big=r.km!=null?fmt(r.km):r.st?"Stationary lander":"unavailable";
c.innerHTML=`<h3>${r.n}</h3><div class="mu">${r.tag}<br>${r.pl.toUpperCase()} · landed ${r.yr} · ${cd(r.lat,r.lon)} (approx.)</div><canvas id="v"></canvas><div class="mu">${r.km!=null?r.lb||L:"DRIVING DISTANCE"}</div><div class="big">${big}</div><p class="mu">${r.km>1?"The ring on the globe has this radius around the landing site. It shows reach, not the actual route. ":""}${NOTE}</p><button id="md" class="on">Mission details →</button> ${al?`<button onclick="openD('${al.id}')">${al.n} →</button> `:""}<button id="zs">Zoom to site</button> <button onclick="$('#card').classList.add('hide');sel=null">Close</button>`;
$("#zs").onclick=()=>focus(r.lat,r.lon,1.1);$("#md").onclick=()=>openD(r.id);vset(r.ty);vdrag()}
// detail slides
let dtId=null;
function openD(id,i=0){const r=byId(id),S=r.s,s=S[i];dtId=id;document.body.classList.add("dtopen");const d=$("#dt");d.classList.remove("hide");
d.innerHTML=`<div class="dh"><div><div class="mu">${r.tag}</div><h3>${r.n}</h3></div><button onclick="closeD()">✕</button></div><div class="tabs">${S.map((x,j)=>`<button class="${j==i?"on":""}" onclick="openD('${id}',${j})">${x[0]}</button>`).join("")}</div><div class="db"><h4>${s[0]}</h4>${s[1]?`<p>${s[1]}</p>`:""}${s[2]?`<div class="kv">${s[2].map(k=>`<span>${k[0]}</span><b>${k[1]}</b>`).join("")}</div>`:""}${s[3]?`<ul>${s[3].map(b=>`<li>${b}</li>`).join("")}</ul>`:""}</div><div class="df"><button ${i?"":"disabled"} onclick="openD('${id}',${i-1})">← Back</button><span class="mu">${i+1} / ${S.length}</span><button ${i<S.length-1?"":"disabled"} onclick="openD('${id}',${i+1})">Next →</button></div><div class="mu src">Source: ${r.src||"NASA Science"}${r.pl=="deep"?` · <a href="#" style="color:var(--cy)" onclick="showList();return false">All other missions</a>`:""}</div>`;plist()}
function showList(){dtId=null;document.body.classList.add("dtopen");const d=$("#dt");d.classList.remove("hide");
d.innerHTML=`<div class="dh"><div><div class="mu">BEYOND THE MOON AND MARS</div><h3>Other missions</h3></div><button onclick="closeD()">✕</button></div><div class="db">${RV.filter(r=>r.pl=="deep").map(r=>`<button class="li" onclick="openD('${r.id}')">${r.n}<small>${r.tag}</small></button>`).join("")}</div>`;plist()}
function closeD(){$("#dt").classList.add("hide");document.body.classList.remove("dtopen");dtId=null;plist()}
function addPin(lat,lon){const w=Wd[cur],g=dot(0xff7a45,1);g.position.copy(ll(lat,lon).multiplyScalar(1.01));w.pv.add(g);w.pg.push(g);
const nr=RV.filter(r=>r.pl==cur&&pn(r)).map(r=>({r,km:gc(lat,lon,r.lat,r.lon,cur)})).sort((a,b)=>a.km-b.km)[0];pins.push({pl:cur,lat,lon,g,nr});plist()}
function plist(){const p=$("#pl"),L=pins.filter(x=>x.pl==cur);p.classList.toggle("hide",!L.length||!$("#dt").classList.contains("hide"));
p.innerHTML="<b>Pins</b>"+L.map((x,i)=>`<div class="pin">Pin ${i+1}: ${cd(x.lat,x.lon)}<br>Nearest site: <b>${x.nr.r.n}</b>, ${fmt(x.nr.km)} away${x.nr.r.km>1?(x.nr.km<x.nr.r.km?" (inside its driven-distance ring)":" (outside its ring)"):""} <button data-i="${pins.indexOf(x)}">Remove</button></div>`).join("");
p.querySelectorAll("button").forEach(b=>b.onclick=()=>{const x=pins[b.dataset.i];x.g.parent.remove(x.g);Wd[x.pl].pg.splice(Wd[x.pl].pg.indexOf(x.g),1);pins.splice(b.dataset.i,1);plist()})}
// 3D model viewer
let VR,VS,VC;
function mt(c){return new THREE.MeshStandardMaterial({color:c,roughness:.6,metalness:.3})}
function bx(w,h,d,c,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mt(c));m.position.set(x,y,z);return m}
function cy(r,h,c,x,y,z,ax){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),mt(c));m.position.set(x,y,z);if(ax)m.rotation.x=Math.PI/2;return m}
function model(ty){const g=new THREE.Group();
if(ty=="lrv"){g.add(bx(1.8,.12,.9,0xb8bcc4,0,.5,0));[[-.65,-.55],[-.65,.55],[.65,-.55],[.65,.55]].forEach(p=>g.add(cy(.3,.14,0x333333,p[0],.3,p[1],1)));g.add(bx(.3,.35,.35,0xdddde8,-.2,.75,-.2),bx(.3,.35,.35,0xdddde8,-.2,.75,.2),cy(.03,.8,0xeeeeee,.7,.95,0),cy(.25,.03,0xffffff,.7,1.4,0),bx(.2,.15,.2,0x999999,.9,.6,0))}
else if(ty=="lm"){g.add(bx(1,.5,1,0xc9a45a,0,.8,0),bx(.8,.4,.8,0xdddde8,0,1.25,0),cy(.25,.03,0xffffff,.2,1.6,0));[[-.6,-.6],[-.6,.6],[.6,-.6],[.6,.6]].forEach(p=>{g.add(cy(.03,.8,0xaaaaaa,p[0],.4,p[1]),cy(.14,.03,0xaaaaaa,p[0],.02,p[1]))})}
else if(ty=="heli"){g.add(bx(.4,.3,.4,0x444450,0,.6,0),cy(.03,.5,0xaaaaaa,0,.95,0),bx(2.2,.02,.12,0x222222,0,1.15,0),bx(.12,.02,2.2,0x222222,0,1.25,0));[[-.3,-.3],[-.3,.3],[.3,-.3],[.3,.3]].forEach(p=>g.add(cy(.015,.6,0x888888,p[0]*1.5,.3,p[1]*1.5)))}
else{g.add(bx(1.3,.4,.8,0xc9ccd2,0,.7,0));[-.6,0,.6].forEach(x=>[-.55,.55].forEach(z=>g.add(cy(.22,.18,0x333333,x,.3,z,1))));g.add(cy(.04,.7,0xdddddd,.45,1.25,0),bx(.18,.12,.3,0x888888,.45,1.65,0),bx(.5,.06,.06,0x777777,.8,.6,.3));
if(ty=="mer")g.add(bx(1.5,.04,1.1,0xd4a64a,0,.93,0));else g.add(bx(.5,.25,.25,0x444444,-.8,.75,0))}
return g}
function vset(ty){if(!VR){VR=new THREE.WebGLRenderer({canvas:$("#v"),antialias:true,alpha:true});VS=new THREE.Scene();VC=new THREE.PerspectiveCamera(40,2,.1,50);VC.position.set(2.8,1.7,3.4);VC.lookAt(0,.6,0);VS.add(new THREE.AmbientLight(0xffffff,.6));const l=new THREE.DirectionalLight(0xffffff,1.2);l.position.set(3,5,4);VS.add(l)}
else{VR.dispose();VR=new THREE.WebGLRenderer({canvas:$("#v"),antialias:true,alpha:true})}
VR.setSize($("#v").clientWidth||330,170,false);if(vm)VS.remove(vm);vm=model(ty);VS.add(vm)}
function vdrag(){let d=null;const v=$("#v");v.onpointerdown=e=>{d=e.clientX;v.setPointerCapture(e.pointerId)};v.onpointermove=e=>{if(d!=null){vm.rotation.y+=(e.clientX-d)*.01;d=e.clientX}};v.onpointerup=()=>d=null}
function vloop(){if(sel&&vm&&VR&&document.getElementById("v")){vm.rotation.y+=.004;VR.render(VS,VC)}}
