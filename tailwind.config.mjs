/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        bungee: ['Bungee', 'cursive'],
        proxima: ['Proxima Nova', 'sans-serif'],
      },
      keyframes: {
        'circle-rotate': {
          '0%': { transform: 'rotate(0deg) translateX(20px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(20px) rotate(-360deg)' },
        },
        'tick-fill': {
          '0%': { strokeDasharray: '0 24', fill: 'none' },
          '100%': { strokeDasharray: '24 0', fill: 'green' },
        },
      },
      animation: {
        'circle-rotate': 'circle-rotate 1.5s linear infinite',
        'tick-fill': 'tick-fill 0.5s ease-in-out forwards',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
