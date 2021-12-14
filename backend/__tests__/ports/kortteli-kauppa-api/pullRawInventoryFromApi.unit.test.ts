import nock from "nock";
import { FetchSnapshotFromKortteliKauppaApi } from "../../../src/ports/kortteli-kauppa-api";
import {
  GetSingleShopFromMemory,
  makeShopId,
  makeShopName,
  Shop,
  ShopNotFoundError,
} from "../../../src/domain/shops";
import { singleCabinetItem, singleCabinetItemAsArray } from "../../fixtures";

describe("FetchSnapshotFromKortteliKauppaApi", () => {
  const testBaseUrl = "http://www.kk-api.test";
  const existingShopWithStock = new Shop(
    makeShopId("827ab95d-a0af-474b-a6aa-1e866584fb2e"),
    makeShopName("store-1")
  );
  const existingShopWithoutStock = new Shop(
    makeShopId("b7f6d0d3-2a4f-48bd-9d75-54c7200dbdc1"),
    makeShopName("store-2")
  );
  const getShopById = new GetSingleShopFromMemory([
    existingShopWithStock,
    existingShopWithoutStock,
  ]);
  it("should return an empty array if no data can be found", async () => {
    const scope = nock(testBaseUrl)
      .get(`/Kortteliapp/api/cabin/list/v2/${existingShopWithoutStock.name}`)
      .reply(200, []);
    const getInventory = new FetchSnapshotFromKortteliKauppaApi(
      testBaseUrl,
      getShopById
    );
    const result = await getInventory.forShop(existingShopWithoutStock.id);
    expect(result).toEqual([]);
    scope.done();
  });

  it("should return some data if a shop has data", async () => {
    const scope = nock(testBaseUrl)
      .get(`/Kortteliapp/api/cabin/list/v2/${existingShopWithStock.name}`)
      .reply(200, singleCabinetItemAsArray);
    const getInventory = new FetchSnapshotFromKortteliKauppaApi(
      testBaseUrl,
      getShopById
    );
    const found = await getInventory.forShop(existingShopWithStock.id);
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject(singleCabinetItem);
    scope.done();
  });

  it("should throw a ShopNotFoundError if no shop exists", async () => {
    const getInventory = new FetchSnapshotFromKortteliKauppaApi(
      testBaseUrl,
      getShopById
    );
    await expect(() =>
      getInventory.forShop(makeShopId("not-found"))
    ).rejects.toThrow(ShopNotFoundError);
  });
});
