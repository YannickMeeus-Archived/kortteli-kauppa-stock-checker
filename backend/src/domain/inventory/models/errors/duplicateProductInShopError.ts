class DuplicateProductInShopError extends Error {
  constructor(epc: string, shopId: string) {
    super(`Product with EPC ${epc} already exists in shop ${shopId}`);
  }
}
export { DuplicateProductInShopError };
