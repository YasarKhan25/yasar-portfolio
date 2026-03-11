/* =====================================================
   6 fully playable HTML5 Canvas game engines
   Each engine accepts a canvas element and starts
   a game loop. Call stopGame() to clean up.
===================================================== */

let _animId = null
let _kd = null
let _ku = null

export function stopGame() {
  if (_animId) { cancelAnimationFrame(_animId); _animId = null }
  if (_kd) { window.removeEventListener('keydown', _kd); _kd = null }
  if (_ku) { window.removeEventListener('keyup', _ku); _ku = null }
}

function makeKeys() {
  const k = {}
  _kd = e => {
    k[e.code] = true; k[e.key] = true
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))
      e.preventDefault()
  }
  _ku = e => { k[e.code] = false; k[e.key] = false }
  window.addEventListener('keydown', _kd)
  window.addEventListener('keyup', _ku)
  return k
}

function loop(fn) { const tick = () => { fn(); _animId = requestAnimationFrame(tick) }; tick() }

function drawTank(ctx, x, y, ang, col) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang)
  ctx.fillStyle = col; ctx.fillRect(-13,-17,26,34)
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-17,-17,5,34); ctx.fillRect(12,-17,5,34)
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.fill()
  ctx.fillStyle = col==='#1d6fe8' ? '#93c5fd' : '#fca5a5'; ctx.fillRect(-2.5,-22,5,22)
  ctx.restore()
}

function sparks(pts, x, y, col, n) {
  for (let i=0; i<n; i++) {
    const a = Math.random()*Math.PI*2, s = 1+Math.random()*3
    pts.push({ x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s, life:25, col })
  }
}

// ─── TANK BATTLE ───────────────────────────────────
export function runTank(cv) {
  const ctx=cv.getContext('2d'), W=cv.width, H=cv.height, K=makeKeys()
  let mx=W/2, my=H/2
  cv.addEventListener('mousemove', e => {
    const r=cv.getBoundingClientRect()
    mx=(e.clientX-r.left)*(W/r.width); my=(e.clientY-r.top)*(H/r.height)
  })
  let p,bul,ene,pts,score,wave,over,ammo,fcd,reloading,spawnT
  function spawnE() {
    const s=Math.floor(Math.random()*4); let x,y
    if(s===0){x=Math.random()*W;y=-30} else if(s===1){x=W+30;y=Math.random()*H}
    else if(s===2){x=Math.random()*W;y=H+30} else{x=-30;y=Math.random()*H}
    ene.push({x,y,ang:0,hp:1+wave,mhp:1+wave,spd:.6+wave*.15,fcd:60+Math.random()*80})
  }
  function reset() {
    p={x:W/2,y:H-70,ang:0,spd:0,hp:100}; bul=[];ene=[];pts=[]
    score=0;wave=1;over=false;ammo=10;fcd=0;reloading=false;spawnT=0
    for(let i=0;i<4;i++) spawnE()
  }
  reset()
  cv.addEventListener('click', () => {
    if(over){reset();return}
    if(ammo>0&&fcd<=0){ammo--;fcd=18;bul.push({x:p.x+Math.sin(p.ang)*24,y:p.y-Math.cos(p.ang)*24,vx:Math.sin(p.ang)*9,vy:-Math.cos(p.ang)*9,isP:true,life:90})}
  })
  loop(() => {
    if(!over){
      if(K['KeyA']||K['ArrowLeft']) p.ang-=.05
      if(K['KeyD']||K['ArrowRight']) p.ang+=.05
      if(K['KeyW']||K['ArrowUp']) p.spd=Math.min(p.spd+.2,3.2)
      else if(K['KeyS']||K['ArrowDown']) p.spd=Math.max(p.spd-.2,-1.5)
      else p.spd*=.85
      p.x=Math.max(20,Math.min(W-20,p.x+Math.sin(p.ang)*p.spd))
      p.y=Math.max(20,Math.min(H-20,p.y-Math.cos(p.ang)*p.spd))
      p.ang=Math.atan2(mx-p.x,-(my-p.y))
      if(fcd>0) fcd--; spawnT++
      if(ene.length===0){wave++;for(let i=0;i<3+wave;i++)spawnE()}
      if(spawnT>350&&ene.length<12){spawnT=0;spawnE()}
      ene.forEach(e=>{
        const dx=p.x-e.x,dy=p.y-e.y; e.ang=Math.atan2(dx,-dy)
        if(Math.hypot(dx,dy)>44){e.x+=Math.sin(e.ang)*e.spd;e.y-=Math.cos(e.ang)*e.spd}
        e.fcd--; if(e.fcd<=0){e.fcd=70+Math.random()*60;bul.push({x:e.x,y:e.y,vx:Math.sin(e.ang)*4,vy:-Math.cos(e.ang)*4,isP:false,life:90})}
      })
      bul=bul.filter(b=>{
        b.x+=b.vx;b.y+=b.vy;b.life--
        if(b.life<=0||b.x<-10||b.x>W+10||b.y<-10||b.y>H+10) return false
        if(b.isP){for(let i=ene.length-1;i>=0;i--){if(Math.hypot(b.x-ene[i].x,b.y-ene[i].y)<22){ene[i].hp--;sparks(pts,b.x,b.y,'#4ade80',5);if(ene[i].hp<=0){sparks(pts,ene[i].x,ene[i].y,'#fb923c',12);ene.splice(i,1);score+=100*wave};return false}}}
        else if(Math.hypot(b.x-p.x,b.y-p.y)<20){p.hp-=8;sparks(pts,b.x,b.y,'#f87171',5);if(p.hp<=0)over=true;return false}
        return true
      })
      pts=pts.filter(q=>{q.x+=q.vx;q.y+=q.vy;q.vx*=.9;q.vy*=.9;q.life--;return q.life>0})
      if(ammo===0&&!reloading){reloading=true;setTimeout(()=>{ammo=10;reloading=false},2800)}
    }
    ctx.fillStyle='#03080e';ctx.fillRect(0,0,W,H)
    ctx.strokeStyle='rgba(0,210,255,.04)';ctx.lineWidth=1
    for(let x=0;x<W;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
    for(let y=0;y<H;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
    pts.forEach(q=>{ctx.save();ctx.globalAlpha=q.life/25;ctx.fillStyle=q.col;ctx.beginPath();ctx.arc(q.x,q.y,3,0,Math.PI*2);ctx.fill();ctx.restore()})
    ene.forEach(e=>{drawTank(ctx,e.x,e.y,e.ang,'#dc2626');ctx.fillStyle='#111';ctx.fillRect(e.x-18,e.y-28,36,4);ctx.fillStyle='#22c55e';ctx.fillRect(e.x-18,e.y-28,36*(e.hp/e.mhp),4)})
    bul.forEach(b=>{ctx.save();ctx.globalAlpha=Math.min(1,b.life/30);ctx.fillStyle=b.isP?'#fbbf24':'#f87171';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(b.x,b.y,5,0,Math.PI*2);ctx.fill();ctx.restore()})
    drawTank(ctx,p.x,p.y,p.ang,'#1d6fe8')
    ctx.fillStyle='rgba(2,6,14,.8)';ctx.fillRect(8,8,190,90)
    ctx.font='10px Space Mono,monospace'
    ctx.fillStyle='#444';ctx.fillRect(30,14,130,7);ctx.fillStyle=p.hp>50?'#22c55e':p.hp>25?'#f59e0b':'#ef4444';ctx.fillRect(30,14,130*(p.hp/100),7)
    ctx.fillStyle='#00d2ff';ctx.fillText('AMMO '+(reloading?'[RELOAD]':ammo+'/10'),10,38)
    ctx.fillStyle='#fbbf24';ctx.fillText('SCORE '+score,10,52)
    ctx.fillStyle='#a855f7';ctx.fillText('WAVE '+wave,10,66)
    ctx.fillStyle='#22d3ee';ctx.fillText('ENEMIES '+ene.length,10,80)
    if(over){ctx.fillStyle='rgba(0,0,0,.85)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.font='bold 28px Rajdhani,sans-serif';ctx.fillStyle='#ef4444';ctx.fillText('GAME OVER',W/2,H/2-22);ctx.font='11px Space Mono,monospace';ctx.fillStyle='#6b7e99';ctx.fillText('Score: '+score+' · Wave: '+wave,W/2,H/2+8);ctx.fillStyle='#00d2ff';ctx.fillText('[ CLICK TO RESTART ]',W/2,H/2+36);ctx.textAlign='left'}
  })
}

// ─── FPS ARENA ─────────────────────────────────────
export function runFps(cv) {
  const ctx=cv.getContext('2d'),W=cv.width,H=cv.height,K=makeKeys()
  let mx=W/2,my=H/2
  cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();mx=(e.clientX-r.left)*(W/r.width);my=(e.clientY-r.top)*(H/r.height)})
  let pl,bul,ene,pts,wave,score,over,ammo,fcd,reloading,spawnT
  function spawnWave(){for(let i=0;i<3+wave*2;i++){const a=Math.random()*Math.PI*2,r=200+Math.random()*100;ene.push({x:pl.x+Math.cos(a)*r,y:pl.y+Math.sin(a)*r,hp:1+Math.floor(wave/2),mhp:1+Math.floor(wave/2),spd:.7+wave*.1,fcd:60+Math.random()*80})}}
  function reset(){pl={x:W/2,y:H/2,hp:100,spd:2.4};bul=[];ene=[];pts=[];wave=1;score=0;over=false;ammo=15;fcd=0;reloading=false;spawnT=0;spawnWave()}
  reset()
  cv.addEventListener('click',()=>{if(over){reset();return};if(ammo>0&&fcd<=0){ammo--;fcd=12;const a=Math.atan2(mx-pl.x,-(my-pl.y));bul.push({x:pl.x+Math.sin(a)*22,y:pl.y-Math.cos(a)*22,vx:Math.sin(a)*10,vy:-Math.cos(a)*10,life:70,isP:true})}})
  loop(()=>{
    if(!over){
      if(K['KeyA']||K['ArrowLeft'])pl.x-=pl.spd;if(K['KeyD']||K['ArrowRight'])pl.x+=pl.spd
      if(K['KeyW']||K['ArrowUp'])pl.y-=pl.spd;if(K['KeyS']||K['ArrowDown'])pl.y+=pl.spd
      pl.x=Math.max(18,Math.min(W-18,pl.x));pl.y=Math.max(18,Math.min(H-18,pl.y))
      if(fcd>0)fcd--;spawnT++
      if(spawnT>300&&ene.length<20){spawnT=0;ene.push({x:Math.random()<.5?-20:W+20,y:Math.random()*H,hp:1+Math.floor(wave/2),mhp:1+Math.floor(wave/2),spd:.7+wave*.1,fcd:80})}
      if(ene.length===0){wave++;spawnWave()}
      ene.forEach(e=>{const dx=pl.x-e.x,dy=pl.y-e.y,a=Math.atan2(dx,-dy);if(Math.hypot(dx,dy)>22){e.x+=Math.sin(a)*e.spd;e.y-=Math.cos(a)*e.spd};e.fcd--;if(e.fcd<=0){e.fcd=60+Math.random()*60;bul.push({x:e.x,y:e.y,vx:Math.sin(a)*3.5,vy:-Math.cos(a)*3.5,life:100,isP:false})}})
      bul=bul.filter(b=>{b.x+=b.vx;b.y+=b.vy;b.life--;if(b.life<=0||b.x<-10||b.x>W+10||b.y<-10||b.y>H+10)return false;if(b.isP){for(let i=ene.length-1;i>=0;i--){if(Math.hypot(b.x-ene[i].x,b.y-ene[i].y)<18){ene[i].hp--;sparks(pts,b.x,b.y,'#4ade80',5);if(ene[i].hp<=0){sparks(pts,ene[i].x,ene[i].y,'#fb923c',10);score+=100*wave;ene.splice(i,1)};return false}}}else if(Math.hypot(b.x-pl.x,b.y-pl.y)<18){pl.hp-=10;if(pl.hp<=0)over=true;return false};return true})
      pts=pts.filter(q=>{q.x+=q.vx;q.y+=q.vy;q.vx*=.88;q.vy*=.88;q.life--;return q.life>0})
      if(ammo===0&&!reloading){reloading=true;setTimeout(()=>{ammo=15;reloading=false},2500)}
    }
    ctx.fillStyle='#1a1a2e';ctx.fillRect(0,0,W,H)
    for(let x=0;x<W;x+=50)for(let y=0;y<H;y+=50){ctx.strokeStyle='rgba(255,255,255,.02)';ctx.lineWidth=1;ctx.strokeRect(x,y,50,50)}
    pts.forEach(q=>{ctx.save();ctx.globalAlpha=q.life/30;ctx.fillStyle=q.col;ctx.beginPath();ctx.arc(q.x,q.y,3,0,Math.PI*2);ctx.fill();ctx.restore()})
    ene.forEach(e=>{ctx.fillStyle='#7f1d1d';ctx.beginPath();ctx.arc(e.x,e.y,12,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ef4444';ctx.beginPath();ctx.arc(e.x,e.y,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.fillRect(e.x-14,e.y-22,28,4);ctx.fillStyle='#22c55e';ctx.fillRect(e.x-14,e.y-22,28*(e.hp/e.mhp),4)})
    bul.forEach(b=>{ctx.save();ctx.globalAlpha=Math.min(1,b.life/20);ctx.fillStyle=b.isP?'#fbbf24':'#f87171';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(b.x,b.y,b.isP?4:3,0,Math.PI*2);ctx.fill();ctx.restore()})
    const ang=Math.atan2(mx-pl.x,-(my-pl.y));ctx.save();ctx.translate(pl.x,pl.y);ctx.rotate(ang);ctx.fillStyle='#1e40af';ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3b82f6';ctx.beginPath();ctx.arc(0,0,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#93c5fd';ctx.fillRect(-3,-18,6,18);ctx.restore()
    ctx.fillStyle='rgba(2,6,14,.8)';ctx.fillRect(8,8,206,90)
    ctx.font='10px Space Mono,monospace'
    ctx.fillStyle='#444';ctx.fillRect(30,14,148,7);ctx.fillStyle=pl.hp>50?'#22c55e':pl.hp>25?'#f59e0b':'#ef4444';ctx.fillRect(30,14,148*(pl.hp/100),7)
    ctx.fillStyle='#fbbf24';ctx.fillText('AMMO '+(reloading?'[RELOAD]':ammo+'/15'),10,38)
    ctx.fillStyle='#00d2ff';ctx.fillText('SCORE '+score,10,52)
    ctx.fillStyle='#a855f7';ctx.fillText('WAVE '+wave,10,66)
    ctx.fillStyle='#6b7e99';ctx.fillText('ENEMIES '+ene.length,10,80)
    if(over){ctx.fillStyle='rgba(0,0,0,.85)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.font='bold 28px Rajdhani,sans-serif';ctx.fillStyle='#ef4444';ctx.fillText('YOU DIED',W/2,H/2-22);ctx.font='11px Space Mono,monospace';ctx.fillStyle='#6b7e99';ctx.fillText('Score: '+score+' · Wave: '+wave,W/2,H/2+8);ctx.fillStyle='#00d2ff';ctx.fillText('[ CLICK TO RESTART ]',W/2,H/2+36);ctx.textAlign='left'}
  })
}

// ─── SKIING ────────────────────────────────────────
export function runSki(cv) {
  const ctx=cv.getContext('2d'),W=cv.width,H=cv.height,K=makeKeys()
  let s,trees,obs,started,over
  function reset(){s={x:W/2,y:H*.38,vx:0,spd:2,ang:0};trees=[];obs=[];started=false;over=false;score=0;lives=3;dist=0;for(let i=0;i<22;i++)trees.push({x:Math.random()*W,y:Math.random()*H*3-H});for(let i=0;i<12;i++)obs.push({x:Math.random()*W*.72+W*.14,y:-(Math.random()*H*2+100),type:Math.random()>.5?'rock':'mogul'})}
  let score=0,lives=3,dist=0
  reset()
  cv.addEventListener('click',()=>{started=true;if(over)reset()})
  loop(()=>{
    if(started&&!over){
      if(K['ArrowLeft']||K['KeyA']){s.vx-=.28;s.ang=Math.max(s.ang-.04,-.48)}
      else if(K['ArrowRight']||K['KeyD']){s.vx+=.28;s.ang=Math.min(s.ang+.04,.48)}
      else{s.vx*=.82;s.ang*=.88}
      if(K['ArrowUp']||K['KeyW'])s.spd=Math.max(s.spd-.06,1)
      s.vx=Math.max(-5.5,Math.min(5.5,s.vx));s.x=Math.max(16,Math.min(W-16,s.x+s.vx))
      s.spd=Math.min(s.spd+.004,9);dist+=s.spd;score=Math.floor(dist/10)
      obs.forEach(o=>{o.y+=s.spd;if(o.y>H+50){o.y=-(Math.random()*150+50);o.x=Math.random()*W*.72+W*.14};if(Math.hypot(s.x-o.x,s.y-o.y)<22){lives--;s.spd=1;s.vx=0;o.y=-200;if(lives<=0)over=true}})
      trees.forEach(t=>{t.y+=s.spd*.25;if(t.y>H+50)t.y=-(Math.random()*280+50)})
    }
    const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#0a1628');sky.addColorStop(1,'#1e3a5f');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H)
    const grd=ctx.createLinearGradient(0,H*.1,0,H);grd.addColorStop(0,'#dff7f4');grd.addColorStop(1,'#aed4f0');ctx.fillStyle=grd;ctx.fillRect(0,H*.12,W,H)
    trees.forEach(t=>{const sc=.7+t.x/W*.6;ctx.save();ctx.translate(t.x,t.y);ctx.scale(sc,sc);ctx.fillStyle='#14532d';ctx.beginPath();ctx.moveTo(0,-38);ctx.lineTo(-14,6);ctx.lineTo(14,6);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(0,-58);ctx.lineTo(-10,-18);ctx.lineTo(10,-18);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(-2,6,4,12);ctx.restore()})
    obs.forEach(o=>{if(o.type==='rock'){ctx.fillStyle='#475569';ctx.beginPath();ctx.ellipse(o.x,o.y,20,13,0,0,Math.PI*2);ctx.fill()}else{ctx.fillStyle='#dde9f8';ctx.beginPath();ctx.ellipse(o.x,o.y,16,9,0,0,Math.PI*2);ctx.fill()}})
    ctx.save();ctx.translate(s.x,s.y);ctx.rotate(s.ang);ctx.strokeStyle='rgba(147,197,253,.5)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-3,2);ctx.lineTo(-3,22);ctx.stroke();ctx.beginPath();ctx.moveTo(3,2);ctx.lineTo(3,22);ctx.stroke();ctx.fillStyle='#dc2626';ctx.fillRect(-7,-18,14,17);ctx.fillStyle='#fde68a';ctx.beginPath();ctx.arc(0,-22,7,0,Math.PI*2);ctx.fill();ctx.restore()
    ctx.fillStyle='rgba(2,6,14,.72)';ctx.fillRect(8,8,196,62)
    ctx.font='10px Space Mono,monospace';ctx.fillStyle='#93c5fd';ctx.fillText('SCORE '+score,14,26);ctx.fillText('SPEED '+s.spd.toFixed(1)+'x',14,42);ctx.fillStyle='#fde68a';ctx.fillText('DIST '+(dist/100).toFixed(1)+'km',14,58)
    for(let i=0;i<3;i++){ctx.fillStyle=i<lives?'#ef4444':'#374151';const hx=W-18-i*22,hy=14;ctx.beginPath();ctx.moveTo(hx,hy+5);ctx.bezierCurveTo(hx,hy,hx-8,hy,hx-8,hy+8);ctx.bezierCurveTo(hx-8,hy+14,hx,hy+20,hx,hy+20);ctx.bezierCurveTo(hx,hy+20,hx+8,hy+14,hx+8,hy+8);ctx.bezierCurveTo(hx+8,hy,hx,hy,hx,hy+5);ctx.fill()}
    if(!started){ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.font='bold 26px Rajdhani,sans-serif';ctx.fillStyle='#60a5fa';ctx.fillText('DOWNHILL RUSH',W/2,H/2-22);ctx.font='11px Space Mono,monospace';ctx.fillStyle='#6b7e99';ctx.fillText('← → Steer  |  ↑ Brake  |  Click to Start',W/2,H/2+8);ctx.textAlign='left'}
    if(over){ctx.fillStyle='rgba(0,0,0,.84)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.font='bold 26px Rajdhani,sans-serif';ctx.fillStyle='#ef4444';ctx.fillText('CRASHED!',W/2,H/2-22);ctx.font='11px Space Mono,monospace';ctx.fillStyle='#6b7e99';ctx.fillText('Score: '+score,W/2,H/2+8);ctx.fillStyle='#00d2ff';ctx.fillText('[ CLICK TO RESTART ]',W/2,H/2+36);ctx.textAlign='left'}
  })
}

// ─── ENDLESS RUNNER ────────────────────────────────
export function runRunner(cv) {
  const ctx=cv.getContext('2d'),W=cv.width,H=cv.height,K=makeKeys()
  const LANES=[W/2-148,W/2,W/2+148]
  let pl,obs,coins,score,spd,dist,over,started,spawnT,coinT
  function reset(){pl={lane:1,x:LANES[1],y:H-90,vy:0,onGround:true,sliding:false,slideT:0};obs=[];coins=[];score=0;spd=4;dist=0;over=false;started=false;spawnT=0;coinT=0}
  reset()
  cv.addEventListener('click',()=>{started=true;if(over){reset();started=true}})
  let lk={}
  loop(()=>{
    if(started&&!over){
      const ju=K['Space']||K['ArrowUp'],sl=K['ArrowDown']||K['KeyS'],ll=K['ArrowLeft']||K['KeyA'],rr=K['ArrowRight']||K['KeyD']
      if(ju&&!lk.j&&pl.onGround){pl.vy=-13;pl.onGround=false}
      if(sl&&!lk.s&&pl.onGround&&!pl.sliding){pl.sliding=true;pl.slideT=30}
      if(ll&&!lk.l&&pl.lane>0)pl.lane--;if(rr&&!lk.r&&pl.lane<2)pl.lane++
      lk={j:ju,s:sl,l:ll,r:rr}
      dist++;spd=4+dist/600;score=Math.floor(dist/8)
      pl.x+=(LANES[pl.lane]-pl.x)*.18;pl.y+=pl.vy;pl.vy+=.6
      if(pl.y>=H-90){pl.y=H-90;pl.vy=0;pl.onGround=true}
      if(pl.sliding){pl.slideT--;if(pl.slideT<=0)pl.sliding=false}
      spawnT++;coinT++
      if(spawnT>Math.max(40,90-spd*6)){spawnT=0;obs.push({x:LANES[Math.floor(Math.random()*3)],y:-40,type:Math.random()>.4?'barrier':'hurdle'})}
      if(coinT>25){coinT=0;coins.push({x:LANES[Math.floor(Math.random()*3)],y:pl.y-40-Math.random()*60,got:false})}
      obs.forEach(o=>o.y+=spd);coins.forEach(c=>{c.y+=spd;if(!c.got&&Math.abs(c.x-pl.x)<28&&Math.abs(c.y-pl.y)<28){c.got=true;score+=10}})
      obs=obs.filter(o=>{if(o.y>H+40)return false;const py=pl.y-(pl.sliding?7:0),ph=pl.sliding?14:36;if(Math.abs(o.x-pl.x)<32&&Math.abs(o.y-py)<ph+14){if(o.type==='hurdle'&&!pl.onGround)return true;over=true};return true})
      coins=coins.filter(c=>!c.got&&c.y<H+20)
    }
    ctx.fillStyle='#0f0523';ctx.fillRect(0,0,W,H)
    ctx.fillStyle='#1a0a3a';ctx.fillRect(LANES[0]-80,H-60,LANES[2]-LANES[0]+160,60)
    ctx.strokeStyle='rgba(0,210,255,.18)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(LANES[0]-80,H-60);ctx.lineTo(LANES[2]+80,H-60);ctx.stroke()
    ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=1;ctx.setLineDash([20,20]);ctx.lineDashOffset=-(dist%40)
    ;[LANES[0]+74,LANES[1]+74].forEach(x=>{ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()});ctx.setLineDash([])
    coins.forEach(c=>{ctx.fillStyle='#fbbf24';ctx.shadowColor='#fbbf24';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(c.x,c.y,8,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0})
    obs.forEach(o=>{if(o.type==='barrier'){ctx.fillStyle='#dc2626';ctx.fillRect(o.x-24,o.y-44,48,44);ctx.fillStyle='#fca5a5';ctx.fillRect(o.x-22,o.y-42,44,8)}else{ctx.fillStyle='#7c3aed';ctx.fillRect(o.x-28,o.y-18,56,18)}})
    const px=pl.x,py=pl.y,ph=pl.sliding?14:36
    ctx.fillStyle='#1d6fe8';if(pl.sliding)ctx.fillRect(px-22,py-14,44,14);else ctx.fillRect(px-14,py-ph,28,ph)
    if(!pl.sliding){ctx.fillStyle='#fde68a';ctx.beginPath();ctx.arc(px,py-ph-8,10,0,Math.PI*2);ctx.fill()}
    ctx.fillStyle='rgba(2,6,14,.72)';ctx.fillRect(8,8,184,42)
    ctx.font='10px Space Mono,monospace';ctx.fillStyle='#00d2ff';ctx.fillText('SCORE '+score,14,24);ctx.fillStyle='#fbbf24';ctx.fillText('SPEED '+spd.toFixed(1)+'x',14,40)
    if(!started){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.font='bold 26px Rajdhani,sans-serif';ctx.fillStyle='#a855f7';ctx.fillText('NEONDASH 3D',W/2,H/2-22);ctx.font='11px Space Mono,monospace';ctx.fillStyle='#6b7e99';ctx.fillText('← → Lane  |  Space Jump  |  ↓ Slide  |  Click',W/2,H/2+8);ctx.textAlign='left'}
    if(over){ctx.fillStyle='rgba(0,0,0,.84)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.font='bold 26px Rajdhani,sans-serif';ctx.fillStyle='#ef4444';ctx.fillText('GAME OVER',W/2,H/2-22);ctx.font='11px Space Mono,monospace';ctx.fillStyle='#6b7e99';ctx.fillText('Score: '+score,W/2,H/2+8);ctx.fillStyle='#00d2ff';ctx.fillText('[ CLICK TO RESTART ]',W/2,H/2+36);ctx.textAlign='left'}
  })
}

// ─── PUZZLE ────────────────────────────────────────
export function runPuzzle(cv) {
  const ctx=cv.getContext('2d'),W=cv.width,H=cv.height,K=makeKeys()
  const T=44,COLS=12,ROWS=8,OX=Math.floor((W-COLS*T)/2),OY=Math.floor((H-ROWS*T)/2)
  const LVLS=[
    {g:[[1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,2,0,0,0,3,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1]],box:{c:4,r:4},pl:{c:2,r:2}},
    {g:[[1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,1,0,0,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,0,0,1],[1,0,0,0,0,2,0,0,3,0,0,1],[1,0,0,1,0,0,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1]],box:{c:5,r:5},pl:{c:2,r:2}},
    {g:[[1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,1,0,0,0,0,0,1],[1,0,0,0,0,0,0,1,0,0,0,1],[1,0,3,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,1,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1]],box:{c:8,r:5},pl:{c:9,r:2}},
  ]
  let li=0,grid,box,player,moves,won,wonT
  function loadLevel(){const L=LVLS[li%LVLS.length];grid=L.g.map(r=>[...r]);box={...L.box};player={...L.pl};moves=0;won=false;wonT=0}
  loadLevel()
  cv.addEventListener('click',()=>{if(won){li++;loadLevel()}})
  let lk={}
  loop(()=>{
    if(won)wonT=Math.min(wonT+.06,1)
    const lu=K['ArrowLeft']||K['KeyA'],ru=K['ArrowRight']||K['KeyD'],uu=K['ArrowUp']||K['KeyW'],du=K['ArrowDown']||K['KeyS']
    let dr=0,dc=0;if(lu&&!lk.l)dc=-1;else if(ru&&!lk.r)dc=1;else if(uu&&!lk.u)dr=-1;else if(du&&!lk.d)dr=1
    lk={l:lu,r:ru,u:uu,d:du}
    if((dc||dr)&&!won){const nr=player.r+dr,nc=player.c+dc;if(grid[nr]&&grid[nr][nc]===0){if(box.r===nr&&box.c===nc){const br=nr+dr,bc=nc+dc;if(grid[br]&&grid[br][bc]===0){box.r=br;box.c=bc;player.r=nr;player.c=nc;moves++}}else{player.r=nr;player.c=nc;moves++}};if(LVLS[li%LVLS.length].g[box.r][box.c]===3)won=true}
    ctx.fillStyle='#0d1225';ctx.fillRect(0,0,W,H)
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const x=OX+c*T,y=OY+r*T,cell=grid[r][c];if(cell===1){ctx.fillStyle='#1e2d4a';ctx.fillRect(x,y,T,T);ctx.fillStyle='#0d1225';ctx.fillRect(x+2,y+2,T-4,T-4)}else if(cell===3){ctx.fillStyle='rgba(34,197,94,.12)';ctx.fillRect(x,y,T,T);ctx.strokeStyle='#22c55e';ctx.lineWidth=2;ctx.strokeRect(x+3,y+3,T-6,T-6)}}
    const bx=OX+box.c*T,by=OY+box.r*T;ctx.fillStyle='#92400e';ctx.fillRect(bx+3,by+3,T-6,T-6);ctx.fillStyle='#fbbf24';ctx.fillRect(bx+8,by+8,T-16,T-16)
    const px=OX+player.c*T+T/2,py=OY+player.r*T+T/2;ctx.fillStyle='#1d6fe8';ctx.beginPath();ctx.arc(px,py,14,0,Math.PI*2);ctx.fill();ctx.fillStyle='#93c5fd';ctx.beginPath();ctx.arc(px,py,8,0,Math.PI*2);ctx.fill()
    ctx.fillStyle='rgba(2,6,14,.72)';ctx.fillRect(8,8,186,42)
    ctx.font='10px Space Mono,monospace';ctx.fillStyle='#a855f7';ctx.fillText('LEVEL '+(li%LVLS.length+1)+'/'+LVLS.length,14,24);ctx.fillStyle='#6b7e99';ctx.fillText('MOVES '+moves,14,40)
    if(won){ctx.fillStyle=`rgba(0,0,0,${.8*wonT})`;ctx.fillRect(0,0,W,H);ctx.globalAlpha=wonT;ctx.textAlign='center';ctx.font='bold 26px Rajdhani,sans-serif';ctx.fillStyle='#22c55e';ctx.fillText('SOLVED! 🎉',W/2,H/2-16);ctx.font='11px Space Mono,monospace';ctx.fillStyle='#6b7e99';ctx.fillText('Moves: '+moves+' · Click for next level',W/2,H/2+12);ctx.globalAlpha=1;ctx.textAlign='left'}
  })
}

// ─── RACING ────────────────────────────────────────
export function runRacing(cv) {
  const ctx=cv.getContext('2d'),W=cv.width,H=cv.height,K=makeKeys()
  const OC=['#dc2626','#7c3aed','#0891b2','#16a34a']
  let pl,opp,score,dist,lap,started,over
  function drawCar(x,y,ang,col){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle=col;ctx.fillRect(-13,-27,26,52);ctx.fillStyle='rgba(147,197,253,.3)';ctx.fillRect(-9,-25,18,11);ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(-9,7,18,9);ctx.fillStyle='#111';[[-15,-15,4,15],[11,-15,4,15],[-15,11,4,15],[11,11,4,15]].forEach(r=>ctx.fillRect(...r));ctx.restore()}
  function reset(){pl={x:W/2,y:H-80,ang:0,spd:0,hp:100,nitro:100};opp=[];score=0;dist=0;lap=0;started=false;over=false;for(let i=0;i<4;i++)opp.push({x:W/4+i*(W/5),y:-100-i*120,spd:2.5+i*.3,col:OC[i]})}
  reset()
  cv.addEventListener('click',()=>{started=true;if(over){reset();started=true}})
  loop(()=>{
    if(started&&!over){
      const acc=K['ArrowUp']||K['KeyW'],brk=K['ArrowDown']||K['KeyS'],lt=K['ArrowLeft']||K['KeyA'],rt=K['ArrowRight']||K['KeyD'],nit=K['Space']
      if(acc)pl.spd=Math.min(pl.spd+(nit&&pl.nitro>0?.35:.22),nit&&pl.nitro>0?12:8)
      else if(brk)pl.spd=Math.max(pl.spd-.4,0);else pl.spd=Math.max(pl.spd-.08,0)
      if(nit&&pl.nitro>0)pl.nitro=Math.max(0,pl.nitro-1);else pl.nitro=Math.min(100,pl.nitro+.3)
      if(lt)pl.ang-=.04+pl.spd*.004;if(rt)pl.ang+=.04+pl.spd*.004
      pl.x+=Math.sin(pl.ang)*pl.spd;pl.y-=Math.cos(pl.ang)*pl.spd
      pl.x=Math.max(60,Math.min(W-60,pl.x));if(pl.y<-40){pl.y=H;lap++;score+=500};if(pl.y>H+40)pl.y=H
      dist+=pl.spd
      opp.forEach(o=>{o.y+=o.spd;if(o.y>H+60)o.y=-(100+Math.random()*200);if(Math.hypot(pl.x-o.x,pl.y-o.y)<36){pl.hp-=5;pl.spd=Math.max(0,pl.spd-3);if(pl.hp<=0)over=true}})
    }
    ctx.fillStyle='#1e2d1e';ctx.fillRect(0,0,W,H);ctx.fillStyle='#2d3a2d';ctx.fillRect(50,0,W-100,H);ctx.fillStyle='#1a2a1a';ctx.fillRect(70,0,W-140,H)
    ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=3;ctx.setLineDash([38,28]);ctx.lineDashOffset=-(dist%66);[W/2-80,W/2,W/2+80].forEach(x=>{ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()});ctx.setLineDash([])
    ctx.strokeStyle='#f59e0b';ctx.lineWidth=4;[70,W-70].forEach(x=>{ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()})
    opp.forEach(o=>drawCar(o.x,o.y,Math.PI,o.col));drawCar(pl.x,pl.y,pl.ang,'#1d6fe8')
    ctx.fillStyle='rgba(2,6,14,.75)';ctx.fillRect(8,8,226,98)
    ctx.font='10px Space Mono,monospace'
    ctx.fillStyle='#00d2ff';ctx.fillText('SCORE '+score,14,24);ctx.fillStyle='#fbbf24';ctx.fillText('SPEED '+Math.floor(pl.spd*30)+' km/h',14,40);ctx.fillStyle='#a855f7';ctx.fillText('LAPS '+lap,14,56)
    ctx.fillStyle='#ff6b35';ctx.fillText('NITRO',14,72);ctx.fillStyle='#111';ctx.fillRect(54,62,136,8);ctx.fillStyle=pl.nitro>30?'#ff6b35':'#ef4444';ctx.fillRect(54,62,136*(pl.nitro/100),8)
    ctx.fillStyle='#6b7e99';ctx.fillText('HP',14,90);ctx.fillStyle='#111';ctx.fillRect(34,80,136,8);ctx.fillStyle=pl.hp>50?'#22c55e':pl.hp>25?'#f59e0b':'#ef4444';ctx.fillRect(34,80,136*(pl.hp/100),8)
    if(!started){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.font='bold 26px Rajdhani,sans-serif';ctx.fillStyle='#ff6b35';ctx.fillText('NEON VELOCITY',W/2,H/2-22);ctx.font='11px Space Mono,monospace';ctx.fillStyle='#6b7e99';ctx.fillText('← → Steer  |  ↑ Gas  |  ↓ Brake  |  Space=Nitro',W/2,H/2+8);ctx.textAlign='left'}
    if(over){ctx.fillStyle='rgba(0,0,0,.84)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.font='bold 26px Rajdhani,sans-serif';ctx.fillStyle='#ef4444';ctx.fillText('CRASHED OUT!',W/2,H/2-22);ctx.font='11px Space Mono,monospace';ctx.fillStyle='#6b7e99';ctx.fillText('Score: '+score+' · Laps: '+lap,W/2,H/2+8);ctx.fillStyle='#00d2ff';ctx.fillText('[ CLICK TO RESTART ]',W/2,H/2+36);ctx.textAlign='left'}
  })
}

export const RUNNERS = { tank: runTank, fps: runFps, ski: runSki, runner: runRunner, puzzle: runPuzzle, racing: runRacing }
