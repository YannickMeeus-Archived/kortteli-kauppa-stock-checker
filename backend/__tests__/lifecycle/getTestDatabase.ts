import { asNumber } from "../../src/lib/asNumber";
import { asString } from "../../src/lib/asString";
import { Postgres } from "../../src/postgres/postgres";

export interface TestingDatabase {
  database: Postgres;
  stop: () => Promise<void>;
}
export const makeTestingDatabase = async (): Promise<TestingDatabase> => {
  const database = new Postgres(
    asString(process.env.DATABASE_HOST, "DATABASE_HOST"),
    asNumber(process.env.DATABASE_PORT, "DATABASE_PORT"),
    asString(process.env.DATABASE_NAME, "DATABASE_NAME"),
    asString(process.env.DATABASE_USERNAME, "DATABASE_USERNAME"),
    asString(process.env.DATABASE_PASSWORD, "DATABASE_PASSWORD")
  );

  const stop = async (): Promise<void> => {
    await database.sql.end();
  };
  return { database, stop };
};

export const getTestDatabase = (): TestingDatabase => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (global as any).__DBFIXTURE__ as TestingDatabase;
};
