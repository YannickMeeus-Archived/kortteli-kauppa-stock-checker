class DuplicateProductInShopError extends Error {
  constructor(ean: string, shopId: string) {
    super(`Product with EAN ${ean} already exists in shop ${shopId}`);
  }
}
export { DuplicateProductInShopError };
