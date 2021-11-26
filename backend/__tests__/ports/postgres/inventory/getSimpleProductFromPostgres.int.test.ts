import { CreateSimpleProductInPostgres } from "../../../../src/ports/postgres/inventory/createSimpleProductInPostgres";
import { GetSimpleProductFromPostgres } from "../../../../src/ports/postgres/inventory/getSimpleProductFromPostgres";
import { CreateNewShopInPostgres } from "../../../../src/ports/postgres/shops";
import { getTestDatabase } from "../../../lifecycle/getTestDatabase";

describe("GetSimpleProductFromPostgres", () => {
  const createSutAndFixtures = () => {
    const { database } = getTestDatabase();
    return {
      fixtures: {
        createShop: new CreateNewShopInPostgres(database),
        createProduct: new CreateSimpleProductInPostgres(database),
      },
      getProduct: new GetSimpleProductFromPostgres(database),
    };
  };
  it("should return an empty array if no products are found for a shop", async () => {
    const { getProduct } = createSutAndFixtures();
    const results = await getProduct.forShop({
      id: "9ffe268e-a7a5-41a4-9f2d-12e96645b3c4",
    });

    expect(results).toEqual([]);
  });
  it("should return an array of products if products are found for a shop", async () => {
    const {
      getProduct,
      fixtures: { createShop, createProduct },
    } = createSutAndFixtures();
    const shop = await createShop.execute({ name: "My little shop" });
    const firstProduct = await createProduct.execute({
      name: "My first product",
      shopId: shop.id,
      cabinet: "A",
      ean: "1234567890123",
      quantity: 10,
    });
    const secondProduct = await createProduct.execute({
      name: "My second product",
      shopId: shop.id,
      cabinet: "A",
      ean: "1234567890124",
      quantity: 10,
    });
    const results = await getProduct.forShop(shop);
    expect(results).toHaveLength(2);
    expect(results).toContainEqual(firstProduct);
    expect(results).toContainEqual(secondProduct);
  });
  it("should correctly return results for different shops", async () => {
    const {
      getProduct,
      fixtures: { createShop, createProduct },
    } = createSutAndFixtures();
    const firstShop = await createShop.execute({ name: "My first shop" });
    const secondShop = await createShop.execute({ name: "My second shop" });
    const firstProduct = await createProduct.execute({
      name: "My first product",
      shopId: firstShop.id,
      cabinet: "A",
      ean: "1234567890123",
      quantity: 10,
    });
    const secondProduct = await createProduct.execute({
      name: "My first product",
      shopId: secondShop.id,
      cabinet: "A",
      ean: "1234567890123",
      quantity: 10,
    });
    const productsForFirstShop = await getProduct.forShop(firstShop);
    const productsForSecondShop = await getProduct.forShop(secondShop);

    expect(productsForFirstShop).toHaveLength(1);
    expect(productsForSecondShop).toHaveLength(1);
    expect(productsForFirstShop).toContainEqual(firstProduct);
    expect(productsForSecondShop).toContainEqual(secondProduct);
  });
});
