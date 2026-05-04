export const formatCurrency = (value, currency = 'USD') => {
  if (isNaN(value) || value === null || value === undefined) return value;
  
  return new Intl.NumberFormat(currency === 'IDR' ? 'id-ID' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'IDR' ? 0 : 2,
    maximumFractionDigits: currency === 'IDR' ? 0 : 2,
  }).format(value);
};

export const roundPercentage = (value, decimals = 2) => {
  if (isNaN(value) || value === null || value === undefined) return value;
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

export const formatPercentage = (value, decimals = 2) => {
  if (isNaN(value) || value === null || value === undefined) return value;
  return `${roundPercentage(value, decimals)}%`;
};
