/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obs: {
          bg: '#000000',
          panel: '#1c1c1e',
          elevated: '#2c2c2e',
          card: '#3a3a3c',
          border: '#38383a',
          text: '#f5f5f7',
          muted: '#8e8e93',
          subtle: '#636366',
          accent: '#0a84ff',
          purple: '#bf5af2',
          green: '#30d158',
          red: '#ff453a',
          orange: '#ff9f0a',
          yellow: '#ffd60a',
          teal: '#5ac8fa',
          pink: '#ff375f',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', 'ui-monospace', '"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}
