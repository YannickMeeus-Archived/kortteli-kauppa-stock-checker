import { WithFlavor } from "@coderspirit/nominal";
import { CabinetItem } from ".";
import { ShopId } from "../../../shops";

type SnapshotId = WithFlavor<string, "SnapshotId">;
class Snapshot {
  constructor(
    public readonly id: SnapshotId,
    public readonly shop: ShopId,
    public readonly contents: CabinetItem[],
    public readonly createdAt: Date = new Date(),
    public readonly archived: boolean = false
  ) {}
}

export { Snapshot, SnapshotId };
