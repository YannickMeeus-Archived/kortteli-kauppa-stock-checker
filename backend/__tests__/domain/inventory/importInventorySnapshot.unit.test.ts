import { randomUUID } from "crypto";
import {
  GetSnapshotFromMemory,
  StoreSnapshotInMemory,
  ImportInventorySnapshots,
  SimpleProduct,
  Snapshot,
  SnapshotId,
  GetSimpleProductsFromMemory,
  RemoveAllSimpleProductsInMemory,
} from "../../../src/domain/inventory";
import { ArchiveSnapshotInMemory } from "../../../src/domain/inventory/archiveSnapshot";
import { CreateSimpleProductInMemory } from "../../../src/domain/inventory/createSimpleProduct";
import {
  Shop,
  CreateNewShopInMemory,
  GetAllShopsFromMemory,
} from "../../../src/domain/shops";
import {
  singleCabinetItemAsArray,
  makeSingleCabinetItem,
} from "../../fixtures";
import { makeProductToCreateFor } from "../../fixtures/simpleProduct";

describe("ImportInventorySnapshot", () => {
  const allInventories = new Map<string, SimpleProduct[]>();
  const snapshots = new Map<SnapshotId, Snapshot>();
  let shops: Shop[] = [];
  const createShop = new CreateNewShopInMemory(shops);
  const getAllShops = new GetAllShopsFromMemory(shops);
  const createProduct = new CreateSimpleProductInMemory(allInventories);
  const getAllProduct = new GetSimpleProductsFromMemory(allInventories);
  const removeAllProducts = new RemoveAllSimpleProductsInMemory(allInventories);
  const getSnapshot = new GetSnapshotFromMemory(snapshots);
  const storeSnapshot = new StoreSnapshotInMemory(snapshots);
  const markSnapshotAsProcessed = new ArchiveSnapshotInMemory(snapshots);
  const importInventorySnapshots = new ImportInventorySnapshots(
    getAllShops,
    getSnapshot,
    createProduct,
    markSnapshotAsProcessed,
    removeAllProducts
  );
  let myShop: Shop;
  beforeEach(async () => {
    allInventories.clear();
    snapshots.clear();
    shops = [];
    myShop = await createShop.execute({ name: "shopA" });
    await createShop.execute({ name: "shopB" });
  });

  it("should create a new product if one does not exist", async () => {
    await storeSnapshot.forShop(myShop.id, singleCabinetItemAsArray);
    await importInventorySnapshots.run();
    expect(allInventories.get(myShop.id)).toHaveLength(1);
  });
  it("should mark a snapshot as processed so that subsequent runs don't process it again", async () => {
    const existingSnapshot = await storeSnapshot.forShop(
      myShop.id,
      singleCabinetItemAsArray
    );
    await importInventorySnapshots.run();

    const relevantSnapshot = snapshots.get(existingSnapshot.id);
    expect(relevantSnapshot?.archived).toBeTruthy();
  });
  it("should replace the existing stock for a given shop instead of just adding toit", async () => {
    const existingProduct = await createProduct.execute(
      makeProductToCreateFor(myShop.id)
    );
    const epcForNewProduct = randomUUID();
    const snapshotItem = makeSingleCabinetItem({ epc: epcForNewProduct });
    await storeSnapshot.forShop(myShop.id, [snapshotItem]);
    await importInventorySnapshots.run();

    const currentShopInventory = await getAllProduct.forShop(myShop.id);
    expect(currentShopInventory).toHaveLength(1);
    expect(currentShopInventory).not.toContainEqual(existingProduct);
  });
});
