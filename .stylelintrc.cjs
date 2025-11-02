// =============================================================================
// CONFIG: Stylelint (v1.1)
// Responsibility: Enforce tokens-first usage and predictable, readable CSS/SCSS
// Contracts:
//  - Design tokens must be consumed via CSS variables (var(--*))
//  - Modern CSS enabled per .browserslistrc (Safari 16+, iOS 16.4+)
//  - Component scopes stay shallow and readable
// Notes:
//  - Raw values allowed ONLY where tokens are DEFINED (see overrides)
//  - `clean-order` is kept; explicit groups below clarify property flow
// Owner: Frontend Team • Last updated: 2025-11-01
// =============================================================================

module.exports = {
  customSyntax: "postcss-scss",

  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-clean-order"
    // (Optional) add "stylelint-config-prettier" if you see formatter conflicts
  ],

  plugins: [
    "stylelint-order",
    "stylelint-declaration-strict-value",
    "stylelint-no-unsupported-browser-features"
  ],

  rules: {
    // ──────────────────────────────────────────────────────────────────────────
    // Naming & selectors
    // ──────────────────────────────────────────────────────────────────────────
    // ✅ BEM: block__element--modifier (kebab-case)
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:--(?:[a-z0-9]+(?:-[a-z0-9]+)*))?$",
      {
        resolveNestedSelectors: true,
        message: "Use BEM: block[-b]__element[-e]--modifier[-m]."
      }
    ],
    // Keep selectors readable (discourages deeply chained selectors)
    "selector-max-compound-selectors": 3,

    // ──────────────────────────────────────────────────────────────────────────
    // Formatting hygiene (autofix-friendly)
    // ──────────────────────────────────────────────────────────────────────────
    "comment-empty-line-before": ["always", { except: ["first-nested"] }],
    "rule-empty-line-before": ["always-multi-line", { except: ["first-nested"] }],
    "at-rule-empty-line-before": [
      "always",
      { except: ["first-nested", "blockless-after-same-name-blockless"] }
    ],
    "declaration-block-single-line-max-declarations": 1,

    // ──────────────────────────────────────────────────────────────────────────
    // Tokens-first discipline
    // ──────────────────────────────────────────────────────────────────────────
    // Require tokens via var(--*) on key, high-impact properties.
    "scale-unlimited/declaration-strict-value": [
      [
        "/^color$/",
        "background",
        "background-color",
        "border-color",
        "fill",
        "stroke",
        "box-shadow",
        "font-size",
        "z-index"
      ],
      {
        ignoreValues: ["inherit", "transparent", "0", "none", "auto", "currentColor"],
        disableFix: false,
        message: "Use design tokens via var(--*)"
      }
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // Modern CSS notations (consistent across codebase)
    // ──────────────────────────────────────────────────────────────────────────
    "color-function-notation": "modern",
    "alpha-value-notation": "modern",
    // We use modern media query range syntax once Browserslist is updated.
    "media-feature-range-notation": "range",

    // Keyword casing sanity
    "value-keyword-case": [
      "lower",
      { ignoreKeywords: ["currentColor"], ignoreProperties: ["font-family"] }
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // Cross-browser checks (warning-level to avoid noisy CI)
    // ──────────────────────────────────────────────────────────────────────────
    "plugin/no-unsupported-browser-features": [
      true,
      {
        severity: "warning",
        ignorePartialSupport: true,
        // These are acceptable in our matrix and/or polyfilled by the toolchain:
        ignore: [
          "css-nesting",
          "flexbox-gap",
          "css-focus-visible",
          "css-logical-props",
          "css-overscroll-behavior",
          "css-overflow"
        ]
      }
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // Maintainability guardrails
    // ──────────────────────────────────────────────────────────────────────────
    "max-nesting-depth": 3,
    "declaration-no-important": true,

    // ──────────────────────────────────────────────────────────────────────────
    // Property ordering (explicit groups → cleaner diffs)
    // ──────────────────────────────────────────────────────────────────────────
    "order/properties-order": [
      [
        // Positioning
        { properties: ["position", "inset", "top", "right", "bottom", "left", "z-index"] },

        // Box model & layout
        { properties: ["display", "contain", "overflow", "box-sizing"] },
        { properties: ["width", "min-width", "max-width"] },
        { properties: ["height", "min-height", "max-height"] },
        {
          properties: [
            "margin",
            "margin-inline",
            "margin-block",
            "padding",
            "padding-inline",
            "padding-block"
          ]
        },
        { properties: ["border", "border-width", "border-style", "border-color", "border-radius"] },
        { properties: ["outline", "outline-offset"] },
        { properties: ["gap", "row-gap", "column-gap"] },
        { properties: ["flex", "flex-grow", "flex-shrink", "flex-basis", "align-self", "order"] },

        // Typography
        {
          properties: [
            "font",
            "font-family",
            "font-size",
            "font-weight",
            "line-height",
            "letter-spacing",
            "text-align",
            "text-wrap",
            "white-space",
            "text-overflow"
          ]
        },

        // Visual & motion
        { properties: ["color", "background", "background-color", "box-shadow", "opacity"] },
        { properties: ["transform", "transition", "will-change"] }
      ],
      { unspecified: "bottomAlphabetical" }
    ]
  },

  // ────────────────────────────────────────────────────────────────────────────
  // Overrides
  // ────────────────────────────────────────────────────────────────────────────
  // ✅ Allow raw values where tokens are DEFINED
  overrides: [
    {
      files: ["**/styles/tokens/**/*.css"],
      rules: { "scale-unlimited/declaration-strict-value": null }
    }
  ]
};
