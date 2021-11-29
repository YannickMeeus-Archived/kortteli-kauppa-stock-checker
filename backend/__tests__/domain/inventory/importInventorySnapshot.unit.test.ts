import {
  GetSnapshotFromMemory,
  StoreSnapshotInMemory,
} from "../../../src/domain/inventory";
import { CreateSimpleProductInMemory } from "../../../src/domain/inventory/createSimpleProduct";
import { ImportInventorySnapshots } from "../../../src/domain/inventory/importInventorySnapshots";
import { SimpleProduct } from "../../../src/domain/inventory/models/simpleProduct";
import { Snapshot } from "../../../src/domain/inventory/models/snapshots/snapshot";
import {
  CreateNewShopInMemory,
  GetAllShopsFromMemory,
  Shop,
} from "../../../src/domain/shops";
import {
  makeSingleCabinetItem,
  singleCabinetItemAsArray,
} from "../../fixtures";
import { makeProductToCreateFor } from "../../fixtures/simpleProduct";

describe("ImportInventorySnapshot", () => {
  const allInventories = new Map<string, SimpleProduct[]>();
  const snapshots = new Map<string, Snapshot>();
  const shops: Shop[] = [];
  const createShop = new CreateNewShopInMemory(shops);
  const getAllShops = new GetAllShopsFromMemory(shops);
  const createProduct = new CreateSimpleProductInMemory(allInventories);
  const fetchSnapshotExternally = new GetSnapshotFromMemory(snapshots);
  const storeSnapshot = new StoreSnapshotInMemory(snapshots);

  const importInventorySnapshots = new ImportInventorySnapshots(
    getAllShops,
    fetchSnapshotExternally,
    createProduct
  );
  let shopA: Shop;
  let shopB: Shop;
  beforeEach(async () => {
    allInventories.clear();
    snapshots.clear();
    shopA = await createShop.execute({ name: "shopA" });
    shopB = await createShop.execute({ name: "shopB" });
  });

  it("should create a new product if one does not exist", async () => {
    await storeSnapshot.forShop(shopA, singleCabinetItemAsArray);
    await importInventorySnapshots.run();
    expect(allInventories.get(shopA.id)).toHaveLength(1);
  });
  it("should update an existing product if one exists", async () => {
    const existingProduct = await createProduct.execute(
      makeProductToCreateFor(shopA)
    );
    const snapshotItem = makeSingleCabinetItem({ epc: existingProduct.epc });
    await storeSnapshot.forShop(shopA, [snapshotItem]);
    await importInventorySnapshots.run();
    expect(allInventories.get(shopA.id)).toHaveLength(1);
  });
  it.todo(
    "should mark a snapshot as processed so that subsequent runs don't process it again"
  );
});
