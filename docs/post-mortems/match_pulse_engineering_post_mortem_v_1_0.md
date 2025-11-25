# 📘 Match Pulse — Engineering Post-Mortem & Lessons (v1.0)

**Owner:** Frontend Team  
**Applies to:** SCSS/Sass, TypeScript/TSX, Tokens, Architecture, Linting, Workflow  
**Last Updated:** 2025-11-17

---

## 🎯 Purpose
Project-wide summary of mistakes, inconsistencies, and engineering friction points encountered during early Match Pulse development. This document ensures these issues are not repeated across future features and phases.

---

# 1) SCSS & Sass Module Lessons

## 1.1 Mixin Call Inconsistency
**Issue:** `@include mixin` vs `@include mixin()` used randomly.

**Rule:** Always use parentheses.
```scss
@include abstracts.focus-ring();
@include abstracts.motion-safe() { ... }
```

---

## 1.2 `map-get()` vs `map.get()`
**Issue:** Lint errors from global function usage.

**Rule:**
```scss
@use "sass:map";
map.get(abstracts.$breakpoints, md);
```

---

## 1.3 Old `motion-safe` Used `!important`
**Rule:** Use wrapper-only implementation.
```scss
@mixin motion-safe() {
  @media (prefers-reduced-motion: no-preference) {
    @content;
  }
}
```

---

## 1.4 Undefined Tokens in Components
**Rule:** Define tokens *before* using them in any component.

---

## 1.5 Raw px Values in Components
**Rule:** Never use raw px; always use tokens.
```scss
min-inline-size: var(--s-6);
```
Or define a semantic token.

---

# 2) Architecture & BEM Lessons

## 2.1 Empty BEM Blocks
**Rule:** Do not declare a selector until it has styles.

---

## 2.2 Incorrect SCSS Imports
**Rule:** Always use relative imports.
```scss
@use "../abstracts" as abstracts;
```

---

# 3) Tokens & Design-System Lessons

## 3.1 Using Semantic Colors Before Defining Them
**Rule:** All surfaces, hovers, actives must exist in the tokens file first.

---

## 3.2 Complex Shadows in Components
**Rule:** If a shadow isn’t a design token → create one.

---

# 4) Linting, Tooling & CI Lessons

## 4.1 Stylelint Property-Order Pain
**Rule:** Never fix by hand. Always run:
```
npm run lint:css:fix
npm run check
```

---

## 4.2 Anonymous Default Exports in Configs
**Rule:** Export named constants in config files.
```js
const config = { ... };
export default config;
```

---

## 4.3 Unsupported Browser Feature Warnings
**Rule:** Warnings are OK. Only errors block PRs.

---

# 5) UX & Layout Lessons

## 5.1 Mobile Treated as Shrunk Desktop
**Rule:** Mobile-first must be intentional.
- 44px tap targets
- Dedicated mobile layouts
- Not reduced desktop

---

## 5.2 Focus-Visible Inconsistency
**Rule:** Every interactive element uses:
```scss
@include abstracts.focus-ring();
```

---

# 6) Workflow & Process Lessons

## 6.1 `lint:css:fix` Producing Huge Diffs
**Rule:** Accept once after global theme changes. Afterward, run per-feature if desired.

---

## 6.2 Commit Discipline Before Git
**Rule:**
1. `npm run lint`  
2. `npm run typecheck`  
3. Fix issues  
4. Only then push/commit

---

# 7) TL;DR — Golden Rules
- Always use parentheses in mixins
- No raw px in SCSS
- Never use undefined tokens
- Use `map.get()` not `map-get()`
- Use relative SCSS imports
- No empty BEM blocks
- Avoid `!important`
- Always use `@include abstracts.focus-ring();`
- Run lint fixes regularly
- Mobile-first is intentional, not reduced desktop

---

**End of Document — Match Pulse Engineering Post-Mortem & Lessons (v1.0)**