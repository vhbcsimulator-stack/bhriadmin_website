/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-primary-fixed-variant": "#00513b",
        "surface-container": "#eeeeee",
        "surface-variant": "#e2e2e2",
        "secondary-fixed": "#84f8ca",
        "inverse-surface": "#2f3131",
        "surface-container-low": "#f3f3f4",
        "tertiary-fixed-dim": "#bcc9c5",
        "primary-container": "#006b4f",
        "on-primary-fixed": "#002116",
        "secondary-fixed-dim": "#67dbaf",
        "on-secondary": "#ffffff",
        "surface-container-high": "#e8e8e8",
        "outline-variant": "#bec9c2",
        "on-tertiary-fixed-variant": "#3d4946",
        "on-secondary-fixed-variant": "#00513b",
        "deep-emerald": "#032803",
        "surface": "#f9f9f9",
        "error": "#ba1a1a",
        "surface-container-lowest": "#ffffff",
        "inverse-primary": "#82d7b4",
        "surface-bright": "#f9f9f9",
        "tertiary": "#3d4845",
        "brand-blue": "#046BD2",
        "on-primary-container": "#93e8c5",
        "inverse-on-surface": "#f0f1f1",
        "on-tertiary-fixed": "#121e1b",
        "on-tertiary": "#ffffff",
        "tertiary-fixed": "#d8e5e0",
        "on-primary": "#ffffff",
        "on-background": "#1a1c1c",
        "background": "#f9f9f9",
        "on-error": "#ffffff",
        "slate-text": "#1E293B",
        "secondary-container": "#84f8ca",
        "secondary": "#006c4f",
        "tertiary-container": "#54605c",
        "on-secondary-fixed": "#002116",
        "outline": "#6f7a73",
        "on-tertiary-container": "#cddad5",
        "surface-tint": "#026c50",
        "surface-container-highest": "#e2e2e2",
        "error-container": "#ffdad6",
        "surface-dim": "#dadada",
        "on-secondary-container": "#007354",
        "on-surface": "#1a1c1c",
        "primary-fixed": "#9ef4d0",
        "on-error-container": "#93000a",
        "on-surface-variant": "#3f4944",
        "primary-fixed-dim": "#82d7b4",
        "primary": "#00503b"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "stack-lg": "2rem",
        "gutter": "1.5rem",
        "stack-md": "1rem",
        "stack-sm": "0.5rem",
        "section-gap": "4rem",
        "margin-page": "2rem"
      },
      fontFamily: {
        "body-lg": ["Lato", "sans-serif"],
        "body-sm": ["Lato", "sans-serif"],
        "label-caps": ["Lato", "sans-serif"],
        "headline-md": ["EB Garamond", "serif"],
        "display-lg-mobile": ["EB Garamond", "serif"],
        "subhead-lg": ["Lato", "sans-serif"],
        "display-lg": ["EB Garamond", "serif"],
        "body-md": ["Lato", "sans-serif"],
        "subhead-sm": ["Lato", "sans-serif"]
      },
      fontSize: {
        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "body-sm": ["12px", { "lineHeight": "1.5", "fontWeight": "400" }],
        "label-caps": ["11px", { "lineHeight": "1.2", "letterSpacing": "0.1em", "fontWeight": "700" }],
        "headline-md": ["32px", { "lineHeight": "1.3", "fontWeight": "500" }],
        "display-lg-mobile": ["34px", { "lineHeight": "1.2", "fontWeight": "500" }],
        "subhead-lg": ["16px", { "lineHeight": "1.5", "letterSpacing": "0.05em", "fontWeight": "700" }],
        "display-lg": ["48px", { "lineHeight": "1.2", "fontWeight": "500" }],
        "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "subhead-sm": ["12px", { "lineHeight": "1.5", "letterSpacing": "0.05em", "fontWeight": "700" }]
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out forwards',
        scaleUp: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    }
  },
  plugins: [],
}
