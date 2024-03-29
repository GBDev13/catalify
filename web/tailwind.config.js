/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "var(--color-primary)",
        primaryLight: "var(--color-primary-light)",
        readable: "var(--color-readable)",
        scrollThumb: "var(--color-scroll-thumb, #6366f1)",
        scrollTrack: "var(--color-scroll-track, #e2e8f0)",
        whatsapp: "#25D366"
      },
      keyframes: {
        pingSlow: {
          "75%, 100%": { transform: "scale(1.2)", opacity: "0" },
        }
      },
      animation: {
        pingSlow: "pingSlow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp')
  ]
}
