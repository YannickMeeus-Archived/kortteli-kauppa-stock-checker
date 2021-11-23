export class ShopNotFoundError extends Error {
  constructor(id: string) {
    super(`A shop with id ${id} could not be found`);
  }
}
