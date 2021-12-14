import { ProductToCreate } from "../../../../src/domain/inventory/createSimpleProduct";
import { DuplicateProductInShopError } from "../../../../src/domain/inventory/models/errors/duplicateProductInShopError";
import { makeShopName } from "../../../../src/domain/shops";
import { CreateSimpleProductInPostgres } from "../../../../src/ports/postgres/inventory";
import { CreateNewShopInPostgres } from "../../../../src/ports/postgres/shops";
import { getTestDatabase } from "../../../lifecycle/getTestDatabase";

describe("CreateSimpleProductInPostgres", () => {
  const createSutAndFixtures = () => {
    const { database } = getTestDatabase();
    return {
      fixtures: {
        createShop: new CreateNewShopInPostgres(database),
      },
      createSimpleProduct: new CreateSimpleProductInPostgres(database),
    };
  };
  it("should create a simple product", async () => {
    const {
      createSimpleProduct,
      fixtures: { createShop },
    } = createSutAndFixtures();
    const createdShop = await createShop.execute({
      name: makeShopName("test shop"),
    });
    const productToCreate: ProductToCreate = {
      cabinet: "Cabinet 1",
      epc: "12345678901",
      name: "Product 1",
      quantity: 10,
      shopId: createdShop.id,
    };
    const product = await createSimpleProduct.execute(productToCreate);
    expect(product).toBeTruthy();
  });
  it("should disallow duplicate EPCs for a combination of shop and EPC", async () => {
    const {
      createSimpleProduct,
      fixtures: { createShop },
    } = createSutAndFixtures();
    const createdShop = await createShop.execute({
      name: makeShopName("test shop"),
    });
    const productToCreate: ProductToCreate = {
      cabinet: "Cabinet 1",
      epc: "12345678901",
      name: "Product 1",
      quantity: 10,
      shopId: createdShop.id,
    };

    await expect(async () => {
      await createSimpleProduct.execute(productToCreate);
      await createSimpleProduct.execute(productToCreate);
    }).rejects.toThrow(DuplicateProductInShopError);
  });
  it("should allow duplicate EANs if they are allocated to different shops", async () => {
    const {
      createSimpleProduct,
      fixtures: { createShop },
    } = createSutAndFixtures();
    const firstShop = await createShop.execute({
      name: makeShopName("test shop 1"),
    });
    const secondShop = await createShop.execute({
      name: makeShopName("test shop 2"),
    });
    const firstShopsProduct: ProductToCreate = {
      cabinet: "Cabinet 1",
      epc: "12345678901",
      name: "Product 1",
      quantity: 10,
      shopId: firstShop.id,
    };
    const secondShopsProduct: ProductToCreate = {
      ...firstShopsProduct,
      shopId: secondShop.id,
    };
    const firstCreatedProduct = await createSimpleProduct.execute(
      firstShopsProduct
    );
    const secondCreatedProduct = await createSimpleProduct.execute(
      secondShopsProduct
    );
    expect(firstCreatedProduct).toBeDefined();
    expect(secondCreatedProduct).toBeDefined();
  });
});
