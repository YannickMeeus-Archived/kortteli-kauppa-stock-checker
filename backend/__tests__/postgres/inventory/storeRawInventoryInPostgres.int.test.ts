import { randomUUID } from "crypto";
import { CabinetItem } from "../../../src/inventory/models/cabinetItem";
import { GetRawInventoryFromPostgres } from "../../../src/postgres/inventory/getRawInventoryFromPostgres";
import { StoreRawInventoryInPostgres } from "../../../src/postgres/inventory/storeRawInventoryInPostgres";
import { CreateNewShopInPostgres } from "../../../src/postgres/shops";
import { singleCabinetItem } from "../../fixtures/singleCabinetItemReturned";
import { getTestDatabase } from "../../lifecycle/getTestDatabase";
import "jest-extended";
describe("StoreRawInventoryInPostgres", () => {
  const createSutAndFixtures = () => {
    const { database } = getTestDatabase();
    return {
      fixtures: {
        createShop: new CreateNewShopInPostgres(database),
        getRawInventory: new GetRawInventoryFromPostgres(database),
      },
      storeRawInventory: new StoreRawInventoryInPostgres(database),
    };
  };
  it("should exist", async () => {
    const { storeRawInventory } = createSutAndFixtures();
    expect(storeRawInventory).toBeDefined();
  });
  it("should store raw inventory in postgres", async () => {
    const {
      storeRawInventory,
      fixtures: { createShop, getRawInventory },
    } = createSutAndFixtures();

    const createdShop = await createShop.execute({ name: "test shop" });
    const firstItem: CabinetItem = {
      ...singleCabinetItem,
      location: randomUUID(),
    };
    const secondItem: CabinetItem = {
      ...singleCabinetItem,
      location: randomUUID(),
    };
    await storeRawInventory.forShop(createdShop, [firstItem, secondItem]);

    const storedRawInventory = await getRawInventory.oldestForShop(createdShop);
    expect(storedRawInventory).toIncludeAllMembers([firstItem, secondItem]);
  });
});
