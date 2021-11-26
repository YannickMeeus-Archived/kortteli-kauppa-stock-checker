import {
  CreateSimpleProduct,
  ProductToCreate,
} from "../../../domain/inventory/createSimpleProduct";
import { DuplicateProductInShopError } from "../../../domain/inventory/models/errors/duplicateProductInShopError";
import { SimpleProduct } from "../../../domain/inventory/models/simpleProduct";
import { Postgres } from "../postgres";

class CreateSimpleProductInPostgres implements CreateSimpleProduct {
  constructor(private readonly postgres: Postgres) {}
  async execute({
    name,
    quantity,
    shopId,
    ean,
    cabinet,
  }: ProductToCreate): Promise<SimpleProduct> {
    const query = `
      INSERT INTO simple_products (
        ean,
        quantity,
        shop_id,
        name,
        cabinet
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [ean, quantity, shopId, name, cabinet];
    try {
      const created = await this.postgres.sql.query(query, values);
      return new SimpleProduct(
        created.rows[0].id,
        created.rows[0].ean,
        created.rows[0].name,
        created.rows[0].quantity,
        created.rows[0].cabinet,
        created.rows[0].shop_id
      );
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.includes("simple_products_ean_shop_id_key")
      ) {
        throw new DuplicateProductInShopError(ean, shopId);
      }
      throw error;
    }
  }
}

export { CreateSimpleProductInPostgres };
