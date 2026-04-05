module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-env-function")({
      importFrom: "design-tokens/config/breakpoints.js",
    }),
  ],
};
