export const getValue = (token, original) => {
  const value = original === "original" ? token.original.$value : token.$value;

  if (token === undefined) {
    throw new Error(`The token is undefined.`);
  }

  if (value === undefined || value === null) {
    throw new Error(`The token ${token.name} has no valid $value property.`);
  }

  return value;
};
