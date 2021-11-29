import { CabinetItem } from ".";

class Snapshot {
  constructor(
    public readonly id: string,
    public readonly contents: CabinetItem[],
    public readonly processed: boolean = false
  ) {}
}

export { Snapshot };
