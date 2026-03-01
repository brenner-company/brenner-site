import { pxToRem } from "./pxToRem.js";

export const buildClamp = ({ min, max }, platform) => {
  const minRem = pxToRem(min);
  const maxRem = pxToRem(max);

  const minViewport = platform?.viewport.min || 360;
  const maxViewport = platform?.viewport.max || 1240;

  const slope = (max - min) / (maxViewport - minViewport);
  const intercept = pxToRem(
    min - slope * minViewport,
    platform?.basePxFontSize,
  );

  const slopeVw = (slope * 100).toFixed(4);
  const interceptRem = intercept.toFixed(4);

  const preferred =
    intercept === 0 ? `${slopeVw}vw` : `${interceptRem}rem + ${slopeVw}vw`;

  return `clamp(${minRem.toFixed(4)}rem, ${preferred}, ${maxRem.toFixed(4)}rem)`;
};
