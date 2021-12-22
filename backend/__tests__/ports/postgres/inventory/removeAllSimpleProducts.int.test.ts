import {
  CreateSimpleProductInPostgres,
  GetSimpleProductFromPostgres,
} from "../../../../src/ports/postgres/inventory";
import { RemoveAllSimpleProductsFromPostgres } from "../../../../src/ports/postgres/inventory/removeAllSimpleProductsFromPostgres";
import { CreateNewShopInPostgres } from "../../../../src/ports/postgres/shops";
import { makeProductToCreateFor } from "../../../fixtures/simpleProduct";
import { getTestDatabase } from "../../../lifecycle/getTestDatabase";

describe("RemoveAllSimpleProductsFromPostgres", () => {
  const createSutAndFixtures = () => {
    const { database } = getTestDatabase();
    return {
      fixtures: {
        createShop: new CreateNewShopInPostgres(database),
        createProduct: new CreateSimpleProductInPostgres(database),
        getSimpleProduct: new GetSimpleProductFromPostgres(database),
      },
      removeAllProducts: new RemoveAllSimpleProductsFromPostgres(database),
    };
  };
  it(`should not affect the data of any other shop's products`, async () => {
    expect.hasAssertions();
    const {
      removeAllProducts,
      fixtures: { createShop, createProduct, getSimpleProduct },
    } = createSutAndFixtures();
    const { id: theOtherShop } = await createShop.execute({
      name: "My first shop",
    });
    const { id: myRelevantShop } = await createShop.execute({
      name: "My relevant shop",
    });
    await createProduct.execute(makeProductToCreateFor(theOtherShop));

    await removeAllProducts.forAGivenShop(myRelevantShop);

    const otherShopsInventory = await getSimpleProduct.forShop(theOtherShop);
    expect(otherShopsInventory).toHaveLength(1);
  });
});
