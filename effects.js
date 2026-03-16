/* =====================================================
   CarCare — Visual Effects Engine
   Parallax | Fade In/Out | Glassy Interactions
   ===================================================== */

(function () {
  'use strict';

  /* ── Smooth Scroll for nav anchors ── */
  document.querySelectorAll('nav a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* Custom cursor and glow removed */

  /* ── Parallax hero background ── */
  const heroBg = document.querySelector('.hero-parallax-bg');
  const heroContent = document.querySelector('.parallax-content');
  const hero = document.querySelector('.hero');

  function onScroll() {
    /* Updated scroll handler - effects removed */
    updateHeader();
  }

  /* Parallax and Fade effects removed */

  /* ── 3D Tilt on Cards (mouse over) ── */
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
      card.style.boxShadow = `${-dx * 20}px ${-dy * 20}px 60px rgba(53,109,255,0.18), 0 30px 80px rgba(0,0,0,0.4)`;

      /* Glassy shimmer follow and magnetic border glow */
      const shimmer = card.querySelector('.glass-shimmer');
      if (shimmer) {
        // Spotlight reflection
        shimmer.style.background = `radial-gradient(circle at ${(dx + 1) * 50}% ${(dy + 1) * 50}%, rgba(255,255,255,0.12) 0%, transparent 65%)`;
      }
      const magicBorder = card.querySelector('.magic-border');
      if (magicBorder) {
        // Creates a border lighting effect that hits exactly where the mouse is
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;
        magicBorder.style.background = `radial-gradient(400px circle at ${localX}px ${localY}px, rgba(53,109,255,0.8), transparent 40%)`;
      }
    });

    document.addEventListener('mouseleave', e => {
      const card = e.target.closest(selector);
      if (!card) return;
      resetCard(card);
    }, true);

    document.addEventListener('mouseout', e => {
      if (!e.relatedTarget || !e.target.closest(selector)) return;
      const card = e.target.closest(selector);
      if (card && !card.contains(e.relatedTarget)) {
        resetCard(card);
      }
    });
  }

  function resetCard(card) {
    card.style.transform = '';
    card.style.boxShadow = '';
    const shimmer = card.querySelector('.glass-shimmer');
    if (shimmer) shimmer.style.background = '';
    const magicBorder = card.querySelector('.magic-border');
    if (magicBorder) magicBorder.style.background = 'transparent';
  }

  /* ── Inject glass-shimmer and magic-border into cards ── */
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

  /* ── Magnetic button effect ── */
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

  /* ── Ripple effect on buttons ── */
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

  /* ── Header glass blur on scroll ── */
  const header = document.querySelector('header');
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }

  /* ── Init after DOM ready ── */
  function init() {
    /* Tilt on cards */
    addTilt('.stat-box', 8);
    addTilt('.why-card', 8);
    addTilt('.offer-card', 7);
    addTilt('.p-card', 7);
    addTilt('.rv-card', 5);
    addTilt('.ba-card', 6);
    addTilt('.service-card', 6);

    /* Shimmer injection — retry after React renders */
    const shimmerSelectors = '.stat-box,.why-card,.offer-card,.p-card,.rv-card,.ba-card,.service-card';
    setTimeout(() => injectShimmer(shimmerSelectors), 600);
    setTimeout(() => injectShimmer(shimmerSelectors), 1500);
    setTimeout(() => {
      injectShimmer(shimmerSelectors);
      /* Re-add tilt after React-rendered cards appear */
      addTilt('.service-card', 6);
      addTilt('.rv-card', 5);
      addTilt('.p-card', 7);
    }, 3000);

    /* Magnetic buttons */
    addMagnetic('.btn, .offer-btn, .submit-btn, .bm-btn-next, .faq-img-cta, .service-btn', 0.3);

    /* Ripple */
    addRipple('.btn, .offer-btn, .submit-btn, .bm-btn-next, .p-btn, .service-btn, .offer-copy-btn');

    /* Scroll listeners */
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Initial call */
    onScroll();

    /* Observe dynamically added React cards with MutationObserver */
    const mo = new MutationObserver(() => {
      injectShimmer(shimmerSelectors);
      addMagnetic('.btn, .offer-btn, .service-btn, .p-btn', 0.3);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();