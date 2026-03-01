export const isStaticDimensionFilter = (token) =>
  token.$type === "dimension" &&
  token.$value !== null &&
  !(
    typeof token.$value === "object" &&
    "min" in token.$value &&
    "max" in token.$value
  );

export const isStaticDimension = {
  name: "isStaticDimension",
  filter: isStaticDimensionFilter,
};
