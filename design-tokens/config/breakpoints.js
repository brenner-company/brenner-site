const breakpoints = {
  s: 576,
  m: 872,
  l: 1080,
  xl: 1420,
};

export const environmentVariables = Object.fromEntries(
  Object.entries(breakpoints).flatMap(([key, value]) => [
    [`--breakpoint-${key}`, `${value}px`],
    [`--breakpoint-below-${key}`, `${value - 1}px`],
  ]),
);
