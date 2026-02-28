export const isStaticDimensionFilter = (token) =>
  token.$type === "dimension" &&
  token.$value !== null &&
  typeof token.$value === "number";

export const isStaticDimension = {
  name: "isStaticDimension",
  filter: isStaticDimensionFilter,
};
