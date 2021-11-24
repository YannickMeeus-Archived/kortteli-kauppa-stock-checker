export class ShopAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`A shop with name ${name} already exists.`);
  }
}
