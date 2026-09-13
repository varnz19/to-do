/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#C86D51',
          light: '#E58A6F',
          dark: '#A6533A',
          muted: '#F6ECE8',
        },
        forest: {
          DEFAULT: '#2E4D40',
          light: '#436B5A',
          dark: '#1D332A',
        },
        notion: {
          bg: 'var(--bg-main)',
          sidebar: 'var(--bg-sidebar)',
          card: 'var(--bg-card)',
          hover: 'var(--bg-hover)',
          active: 'var(--bg-active)',
          border: 'var(--border-color)',
          text: 'var(--text-main)',
          muted: 'var(--text-muted)',
          accent: 'var(--accent-color)',
          // Cohesive Warm Status Palette
          wishlist: { bg: 'var(--st-wishlist-bg)', text: 'var(--st-wishlist-text)', border: 'var(--st-wishlist-border)' },
          applied: { bg: 'var(--st-applied-bg)', text: 'var(--st-applied-text)', border: 'var(--st-applied-border)' },
          oa: { bg: 'var(--st-oa-bg)', text: 'var(--st-oa-text)', border: 'var(--st-oa-border)' },
          interview: { bg: 'var(--st-interview-bg)', text: 'var(--st-interview-text)', border: 'var(--st-interview-border)' },
          offer: { bg: 'var(--st-offer-bg)', text: 'var(--st-offer-text)', border: 'var(--st-offer-border)' },
          rejected: { bg: 'var(--st-rejected-bg)', text: 'var(--st-rejected-text)', border: 'var(--st-rejected-border)' },
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(36, 33, 29, 0.05), 0 1px 2px rgba(36, 33, 29, 0.03)',
        'warm-card': '0 4px 14px -2px rgba(36, 33, 29, 0.06), 0 1px 3px rgba(36, 33, 29, 0.04)',
        'warm-hover': '0 8px 22px -4px rgba(36, 33, 29, 0.10), 0 2px 6px rgba(36, 33, 29, 0.04)',
        'warm-modal': '0 20px 40px -8px rgba(24, 22, 20, 0.25), 0 4px 12px rgba(24, 22, 20, 0.1)',
      },
      animation: {
        'strike': 'strike 0.22s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-down': 'slideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        strike: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(3px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
