// =============================================================================
// CONFIG: PostCSS (v1.1)
// Responsibility: Apply modern CSS transforms per .browserslistrc and run Tailwind v4
// Contracts:
//  - Browserslist is the single source of truth for target environments
//  - Nesting is handled by @tailwindcss/postcss (disable in preset-env)
//  - Autoprefixer is explicit for clarity and future-proofing
// Owner: Frontend Team • Last updated: 2025-11-01
// =============================================================================

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Modern CSS transforms gated by Browserslist targets (stage 3 features).
    // NOTE: Nesting is disabled here because Tailwind's plugin already handles it.
    'postcss-preset-env': {
      stage: 3,
      features: { 'nesting-rules': false },
    },

    // Tailwind v4 official PostCSS plugin (includes Tailwind processing).
    '@tailwindcss/postcss': {},

    // Explicit autoprefixer for clarity (even if Tailwind currently bundles it).
    // If Tailwind’s behavior changes in future, our prefixes remain stable.
    autoprefixer: {},
  },
};

export default config;
