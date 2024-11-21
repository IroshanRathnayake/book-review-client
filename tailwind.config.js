/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'coral': {
          500: '#FF6B6B',
          600: '#FF5252',
        }
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

