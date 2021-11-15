import { CreatableShop, CreateNewShop, Shop } from "../../shops";
import { Postgres } from "../configuration";
import { parseOneRow } from "../../../__tests__/postgres/shops/parseOneRow";
import { ShopAlreadyExistsError } from "../../shops/errors/ShopAlreadyExistsError";

class CreateNewShopInPostgres implements CreateNewShop {
  constructor(private readonly postgres: Postgres) {}
  async execute({ name }: CreatableShop): Promise<Shop> {
    try {
      const created = await this.postgres.sql.query(
        `INSERT INTO shops (name) VALUES ($1) RETURNING id, name`,
        [name]
      );
      return parseOneRow(created.rows);
    } catch (e: any) {
      if (
        e.message ===
        'duplicate key value violates unique constraint "shops_name_key"'
      ) {
        throw new ShopAlreadyExistsError(name);
      }
      throw e;
    }
  }
}

export { CreateNewShopInPostgres };
