import { makeNewShopId, makeShopName } from "../../../../src/domain/shops";
import {
  CreateNewShopInPostgres,
  GetSingleShopFromPostgres,
  DeleteShopInPostgres,
} from "../../../../src/ports/postgres/shops";
import { getTestDatabase } from "../../../lifecycle/getTestDatabase";

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
    await deleteShop.execute(makeNewShopId());
  });
  it("should delete a shop if there is one to delete", async () => {
    const {
      deleteShop,
      fixtures: { createShop, getSingleShop },
    } = createSutAndFixtures();

    const { id: createdId } = await createShop.execute({
      name: makeShopName("Created Shop"),
    });

    const shouldBeAShop = await getSingleShop.byId(createdId);
    expect(shouldBeAShop).toBeDefined();
    await deleteShop.execute(createdId);

    const shouldNotBeAShop = await getSingleShop.byId(createdId);
    expect(shouldNotBeAShop).toBeUndefined();
  });
});
