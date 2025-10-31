// =============================================================================
// CONFIG: Stylelint
// Responsibility: Enforce tokens-first usage in SCSS/CSS while allowing raw
// values inside token source files (where tokens are defined).
// Owner: Frontend Team • Last updated: 2025-10-27
// =============================================================================

module.exports = {
  customSyntax: "postcss-scss",

  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-clean-order"
  ],

  plugins: [
    "stylelint-order",
    "stylelint-declaration-strict-value",
    "stylelint-no-unsupported-browser-features"
  ],

  rules: {
    // ✅ BEM: block__element--modifier (kebab-case)
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:--(?:[a-z0-9]+(?:-[a-z0-9]+)*))?$",
      { resolveNestedSelectors: true, message: "Use BEM: block[-b]__element[-e]--modifier[-m]." }
    ],

    // Autofixable formatting noise
    "comment-empty-line-before": ["always", { except: ["first-nested"] }],
    "rule-empty-line-before": ["always-multi-line", { except: ["first-nested"] }],
    "at-rule-empty-line-before": ["always", { except: ["first-nested","blockless-after-same-name-blockless"] }],
    "declaration-block-single-line-max-declarations": 1,

    // 🎯 Tokens-first on key props
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
        ignoreValues: ["inherit","transparent","0","none","auto","currentColor"],
        disableFix: false,
        message: "Use design tokens via var(--*)"
      }
    ],

    // Keyword casing sanity
    "value-keyword-case": ["lower", { ignoreKeywords: ["currentColor"], ignoreProperties: ["font-family"] }],

    // Match our style: width <= 600px, etc.
    "media-feature-range-notation": "prefix",

    // 🌐 Respect Browserslist but keep it as warnings
    "plugin/no-unsupported-browser-features": [true, {
      severity: "warning",
      ignorePartialSupport: true,
      ignore: [
        "css-nesting",
        "flexbox-gap",
        "css-focus-visible",
        "css-logical-props",
        "css-overscroll-behavior",
        "css-overflow"
      ]
    }],

    // Maintainability
    "max-nesting-depth": 3,
    "declaration-no-important": true
  },

  // ✅ Allow raw values where tokens are DEFINED
  overrides: [
    {
      files: ["**/styles/tokens/**/*.css"],
      rules: { "scale-unlimited/declaration-strict-value": null }
    }
  ]
};
