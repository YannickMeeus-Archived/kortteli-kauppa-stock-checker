import { path } from "app-root-path";
import { PostgreSqlContainer } from "testcontainers";
import { Postgres } from "../../src/postgres/configuration";
import { Migrations } from "../../src/postgres/migrations";
import { TestingDatabase } from "./getTestDatabase";

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

export const makeTestingDatabase = async (): Promise<TestingDatabase> => {
  const container = await new PostgreSqlContainer("postgres:13.3-alpine")
    .withExposedPorts(5432)
    .withDatabase("backend_test")
    .withUsername("db_user")
    .withUsername("db_user")
    .withPassword("f71a0e2a-943b-4dfa-99cc-3afde6af79e1")
    .start();

  const database = new Postgres(
    container.getHost(),
    container.getPort(),
    container.getDatabase(),
    container.getUsername(),
    container.getPassword()
  );

  const stop = async (): Promise<void> => {
    await container.stop();
  };
  return { database, stop };
};
