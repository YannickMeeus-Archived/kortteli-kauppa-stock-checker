import {
  CreateNewShopInPostgres,
  GetSingleShopFromPostgres,
} from "../../../src/postgres/shops";
import { getTestDatabase } from "../../lifecycle/getTestDatabase";

describe("GetSingleShopFromPostgres", () => {
  const createSutAndFixtures = () => {
    const { database } = getTestDatabase();
    return {
      fixtures: {
        createShop: new CreateNewShopInPostgres(database),
      },
      getSingleShop: new GetSingleShopFromPostgres(database),
    };
  };
  it("should return an existing shop", async () => {
    const {
      getSingleShop,
      fixtures: { createShop },
    } = createSutAndFixtures();
    const expectedName = "Test Shop - GetSingleShopFromPostgres";
    const { id: createdId } = await createShop.execute({
      name: expectedName,
    });

    const actualShop = await getSingleShop.byId(createdId);
    expect(actualShop).toBeDefined();
    expect(actualShop?.id).toBe(createdId);
    expect(actualShop?.name).toBe(expectedName);
  });
  it("should return nothing if the shop does not exist", async () => {
    const { getSingleShop } = createSutAndFixtures();
    const idDoesNotExist = "d3f0c375-5769-43ef-a9d1-2f778f8ba4fd";
    const actualShop = await getSingleShop.byId(idDoesNotExist);
    expect(actualShop).toBeUndefined();
  });
});
