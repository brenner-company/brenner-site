import StyleDictionary from "style-dictionary";
import { isFluidDimensionFilter } from "./filters/isFluidDimension.js";
import { isStaticDimensionFilter } from "./filters/isStaticDimension.js";
import { staticDimensionTransformer } from "./transformers/staticDimensionTransformer.js";
import { getValue } from "./utilities/getValue.js";
import { buildClamp } from "./utilities/buildClamp.js";
import { utilityConfig } from "./config/utilities.js";

StyleDictionary.registerTransformGroup({
  name: "css/brenner",
  transforms: StyleDictionary.hooks.transformGroups["css"].filter(
    (transform) => transform !== "size/rem",
  ),
});

StyleDictionary.registerTransform({
  name: "dimension/fluid",
  type: "value",
  transitive: true,
  filter: isFluidDimensionFilter,
  transform: (token, platform) => {
    const tokenValue = getValue(token);
    return buildClamp(tokenValue, platform);
  },
});

StyleDictionary.registerTransform({
  name: "dimension/static",
  type: "value",
  transitive: true,
  filter: isStaticDimensionFilter,
  transform: (token, platform) => {
    try {
      const tokenValue = getValue(token);
      return staticDimensionTransformer(tokenValue, platform);
    } catch (error) {
      throw new Error(
        `Error transforming dimension token '${token.name}': ${error}`,
      );
    }
  },
});

StyleDictionary.registerFormat({
  name: "css/dimensions-utilities",
  format: ({ dictionary }) => {
    const lines = ["/**\n * DIMENSIONS\n * Do not edit directly, this file was auto-generated.\n */\n"];

    for (const token of dictionary.allTokens) {
      const size = token.path.slice(1).join("-");
      lines.push(`/* ${size} */`);
      for (const { prefix, property } of utilityConfig.dimensions) {
        lines.push(`.u-${prefix}-${size} { ${property}: var(--${token.path.join("-")}) !important; }`);
      }
      lines.push("");
    }

    return lines.join("\n");
  },
});

StyleDictionary.registerFormat({
  name: "css/spacing-utilities",
  format: ({ dictionary }) => {
    const lines = ["/**\n * SPACINGS\n * Do not edit directly, this file was auto-generated.\n */\n"];

    for (const token of dictionary.allTokens) {
      const size = token.path.slice(1).join("-");
      lines.push(`/* ${size} */`);
      for (const { prefix, property } of utilityConfig.spacing) {
        lines.push(`.u-${prefix}-${size} { ${property}: var(--${token.path.join("-")}) !important; }`);
      }
      lines.push("");
    }

    return lines.join("\n");
  },
});

StyleDictionary.registerFormat({
  name: "css/font-family-utilities",
  format: ({ dictionary }) => {
    const lines = ["/**\n * FONT FAMILIES\n * Do not edit directly, this file was auto-generated.\n */\n"];

    for (const token of dictionary.allTokens) {
      const family = token.path.slice(2).join("-");
      lines.push(`/* ${family} */`);
      for (const { prefix, property } of utilityConfig.fontFamilies) {
        lines.push(`.u-${prefix}-${family} { ${property}: var(--${token.path.join("-")}) !important; }`);
      }
      lines.push("");
    }

    return lines.join("\n");
  },
});

StyleDictionary.registerFormat({
  name: "css/font-weight-utilities",
  format: ({ dictionary }) => {
    const lines = ["/**\n * FONT WEIGHTS\n * Do not edit directly, this file was auto-generated.\n */\n"];

    for (const token of dictionary.allTokens) {
      const weight = token.path.slice(2).join("-");
      lines.push(`/* ${weight} */`);
      for (const { prefix, property } of utilityConfig.fontWeights) {
        lines.push(`.u-${prefix}-${weight} { ${property}: var(--${token.path.join("-")}) !important; }`);
      }
      lines.push("");
    }

    return lines.join("\n");
  },
});

const sd = new StyleDictionary({
  log: {
    verbosity: "verbose", // "default" | "silent" | "verbose"
  },
  source: ["./design-tokens/tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "css/brenner",
      transforms: ["dimension/fluid", "dimension/static"],
      basePxFontSize: 16,
      outputUnit: "rem",
      viewport: {
        min: 330,
        max: 1200,
      },
      buildPath: "./css/variables/",
      files: [
        {
          destination: "_generated-variables.css",
          format: "css/variables",
        },
      ],
    },
    "css/utilities": {
      buildPath: "./css/utilities/",
      files: [
        {
          destination: "_generated-spacings.css",
          format: "css/spacing-utilities",
          filter: (token) => token.path[0] === "dimensions",
        },
        {
          destination: "_generated-dimensions.css",
          format: "css/dimensions-utilities",
          filter: (token) => token.path[0] === "dimensions",
        },
        {
          destination: "_generated-font-families.css",
          format: "css/font-family-utilities",
          filter: (token) => token.path[0] === "text" && token.path[1] === "fonts",
        },
        {
          destination: "_generated-font-weights.css",
          format: "css/font-weight-utilities",
          filter: (token) => token.path[0] === "text" && token.path[1] === "weights",
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
