/* =====================================================
   CarCare — Visual Effects Engine v2.0
   Dark Navy + Gold Theme
   Scroll Animations | Parallax | Particles | Tilt
   Interactive Hero | Form Effects | Counters
   ===================================================== */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════
     1. SMOOTH SCROLL FOR NAV ANCHORS
  ═══════════════════════════════════════════════ */
  document.querySelectorAll('nav a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ═══════════════════════════════════════════════
     2. GOLD PARTICLE CANVAS (Hero Background)
  ═══════════════════════════════════════════════ */
  function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-particles';
    canvas.style.cssText = `
      position:absolute; inset:0; z-index:1;
      pointer-events:none; width:100%; height:100%;
    `;
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let W, H, particles = [], mouse = { x: -9999, y: -9999 };

    function resize() {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    // Gold particle colors
    const goldColors = [
      'rgba(201,168,76,', 'rgba(212,184,67,', 'rgba(228,198,90,',
      'rgba(255,215,100,', 'rgba(180,140,50,'
    ];

    class Particle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * W;
        this.y = initial ? Math.random() * H : H + 10;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = -(Math.random() * 0.6 + 0.2);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.6 + 0.1;
        this.color = goldColors[Math.floor(Math.random() * goldColors.length)];
        this.life = 0;
        this.maxLife = Math.random() * 200 + 150;
        this.twinkle = Math.random() * Math.PI * 2;
      }
      update() {
        this.life++;
        this.x += this.speedX;
        this.y += this.speedY;
        this.twinkle += 0.04;

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const force = (80 - dist) / 80;
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
        }

        const fadeIn = Math.min(this.life / 30, 1);
        const fadeOut = this.life > this.maxLife - 30 ? (this.maxLife - this.life) / 30 : 1;
        this.currentOpacity = this.opacity * fadeIn * fadeOut * (0.7 + 0.3 * Math.sin(this.twinkle));

        if (this.life >= this.maxLife || this.y < -10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.currentOpacity + ')';
        ctx.fill();

        // Glow for larger particles
        if (this.size > 1.5) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = this.color + (this.currentOpacity * 0.15) + ')';
          ctx.fill();
        }
      }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ═══════════════════════════════════════════════
     3. PARALLAX HERO BACKGROUND
  ═══════════════════════════════════════════════ */
  function initParallax() {
    const heroBg = document.querySelector('.hero-parallax-bg');
    if (!heroBg) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const speed = 0.4;
      heroBg.style.transform = `translateY(${scrollY * speed}px) scale(1.1)`;
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════
     4. SCROLL REVEAL — Fade + Slide Animations
  ═══════════════════════════════════════════════ */

  // CSS for scroll animations
  const scrollCSS = document.createElement('style');
  scrollCSS.textContent = `
    /* Base reveal states */
    .sr-fade { opacity: 0; transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.23,1,0.32,1); }
    .sr-up    { opacity: 0; transform: translateY(50px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.23,1,0.32,1); }
    .sr-left  { opacity: 0; transform: translateX(-60px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.23,1,0.32,1); }
    .sr-right { opacity: 0; transform: translateX(60px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.23,1,0.32,1); }
    .sr-scale { opacity: 0; transform: scale(0.85); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.23,1,0.32,1); }
    .sr-zoom  { opacity: 0; transform: scale(1.1); transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.23,1,0.32,1); }

    /* Visible / revealed states */
    .sr-fade.revealed,
    .sr-up.revealed,
    .sr-left.revealed,
    .sr-right.revealed,
    .sr-scale.revealed,
    .sr-zoom.revealed  { opacity: 1; transform: none; }

    /* Stagger delays */
    .sr-delay-1 { transition-delay: 0.1s !important; }
    .sr-delay-2 { transition-delay: 0.2s !important; }
    .sr-delay-3 { transition-delay: 0.3s !important; }
    .sr-delay-4 { transition-delay: 0.4s !important; }
    .sr-delay-5 { transition-delay: 0.5s !important; }
    .sr-delay-6 { transition-delay: 0.6s !important; }
    .sr-delay-7 { transition-delay: 0.7s !important; }
    .sr-delay-8 { transition-delay: 0.8s !important; }

    /* ── Hero text entrance ── */
    .hero-badge    { animation: heroSlideDown 0.8s cubic-bezier(0.23,1,0.32,1) 0.2s both; }
    .hero h1       { animation: heroSlideUp 0.9s cubic-bezier(0.23,1,0.32,1) 0.4s both; }
    .hero p        { animation: heroSlideUp 0.9s cubic-bezier(0.23,1,0.32,1) 0.55s both; }
    .hero .btn     { animation: heroScaleIn 0.8s cubic-bezier(0.23,1,0.32,1) 0.7s both; }
    .hero-stats-bar { animation: heroSlideUp 0.8s cubic-bezier(0.23,1,0.32,1) 0.9s both; }

    @keyframes heroSlideDown {
      from { opacity:0; transform: translateY(-30px); }
      to   { opacity:1; transform: translateY(0); }
    }
    @keyframes heroSlideUp {
      from { opacity:0; transform: translateY(30px); }
      to   { opacity:1; transform: translateY(0); }
    }
    @keyframes heroScaleIn {
      from { opacity:0; transform: scale(0.8); }
      to   { opacity:1; transform: scale(1); }
    }

    /* ── Section heading underline animation ── */
    .section-heading-line {
      display: block;
      width: 0;
      height: 3px;
      background: linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C);
      border-radius: 2px;
      margin: 10px auto 0;
      transition: width 0.8s cubic-bezier(0.23,1,0.32,1) 0.3s;
    }
    .revealed .section-heading-line,
    .section-heading-line.revealed { width: 80px; }

    /* ── Gold shimmer on headings ── */
    .gold-shimmer-heading {
      background: linear-gradient(to right, #C9A84C 20%, #F5E07A 45%, #C9A84C 60%, #E8C96A 80%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: goldShimmer 3s linear infinite;
    }
    @keyframes goldShimmer {
      to { background-position: 200% center; }
    }

    /* ── Card hover gold border pulse ── */
    .service-card, .why-card, .offer-card, .p-card, .rv-card, .ba-card, .stat-box {
      transition: transform 0.35s cubic-bezier(0.23,1,0.32,1),
                  box-shadow 0.35s ease,
                  border-color 0.35s ease !important;
    }

    /* ── Floating label for booking inputs ── */
    .bm-form-group { position: relative; }
    .bm-form-input:focus {
      border-color: #C9A84C !important;
      box-shadow: 0 0 0 3px rgba(201,168,76,0.15), 0 0 20px rgba(201,168,76,0.1) !important;
      outline: none;
    }
    .bm-form-input:focus + .bm-focus-line { width: 100%; }
    .bm-focus-line {
      position: absolute;
      bottom: 0; left: 0;
      height: 2px;
      width: 0;
      background: linear-gradient(90deg, #C9A84C, #E8C96A);
      border-radius: 2px;
      transition: width 0.4s ease;
    }

    /* ── Calendar day hover ── */
    .bm-cal-day:not(.disabled):not(.selected):hover {
      background: rgba(201,168,76,0.15) !important;
      color: #C9A84C !important;
      border-color: rgba(201,168,76,0.4) !important;
      transform: scale(1.12);
    }
    .bm-cal-day.selected {
      background: #C9A84C !important;
      color: #05091A !important;
      font-weight: 700 !important;
      box-shadow: 0 4px 15px rgba(201,168,76,0.4) !important;
    }
    .bm-time-slot:hover:not(.selected) {
      border-color: #C9A84C !important;
      color: #C9A84C !important;
      background: rgba(201,168,76,0.08) !important;
      transform: translateY(-2px);
    }
    .bm-time-slot.selected {
      background: #C9A84C !important;
      color: #05091A !important;
      font-weight: 700 !important;
    }
    .bm-btn-next:not(:disabled) {
      background: linear-gradient(135deg, #C9A84C, #E8C96A) !important;
      color: #05091A !important;
      font-weight: 700 !important;
      box-shadow: 0 8px 25px rgba(201,168,76,0.35) !important;
    }
    .bm-btn-next:not(:disabled):hover {
      transform: translateY(-3px) !important;
      box-shadow: 0 14px 35px rgba(201,168,76,0.5) !important;
    }

    /* ── FAQ accordion smooth ── */
    .faq-a { max-height: 0; overflow: hidden; transition: max-height 0.5s cubic-bezier(0.23,1,0.32,1); }
    .faq-a.open { max-height: 300px; }
    .faq-icon { transition: transform 0.4s cubic-bezier(0.23,1,0.32,1); display:inline-block; }
    .faq-item-new.open .faq-icon { transform: rotate(45deg); color: #C9A84C; }
    .faq-item-new.open .faq-q { color: #C9A84C; }
    .faq-item-new { border-bottom: 1px solid rgba(201,168,76,0.1); transition: background 0.3s; }
    .faq-item-new:hover { background: rgba(201,168,76,0.03); }

    /* ── WhatsApp & Call FAB pulse ── */
    .whatsapp, .call {
      animation: fabPulse 2.5s ease-in-out infinite;
    }
    .call { animation-delay: 1.25s; }
    @keyframes fabPulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(201,168,76,0.3); }
      50%       { box-shadow: 0 4px 35px rgba(201,168,76,0.6), 0 0 0 8px rgba(201,168,76,0.08); }
    }

    /* ── Offer timer glow ── */
    .offer-timer-box {
      transition: transform 0.2s ease;
    }
    .offer-timer-num {
      animation: timerTick 1s ease-in-out infinite alternate;
    }
    @keyframes timerTick {
      from { text-shadow: 0 0 8px rgba(201,168,76,0.3); }
      to   { text-shadow: 0 0 20px rgba(201,168,76,0.7); }
    }

    /* ── Service card image zoom on hover ── */
    .service-card:hover .service-card-img {
      transform: scale(1.08);
    }
    .service-card-img { transition: transform 0.6s cubic-bezier(0.23,1,0.32,1) !important; }

    /* ── Nav active gold underline ── */
    nav a.active {
      color: #C9A84C !important;
      background: rgba(201,168,76,0.08) !important;
    }
    nav a::after { background: #C9A84C !important; }

    /* ── Progress bar for booking steps ── */
    .bm-step-dot.active {
      background: #C9A84C !important;
      box-shadow: 0 0 12px rgba(201,168,76,0.5) !important;
    }
    .bm-step-dot.done {
      background: #A6882E !important;
    }
    .bm-step-line.done {
      background: #C9A84C !important;
    }

    /* ── Header gold border on scroll ── */
    header.header-scrolled {
      border-bottom-color: rgba(201,168,76,0.25) !important;
    }

    /* ── Gold cursor trail ── */
    .cursor-trail {
      position: fixed;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(201,168,76,0.8), transparent);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%,-50%);
      transition: opacity 0.3s;
    }

    /* ── Section divider gold line ── */
    .gold-divider {
      width: 60px; height: 3px;
      background: linear-gradient(90deg, transparent, #C9A84C, transparent);
      margin: 12px auto;
      border-radius: 2px;
    }

    /* ── Booking modal open animation ── */
    .bm-overlay.open .bm-modal {
      animation: modalBounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
    }
    @keyframes modalBounceIn {
      from { opacity:0; transform: scale(0.85) translateY(30px); }
      to   { opacity:1; transform: scale(1) translateY(0); }
    }

    /* ── Offer copy button flash ── */
    .offer-copy-btn.copied {
      background: #C9A84C !important;
      color: #05091A !important;
      transform: scale(1.05);
    }

    /* ── Footer link hover ── */
    .footer-col a:hover { color: #C9A84C !important; padding-left: 6px; }
    .footer-col a { transition: color 0.2s, padding-left 0.2s; }

    /* ── Smooth page load overlay ── */
    #page-loader {
      position: fixed; inset: 0; z-index: 99999;
      background: #05091A;
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 20px;
      transition: opacity 0.6s ease, visibility 0.6s ease;
    }
    #page-loader.hidden { opacity: 0; visibility: hidden; }
    .loader-logo {
      font-size: 28px; font-weight: 700;
      color: #C9A84C; letter-spacing: 3px;
      animation: loaderPulse 1s ease-in-out infinite alternate;
    }
    @keyframes loaderPulse {
      from { opacity: 0.4; }
      to   { opacity: 1; }
    }
    .loader-bar {
      width: 200px; height: 3px;
      background: rgba(201,168,76,0.2);
      border-radius: 3px;
      overflow: hidden;
    }
    .loader-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #C9A84C, #E8C96A);
      border-radius: 3px;
      animation: loaderFill 1.2s cubic-bezier(0.23,1,0.32,1) forwards;
    }
    @keyframes loaderFill {
      from { width: 0; }
      to   { width: 100%; }
    }
  `;
  document.head.appendChild(scrollCSS);

  /* ═══════════════════════════════════════════════
     5. PAGE LOADER
  ═══════════════════════════════════════════════ */
  function initLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
      <div class="loader-logo">⚙ CarCare</div>
      <div class="loader-bar"><div class="loader-bar-fill"></div></div>
    `;
    document.body.prepend(loader);

    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 1300);
      setTimeout(() => loader.remove(), 1900);
    });
  }

  /* ═══════════════════════════════════════════════
     6. SCROLL REVEAL — IntersectionObserver
  ═══════════════════════════════════════════════ */
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(el => {
        if (el.isIntersecting) {
          el.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    // Observe all scroll-reveal elements
    document.querySelectorAll('.sr-fade,.sr-up,.sr-left,.sr-right,.sr-scale,.sr-zoom,.section-heading-line').forEach(el => {
      observer.observe(el);
    });

    return observer;
  }

  /* ═══════════════════════════════════════════════
     7. AUTO-APPLY SCROLL CLASSES TO SECTIONS
  ═══════════════════════════════════════════════ */
  function applyScrollClasses() {
    // Stats section heading
    document.querySelectorAll('.stats-section .section-title, .stats-section h2').forEach(el => {
      el.classList.add('sr-up');
    });

    // Why section
    document.querySelectorAll('.why-header .why-label').forEach(el => el.classList.add('sr-fade', 'sr-delay-1'));
    document.querySelectorAll('.why-header .why-heading').forEach(el => el.classList.add('sr-up', 'sr-delay-2'));
    document.querySelectorAll('.why-card').forEach((el, i) => {
      el.classList.add('sr-up', `sr-delay-${Math.min(i + 1, 6)}`);
    });

    // Services section
    document.querySelectorAll('.react-services-section .react-title').forEach((el, i) => {
      el.classList.add(i === 0 ? 'sr-fade' : 'sr-up', `sr-delay-${i + 1}`);
    });
    document.querySelectorAll('.service-card').forEach((el, i) => {
      el.classList.add('sr-scale', `sr-delay-${Math.min(i + 1, 8)}`);
    });

    // Offers section
    document.querySelectorAll('.offer-label').forEach(el => el.classList.add('sr-fade'));
    document.querySelectorAll('.offer-heading').forEach(el => el.classList.add('sr-up', 'sr-delay-1'));
    document.querySelectorAll('.offer-card').forEach((el, i) => {
      el.classList.add('sr-scale', `sr-delay-${Math.min(i + 1, 4)}`);
    });

    // Pricing section
    document.querySelectorAll('.pricing-heading').forEach(el => el.classList.add('sr-up'));
    document.querySelectorAll('.p-card').forEach((el, i) => {
      el.classList.add(i % 2 === 0 ? 'sr-left' : 'sr-right', `sr-delay-${Math.min(i + 1, 4)}`);
    });

    // Reviews section
    document.querySelectorAll('.rv-heading').forEach(el => el.classList.add('sr-up'));
    document.querySelectorAll('.rv-card').forEach((el, i) => {
      el.classList.add('sr-up', `sr-delay-${Math.min(i + 1, 6)}`);
    });

    // BA section
    document.querySelectorAll('.ba-heading').forEach(el => el.classList.add('sr-up'));
    document.querySelectorAll('.ba-card').forEach((el, i) => {
      el.classList.add(i === 0 ? 'sr-left' : 'sr-right', 'sr-delay-2');
    });

    // FAQ section
    document.querySelectorAll('.faq-heading').forEach(el => el.classList.add('sr-up'));
    document.querySelectorAll('.faq-item-new').forEach((el, i) => {
      el.classList.add('sr-left', `sr-delay-${Math.min(i + 1, 6)}`);
    });
    document.querySelectorAll('.faq-right').forEach(el => el.classList.add('sr-right', 'sr-delay-3'));

    // Booking / CTA section
    document.querySelectorAll('.cta-left').forEach(el => el.classList.add('sr-left', 'sr-delay-1'));
    document.querySelectorAll('.cta-right').forEach(el => el.classList.add('sr-right', 'sr-delay-2'));

    // Mechanic section
    document.querySelectorAll('.mf-info-side').forEach(el => el.classList.add('sr-left', 'sr-delay-1'));
    document.querySelectorAll('.mf-image-side').forEach(el => el.classList.add('sr-right', 'sr-delay-2'));

    // Footer
    document.querySelectorAll('.footer-col').forEach((el, i) => {
      el.classList.add('sr-up', `sr-delay-${Math.min(i + 1, 4)}`);
    });
  }

  /* ═══════════════════════════════════════════════
     8. RE-OBSERVE REACT-RENDERED ELEMENTS
  ═══════════════════════════════════════════════ */
  let scrollObserver = null;

  function reObserve() {
    if (!scrollObserver) return;
    document.querySelectorAll('.sr-fade,.sr-up,.sr-left,.sr-right,.sr-scale,.sr-zoom').forEach(el => {
      if (!el.classList.contains('revealed')) {
        scrollObserver.observe(el);
      }
    });
  }

  /* ═══════════════════════════════════════════════
     9. GOLD CURSOR TRAIL
  ═══════════════════════════════════════════════ */
  function initCursorTrail() {
    const trail = [];
    const trailCount = 6;

    for (let i = 0; i < trailCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail';
      dot.style.opacity = 1 - i * 0.15;
      dot.style.width = dot.style.height = `${8 - i}px`;
      document.body.appendChild(dot);
      trail.push({ el: dot, x: 0, y: 0 });
    }

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateTrail() {
      trail[0].x += (mouseX - trail[0].x) * 0.3;
      trail[0].y += (mouseY - trail[0].y) * 0.3;

      for (let i = 1; i < trailCount; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.35;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.35;
      }

      trail.forEach(t => {
        t.el.style.left = t.x + 'px';
        t.el.style.top = t.y + 'px';
      });

      requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Hide on mobile
    if (window.matchMedia('(max-width:768px)').matches) {
      trail.forEach(t => t.el.style.display = 'none');
    }
  }

  /* ═══════════════════════════════════════════════
     10. 3D CARD TILT (gold-themed)
  ═══════════════════════════════════════════════ */
  function addTilt(selector, intensity = 12) {
    document.addEventListener('mousemove', e => {
      const card = e.target.closest(selector);
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * intensity;
      const rotY = dx * intensity;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04) translateY(-6px)`;
      card.style.boxShadow = `${-dx * 18}px ${-dy * 18}px 50px rgba(201,168,76,0.15), 0 25px 60px rgba(0,0,0,0.45)`;

      const shimmer = card.querySelector('.glass-shimmer');
      if (shimmer) {
        shimmer.style.background = `radial-gradient(circle at ${(dx + 1) * 50}% ${(dy + 1) * 50}%, rgba(201,168,76,0.1) 0%, transparent 65%)`;
      }
      const magicBorder = card.querySelector('.magic-border');
      if (magicBorder) {
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;
        magicBorder.style.background = `radial-gradient(400px circle at ${localX}px ${localY}px, rgba(201,168,76,0.75), transparent 40%)`;
      }
    });

    document.addEventListener('mouseout', e => {
      if (!e.relatedTarget || !e.target.closest(selector)) return;
      const card = e.target.closest(selector);
      if (card && !card.contains(e.relatedTarget)) resetCard(card);
    });

    document.addEventListener('mouseleave', e => {
      const card = e.target.closest(selector);
      if (card) resetCard(card);
    }, true);
  }

  function resetCard(card) {
    card.style.transform = '';
    card.style.boxShadow = '';
    const shimmer = card.querySelector('.glass-shimmer');
    if (shimmer) shimmer.style.background = '';
    const magicBorder = card.querySelector('.magic-border');
    if (magicBorder) magicBorder.style.background = 'transparent';
  }

  /* ═══════════════════════════════════════════════
     11. INJECT GLASS SHIMMER + MAGIC BORDER INTO CARDS
  ═══════════════════════════════════════════════ */
  function injectShimmer(selector) {
    document.querySelectorAll(selector).forEach(card => {
      if (!card.querySelector('.glass-shimmer')) {
        const s = document.createElement('div');
        s.className = 'glass-shimmer';
        card.appendChild(s);
      }
      if (!card.querySelector('.magic-border')) {
        const b = document.createElement('div');
        b.className = 'magic-border';
        card.appendChild(b);
      }
    });
  }

  /* ═══════════════════════════════════════════════
     12. MAGNETIC BUTTON EFFECT
  ═══════════════════════════════════════════════ */
  function addMagnetic(selector, strength = 0.35) {
    document.querySelectorAll(selector).forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        btn.style.transform = `translate(${dx}px,${dy}px) scale(1.06)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ═══════════════════════════════════════════════
     13. RIPPLE EFFECT ON BUTTONS
  ═══════════════════════════════════════════════ */
  function addRipple(selector) {
    document.addEventListener('click', e => {
      const btn = e.target.closest(selector);
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  }

  /* ═══════════════════════════════════════════════
     14. HEADER GLASS BLUR ON SCROLL
  ═══════════════════════════════════════════════ */
  const header = document.querySelector('header');
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }

  /* ═══════════════════════════════════════════════
     15. HERO SECTION INTERACTIVE TEXT SPLIT
  ═══════════════════════════════════════════════ */
  function initHeroInteractive() {
    const heroP = document.querySelector('.hero p');
    if (heroP) {
      heroP.addEventListener('mouseenter', () => {
        heroP.style.letterSpacing = '1.5px';
        heroP.style.transition = 'letter-spacing 0.4s ease, color 0.4s ease';
        heroP.style.color = 'rgba(201,168,76,0.9)';
      });
      heroP.addEventListener('mouseleave', () => {
        heroP.style.letterSpacing = '';
        heroP.style.color = '';
      });
    }

    // Hero badge wiggle on hover
    const badge = document.querySelector('.hero-badge');
    if (badge) {
      badge.style.cursor = 'default';
      badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'scale(1.05)';
        badge.style.borderColor = 'rgba(201,168,76,0.6)';
        badge.style.transition = 'transform 0.3s ease, border-color 0.3s ease';
      });
      badge.addEventListener('mouseleave', () => {
        badge.style.transform = '';
        badge.style.borderColor = '';
      });
    }
  }

  /* ═══════════════════════════════════════════════
     16. BOOKING FORM FOCUS EFFECTS
  ═══════════════════════════════════════════════ */
  function initFormEffects() {
    // Observe booking modal for when it opens and inject focus lines
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.bm-form-input').forEach(input => {
        if (input.dataset.enhanced) return;
        input.dataset.enhanced = 'true';

        // Focus line
        const line = document.createElement('div');
        line.className = 'bm-focus-line';
        input.parentNode.appendChild(line);

        // Input typing animation
        input.addEventListener('input', () => {
          if (input.value.length > 0) {
            input.style.color = '#fff';
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ═══════════════════════════════════════════════
     17. OFFER STRIP SPEED CONTROL (pause on hover)
  ═══════════════════════════════════════════════ */
  function initOfferStrip() {
    const strip = document.querySelector('.offer-strip-inner');
    if (!strip) {
      setTimeout(initOfferStrip, 800);
      return;
    }
    strip.addEventListener('mouseenter', () => {
      strip.style.animationPlayState = 'paused';
    });
    strip.addEventListener('mouseleave', () => {
      strip.style.animationPlayState = 'running';
    });
  }

  /* ═══════════════════════════════════════════════
     18. AMBIENT ORB GOLD COLOR UPDATE
  ═══════════════════════════════════════════════ */
  function fixOrbColors() {
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    const orb3 = document.querySelector('.orb-3');
    if (orb1) orb1.style.background = '#1A3A8F';   // Deep Navy Blue orb
    if (orb2) orb2.style.background = '#C9A84C';   // Gold orb
    if (orb3) orb3.style.background = '#0D2B7A';   // Dark Navy orb
  }

  /* ═══════════════════════════════════════════════
     19. GOLD SECTION HEADINGS AUTO-ENHANCE
  ═══════════════════════════════════════════════ */
  function enhanceHeadings() {
    // Add underline dividers to section headings
    const headingSelectors = [
      '.react-title-main', '.why-heading', '.offer-heading',
      '.pricing-heading', '.rv-heading', '.ba-heading',
      '.faq-heading', '.booking-heading', '.mf-heading'
    ];

    headingSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(h => {
        if (h.querySelector('.section-heading-line')) return;
        const line = document.createElement('span');
        line.className = 'section-heading-line';
        h.appendChild(line);
      });
    });
  }

  /* ═══════════════════════════════════════════════
     20. SCROLL PROGRESS BAR (Gold top bar)
  ═══════════════════════════════════════════════ */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed; top: 0; left: 0; height: 3px;
      background: linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C);
      background-size: 200% 100%;
      z-index: 9999; width: 0%;
      transition: width 0.1s ease;
      animation: progressShimmer 2s linear infinite;
      box-shadow: 0 0 8px rgba(201,168,76,0.5);
    `;

    const shimmerAnim = document.createElement('style');
    shimmerAnim.textContent = `
      @keyframes progressShimmer {
        0%   { background-position: 0% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    document.head.appendChild(shimmerAnim);
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════
     21. MAIN INIT
  ═══════════════════════════════════════════════ */
  function init() {
    // Page loader
    initLoader();

    // Scroll progress
    initScrollProgress();

    // Particles
    initParticles();

    // Parallax hero bg
    initParallax();

    // Hero interactive
    initHeroInteractive();

    // Cursor trail
    initCursorTrail();

    // Scroll progress bar
    // (already init'd above)

    // Fix orb colors for navy+gold
    fixOrbColors();

    // Tilt on cards
    addTilt('.stat-box', 8);
    addTilt('.why-card', 8);
    addTilt('.offer-card', 7);
    addTilt('.p-card', 7);
    addTilt('.rv-card', 5);
    addTilt('.ba-card', 6);
    addTilt('.service-card', 6);
    addTilt('.cta-contact-card', 6);

    // Shimmer injection
    const shimmerSelectors = '.stat-box,.why-card,.offer-card,.p-card,.rv-card,.ba-card,.service-card,.cta-contact-card';
    setTimeout(() => injectShimmer(shimmerSelectors), 600);
    setTimeout(() => injectShimmer(shimmerSelectors), 1500);
    setTimeout(() => {
      injectShimmer(shimmerSelectors);
      addTilt('.service-card', 6);
      addTilt('.rv-card', 5);
      addTilt('.p-card', 7);
    }, 3000);

    // Magnetic buttons
    addMagnetic('.btn, .offer-btn, .submit-btn, .bm-btn-next, .faq-img-cta, .service-btn, .cta-book-btn, .cta-wa-btn, .mf-cta-btn', 0.3);

    // Ripple
    addRipple('.btn, .offer-btn, .submit-btn, .bm-btn-next, .p-btn, .service-btn, .offer-copy-btn, .cta-book-btn, .cta-wa-btn');

    // Scroll listener
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    // Offer strip
    initOfferStrip();

    // Form effects
    initFormEffects();

    // Apply scroll classes to static HTML elements
    applyScrollClasses();

    // Start scroll observer
    scrollObserver = initScrollReveal();

    // Re-enhance when React renders
    const mo = new MutationObserver(() => {
      injectShimmer(shimmerSelectors);
      addMagnetic('.btn, .offer-btn, .service-btn, .p-btn, .mf-cta-btn', 0.3);
      applyScrollClasses();
      reObserve();
      enhanceHeadings();
      setTimeout(enhanceHeadings, 200);
      setTimeout(() => { applyScrollClasses(); reObserve(); }, 500);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Multiple retries for React-rendered content
    [800, 1500, 2500, 4000].forEach(delay => {
      setTimeout(() => {
        injectShimmer(shimmerSelectors);
        applyScrollClasses();
        enhanceHeadings();
        reObserve();
        initOfferStrip();
        fixOrbColors();
      }, delay);
    });
  }

  /* ── Start ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
