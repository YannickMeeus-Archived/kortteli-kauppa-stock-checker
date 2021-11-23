import { CreateNewShopInPostgres } from "../../../src/postgres/shops";
import { getTestDatabase } from "../../lifecycle/getTestDatabase";
import { ShopAlreadyExistsError } from "../../../src/shops/errors/ShopAlreadyExistsError";

describe("createNewShopInPostgres", () => {
  const createSut = () => {
    const { database } = getTestDatabase();
    return new CreateNewShopInPostgres(database);
  };
  it("should create a new shop by name", async () => {
    const createShop = createSut();
    const shop = await createShop.execute({ name: "Test Shop Alpha" });
    expect(shop.id).toBeDefined();
    expect(shop.name).toBe("Test Shop Alpha");
  });
  it("should throw an error stating the record already exists if we try to insert the same shop multiple times", async () => {
    const createShop = createSut();
    const payload = { name: "Shop Name" };

    await expect(async () => {
      await createShop.execute(payload);
      await createShop.execute(payload);
    }).rejects.toThrowError(ShopAlreadyExistsError);
  });
});
