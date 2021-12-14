import { makeShopId, makeShopName, Shop } from "../../../domain/shops";
import { dbShop } from "../shops/models/dbShop";

const fromDbShopRow = (row: dbShop): Shop => {
  return new Shop(makeShopId(row.id), makeShopName(row.name));
};

export { fromDbShopRow };
