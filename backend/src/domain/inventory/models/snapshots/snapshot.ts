import { CabinetItem } from ".";

class Snapshot {
  constructor(
    public readonly id: string,
    public readonly contents: CabinetItem[],
    public readonly createdAt: Date = new Date(),
    public readonly archived: boolean = false
  ) {}
}

export { Snapshot };
