import { config } from "dotenv";
import { asString, asNumber } from "../src/lib/parsing";
import { Migrations } from "../src/ports/postgres/migrations";
import { Postgres } from "../src/ports/postgres/postgres";
import { path as root } from "app-root-path";
(async () => {
  const productionConfig = config({ path: "./.env.production" });
  if (productionConfig.error) {
    throw productionConfig.error;
  }
  const auroraConfig = config({ path: "./.env.aurora" });
  if (auroraConfig.error) {
    throw auroraConfig.error;
  }

  const supabase = new Postgres(
    asString(auroraConfig.parsed?.DATABASE_HOST, "DATABASE_HOST"),
    asNumber(auroraConfig.parsed?.DATABASE_PORT, "DATABASE_PORT"),
    asString(auroraConfig.parsed?.DATABASE_NAME, "DATABASE_NAME"),
    asString(auroraConfig.parsed?.DATABASE_USERNAME, "DATABASE_USERNAME"),
    asString(auroraConfig.parsed?.DATABASE_PASSWORD, "DATABASE_PASSWORD")
  );

  const aurora = new Postgres(
    asString(productionConfig.parsed?.DATABASE_HOST, "DATABASE_HOST"),
    asNumber(productionConfig.parsed?.DATABASE_PORT, "DATABASE_PORT"),
    asString(productionConfig.parsed?.DATABASE_NAME, "DATABASE_NAME"),
    asString(productionConfig.parsed?.DATABASE_USERNAME, "DATABASE_USERNAME"),
    asString(productionConfig.parsed?.DATABASE_PASSWORD, "DATABASE_PASSWORD")
  );

  // query all raw-inventory-data by paging
  // query shops

  const migration = new Migrations(aurora, root);
  await migration.execute();
})();
