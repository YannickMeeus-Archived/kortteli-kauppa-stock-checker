import {
  CabinetItem,
  FetchMockedSnapshotFromMemory,
  StoreSnapshotInMemory,
  DownSyncInventory,
} from "../../../src/domain/inventory";
import { Shop, GetAllShopsFromMemory } from "../../../src/domain/shops";
import { singleCabinetItem } from "../../fixtures";

describe("DownSyncInventory", () => {
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

  const synchronizedInventories = new Map<string, CabinetItem[]>();
  const getAllShops = new GetAllShopsFromMemory(shops);
  const fetchInventory = new FetchMockedSnapshotFromMemory(
    externalShopInventories
  );
  const storeInventory = new StoreSnapshotInMemory(synchronizedInventories);
  it("should retrieve and store all shops' inventory", async () => {
    const downSyncInventory = new DownSyncInventory(
      getAllShops,
      fetchInventory,
      storeInventory
    );

    await downSyncInventory.run();

    expect(synchronizedInventories.size).toBe(2);
    expect(synchronizedInventories.get(firstShop.id)).toEqual([
      firstShopInventory,
    ]);
    expect(synchronizedInventories.get(secondShop.id)).toEqual([
      secondShopInventory,
    ]);
  });
});
