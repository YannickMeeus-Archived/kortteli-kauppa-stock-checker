import { Shop } from "../shops";
import { CabinetItem } from "./models/cabinetItem";

type Query = Pick<Shop, "id">;

interface PullRawInventory {
  forShop(shop: Query): Promise<CabinetItem[]>;
}

export { PullRawInventory, Query };
