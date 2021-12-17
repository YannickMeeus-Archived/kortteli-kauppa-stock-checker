import {
  GetSnapshotFromMemory,
  StoreSnapshotInMemory,
  ImportInventorySnapshots,
  SimpleProduct,
  Snapshot,
  SnapshotId,
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
  const getSnapshot = new GetSnapshotFromMemory(snapshots);
  const storeSnapshot = new StoreSnapshotInMemory(snapshots);
  const markSnapshotAsProcessed = new ArchiveSnapshotInMemory(snapshots);
  const importInventorySnapshots = new ImportInventorySnapshots(
    getAllShops,
    getSnapshot,
    createProduct,
    markSnapshotAsProcessed
  );
  let shopA: Shop;
  let shopB: Shop;
  beforeEach(async () => {
    allInventories.clear();
    snapshots.clear();
    shops = [];
    shopA = await createShop.execute({ name: "shopA" });
    shopB = await createShop.execute({ name: "shopB" });
  });

  it("should create a new product if one does not exist", async () => {
    await storeSnapshot.forShop(shopA.id, singleCabinetItemAsArray);
    await importInventorySnapshots.run();
    expect(allInventories.get(shopA.id)).toHaveLength(1);
  });
  it("should update an existing product if one exists", async () => {
    const existingProduct = await createProduct.execute(
      makeProductToCreateFor(shopA.id)
    );
    const snapshotItem = makeSingleCabinetItem({ epc: existingProduct.epc });
    await storeSnapshot.forShop(shopA.id, [snapshotItem]);
    await importInventorySnapshots.run();

    expect(allInventories.get(shopA.id)).toHaveLength(1);
  });
  it("should mark a snapshot as processed so that subsequent runs don't process it again", async () => {
    const existingSnapshot = await storeSnapshot.forShop(
      shopA.id,
      singleCabinetItemAsArray
    );
    await importInventorySnapshots.run();

    const relevantSnapshot = snapshots.get(existingSnapshot.id);
    expect(relevantSnapshot?.archived).toBeTruthy();
  });
  it.todo(
    "should mark a snapshot as processed so that subsequent runs don't process it again 2"
  );
});
