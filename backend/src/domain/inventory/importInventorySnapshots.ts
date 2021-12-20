import { GetSnapshot, Snapshot } from ".";
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
      let currentSnapshot: Snapshot | undefined = undefined;
      currentSnapshot = await this.getSnapshot.oldestUnArchivedForShop(shopId);

      if (!currentSnapshot) {
        continue;
      }
      do {
        const productsToCreate = currentSnapshot.contents.map(
          fromCabinetItemToSimpleProduct(shopId)
        );
        for (const product of productsToCreate) {
          await this.createProduct.execute(product, true);
        }
        await this.archiveSnapshot.execute(currentSnapshot.id);
        currentSnapshot = await this.getSnapshot.oldestUnArchivedForShop(
          shopId
        );
      } while (currentSnapshot != undefined);
    }
  }
}
export { ImportInventorySnapshots };
