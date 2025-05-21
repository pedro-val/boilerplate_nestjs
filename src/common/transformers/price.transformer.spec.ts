import { priceToCents, priceToReais } from './price.transformer';

describe('Price Transformer', () => {
  describe('priceToCents', () => {
    it('should convert reais to cents correctly', () => {
      expect(priceToCents(39.05)).toBe(3905);
      expect(priceToCents(100.99)).toBe(10099);
      expect(priceToCents(0)).toBe(0);
    });

    it('should handle decimal precision correctly', () => {
      expect(priceToCents(10.999)).toBe(1100); // rounds to 11.00 reais, which is 1100 cents
      expect(priceToCents(5.555)).toBe(556); // rounds to 5.56 reais, which is 556 cents
    });
  });

  describe('priceToReais', () => {
    it('should convert cents to reais correctly', () => {
      expect(priceToReais(3905)).toBe(39.05);
      expect(priceToReais(10099)).toBe(100.99);
      expect(priceToReais(0)).toBe(0);
    });

    it('should handle floating point precision correctly', () => {
      expect(priceToReais(333)).toBe(3.33);
      expect(priceToReais(1)).toBe(0.01);
    });
  });
});
