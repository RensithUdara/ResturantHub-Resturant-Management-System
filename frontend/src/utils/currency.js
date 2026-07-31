export const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return `Rs. ${amount.toFixed(2)}`;
};
