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
          DEFAULT: '#4F46E5', // Vibrant Electric Indigo
          light: '#6366F1',
          dark: '#4338CA',
          muted: '#EEF2FF',
        },
        forest: {
          DEFAULT: '#10B981', // Vibrant Emerald
          light: '#34D399',
          dark: '#059669',
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
          // Cohesive Vibrant Status Palette
          wishlist: { bg: 'var(--st-wishlist-bg)', text: 'var(--st-wishlist-text)', border: 'var(--st-wishlist-border)' },
          applied: { bg: 'var(--st-applied-bg)', text: 'var(--st-applied-text)', border: 'var(--st-applied-border)' },
          oa: { bg: 'var(--st-oa-bg)', text: 'var(--st-oa-text)', border: 'var(--st-oa-border)' },
          interview: { bg: 'var(--st-interview-bg)', text: 'var(--st-interview-text)', border: 'var(--st-interview-border)' },
          offer: { bg: 'var(--st-offer-bg)', text: 'var(--st-offer-text)', border: 'var(--st-offer-border)' },
          rejected: { bg: 'var(--st-rejected-bg)', text: 'var(--st-rejected-text)', border: 'var(--st-rejected-border)' },
        }
      },
      fontFamily: {
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'warm-card': '0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'warm-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'warm-modal': '0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.06)',
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
