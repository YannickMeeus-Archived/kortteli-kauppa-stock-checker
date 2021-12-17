import { randomUUID } from "crypto";
import { CabinetItem } from "../../../../src/domain/inventory";
import {
  GetSnapshotFromPostgres,
  StoreSnapshotInPostgres,
} from "../../../../src/ports/postgres/inventory";
import { CreateNewShopInPostgres } from "../../../../src/ports/postgres/shops";
import { singleCabinetItem } from "../../../fixtures";
import { getTestDatabase } from "../../../lifecycle/getTestDatabase";

describe("StoreSnapshot", () => {
  const createSutAndFixtures = () => {
    const { database } = getTestDatabase();
    return {
      fixtures: {
        createShop: new CreateNewShopInPostgres(database),
        getSnapshot: new GetSnapshotFromPostgres(database),
      },
      storeSnapshot: new StoreSnapshotInPostgres(database),
    };
  };
  it("should exist", async () => {
    const { storeSnapshot } = createSutAndFixtures();
    expect(storeSnapshot).toBeDefined();
  });
  it("should store raw inventory in postgres", async () => {
    const {
      storeSnapshot,
      fixtures: { createShop, getSnapshot },
    } = createSutAndFixtures();

    const { id } = await createShop.execute({ name: "test shop" });
    const firstItem: CabinetItem = {
      ...singleCabinetItem,
      location: randomUUID(),
    };
    const secondItem: CabinetItem = {
      ...singleCabinetItem,
      location: randomUUID(),
    };
    await storeSnapshot.forShop(id, [firstItem, secondItem]);

    const storedSnapshot = await getSnapshot.oldestForShop(id);
    expect(storedSnapshot?.contents).toIncludeAllMembers([
      firstItem,
      secondItem,
    ]);
  });
  it("should return the created snapshot", async () => {
    expect.hasAssertions();
    const {
      storeSnapshot,
      fixtures: { createShop },
    } = createSutAndFixtures();
    const { id } = await createShop.execute({ name: "test shop" });
    const created = await storeSnapshot.forShop(id, [singleCabinetItem]);
    expect(created).toBeDefined();
  });
  it("should stamp a snapshot with a time of creation", async () => {
    const {
      storeSnapshot,
      fixtures: { createShop },
    } = createSutAndFixtures();
    const { id } = await createShop.execute({ name: "test shop" });
    const created = await storeSnapshot.forShop(id, [singleCabinetItem]);
    expect(created.createdAt).toBeDefined();
  });
  it("should initially set it to unarchived", async () => {
    const {
      storeSnapshot,
      fixtures: { createShop },
    } = createSutAndFixtures();
    const { id } = await createShop.execute({ name: "test shop" });
    const created = await storeSnapshot.forShop(id, [singleCabinetItem]);
    expect(created.archived).toBeFalse();
  });
});
