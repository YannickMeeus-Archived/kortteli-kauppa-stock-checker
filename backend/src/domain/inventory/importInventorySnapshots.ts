import { GetSnapshot, RemoveAllSimpleProducts, Snapshot } from ".";
import { GetAllShops } from "../shops";
import { ArchiveSnapshot } from "./archiveSnapshot";
import { CreateSimpleProduct } from "./createSimpleProduct";
import { fromCabinetItemToSimpleProduct } from "./fromCabinetItemToSimpleProduct";
import { PromisePool } from "@supercharge/promise-pool";
class ImportInventorySnapshots {
  constructor(
    private readonly getAllShops: GetAllShops,
    private readonly getSnapshot: GetSnapshot,
    private readonly createProduct: CreateSimpleProduct,
    private readonly archiveSnapshot: ArchiveSnapshot,
    private readonly removeSimpleProducts: RemoveAllSimpleProducts
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
        await this.removeSimpleProducts.forAGivenShop(shopId);
        console.log(
          `Importing snapshot ${currentSnapshot.id} for shop ${shopId}`
        );
        const productsToCreate = currentSnapshot.contents.map(
          fromCabinetItemToSimpleProduct(shopId)
        );
        console.log(`Creating products: ${productsToCreate.length}`);

        await PromisePool.for(productsToCreate)
          .withConcurrency(40)
          .process(async (product) =>
            this.createProduct.execute(product, true)
          );

        await this.archiveSnapshot.execute(currentSnapshot.id);
        currentSnapshot = await this.getSnapshot.oldestUnArchivedForShop(
          shopId
        );
      } while (currentSnapshot != undefined);
    }
  }
}
export { ImportInventorySnapshots };
