<!-- =============================================================================
PR TEMPLATE (v1.1)
Responsibility: Ensure every change passes the Styles Quality Gate and team standards.
Contracts:
 - Author MUST complete all checkboxes below (no partial submits).
 - Reviewers enforce the same checks; block if any item fails.
Owner: Frontend Team • Last updated: 2025-11-01
============================================================================= -->

## Summary
<!-- What changed and why? Keep it short and outcome-focused. -->

## Scope
- Affected routes/components:
- Non-visual changes (if any): config/build/tooling

## Screenshots / Recordings (required for UI)
<!-- Add before/after images or a short clip. If motion was added, include a reduced-motion capture. -->

## Risk & Rollback
- Risk level: Low / Medium / High
- Rollback plan: Revert PR / Feature flag off / Hotfix follow-up

---

## Author Checks (must pass before requesting review)

### 1) Local Quality Gate
- [ ] Ran `npm run lint && npm run typecheck && npm run lint:css`
- [ ] Ran `npm run build` (or `npm run verify`) without errors
- [ ] No new `!important` or deep selector chains introduced

### 2) Cross-Browser / Device (per Support Matrix)
- [ ] Verified on Safari macOS **16+**
- [ ] Verified on iOS Safari **16.4+**
- [ ] Verified on a Chromium browser (Chrome/Edge latest)

### 3) Design System & Tokens
- [ ] **Tokens-first**: colors, spacing, radii, shadows, font sizes use `var(--*)`
- [ ] No magic numbers or hard-coded colors/sizes (unless inside token definitions)
- [ ] Fluid type where applicable (e.g., headings/labels) uses `clamp()`

### 4) Accessibility
- [ ] Interactive text and controls meet **WCAG AA** contrast
- [ ] Motion respects `prefers-reduced-motion` (non-essential animations disabled/reduced)
- [ ] Focus order visible and logical; no focus traps

### 5) CSS/SCSS Quality
- [ ] Class names follow **BEM**: `block__element--modifier` (kebab-case)
- [ ] Selector depth is reasonable (`selector-max-compound-selectors: 3`)
- [ ] Nesting ≤ 3 levels; no over-specificity or ID selectors
- [ ] Uses **modern media ranges** (e.g., `(width >= 768px)`) and logical props where sensible
- [ ] No layout shift on load (images sized, font fallbacks defined)

### 6) Performance & Hygiene
- [ ] No regressions in bundle size (review diff if large CSS added)
- [ ] Removed dead CSS/code and unused imports
- [ ] Story/fixture updated (if the component has one)

---

## Reviewer Checklist (for maintainers)
- [ ] Matches Support Matrix; no unsupported features without fallbacks
- [ ] Tokens-first enforced; no hard-coded design values
- [ ] A11y checks pass (contrast, focus, reduced-motion)
- [ ] CSS structure readable: property order consistent, selectors simple, BEM correct
- [ ] Screenshots/recordings demonstrate intended behavior across breakpoints
- [ ] Tests/stories updated (if applicable)
- [ ] Clear rollback noted

---

## Notes for Release (optional)
<!-- Changelog entry, flags, migrations, or steps QA should follow. -->
