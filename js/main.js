/* main.js — WEB-WRLD interactions */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll progress bar ── */
  const scrollBar = document.getElementById('scrollBar');
  if (scrollBar) {
    window.addEventListener('scroll', () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollBar.style.width = (window.scrollY / max * 100) + '%';
    });
  }

  /* ── Sticky nav shrink ── */
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ── Active nav link ── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Hamburger / mobile menu ── */
  const hamburger   = document.querySelector('.hamburger');
  const mobileMenu  = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Stagger children inside .stagger-parent ── */
  document.querySelectorAll('.stagger-parent').forEach(parent => {
    const children = parent.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = (i * 0.12) + 's';
    });
  });

  /* ── Stats counter animation ── */
  function animateCounter(el, target, suffix = '') {
    let current = 0;
    const step  = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current + suffix;
    }, 25);
  }

  const statsSection = document.querySelector('.stats-row');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.stat-num').forEach(el => {
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
        });
        statsObserver.disconnect();
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
