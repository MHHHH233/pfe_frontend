// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': '#5FD18E',
        'bright-green': '#07F468',
        'dark-gray': '#252525',
        'medium-gray': '#333333',
        'light-gray': '#B3B3B3',
      },
    },
  },
  plugins: [],
}
