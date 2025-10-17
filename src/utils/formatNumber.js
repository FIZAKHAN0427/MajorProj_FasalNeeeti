export const formatNumber = (num) => {
  if (num == null || isNaN(num)) return 'N/A';
  return parseFloat(num).toFixed(2);
};

export const formatInteger = (num) => {
  if (num == null || isNaN(num)) return 'N/A';
  return Math.round(num).toLocaleString();
};