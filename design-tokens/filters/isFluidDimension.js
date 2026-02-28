export const isFluidDimensionFilter = (token) =>
  token.$type === "dimension" &&
  token.$value !== null &&
  typeof token.$value === "object" &&
  "min" in token.$value &&
  "max" in token.$value;

export const isFluidDimension = {
  name: "isFluidDimension",
  filter: isFluidDimensionFilter,
};
