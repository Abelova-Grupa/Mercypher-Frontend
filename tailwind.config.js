// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#f0eee7",       // background
          border: "#ddd8d1",   // borders, dividers
        },

        primary: {
          DEFAULT: "#54ac64",  // main buttons / actions
          hover: "#489a57",    // slightly darker
          active: "#3f874d",
        },
      },
    },
  },
}
