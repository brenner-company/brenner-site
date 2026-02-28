import { StyleDictionary } from "style-dictionary-utils";
import { isFluidDimensionFilter } from "./filters/isFluidDimension.js";
import { isStaticDimensionFilter } from "./filters/isStaticDimension.js";

const VIEWPORT_MIN = 330;
const VIEWPORT_MAX = 1200;

console.log(StyleDictionary.hooks.transformGroups["css"]);

/**
 * Converts px to rem
 */
const pxToRem = (px, base = 16) => px / base;

/**
 * Generates a CSS clamp() value from min/max pixel values.
 * Formula: clamp(minRem, preferred, maxRem)
 * The preferred value is a linear interpolation between the two sizes
 * across the viewport range.
 */
const buildClamp = (minPx, maxPx) => {
  const minRem = pxToRem(minPx);
  const maxRem = pxToRem(maxPx);

  // slope = (maxSize - minSize) / (maxViewport - minViewport)
  const slope = (maxPx - minPx) / (VIEWPORT_MAX - VIEWPORT_MIN);
  // intercept in rem: minSize - slope * minViewport
  const intercept = pxToRem(minPx - slope * VIEWPORT_MIN);

  const slopeVw = (slope * 100).toFixed(4);
  const interceptRem = intercept.toFixed(4);

  const preferred =
    intercept === 0 ? `${slopeVw}vw` : `${interceptRem}rem + ${slopeVw}vw`;

  return `clamp(${minRem.toFixed(4)}rem, ${preferred}, ${maxRem.toFixed(4)}rem)`;
};

// StyleDictionary.registerFilter({
//   name: "isFluidDimension",
//   filter: (token) =>
//     token.$type === "dimension" &&
//     token.$value !== null &&
//     typeof token.$value === "object" &&
//     "min" in token.$value &&
//     "max" in token.$value,
// });

// StyleDictionary.registerFilter({
//   name: "isStaticDimension",
//   filter: (token) =>
//     token.$type === "dimension" && typeof token.$value === "number",
// });

StyleDictionary.registerTransform({
  name: "dimension/fluid",
  type: "value",
  transitive: true,
  filter: isFluidDimensionFilter,
  transform: (token) => {
    console.log(token.$value);
    const { min, max } = token.$value;
    return buildClamp(min, max);
  },
});

StyleDictionary.registerTransform({
  name: "dimension/static",
  type: "value",
  transitive: true,
  filter: isStaticDimensionFilter,
  transform: (token) => {
    console.log(token.$value);
    return `${pxToRem(token.$value).toFixed(4)}rem`;
  },
});

// ─── Config ────────────────────────────────────────────────────────────────

const sd = new StyleDictionary();

const esd = await sd.extend({
  log: {
    verbosity: "verbose", // 'default' | 'silent' | 'verbose'
  },
  source: ["./design-tokens/tokens/**/*.json"],
  platforms: {
    css: {
      transforms: ["dimension/fluid", "dimension/css"],
      basePxFontSize: 16, // optional: base font size for rem conversion
      outputUnit: "rem", // optional: 'px' or 'rem'
      buildPath: "./css/variables/",
      files: [
        {
          destination: "_generated-variables.css",
          format: "css/variables",
        },
      ],
    },
  },
  // tokens: {
  //   dimensions: {
  //     $type: 'dimension',
  //     '3xs': {
  //       $value: { min: 5, max: 6 },
  //     },
  //     sm: {
  //       $value: 16, // static example
  //     },
  //   },
  // },
  // platforms: {
  //   css: {
  //     prefix: 'ds',
  //     transformGroup: 'css', // base transforms (name, etc.)
  //     transforms: [
  //       // Override the default dimension transform with our custom ones
  //       'dimension/fluidClamp',
  //       'dimension/pxToRem',
  //       // Keep the standard name transform from the css group
  //       'name/camel',
  //     ],
  //     files: [
  //       // ── Fluid tokens → clamp() ──────────────────────────────────────
  //       {
  //         destination: 'tokens/fluid-dimensions.css',
  //         format: 'css/variables',
  //         filter: 'isFluidDimension',
  //       },
  //       // ── Static tokens → rem ─────────────────────────────────────────
  //       {
  //         destination: 'tokens/static-dimensions.css',
  //         format: 'css/variables',
  //         filter: 'isStaticDimension',
  //       },
  //     ],
  //   },
  // },
});

esd.buildAllPlatforms();
