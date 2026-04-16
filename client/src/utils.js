export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

export const percentageOff = (product) =>
  Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
