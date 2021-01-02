module.exports = {
  purge: {
    enabled: process.env["npm_lifecycle_event"] === "build",
    mode: "layers",
    layers: ["base", "components", "utilities"],
    content: [
      "src/**/*.tsx",
      "src/**/*.ts",
      "src/**/*.html",
      "src/**/*.css",
      "index.html",
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
