export function formatPrice(amount: number, { showZeroAsNumber = false } = {}) {
  const isInteger = Number.isInteger(amount);
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: 2,
  });

  if (amount === 0 && !showZeroAsNumber) return 'Free';
  return formatter.format(amount);
}
