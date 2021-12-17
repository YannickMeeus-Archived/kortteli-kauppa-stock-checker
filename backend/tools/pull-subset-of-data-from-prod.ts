/*
  This is used to pull down a set of data and store it into ./snapshots.
  Ideally it will automatically upload them to a bucket in supabase, but
  let's not focus on that just yet.
*/

import { config } from "dotenv";
import { asNumber, asString } from "../src/lib/parsing";
import { Postgres } from "../src/ports/postgres/postgres";
import { format } from "date-fns";
import { mkdir, rm, writeFile } from "fs/promises";
import { GetAllShopsFromPostgres } from "../src/ports/postgres/shops";

(async () => {
  const productionConfig = config({ path: "./.env.production" });
  if (productionConfig.error) {
    throw productionConfig.error;
  }

  const production = new Postgres(
    asString(productionConfig.parsed?.DATABASE_HOST, "DATABASE_HOST"),
    asNumber(productionConfig.parsed?.DATABASE_PORT, "DATABASE_PORT"),
    asString(productionConfig.parsed?.DATABASE_NAME, "DATABASE_NAME"),
    asString(productionConfig.parsed?.DATABASE_USERNAME, "DATABASE_USERNAME"),
    asString(productionConfig.parsed?.DATABASE_PASSWORD, "DATABASE_PASSWORD")
  );

  const directory = __dirname + "/snapshots";
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });

  const getShops = new GetAllShopsFromPostgres(production);
  const shops = await getShops.execute();
  const shopsIdToName: Map<string, string> = shops.reduce(
    (acc, shop) => acc.set(shop.id, shop.name),
    new Map()
  );
  const snapshots = await production.sql.query(`
SELECT *
FROM
    public.raw_inventory_data
WHERE
    created_at BETWEEN '2021-11-22' AND '2021-12-05'`);
  for (const snapshot of snapshots.rows) {
    const createdTimestamp = snapshot.created_at;
    const shopId = snapshot.shop;
    const data = snapshot.raw_data;
    const shop = shopsIdToName.get(shopId);
    mkdir(directory + "/" + shop, { recursive: true });
    const filename = `${directory}/${shop}/${format(
      createdTimestamp,
      "yyyy-MM-dd-HHmmss"
    )}.json`;

    const metadata = {
      shop,
      createdAt: createdTimestamp,
    };
    const contents = {
      metadata,
      data,
    };

    await writeFile(filename, JSON.stringify(contents, null, 2));
  }
  process.exit(0);
})();
