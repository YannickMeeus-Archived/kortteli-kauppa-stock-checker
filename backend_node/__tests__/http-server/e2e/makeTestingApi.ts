import { makeHttpApi } from "../../../src/http-server/composition-root";
import { Postgres } from "../../../src/postgres/configuration";
import { PostgreSqlContainer } from "testcontainers";

const testingApiKey = "testing-api-key";

const makeFakeHttpApi = (testingDatabase: Postgres) =>
  makeHttpApi({
    security: { apiKey: testingApiKey },
    database: testingDatabase,
  });

export interface TestingDatabase {
  database: Postgres;
  stop: () => Promise<void>;
}
const makeTestingDatabase = async (): Promise<TestingDatabase> => {
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
export { testingApiKey, makeFakeHttpApi, makeTestingDatabase };
