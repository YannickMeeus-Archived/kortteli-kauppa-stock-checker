import { CabinetItem } from "../../../src/inventory/models/cabinetItem";
import {
  StoreRawInventoryInPostgres,
  GetRawInventoryFromPostgres,
} from "../../../src/postgres/inventory";
import { CreateNewShopInPostgres } from "../../../src/postgres/shops";
import { singleCabinetItem } from "../../fixtures/singleCabinetItemReturned";
import { getTestDatabase } from "../../lifecycle/getTestDatabase";

describe("GetRawInventoryFromPostgres", () => {
  const createSutAndFixtures = () => {
    const { database } = getTestDatabase();
    return {
      fixtures: {
        createShop: new CreateNewShopInPostgres(database),
        storeRawInventory: new StoreRawInventoryInPostgres(database),
      },
      getRawInventory: new GetRawInventoryFromPostgres(database),
    };
  };
  it("should return an empty array if no cabinet items were found", async () => {
    const { getRawInventory } = createSutAndFixtures();
    const possiblyCabinetItems = await getRawInventory.oldestForShop({
      id: "a8d49b4c-91c7-4128-8dc8-5a821736dde7",
    });

    expect(possiblyCabinetItems).toEqual([]);
  });

  it("should return existing cabinet items for a shop if such exists", async () => {
    const {
      getRawInventory,
      fixtures: { createShop, storeRawInventory },
    } = createSutAndFixtures();

    const shop = await createShop.execute({ name: "test shop" });
    const expected = [singleCabinetItem];
    await storeRawInventory.forShop(shop, expected);
    const actual = await getRawInventory.oldestForShop(shop);

    expect(expected).toEqual(actual);
  });

  it("should return the oldest inventory snapshop if multiple exist for a given shop", async () => {
    const {
      getRawInventory,
      fixtures: { createShop, storeRawInventory },
    } = createSutAndFixtures();

    const shop = await createShop.execute({ name: "test shop" });
    const older: CabinetItem[] = [{ ...singleCabinetItem, location: "Older" }];
    const newer: CabinetItem[] = [{ ...singleCabinetItem, location: "Newer" }];
    await storeRawInventory.forShop(shop, older);
    await storeRawInventory.forShop(shop, newer);

    const actual = await getRawInventory.oldestForShop(shop);
    expect(actual).toEqual(older);
  });
});
