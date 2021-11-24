import { Shop } from "./models/shop";

export interface GetAllShops {
  execute: () => Promise<Shop[]>;
}

export class GetAllShopsFromMemory implements GetAllShops {
  constructor(private readonly shops: Shop[]) {}

  async execute(): Promise<Shop[]> {
    return this.shops;
  }
}
