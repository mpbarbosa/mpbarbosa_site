/**
 * v2.js — mpbarbosa.com v2 main script
 * No jQuery. Vanilla ES modules.
 */

// ── Background image rotation ─────────────────────────────────────────────
const BG_IMAGES = [
  'images/bg.jpg',
  'images/IMG_20241013_153839.jpg',
  'images/IMG_20241013_161000.jpg',
  'images/IMG_20241208_191404.jpg',
  'images/IMG_20250222_182439.jpg',
  'images/IMG_20250222_182628.jpg',
  'images/IMG_20250301_190856~2.jpg',
  'images/IMG_20250303_165100.jpg',
  'images/IMG_20250421_145915.jpg',
  'images/IMG_20250709_114400.jpg',
  'images/IMG_20250709_165455.jpg',
  'images/IMG_20250709_165515.jpg',
  'images/IMG_20250709_165645.jpg',
  'images/IMG_20250709_165903.jpg',
  'images/pic01.jpg',
  'images/pic02.jpg',
  'images/pic03.jpg',
];

function setRandomBackground() {
  const bg = document.getElementById('bg');
  if (!bg) {
    return;
  }

  const img = new Image();
  const candidates = [...BG_IMAGES];
  let tried = 0;

  function tryNext() {
    if (tried >= candidates.length) {
      return;
    }
    const src = candidates[Math.floor(Math.random() * candidates.length)];
    candidates.splice(candidates.indexOf(src), 1);
    tried++;
    img.onload = () => {
      bg.style.backgroundImage = `url("${src}")`;
    };
    img.onerror = tryNext;
    img.src = src;
  }

  tryNext();
}

// ── Staggered entrance animations ────────────────────────────────────────
function initEntranceAnimations() {
  const cards = document.querySelectorAll('.section-card');
  if (!cards.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) {
          return;
        }
        // Stagger each card by 80ms
        const delay = i * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 },
  );

  cards.forEach((card) => observer.observe(card));
}

// ── Active nav highlight ──────────────────────────────────────────────────
function initNavHighlight() {
  const sections = document.querySelectorAll('.section-card[id]');
  const navLinks = document.querySelectorAll('#top-bar nav a[href^="#"]');
  if (!sections.length || !navLinks.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    },
    { threshold: 0.4 },
  );

  sections.forEach((s) => observer.observe(s));
}

// ── Contact form (no backend — shows a thank-you message) ─────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) {
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.innerHTML =
      '<p style="text-align:center;font-weight:500;padding:2rem 0">Obrigado pela mensagem! Entrarei em contato em breve.</p>';
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setRandomBackground();
  initEntranceAnimations();
  initNavHighlight();
  initContactForm();
});
