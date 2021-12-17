import { randomUUID } from "crypto";
import { SnapshotNotFoundError } from "../../../../src/domain/inventory/models/errors/snapshotNotFoundError";
import {
  GetSnapshotFromPostgres,
  StoreSnapshotInPostgres,
} from "../../../../src/ports/postgres/inventory";
import { ArchiveSnapshotInPostgres } from "../../../../src/ports/postgres/inventory/archiveSnapshotInPostgres";
import { CreateNewShopInPostgres } from "../../../../src/ports/postgres/shops";
import { getTestDatabase } from "../../../lifecycle/getTestDatabase";

describe("ArchiveSnapshotInPostgres", () => {
  const createSutAndFixtures = () => {
    const { database } = getTestDatabase();
    return {
      fixtures: {
        storeSnapshot: new StoreSnapshotInPostgres(database),
        createShop: new CreateNewShopInPostgres(database),
        getSnapshot: new GetSnapshotFromPostgres(database),
      },
      archiveSnapshot: new ArchiveSnapshotInPostgres(database),
    };
  };
  it("should throw if a snapshot could not be found to archive", async () => {
    const { archiveSnapshot } = createSutAndFixtures();
    const id = randomUUID();
    await expect(async () => archiveSnapshot.execute(id)).rejects.toThrow(
      SnapshotNotFoundError
    );
  });
  it("should mark a snapshot that is not archived yet as archived", async () => {
    expect.hasAssertions();

    const {
      archiveSnapshot,
      fixtures: { storeSnapshot, createShop, getSnapshot },
    } = createSutAndFixtures();
    const createdShop = await createShop.execute({ name: "test shop" });
    const existingSnapshot = await storeSnapshot.forShop(createdShop.id, []);
    expect(existingSnapshot.archived).toBeFalsy();

    await archiveSnapshot.execute(existingSnapshot.id);
    const archivedSnapshot = await getSnapshot.byId(existingSnapshot.id);
    expect(archivedSnapshot.archived).toBeTruthy();
  });
});
