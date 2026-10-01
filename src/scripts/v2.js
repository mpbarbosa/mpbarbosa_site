/**
 * v2.js — mpbarbosa.com v2 main script
 * No jQuery. Vanilla ES modules.
 */

// ── Background image rotation ─────────────────────────────────────────────
// Root-absolute so the list also resolves from /en/ and /en/singularity/,
// which load this module as ../scripts/v2.js.
// Pre-processed for the way #bg actually renders them: grayscale, 6% opacity,
// 40% brightness. Downscaled grayscale WebP is indistinguishable at that
// treatment and ~6x lighter than the original phone JPEGs.
const BG_IMAGES = [
  '/images/bg/bg.webp',
  '/images/bg/IMG_20241013_153839.webp',
  '/images/bg/IMG_20241013_161000.webp',
  '/images/bg/IMG_20241208_191404.webp',
  '/images/bg/IMG_20250222_182439.webp',
  '/images/bg/IMG_20250222_182628.webp',
  '/images/bg/IMG_20250301_190856~2.webp',
  '/images/bg/IMG_20250303_165100.webp',
  '/images/bg/IMG_20250421_145915.webp',
  '/images/bg/IMG_20250709_114400.webp',
  '/images/bg/IMG_20250709_165455.webp',
  '/images/bg/IMG_20250709_165515.webp',
  '/images/bg/IMG_20250709_165645.webp',
  '/images/bg/IMG_20250709_165903.webp',
  '/images/bg/pic01.webp',
  '/images/bg/pic02.webp',
  '/images/bg/pic03.webp',
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

// ── Boot ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setRandomBackground();
  initEntranceAnimations();
  initNavHighlight();
});
