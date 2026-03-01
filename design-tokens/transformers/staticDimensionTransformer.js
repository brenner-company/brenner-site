export const staticDimensionTransformer = (dimensionTokenValue, platform) => {
  if (typeof dimensionTokenValue === "string") {
    return dimensionTokenValue;
  }
  if (dimensionTokenValue === undefined || dimensionTokenValue === null) {
    throw `Invalid dimension value: 'undefined'\n`;
  }

  const { value, unit } = dimensionTokenValue;
  const appendUnit = platform?.appendUnit === false ? false : true;
  const outputUnit = platform?.outputUnit || unit || "px";
  const supportedUnits = ["px", "rem"];

  if (isNaN(value)) {
    throw `Invalid Number: '${value}' is not a valid number\n`;
  }

  if (!supportedUnits.includes(unit)) {
    throw `Invalid Unit: '${unit}' is not a valid unit\n`;
  }

  if (unit !== outputUnit && unit === "px" && outputUnit === "rem") {
    const baseFont = platform?.basePxFontSize || 16;
    return `${value / baseFont}${appendUnit ? outputUnit : ""}`;
  }

  if (unit !== outputUnit && unit === "rem" && outputUnit === "px") {
    const baseFont = platform?.basePxFontSize || 16;
    return `${baseFont * value}${appendUnit ? outputUnit : ""}`;
  }

  return `${value}${appendUnit ? outputUnit : ""}`;
};
