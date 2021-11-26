import { CabinetItem } from ".";

class Snapshot {
  constructor(
    private readonly id: string,
    private readonly contents: CabinetItem[],
    private readonly processed: boolean = false
  ) {}
}

export { Snapshot };
