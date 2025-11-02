# =============================================================================
# MATCH PULSE — Browser & Device Support Matrix (v1.1)
# Responsibility     : Define the supported targets for design, build, and QA.  
# Contracts         : All features and styles must gracefully degrade outside this list.  
# Owner             : Frontend Team  •  Last updated  2025-11-01
# =============================================================================

## 🎯 Primary Browsers (desktop & mobile)
| Platform | Browsers | Versions |
|-----------|-----------|-----------|
| macOS | Safari | 16 + |
| Windows | Edge / Chrome | last 2 versions |
| Android | Chrome | 11 + |
| iOS | Safari | 16.4 + |
| Linux (optional) | Firefox | latest 2 versions |

---

## ♿ Assistive Technology Targets
| Platform | Screen Reader | Notes |
|-----------|---------------|-------|
| macOS / iOS | VoiceOver | Default testing environment |
| Windows | NVDA | Focus order & keyboard navigation checks |

---

## ⚙️ Rules of Engagement
- **No regression** on primary targets before merge (visual or functional).  
- **Progressive enhancement required** — older browsers see graceful fallbacks.  
- **Motion safety:** wrap non-essential animations in  
  `@media (prefers-reduced-motion: reduce)` blocks.  
- **Tokens-first:** colors, spacing, radii, shadows, font sizes must use `var(--*)`.  
- **Fluid type:** use `clamp()` for responsive headings and key labels.  
- **Contrast:** text and interactive elements meet WCAG AA minimums.  
- **No vendor prefixes by hand — Autoprefixer applies per .browserslistrc.**

---

## 🧩 Verification Checklist (Dev & QA)
1. ✅ Runs without warnings on `npm run verify` (ESLint + Stylelint + Typecheck + Build).  
2. ✅ Visual review on Safari 16+ (macOS) and iOS 16.4+.  
3. ✅ Visual review on Chrome / Edge (latest 2).  
4. ✅ Responsive tests from 320 → 1440 px (width).  
5. ✅ A11y audit (pass contrast & keyboard nav).  
6. ✅ Performance budget ≤ defined threshold (when available).

---

## 🧠 Notes
- This matrix is the single source of truth for PostCSS and Autoprefixer.  
- QA scripts may read from this file to generate test plans.  
- Update this doc every major release or when market share shifts significantly.
