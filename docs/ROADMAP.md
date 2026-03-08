# MP Barbosa Site — Roadmap

**Generated**: March 2026  
**Baseline**: 252/287 tests passing (87.8%) | v3.0.0 git-based staging architecture

---

## 📊 Baseline

| Area | Status |
|------|--------|
| Tests | 252/287 passing (87.8%) — 35 failures, 8 broken suites |
| SEO | Missing meta description, Open Graph, Twitter Cards |
| Social links | All placeholder `href="#"` in Contact section |
| Contact form | No backend (`action="#"` — form doesn't send) |
| Template boilerplate | Attribution text still visible in header hero |

---

## Phase 1 — Quick Wins (1–2 weeks)

| Item | What to do |
|------|------------|
| Remove template credits | Delete "A fully responsive site template…" paragraph from the header |
| Real social links | Replace `href="#"` with real LinkedIn, GitHub URLs in Contact; remove Twitter/Facebook if unused |
| Add LinkedIn icon | Replace `fa-twitter` or `fa-facebook` with `fa-linkedin` |
| SEO meta tags | Add `<meta name="description">`, Open Graph (`og:title`, `og:description`, `og:image`), and canonical URL |
| Favicon | Add a `favicon.ico` or SVG favicon for `mpbarbosa.com` |
| Fix AI_WORKFLOW.JS | Either link to a repo/demo or convert to plain text — current tooltip-only UX is confusing |
| Fix failing tests | 35 failing tests + Puppeteer accessibility suite failure should be resolved |

---

## Phase 2 — Content & Credibility (1 month)

| Item | What to do |
|------|------------|
| Working contact form | Integrate Formspree or similar (free tier, no backend needed) |
| Curriculum / CV section | Add a new `#curriculo` article with key career milestones and a downloadable PDF |
| Professional photo | Replace `pic03.jpg` in About with a real headshot |
| Strudel music project | Add it to the Projects list once it has something to show |
| Busca Vagas visibility | Consider whether it deserves a project card (it powers Monitora Vagas) |
| English/PT toggle | Consider linking to an English version of the intro/about content |

---

## Phase 3 — Developer Credibility (2–3 months)

| Item | What to do |
|------|------------|
| Project cards with screenshots | Replace the plain `<ul>` in Projects with visual cards (image, title, description, link) |
| ESLint | Implement and fix the 309 files with console statements (critical code quality gap) |
| Blog / Notes section | Add a `#notas` article or link to a dev.to/Hashnode blog for technical writing |
| Test suite to 100% green | Resolve accessibility test (Puppeteer/Chrome launch failure) and fix brittle assertions |
| GitHub Actions badge | Add CI status badge to README |

---

## Phase 4 — Polish & Growth (3–6 months)

| Item | What to do |
|------|------------|
| Analytics | Add privacy-respecting analytics (Plausible or Fathom — free self-hosted) |
| Performance audit | Run Lighthouse, target 95+ score on Performance/Accessibility/SEO |
| Dark/light mode | The HTML5 UP template supports it with minor CSS additions |
| Structured data | Add `schema.org/Person` JSON-LD for better Google presence |
| Music in Numbers public link | Current URL `music_in_numbers/src/music_in_numbers.html` leaks internal path — clean it up |

---

## 🔴 Ongoing Debt

| Item | Notes |
|------|-------|
| `console.log` in production | 309 files / 94% of non-test JS — add ESLint rule to enforce |
| Node.js v25 coverage broken | Track external fix or pin to Node.js LTS |
| Messy commit messages | Several commits with "Please copy the AI-generated commit message…" — enforce conventional commits |
| `public.deprecated/` at root | Confirm it can be safely deleted |
