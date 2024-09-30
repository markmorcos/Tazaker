export const defaultFees = (price: number) =>
  Math.round(100 * (price * 0.05 + 0.5)) / 100;
