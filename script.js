const CONFIG = {
  herName: 'Anna',
  photos: [
    'assets/photos/1.jpg',
    'assets/photos/2.jpg',
    'assets/photos/3.jpg',
    'assets/photos/4.jpg'
  ],
  messages: [
    "From the moment I met you, the world felt a little softer, the colors a little brighter.",
    "Your smile is my favorite sunrise; your laugh, my favorite song.",
    "Thank you for your kindness, your strength, and the way you light up every room you walk into.",
    "Today is your day — may it be as beautiful and brilliant as your heart."
  ],
  loveNote: `My love,

Every day with you is a gift I never take for granted. Your heart is where I feel most at home, and your joy is the melody that keeps me dancing through life.

On your birthday, I want to remind you how loved you are — today, tomorrow, always.

Forever yours,`,
  // Optional: local file or an online private link
  videoUrl: '' // e.g., 'assets/video/hb.mp4' or '' to show only note
};

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  setHeroTitle(CONFIG.herName);
  setupIntersectionReveal();
  setupSlideshow(CONFIG.photos);
  setupTypewriter(CONFIG.messages);
  setupMusicToggle();
  setupClickEffects();
  setupSurprise(CONFIG.loveNote, CONFIG.videoUrl);
});

// ---- HERO TITLE ----
function setHeroTitle(name){
  const title = document.getElementById('heroTitle');
  title.textContent = `Happy Birthday, ${name}!`;
}

// ---- INTERSECTION REVEAL ----
function setupIntersectionReveal(){
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('in-view'); }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.section-header, .slideshow, .typewriter-card, .surprise-card').forEach(el=>{
    el.classList.add('reveal'); observer.observe(el);
  });
}

// ---- SLIDESHOW ----
function setupSlideshow(photos){
  const slidesEl = document.getElementById('slides');
  const dotsEl = document.getElementById('dots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');

  if(!photos || photos.length === 0){
    slidesEl.innerHTML = `<div class="slide active"><div style="display:grid;place-items:center;color:#8a7a99">Add photos in assets/photos</div></div>`;
    return;
  }

  const slides = photos.map((src, i) => {
    const div = document.createElement('div');
    div.className = 'slide';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = src;
    img.alt = `Photo ${i+1}`;
    div.appendChild(img);
    slidesEl.appendChild(div);
    return div;
  });

  const dots = photos.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot';
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', `Go to slide ${i+1}`);
    d.addEventListener('click', ()=> goTo(i));
    dotsEl.appendChild(d);
    return d;
  });

  let index = 0;
  let autoTimer = null;

  function render(){
    slides.forEach((s, i)=> s.classList.toggle('active', i === index));
    dots.forEach((d, i)=> d.classList.toggle('active', i === index));
  }
  function goTo(i){
    index = (i + slides.length) % slides.length; render(); restartAuto();
  }
  function next(){ goTo(index+1) }
  function prev(){ goTo(index-1) }

  function startAuto(){ autoTimer = setInterval(next, 4000) }
  function stopAuto(){ if(autoTimer) clearInterval(autoTimer) }
  function restartAuto(){ stopAuto(); startAuto() }

  prevBtn.addEventListener('click', ()=> { prev(); pulse(prevBtn) });
  nextBtn.addEventListener('click', ()=> { next(); pulse(nextBtn) });

  // preload
  photos.forEach(src => { const i = new Image(); i.src = src });

  render(); startAuto();

  // pause on hover for accessibility
  slidesEl.addEventListener('mouseenter', stopAuto);
  slidesEl.addEventListener('mouseleave', startAuto);
}

// ---- TYPEWRITER ----
function setupTypewriter(messages){
  const el = document.getElementById('typewriter');
  const prev = document.getElementById('prevMessage');
  const next = document.getElementById('nextMessage');

  let i = 0; let typing = false; let cancel = false;

  function type(text){
    typing = true; cancel = false;
    el.textContent = '';
    let idx = 0;
    const speed = 26;
    function tick(){
      if(cancel){ typing = false; return }
      if(idx <= text.length){
        el.textContent = text.slice(0, idx);
        idx++;
        setTimeout(tick, speed);
      } else {
        typing = false;
      }
    }
    tick();
  }

  function show(n){
    i = (n + messages.length) % messages.length;
    type(messages[i]);
  }

  prev.addEventListener('click', ()=>{
    cancel = true; show(i-1); pulse(prev);
  });
  next.addEventListener('click', ()=>{
    cancel = true; show(i+1); pulse(next);
  });

  show(0);
}

function pulse(el){
  el.animate([{ transform:'scale(1)' }, { transform:'scale(1.06)' }, { transform:'scale(1)' }], { duration:200, easing:'ease-out' });
}

// ---- MUSIC ----
function setupMusicToggle(){
  const audio = document.getElementById('backgroundMusic');
  const toggle = document.getElementById('musicToggle');

  let playing = false;
  toggle.addEventListener('click', async ()=>{
    try{
      if(!playing){
        await audio.play(); playing = true; toggle.classList.add('playing');
      } else {
        audio.pause(); playing = false; toggle.classList.remove('playing');
      }
    }catch(e){
      console.warn('Audio blocked by browser gesture policy:', e);
    }
  });
}

// ---- CLICK EFFECTS (hearts + sparkles + occasional balloons) ----
function setupClickEffects(){
  document.addEventListener('click', (e)=>{
    createHeart(e.clientX, e.clientY);
    if(Math.random() < 0.3) createSparkle(e.clientX, e.clientY);
    if(Math.random() < 0.08) createBalloon(e.clientX, e.clientY);
  }, { passive:true });
}

function createHeart(x,y){
  const el = document.createElement('div');
  el.className = 'float-heart';
  el.textContent = '❤';
  const size = 14 + Math.random()*16;
  el.style.left = `${x - size/2}px`;
  el.style.top = `${y - size/2}px`;
  el.style.fontSize = `${size}px`;
  el.style.color = `hsl(${330 + Math.random()*40}, 80%, 60%)`;
  document.body.appendChild(el);

  const dx = (Math.random() - 0.5) * 80;
  const dy = - (80 + Math.random()*120);
  const anim = el.animate([
    { transform:`translate(0,0) scale(1)`, opacity: 0.9 },
    { transform:`translate(${dx/2}px, ${dy/2}px) scale(1.2)`, opacity: 0.8 },
    { transform:`translate(${dx}px, ${dy}px) scale(0.9)`, opacity:0 }
  ], { duration: 1200 + Math.random()*600, easing:'ease-out' });

  anim.onfinish = ()=> el.remove();
}

function createSparkle(x,y){
  const el = document.createElement('div');
  el.className = 'sparkle';
  const size = 6 + Math.random()*8;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = '50%';
  el.style.background = `radial-gradient(circle, #fff, ${Math.random()>0.5?'#ffd6ea':'#e2dcff'})`;
  el.style.left = `${x - size/2}px`;
  el.style.top = `${y - size/2}px`;
  document.body.appendChild(el);

  const dx = (Math.random() - 0.5) * 80;
  const dy = - (40 + Math.random()*80);
  const anim = el.animate([
    { transform:`translate(0,0) scale(0.6)`, opacity: 0.95 },
    { transform:`translate(${dx}px, ${dy}px) scale(1.4)`, opacity:0 }
  ], { duration: 900, easing:'cubic-bezier(.2,.7,.2,1)' });

  anim.onfinish = ()=> el.remove();
}

function createBalloon(x,y){
  const el = document.createElement('div');
  el.className = 'balloon';
  el.textContent = '🎈';
  const size = 24 + Math.random()*12;
  el.style.left = `${x - size/2}px`;
  el.style.top = `${y - size/2}px`;
  el.style.fontSize = `${size}px`;
  document.body.appendChild(el);

  const dx = (Math.random() - 0.5) * 60;
  const dy = - (window.innerHeight * 0.8 + Math.random()*120);
  const anim = el.animate([
    { transform:`translate(0,0)`, opacity: 1 },
    { transform:`translate(${dx}px, ${dy}px)`, opacity: 0.9 }
  ], { duration: 3000 + Math.random()*1500, easing:'cubic-bezier(.2,.7,.2,1)' });

  anim.onfinish = ()=> el.remove();
}

// ---- SURPRISE (modal + confetti) ----
function setupSurprise(note, videoUrl){
  const btn = document.getElementById('revealBtn');
  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modalBackdrop');
  const close = document.getElementById('modalClose');
  const body = document.getElementById('modalBody');

  function open(){
    body.innerHTML = '';
    if(videoUrl){
      const video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.src = videoUrl;
      body.appendChild(video);
      const hr = document.createElement('div');
      hr.style.height = '16px';
      body.appendChild(hr);
    }
    const noteEl = document.createElement('div');
    noteEl.className = 'love-note';
    noteEl.textContent = note + '\n\n— ♥';
    body.appendChild(noteEl);

    modal.setAttribute('aria-hidden', 'false');
    burstConfetti();
  }

  function closeModal(){
    modal.setAttribute('aria-hidden', 'true');
  }

  btn.addEventListener('click', ()=> { open(); pulse(btn) });
  backdrop.addEventListener('click', closeModal);
  close.addEventListener('click', closeModal);
}

// ---- CONFETTI ----
const Confetti = (function(){
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let running = false;
  let rafId = null;

  function resize(){
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener('resize', resize, { passive:true }); resize();

  function addBurst(x = window.innerWidth/2, y = window.innerHeight/3, count = 160){
    const colors = ['#ff6b9a','#8a7aff','#ffc06b','#7de0ea','#ffd6ea','#e2dcff'];
    for(let i=0;i<count;i++){
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random()*6;
      particles.push({
        x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed,
        size: 3 + Math.random()*3,
        color: colors[(Math.random()*colors.length)|0],
        life: 60 + Math.random()*60,
        rotation: Math.random()*360,
        vr: -6 + Math.random()*12
      });
    }
  }

  function tick(){
    if(!running) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.rotation += p.vr; p.life--;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rotation * Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life/80));
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
      ctx.restore();
    });
    particles = particles.filter(p=> p.life > 0 && p.y < window.innerHeight + 40);
    if(particles.length === 0){ running = false; cancelAnimationFrame(rafId); rafId = null; return; }
    rafId = requestAnimationFrame(tick);
  }

  function burst(x, y){
    addBurst(x, y);
    if(!running){ running = true; tick(); }
  }

  return { burst };
})();

function burstConfetti(){
  Confetti.burst(window.innerWidth/2, window.innerHeight/3);
}

// Optional: trigger a gentle confetti on first reveal or when page loads after a delay
setTimeout(()=> {
  // small subtle confetti cue
  // Confetti.burst(window.innerWidth * 0.7, window.innerHeight * 0.25);
}, 1800);
