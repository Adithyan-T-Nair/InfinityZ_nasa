// Navigation (Home / Moon / Mars), view transitions, start-up.
let mode="home",hov=null,tg={};
function setT(){const f=hov||"moon",b=f=="moon"?"mars":"moon";tg[f]={p:new THREE.Vector3(f=="moon"?-1.1:1.1,-.2,0),s:.85};tg[b]={p:new THREE.Vector3(b=="moon"?-1.1:1.1,.6,-4),s:.85}}
function hit(e){if(!Wd.moon)return null;const rc=new THREE.Raycaster();rc.setFromCamera(new THREE.Vector2(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1),C);const h=rc.intersectObjects([Wd.moon.m,Wd.mars.m])[0];return h?(h.object===Wd.moon.m?"moon":"mars"):null}
function home(){clearTimeout(enter.t);mode="home";hov=null;sel=null;tw=null;Wd.moon.pv.visible=Wd.mars.pv.visible=true;setT();$("#card").classList.add("hide");$("#pl").classList.add("hide");closeD();$("#intro").classList.remove("hide");$("#hint").classList.add("hide");document.querySelectorAll("[data-p]").forEach(b=>b.classList.remove("on"))}
function enter(k){const o=k=="moon"?"mars":"moon";cur=k;mode="selecting";sel=null;$("#card").classList.add("hide");closeD();$("#intro").classList.add("hide");$("#hint").classList.remove("hide");Wd[k].pv.visible=Wd[o].pv.visible=true;tg[k]={p:new THREE.Vector3(0,0,0),s:1};tg[o]={p:new THREE.Vector3(0,0,-14),s:.3};tw={q:new THREE.Quaternion().setFromEuler(new THREE.Euler(.2,-.5,0)),d:3.4};document.querySelectorAll("[data-p]").forEach(b=>b.classList.toggle("on",b.dataset.p==k));clearTimeout(enter.t);enter.t=setTimeout(()=>{Wd[o].pv.visible=false;mode="explore";plist()},1000)}
$("#hm").onclick=home;$("#bd").onclick=showList;
cv.addEventListener("pointermove",e=>{if(mode=="home"&&!ptr.size){const k=hit(e);if(k!=hov){hov=k;setT();cv.style.cursor=k?"pointer":"default"}}});
document.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>enter(b.dataset.p));
$("#u").onclick=()=>{mi=!mi;$("#u").textContent="Units: "+(mi?"miles":"km");if(sel)card();plist()};
$("#pm").onclick=()=>{pinMode=!pinMode;$("#pm").textContent="Pin mode: "+(pinMode?"on – tap the surface":"off");$("#pm").classList.toggle("on",pinMode)};
$("#rs").onclick=()=>{tw={q:new THREE.Quaternion().setFromEuler(new THREE.Euler(.2,-.5,0)),d:3.4}};
setTimeout(()=>{try{init()}catch(e){$("#hint").textContent="3D could not start (WebGL unavailable)."}$("#ld").remove()},40);
