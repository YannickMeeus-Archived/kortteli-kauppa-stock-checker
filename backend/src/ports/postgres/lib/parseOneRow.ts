import { Shop } from "../../../domain/shops";
import { dbShop } from "../shops/models/dbShop";
import { fromDbShopRow } from "./fromDbShopRow";

const parseOneRow: (rows: dbShop[]) => Shop = (rows) => {
  if (rows.length != 1) {
    throw new Error("Unexpected amount of rows returned from query");
  }
  const onlyRow = rows[0];
  return fromDbShopRow(onlyRow);
};

export { parseOneRow };
