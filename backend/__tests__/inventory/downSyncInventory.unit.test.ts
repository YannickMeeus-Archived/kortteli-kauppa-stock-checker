import { DownSyncInventory } from "../../src/inventory/downSyncInventory";
import { CabinetItem } from "../../src/inventory/models/cabinetItem";
import { PullRawInventoryFromMemory } from "../../src/inventory/pullRawInventory";
import { StoreRawInventoryInMemory } from "../../src/inventory/storeRawInventory";
import { GetAllShopsFromMemory, Shop } from "../../src/shops";
import { singleCabinetItem } from "../fixtures/singleCabinetItemReturned";

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
  const fetchInventory = new PullRawInventoryFromMemory(
    externalShopInventories
  );
  const storeInventory = new StoreRawInventoryInMemory(synchronizedInventories);
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
