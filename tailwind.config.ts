import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', 
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            color: "var(--foreground)",
            a: {
              color: "var(--primary)",
              "&:hover": {
                color: "var(--primary)",
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
