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
          bg: "#f0eee7",
          surface: "#faf9f6",
          border: "#ddd8d1",
          divider: "#e8e4de",
        },

        text: {
          primary: "#1f2933",
          secondary: "#4b5563",
          muted: "#6b7280",
          disabled: "#9ca3af",
        },

        primary: {
          DEFAULT: "#54ac64",
          hover: "#489a57",
          active: "#3f874d",
          soft: "#e3f3e7",
        },

        chat: {
          incoming: "#ffffff",
          outgoing: "#54ac64",
          system: "#f5f3ee",
        },

        status: {
          secure: "#2f855a",
          info: "#2563eb",
          warning: "#d97706",
          error: "#dc2626",
        },
      },
    },
  },
}
