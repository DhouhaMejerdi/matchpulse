// =============================================================================
// CONFIG: PostCSS (ESM)
// Responsibility: Tailwind v4 + modern CSS (stage-3) + Autoprefixer
// Contracts: Targets come from .browserslistrc
// Owner: Frontend Team • Last updated: 2025-11-02
// =============================================================================

const postcssConfig = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true, // optional; fine to leave on
      },
    },
    autoprefixer: { grid: true },
  },
};

export default postcssConfig;