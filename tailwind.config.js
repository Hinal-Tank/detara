/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F6F1E8',
        'bg-warm': '#5B4636',
        'bg-white': '#FFFFFF',
        foreground: '#211B18',
        muted: '#5B4636',
        'text-light': '#766554',
        accent: '#C6A15B',
        'accent-dark': '#9D7840',
        'accent-light': '#E7D3A6',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.35em',
        ultra: '0.5em',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'reveal': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
    },
  },
  plugins: [
    // Custom utilities for mobile optimization
    function({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        '.overflow-wrap-anywhere': {
          'overflow-wrap': 'anywhere',
          'word-break': 'break-word',
        },
        '.tap-transparent': {
          '-webkit-tap-highlight-color': 'transparent',
          'touch-action': 'manipulation',
        },
        '.scrollbar-none': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.scrollbar-none::-webkit-scrollbar': {
          'display': 'none',
        },
        '.safe-bottom': {
          'padding-bottom': 'env(safe-area-inset-bottom, 0px)',
        },
        '.safe-top': {
          'padding-top': 'env(safe-area-inset-top, 0px)',
        },
      });
    },
  ],
};