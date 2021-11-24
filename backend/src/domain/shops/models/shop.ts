export class Shop {
  constructor(public readonly id: string, public readonly name: string) {}
}

export type ShopId = Pick<Shop, "id">;
