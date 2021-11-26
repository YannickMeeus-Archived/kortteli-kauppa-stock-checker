import { ShopId } from "../shops";
import { SimpleProduct } from "./models/simpleProduct";

interface GetSimpleProducts {
  forShop(id: ShopId): Promise<SimpleProduct[]>;
}

export { GetSimpleProducts };
