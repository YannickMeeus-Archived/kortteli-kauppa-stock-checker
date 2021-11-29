import { CabinetItem } from "../../../../src/domain/inventory/models";

import { CreateNewShopInPostgres } from "../../../../src/ports/postgres/shops";
import { singleCabinetItem } from "../../../fixtures";
import { getTestDatabase } from "../../../lifecycle/getTestDatabase";
import {
  GetSnapshotFromPostgres,
  StoreSnapshotInPostgres,
} from "../../../../src/ports/postgres/inventory";

describe("GetSnapshotFromPostgres", () => {
  const createSutAndFixtures = () => {
    const { database } = getTestDatabase();
    return {
      fixtures: {
        createShop: new CreateNewShopInPostgres(database),
        storeSnapshot: new StoreSnapshotInPostgres(database),
      },
      getSnapshot: new GetSnapshotFromPostgres(database),
    };
  };
  it("should return undefined if no cabinet items were found", async () => {
    const { getSnapshot } = createSutAndFixtures();
    const possiblyCabinetItems = await getSnapshot.oldestForShop({
      id: "a8d49b4c-91c7-4128-8dc8-5a821736dde7",
    });

    expect(possiblyCabinetItems).toBeUndefined();
  });

  it("should return existing cabinet items for a shop if such exists", async () => {
    const {
      getSnapshot,
      fixtures: { createShop, storeSnapshot },
    } = createSutAndFixtures();

    const shop = await createShop.execute({ name: "test shop" });
    const expected = [singleCabinetItem];
    await storeSnapshot.forShop(shop, expected);
    const actualSnapshot = await getSnapshot.oldestForShop(shop);

    expect(actualSnapshot?.contents).toEqual(expected);
  });

  it("should return the oldest inventory snapshop if multiple exist for a given shop", async () => {
    const {
      getSnapshot,
      fixtures: { createShop, storeSnapshot },
    } = createSutAndFixtures();

    const shop = await createShop.execute({ name: "test shop" });
    const older: CabinetItem[] = [{ ...singleCabinetItem, location: "Older" }];
    const newer: CabinetItem[] = [{ ...singleCabinetItem, location: "Newer" }];
    await storeSnapshot.forShop(shop, older);
    await storeSnapshot.forShop(shop, newer);

    const actual = await getSnapshot.oldestForShop(shop);
    expect(actual?.contents).toEqual(older);
  });
});
