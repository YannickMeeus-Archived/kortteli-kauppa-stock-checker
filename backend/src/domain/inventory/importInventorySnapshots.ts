import { GetSnapshot } from ".";
import { GetAllShops } from "../shops";
import { CreateSimpleProduct } from "./createSimpleProduct";
import { fromCabinetItemToSimpleProduct } from "./fromCabinetItemToSimpleProduct";

class ImportInventorySnapshots {
  constructor(
    private readonly getAllShops: GetAllShops,
    private readonly getSnapshot: GetSnapshot,
    private readonly createProduct: CreateSimpleProduct
  ) {}
  async run(): Promise<void> {
    const allShops = await this.getAllShops.execute();
    for (const shop of allShops) {
      console.log(`Importing inventory snapshots for shop ${shop.name}`);
      const snapshot = await this.getSnapshot.oldestForShop(shop);
      if (!snapshot) {
        continue;
      }
      const productsToCreate = snapshot.contents.map(
        fromCabinetItemToSimpleProduct(shop)
      );
      console.log(`Creating ${productsToCreate.length} products`);
      for (const product of productsToCreate) {
        await this.createProduct.execute(product);
      }
    }
  }
}
export { ImportInventorySnapshots };
