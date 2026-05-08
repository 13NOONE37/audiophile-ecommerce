const ADJUSTMENT_COOKIE_NAME = 'adjustment_items';

export default ADJUSTMENT_COOKIE_NAME;

export function generateOrderNumber(): string {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${datePart}-${randomPart}`;
}
