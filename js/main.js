// =============================================
// Cold Ones Event Solutions — main.js
// =============================================

// ----- Hero animated background paths -----
(function initHeroPaths() {
  const container = document.getElementById('heroPaths');
  if (!container) return;

  [1, -1].forEach(function(position) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 696 316');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

    for (let i = 0; i < 36; i++) {
      const p = 380 - i * 5 * position;
      const q = 189 + i * 6;
      const r = 312 - i * 5 * position;
      const s = 216 - i * 6;
      const t = 152 - i * 5 * position;
      const u = 343 - i * 6;
      const v = 616 - i * 5 * position;
      const w = 470 - i * 6;
      const x = 684 - i * 5 * position;
      const y = 875 - i * 6;
      const d = `M-${p} -${q}C-${p} -${q} -${r} ${s} ${t} ${u}C${v} ${w} ${x} ${y} ${x} ${y}`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('pathLength', '1');
      path.setAttribute('stroke', `rgba(196,154,18,${Math.min(0.04 + i * 0.009, 0.32)})`);
      path.setAttribute('stroke-width', String(0.5 + i * 0.03));
      path.setAttribute('fill', 'none');

      const dur = 18 + (i % 7) * 3;
      const delay = -(i * 0.65 + (position < 0 ? 9 : 0));
      path.style.strokeDasharray = '0.3 0.7';
      path.style.animation = `heroPathFlow ${dur}s linear ${delay}s infinite`;

      svg.appendChild(path);
    }
    container.appendChild(svg);
  });
})();

// ----- Navbar scroll effect -----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ----- Mobile menu -----
const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');

function openMenu() {
  hamburger.classList.add('active');
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});
mobileOverlay.addEventListener('click', closeMenu);
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ----- Scroll reveal -----
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ----- Stat counters -----
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      animateCounter(el, target);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statsObserver.observe(el));

// ----- FAQ accordion -----
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    faqItems.forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      item.querySelector('.faq-q').setAttribute('aria-expanded', 'true');
    }
  });
});

// ----- Form submission -----
const form = document.getElementById('quoteForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
    btn.disabled = true;
    btn.style.opacity = '0.75';
    setTimeout(() => {
      btn.innerHTML = 'Send Request <i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
      btn.style.opacity = '';
      form.reset();
    }, 3500);
  });
}

// ----- Smooth scroll -----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ----- Nav sliding cursor -----
(function initNavCursor() {
  const cursor = document.getElementById('navCursor');
  const ul     = document.getElementById('navLinks');
  if (!cursor || !ul) return;

  const items = ul.querySelectorAll('li:not(.nav-cursor)');

  items.forEach(li => {
    li.addEventListener('mouseenter', () => {
      cursor.style.left    = li.offsetLeft + 'px';
      cursor.style.width   = li.offsetWidth + 'px';
      cursor.style.opacity = '1';
    });
  });

  ul.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
})();
