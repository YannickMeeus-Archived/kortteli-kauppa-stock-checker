import {
  FetchMockedSnapshotFromMemory,
  StoreSnapshotInMemory,
  TakeSnapshotsForAllShops,
} from "../../../src/domain/inventory";
import { CabinetItem } from "../../../src/domain/inventory/models";
import { Snapshot } from "../../../src/domain/inventory/models/snapshots/snapshot";
import { Shop, GetAllShopsFromMemory } from "../../../src/domain/shops";
import { singleCabinetItem } from "../../fixtures";

describe("TakeInventorySnapshot", () => {
  const firstShop = new Shop(
    "c9b4da19-d70b-41d1-8272-cfea007eacc4",
    "First Shop"
  );
  const secondShop = new Shop(
    "d836b46b-66a6-4b43-b0b4-ac8eae2d876f",
    "Second Shop"
  );
  const shops = [firstShop, secondShop];
  const externalShopInventories = new Map<string, CabinetItem[]>();
  const firstShopInventory: CabinetItem = {
    ...singleCabinetItem,
    location: firstShop.name,
  };
  const secondShopInventory: CabinetItem = {
    ...singleCabinetItem,
    location: secondShop.name,
  };

  externalShopInventories.set(firstShop.id, [firstShopInventory]);
  externalShopInventories.set(secondShop.id, [secondShopInventory]);

  const storedSnapshots = new Map<string, Snapshot[]>();
  const getAllShops = new GetAllShopsFromMemory(shops);
  const fetchInventory = new FetchMockedSnapshotFromMemory(
    externalShopInventories
  );
  const storeInventory = new StoreSnapshotInMemory(storedSnapshots);
  it("should retrieve and store all shops' inventory", async () => {
    const downSyncInventory = new TakeSnapshotsForAllShops(
      getAllShops,
      fetchInventory,
      storeInventory
    );

    await downSyncInventory.run();

    expect(storedSnapshots.size).toBe(2);
    expect(
      storedSnapshots.get(firstShop.id)?.flatMap((s) => s.contents)
    ).toEqual([firstShopInventory]);
    expect(
      storedSnapshots.get(secondShop.id)?.flatMap((s) => s.contents)
    ).toEqual([secondShopInventory]);
  });
});
