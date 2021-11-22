import { PullRawInventoryFromExternalApi } from "../../src/kortteli-kauppa-api/pullRawInventoryFromApi";
import nock from "nock";
import {
  singleCabinetItem,
  singleCabinetItemReturned,
} from "./fixtures/singleCabinetItemReturned";
import { GetSingleShopFromMemory, Shop } from "../../src/shops";
import { ShopNotFoundError } from "../../src/shops/errors/ShopNotFoundError";

describe("pullRawInventoryFromApi", () => {
  const testBaseUrl = "http://www.kk-api.test";
  const existingShopWithStock = new Shop(
    "827ab95d-a0af-474b-a6aa-1e866584fb2e",
    "store-1"
  );
  const existingShopWithoutStock = new Shop(
    "b7f6d0d3-2a4f-48bd-9d75-54c7200dbdc1",
    "store-2"
  );
  const getShopById = new GetSingleShopFromMemory([
    existingShopWithStock,
    existingShopWithoutStock,
  ]);
  it("should return an empty array if no data can be found", async () => {
    const scope = nock(testBaseUrl)
      .get(`/Kortteliapp/api/cabin/list/v2/${existingShopWithoutStock.name}`)
      .reply(200, []);
    const getInventory = new PullRawInventoryFromExternalApi(
      testBaseUrl,
      getShopById
    );
    const result = await getInventory.forShop({
      id: existingShopWithoutStock.id,
    });
    expect(result).toEqual([]);
    scope.done();
  });

  it("should return some data if a shop has data", async () => {
    const scope = nock(testBaseUrl)
      .get(`/Kortteliapp/api/cabin/list/v2/${existingShopWithStock.name}`)
      .reply(200, singleCabinetItemReturned);
    const getInventory = new PullRawInventoryFromExternalApi(
      testBaseUrl,
      getShopById
    );
    const found = await getInventory.forShop({ id: existingShopWithStock.id });
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject(singleCabinetItem);
    scope.done();
  });

  it("should throw a ShopNotFoundError if no shop exists", async () => {
    const getInventory = new PullRawInventoryFromExternalApi(
      testBaseUrl,
      getShopById
    );
    await expect(() =>
      getInventory.forShop({ id: "not-found" })
    ).rejects.toThrow(ShopNotFoundError);
  });
});
