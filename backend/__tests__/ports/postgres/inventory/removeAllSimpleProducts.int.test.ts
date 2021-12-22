import { randomUUID } from "crypto";
import {
  CreateSimpleProductInPostgres,
  GetSimpleProductFromPostgres as GetSimpleProductsFromPostgres,
} from "../../../../src/ports/postgres/inventory";
import { RemoveAllSimpleProductsFromPostgres } from "../../../../src/ports/postgres/inventory/removeAllSimpleProductsFromPostgres";
import { CreateNewShopInPostgres } from "../../../../src/ports/postgres/shops";
import { times } from "../../../fixtures/range";
import { makeProductToCreateFor } from "../../../fixtures/simpleProduct";
import { getTestDatabase } from "../../../lifecycle/getTestDatabase";

describe("RemoveAllSimpleProductsFromPostgres", () => {
  const createSutAndFixtures = () => {
    const { database } = getTestDatabase();
    return {
      fixtures: {
        createShop: new CreateNewShopInPostgres(database),
        createProduct: new CreateSimpleProductInPostgres(database),
        getSimpleProducts: new GetSimpleProductsFromPostgres(database),
      },
      removeAllProducts: new RemoveAllSimpleProductsFromPostgres(database),
    };
  };
  it(`should not affect the data of any other shop's products`, async () => {
    const {
      removeAllProducts,
      fixtures: { createShop, createProduct, getSimpleProducts },
    } = createSutAndFixtures();
    const { id: theOtherShop } = await createShop.execute({
      name: "My first shop",
    });
    const { id: myRelevantShop } = await createShop.execute({
      name: "My relevant shop",
    });
    await createProduct.execute(makeProductToCreateFor(theOtherShop));

    await removeAllProducts.forAGivenShop(myRelevantShop);

    const otherShopsInventory = await getSimpleProducts.forShop(theOtherShop);
    expect(otherShopsInventory).toHaveLength(1);
  });
  it("should remove all products for a given shop", async () => {
    expect.hasAssertions();
    const {
      removeAllProducts,
      fixtures: { createShop, createProduct, getSimpleProducts },
    } = createSutAndFixtures();
    const { id: myShop } = await createShop.execute({
      name: "My first shop",
    });
    const expectedAmountBeforeDeletion = 10;
    const epcs = times(expectedAmountBeforeDeletion).map(() => randomUUID());
    await Promise.all(
      epcs.map((epc) =>
        createProduct.execute(makeProductToCreateFor(myShop, { epc }))
      )
    );
    let currentProducts = await getSimpleProducts.forShop(myShop);
    expect(currentProducts).toHaveLength(expectedAmountBeforeDeletion);

    await removeAllProducts.forAGivenShop(myShop);
    currentProducts = await getSimpleProducts.forShop(myShop);
    expect(currentProducts).toBeEmpty();
  });
});
