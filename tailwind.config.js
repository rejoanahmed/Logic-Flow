/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/**/*.js',
    './public/**/*.html',
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    fontFamily: {
      manrope: 'Manrope, sans-serif',
      'jetbrains-mono': "'JetBrains Mono', monospace"
    },
    extend: {
      colors: {
        linkedin: '#1269BF',
        discord: '#5B64EA'
      }
    }
  },
  plugins: [require('tailwind-scrollbar'), require('flowbite/plugin')]
}
