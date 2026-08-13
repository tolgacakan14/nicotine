import type { Config } from "tailwindcss";

/**
 * NICOTINE design tokens.
 *
 * The site runs LIGHT: a warm off-white ground with near-black type and
 * polished silver as the only "colour". Tokens are named for their ROLE, not
 * their value — `ground` is whatever the page sits on, `mark` is whatever is
 * printed on it. That way a future inversion is a value change here rather than
 * a rename across every component.
 *
 * The palette stays deliberately tiny. Anything outside this list should be a
 * conscious exception.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      /* Colours resolve through CSS variables so a theme can be swapped at
         runtime — see `.theme-dark` in globals.css, which /club opts into.
         Channels are stored space-separated so Tailwind's `<alpha-value>`
         syntax (bg-ground/80) still works. */
      colors: {
        /* Surfaces */
        ground: "rgb(var(--c-ground) / <alpha-value>)",
        shade: "rgb(var(--c-shade) / <alpha-value>)",
        bone: "rgb(var(--c-bone) / <alpha-value>)",

        /* Lines + muted type */
        line: "rgb(var(--c-line) / <alpha-value>)",
        ash: "rgb(var(--c-ash) / <alpha-value>)",
        haze: "rgb(var(--c-haze) / <alpha-value>)",

        /* Ink */
        mark: "rgb(var(--c-mark) / <alpha-value>)",
        tar: "rgb(var(--c-tar) / <alpha-value>)",

        /* Silver + the club's blush */
        chrome: "rgb(var(--c-chrome) / <alpha-value>)",
        "chrome-hi": "rgb(var(--c-chrome-hi) / <alpha-value>)",
        "chrome-lo": "rgb(var(--c-chrome-lo) / <alpha-value>)",
        blush: "rgb(var(--c-blush) / <alpha-value>)",
        "blush-deep": "rgb(var(--c-blush-deep) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Helvetica Neue", "Arial", "sans-serif"],
        body: ["var(--font-body)", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        brand: "0.42em",
        wide2: "0.18em",
        tight2: "-0.045em",
      },
      fontSize: {
        mega: ["clamp(3.5rem, 15vw, 16rem)", { lineHeight: "0.82", letterSpacing: "-0.045em" }],
        huge: ["clamp(2.5rem, 8vw, 7rem)", { lineHeight: "0.88", letterSpacing: "-0.035em" }],
        big: ["clamp(1.75rem, 4.5vw, 3.75rem)", { lineHeight: "0.95", letterSpacing: "-0.025em" }],
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "42%": { opacity: "1" },
          "43%": { opacity: "0.35" },
          "45%": { opacity: "1" },
          "70%": { opacity: "1" },
          "71%": { opacity: "0.6" },
          "73%": { opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        flicker: "flicker 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
