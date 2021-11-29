/**
 * This is a very naive implementation of a product, and does not take into account any decent structure. A product will be duplicated if
 * it lives in multiple shops, or even multiple cabinet locations
 *
 * @class SimpleProduct
 */
class SimpleProduct {
  constructor(
    public readonly id: string,
    public readonly epc: string,
    public readonly name: string,
    public readonly quantity: number,
    public readonly cabinet: string,
    public readonly shopId: string
  ) {}
}

export { SimpleProduct };
