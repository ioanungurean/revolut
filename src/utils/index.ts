export const hasLessThanTwoDecimals = (value: string): boolean => {
  if (value.indexOf(".") >= 0) {
    return (
      value.substr(value.indexOf(".")) === value.substr(value.indexOf("."), 3)
    );
  }

  return true;
};

export const checkIfValidNumber = (value: string): boolean => {
  const number = Number(value);

  return (
    !isNaN(number) &&
    number >= 0 &&
    number < 1_000_000_000 &&
    number == Number(number.toFixed(2)) &&
    hasLessThanTwoDecimals(value)
  );
};
