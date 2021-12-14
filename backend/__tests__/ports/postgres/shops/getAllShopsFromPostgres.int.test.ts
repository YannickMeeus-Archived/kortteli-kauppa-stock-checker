import { makeShopName } from "../../../../src/domain/shops";
import {
  CreateNewShopInPostgres,
  GetAllShopsFromPostgres,
} from "../../../../src/ports/postgres/shops";
import { getTestDatabase } from "../../../lifecycle/getTestDatabase";

describe("GetAllShopsFromPostgres", () => {
  const createSutAndFixtures = () => {
    const { database } = getTestDatabase();
    return {
      fixtures: {
        createShop: new CreateNewShopInPostgres(database),
      },
      getAllShops: new GetAllShopsFromPostgres(database),
    };
  };
  it("should return an empty array if there are no shops", async () => {
    const { getAllShops } = createSutAndFixtures();
    const allExistingShops = await getAllShops.execute();
    expect(allExistingShops).toEqual([]);
  });
  it("should return an array of shops", async () => {
    const {
      getAllShops,
      fixtures: { createShop },
    } = createSutAndFixtures();
    await createShop.execute({ name: makeShopName("First Shop") });
    await createShop.execute({ name: makeShopName("Second Shop") });
    const existingShops = await getAllShops.execute();
    expect(existingShops).toHaveLength(2);
  });
});
