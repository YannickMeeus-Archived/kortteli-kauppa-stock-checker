import { Shop } from "../../../src/shops";

const parseOneRow: (rows: any[]) => Shop = (rows) => {
  if (rows.length != 1) {
    throw new Error("Unexpected amount of rows returned from query");
  }
  const onlyRow = rows[0];
  return new Shop(onlyRow.id, onlyRow.name);
};

export { parseOneRow };
