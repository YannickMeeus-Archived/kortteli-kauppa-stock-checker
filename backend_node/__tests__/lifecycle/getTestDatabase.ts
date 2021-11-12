import { PostgreSqlContainer } from "testcontainers";
import { Postgres } from "../../src/postgres/configuration";

export interface TestingDatabase {
  database: Postgres;
  stop: () => Promise<void>;
}
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

export const getTestDatabase = (): TestingDatabase => {
  return (global as any).__DBFIXTURE__ as TestingDatabase;
};
