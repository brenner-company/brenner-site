import StyleDictionary from "style-dictionary";
import { isFluidDimensionFilter } from "./filters/isFluidDimension.js";
import { isStaticDimensionFilter } from "./filters/isStaticDimension.js";
import { staticDimensionTransformer } from "./transformers/staticDimensionTransformer.js";
import { getValue } from "./utilities/getValue.js";
import { buildClamp } from "./utilities/buildClamp.js";

StyleDictionary.registerTransformGroup({
  name: "css/brenner",
  transforms: StyleDictionary.hooks.transformGroups["css"].filter(
    (t) => t !== "size/rem",
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
  },
});

await sd.buildAllPlatforms();
