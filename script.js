/* =========================================================
   Felix Chiuman — ANDROID ENGINEER PORTFOLIO
   Interactions & animation
========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveal-on-scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Scroll-spy active nav link ---------- */
  const sections = document.querySelectorAll('main .section, .hero');
  const navAnchors = document.querySelectorAll('.nav-link');
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => a.classList.toggle('active', a.dataset.nav === id));
      }
    });
  }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(s => spyObserver.observe(s));

  /* ---------- Animated stat counters ---------- */
  const statEls = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.round(value);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statObserver.observe(el));

  /* ---------- Typed role phrases ---------- */
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    const phrases = ['inevitable.', 'fast.', 'reliable.', 'crash-free.', 'delightful.'];
    let phraseIndex = 0, charIndex = 0, deleting = false;

    const type = () => {
      const phrase = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = phrase.slice(0, charIndex);
        if (charIndex === phrase.length) {
          deleting = true;
          setTimeout(type, 1600);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = phrase.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? 35 : 65);
    };
    type();
  }

  /* ---------- Live clock in phone mockup ---------- */
  const clockEl = document.getElementById('liveClock');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      clockEl.textContent = `${h}:${m}`;
    };
    updateClock();
    setInterval(updateClock, 1000 * 15);
  }

  /* ---------- Hero visual parallax tilt ---------- */
  const heroVisual = document.getElementById('heroVisual');
  const heroSection = document.querySelector('.hero');
  if (heroVisual && heroSection && window.matchMedia('(pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      heroVisual.style.transform = 'rotateY(0) rotateX(0)';
    });
  }

  /* ---------- Testimonial carousel ---------- */
  const track = document.getElementById('tTrack');
  if (track) {
    const cards = Array.from(track.children);
    const dotsWrap = document.getElementById('tDots');
    const prevBtn = document.getElementById('tPrev');
    const nextBtn = document.getElementById('tNext');
    let current = 0;
    let autoTimer;

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 't-dot';
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function render() {
      cards.forEach((c, i) => c.classList.toggle('active', i === current));
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }
    function goTo(i) {
      current = (i + cards.length) % cards.length;
      render();
      restartAuto();
    }
    function restartAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 6000);
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    render();
    restartAuto();
  }

  /* ---------- Contact form (static — no backend wired up) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const formSubmit = document.getElementById('formSubmit');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        formNote.style.color = '#f87171';
        formNote.textContent = 'Please fill in your name, email, and message.';
        return;
      }
      const btnText = formSubmit.querySelector('.btn-text');
      const originalText = btnText.textContent;
      btnText.textContent = 'Sending…';
      formSubmit.style.opacity = '.75';

      // This is a static front-end only — wire this up to Formspree,
      // a serverless function, or your own backend to actually deliver mail.
      setTimeout(() => {
        btnText.textContent = originalText;
        formSubmit.style.opacity = '1';
        formNote.style.color = 'var(--green)';
        formNote.textContent = "Thanks! This demo form doesn't send yet — connect it to your backend or a service like Formspree.";
        form.reset();
      }, 900);
    });
  }

});
