/**
 * Transforms price from reais (decimal) to cents (integer)
 * @param price - Price in reais (e.g., 39.05)
 * @returns Price in cents (e.g., 3905)
 */
export function priceToCents(price: number): number {
  return Math.round(price * 100);
}

/**
 * Transforms price from cents (integer) to reais (decimal)
 * @param cents - Price in cents (e.g., 3905)
 * @returns Price in reais (e.g., 39.05)
 */
export function priceToReais(cents: number): number {
  return parseFloat((cents / 100).toFixed(2));
}
