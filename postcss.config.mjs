// =============================================================================
// CONFIG: PostCSS (ESM)
// Responsibility: Enable modern CSS features per browserslist while using
// Tailwind v4's official PostCSS plugin. We let Tailwind handle nesting,
// and use preset-env for everything else (stage 3) to avoid double-processing.
// Owner: Frontend Team • Last updated: 2025-10-27
// =============================================================================

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Modern CSS transforms per browserslist (stage 3 features).
    // We disable nesting here because @tailwindcss/postcss already handles it.
    'postcss-preset-env': {
      stage: 3,
      features: { 'nesting-rules': false },
    },

    // Tailwind v4 official PostCSS plugin (bundles Tailwind processing
    // and, in practice, autoprefixing for our target browsers).
    '@tailwindcss/postcss': {},
  },
};

export default config;
