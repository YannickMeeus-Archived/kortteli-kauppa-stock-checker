import { path } from "app-root-path";
import { Migrations } from "../../src/postgres/migrations";
import {makeTestingDatabase} from "./getTestDatabase";

beforeAll(async () => {
  const fixture = await makeTestingDatabase();
  const migration = new Migrations(fixture.database, path);
  await migration.execute({ silent: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).__DBFIXTURE__ = fixture;
});

afterAll(async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (global as any).__DBFIXTURE__.stop();
});
