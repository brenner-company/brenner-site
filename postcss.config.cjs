const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-nested"),
    require("postcss-env-function")({
      importFrom: "design-tokens/config/breakpoints.js",
    }),
    ...(process.env.NODE_ENV === "production"
      ? [
          purgecss({
            content: ["./**/*.html", "./**/*.js"],
            defaultExtractor: (content) =>
              content.match(/[\w-/:]+(?<!:)/g) || [],
          }),
        ]
      : []),
  ],
};
