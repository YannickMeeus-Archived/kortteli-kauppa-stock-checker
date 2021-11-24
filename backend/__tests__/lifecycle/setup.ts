import RootPath from "app-root-path";
import { Migrations } from "../../src/ports/postgres/migrations";
import { getTestDatabase, makeTestingDatabase } from "./getTestDatabase";

import { config } from "dotenv";
import path from "path";

config({ path: path.join(RootPath.path, ".env.test") });

beforeAll(async () => {
  const fixture = await makeTestingDatabase();
  const migration = new Migrations(fixture.database, RootPath.path);
  await migration.execute({ silent: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).__DBFIXTURE__ = fixture;
});

beforeEach(async () => {
  const { database } = getTestDatabase();
  const allTables = await database.sql.query(`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_type='BASE TABLE'
    AND table_schema='public'
      and table_name <> 'pgmigrations'`);
  const tableNames = allTables.rows.map((row) => row.table_name).join(", ");
  const truncateAllApartFromMigrationTable = `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE`;
  await database.sql.query(truncateAllApartFromMigrationTable);
});
afterAll(async () => {
  await getTestDatabase().stop();
});
