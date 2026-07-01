/* ============================================================
   navbar.js —— 导航栏行为脚本
   独立的 IIFE，不依赖其他模块
============================================================ */

(function(){
  const navbar = document.getElementById('resizable-navbar');
  const hamburger = document.getElementById('navbar-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (!navbar) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  const THRESHOLD = 60;

  function onScroll(){
    const currentY = window.scrollY;
    const diff = currentY - lastScrollY;

    if (Math.abs(diff) > THRESHOLD){
      navbar.classList.toggle('nav-hidden', diff > 0);
      navbar.classList.toggle('scrolled', currentY > 10);
      lastScrollY = currentY;
    }
  }

  window.addEventListener('scroll', function(){
    if (!ticking){
      requestAnimationFrame(function(){
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  if (hamburger && mobileMenu){
    hamburger.addEventListener('click', function(){
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
    });

    mobileLinks.forEach(function(link){
      link.addEventListener('click', function(){
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  navLinks.forEach(function(link){
    link.addEventListener('click', function(e){
      navLinks.forEach(function(l){ l.classList.remove('active'); });
      link.classList.add('active');
    });
  });

  const themeBtn = document.getElementById('btn-theme');
  if (themeBtn){
    themeBtn.addEventListener('click', function(){
      const body = document.body;
      const isDark = body.getAttribute('data-theme') !== 'light';
      body.setAttribute('data-theme', isDark ? 'light' : 'dark');
      try { localStorage.setItem('comic-canvas-theme', isDark ? 'light' : 'dark'); } catch(e){}
    });
  }

  const pureBtn = document.getElementById('btn-pure');
  if (pureBtn){
    pureBtn.addEventListener('click', function(){
      document.body.classList.toggle('pure-mode');
      pureBtn.classList.toggle('active', document.body.classList.contains('pure-mode'));
    });
  }

  const waveCanvas = document.getElementById('wave-canvas');
  if (waveCanvas){
    const ctx = waveCanvas.getContext('2d');
    let w, h;
    let animId = null;
    let visible = true;
    const WAVES = 5;
    const AMP_BASE = 8;
    const SPEED = 0.0008;

    function resize(){
      const rect = navbar.getBoundingClientRect();
      w = waveCanvas.width = rect.width * devicePixelRatio;
      h = waveCanvas.height = rect.height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    function drawWave(t, amplitude, frequency, phase, color){
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.6;
      const cw = navbar.getBoundingClientRect().width;
      const ch = navbar.getBoundingClientRect().height;
      const baseY = ch * 0.55;

      for (let x = 0; x <= cw; x += 2){
        const y = baseY
          + Math.sin(x * frequency + phase) * amplitude
          + Math.sin(x * frequency * 1.618 + phase * 0.7) * amplitude * 0.4
          + Math.cos(x * frequency * 0.5 + phase * 1.3) * amplitude * 0.25;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function animate(now){
      if (!visible) { animId = requestAnimationFrame(animate); return; }
      const t = now * SPEED;
      ctx.clearRect(0, 0, w, h);

      drawWave(t, AMP_BASE, 0.015, t * 1.0, 'rgba(59,109,214,0.5)');
      drawWave(t, AMP_BASE * 0.7, 0.022, t * 0.8 + 1.5, 'rgba(99,130,220,0.4)');
      drawWave(t, AMP_BASE * 1.2, 0.011, t * 1.2 + 3.0, 'rgba(140,170,255,0.35)');
      drawWave(t, AMP_BASE * 0.5, 0.028, t * 0.6 + 4.5, 'rgba(59,109,214,0.25)');
      drawWave(t, AMP_BASE * 0.9, 0.018, t * 0.9 + 6.0, 'rgba(100,140,240,0.3)');

      animId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);

    const observer = new MutationObserver(function(){
      visible = !navbar.classList.contains('nav-hidden');
    });
    observer.observe(navbar, { attributes: true, attributeFilter: ['class'] });

    animId = requestAnimationFrame(animate);
  }
})();
