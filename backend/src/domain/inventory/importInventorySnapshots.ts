import { GetSnapshot } from ".";
import { GetAllShops } from "../shops";
import { ArchiveSnapshot } from "./archiveSnapshot";
import { CreateSimpleProduct } from "./createSimpleProduct";
import { fromCabinetItemToSimpleProduct } from "./fromCabinetItemToSimpleProduct";

class ImportInventorySnapshots {
  constructor(
    private readonly getAllShops: GetAllShops,
    private readonly getSnapshot: GetSnapshot,
    private readonly createProduct: CreateSimpleProduct,
    private readonly archiveSnapshot: ArchiveSnapshot
  ) {}
  async run(): Promise<void> {
    const allShops = await this.getAllShops.execute();
    for (const { id: shopId } of allShops) {
      const snapshot = await this.getSnapshot.oldestForShop(shopId);
      if (!snapshot) {
        continue;
      }
      const productsToCreate = snapshot.contents.map(
        fromCabinetItemToSimpleProduct(shopId)
      );
      for (const product of productsToCreate) {
        await this.createProduct.execute(product);
      }
      await this.archiveSnapshot.execute(snapshot.id);
    }
  }
}
export { ImportInventorySnapshots };
