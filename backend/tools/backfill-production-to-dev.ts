import { config } from "dotenv";
import { asNumber, asString } from "../src/lib/parsing";
import { Postgres } from "../src/ports/postgres/postgres";
import format from "pg-format";
(async () => {
  const start = (status: string) =>
    console.log(`-------START - ${status.toUpperCase()} -------`);
  const end = (status: string) =>
    console.log(`-------END -   ${status.toUpperCase()} -------`);

  start("parsing production configuration");
  const productionConfig = config({ path: "./.env.production" });
  if (productionConfig.error) {
    throw productionConfig.error;
  }
  end("parsing production configuration");
  start("parsing development configuration");
  const developmentConfig = config({ path: "./.env" });
  if (developmentConfig.error) {
    throw developmentConfig.error;
  }

  end("parsing development configuration");
  start("build connections to both databases");
  const development = new Postgres(
    asString(developmentConfig.parsed?.DATABASE_HOST, "DATABASE_HOST"),
    asNumber(developmentConfig.parsed?.DATABASE_PORT, "DATABASE_PORT"),
    asString(developmentConfig.parsed?.DATABASE_NAME, "DATABASE_NAME"),
    asString(developmentConfig.parsed?.DATABASE_USERNAME, "DATABASE_USERNAME"),
    asString(developmentConfig.parsed?.DATABASE_PASSWORD, "DATABASE_PASSWORD")
  );

  const production = new Postgres(
    asString(productionConfig.parsed?.DATABASE_HOST, "DATABASE_HOST"),
    asNumber(productionConfig.parsed?.DATABASE_PORT, "DATABASE_PORT"),
    asString(productionConfig.parsed?.DATABASE_NAME, "DATABASE_NAME"),
    asString(productionConfig.parsed?.DATABASE_USERNAME, "DATABASE_USERNAME"),
    asString(productionConfig.parsed?.DATABASE_PASSWORD, "DATABASE_PASSWORD")
  );
  end("build connections to both databases");

  start("nuke development table");
  await development.sql.query(`TRUNCATE raw_inventory_data`);
  end("nuke development table");
  start("pull shops identifiers");
  const developmentShops = await development.sql.query(
    `SELECT id, name from shops`
  );
  const productionShops = await production.sql.query(
    `SELECT id, name from shops`
  );

  end("pull shops identifiers");
  start("migration");
  const allProductionRows = await production.sql.query(
    `SELECT shop, raw_data from raw_inventory_data LIMIT 100`
  );

  const inventoryDataFromProduction = allProductionRows.rows.map((row) => [
    row.shop,
    JSON.stringify(row.raw_data),
  ]);
  const insertQueryTemplate = `INSERT INTO raw_inventory_data (shop, raw_data) VALUES %L`;
  const fullQuery = format(insertQueryTemplate, inventoryDataFromProduction);
  await development.sql.query(fullQuery);

  type fromId = string;
  type toId = string;

  const mappings: Map<fromId, toId> = new Map();
  const devShops = developmentShops.rows.map((row) => ({
    id: row.id,
    name: row.name,
  }));
  for (const shop of productionShops.rows) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { id: devId } = devShops.find((s) => s.name === shop.name)!;
    mappings.set(shop.id, devId);
  }
  for (const [from, to] of mappings.entries()) {
    console.log("mapping", from, to);
    await development.sql.query(
      `UPDATE raw_inventory_data SET shop = '${to}' WHERE shop = '${from}'`
    );
  }
  end("migration");
  process.exit(0);
})();
