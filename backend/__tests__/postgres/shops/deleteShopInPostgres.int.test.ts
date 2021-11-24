import {
  CreateNewShopInPostgres,
  GetSingleShopFromPostgres,
  DeleteShopInPostgres,
} from "../../../src/postgres/shops";
import { getTestDatabase } from "../../lifecycle/getTestDatabase";

describe("DeleteShopInPostgres", () => {
  const createSutAndFixtures = () => {
    const { database } = getTestDatabase();
    return {
      fixtures: {
        createShop: new CreateNewShopInPostgres(database),
        getSingleShop: new GetSingleShopFromPostgres(database),
      },
      deleteShop: new DeleteShopInPostgres(database),
    };
  };
  it("should just return if the shop does not exist", async () => {
    expect.assertions(0);
    const { deleteShop } = createSutAndFixtures();
    await deleteShop.execute({ id: "d98054d9-5d11-4bcd-a678-8beac0432547" });
  });
  it("should delete a shop if there is one to delete", async () => {
    const {
      deleteShop,
      fixtures: { createShop, getSingleShop },
    } = createSutAndFixtures();

    const { id: createdId } = await createShop.execute({
      name: "Created Shop",
    });

    const shouldBeAShop = await getSingleShop.byId(createdId);
    expect(shouldBeAShop).toBeDefined();
    await deleteShop.execute({ id: createdId });

    const shouldNotBeAShop = await getSingleShop.byId(createdId);
    expect(shouldNotBeAShop).toBeUndefined();
  });
});
