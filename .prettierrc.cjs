// =============================================================================
// CONFIG: Prettier
// Responsibility: Deterministic formatting for all text-like files
// Contracts: No stylistic bikeshedding—Prettier is the single source of truth
// Owner: Frontend Team • Last updated: 2025-11-01
// =============================================================================

/** @type {import("prettier").Config} */
module.exports = {
  singleQuote: true,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  endOfLine: "lf",

  // Keep HTML/JSX tidy; Next.js defaults are fine (semi true by default).
  // htmlWhitespaceSensitivity: "css",

  overrides: [
    // Wrap prose for clearer diffs in reviews
    { files: "*.md", options: { proseWrap: "always" } },

    // YAML/JSON—prefer conventional quoting
    { files: "*.yml", options: { singleQuote: false } },
    { files: "*.yaml", options: { singleQuote: false } },

    // SCSS—align with our Stylelint singleQuote
    { files: "*.scss", options: { singleQuote: true } }
  ],

  // Optional: Tailwind class sorting (only if you want Prettier to do it)
  // plugins: ["prettier-plugin-tailwindcss"]
};
