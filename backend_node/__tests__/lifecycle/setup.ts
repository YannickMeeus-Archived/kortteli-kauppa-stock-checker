import RootPath from "app-root-path";
import { Migrations } from "../../src/postgres/migrations";
import { getTestDatabase, makeTestingDatabase } from "./getTestDatabase";

import { config } from "dotenv";
import path from "path";

config({ path: path.join(RootPath.path, ".env.test") });

beforeAll(async () => {
  const fixture = await makeTestingDatabase();
  const migration = new Migrations(fixture.database, RootPath.path);
  await migration.execute({ silent: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  (global as any).__DBFIXTURE__ = fixture;
});
beforeEach(async () => {
  await getTestDatabase().database.sql.query("TRUNCATE TABLE shops");
});
afterAll(async () => {
  await getTestDatabase().database.sql.end();
});
