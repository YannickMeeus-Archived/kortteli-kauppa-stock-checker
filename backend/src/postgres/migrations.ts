import { Postgres } from "./postgres";
import runner, { RunnerOption } from "node-pg-migrate";

interface Opts {
  silent: boolean;
}
const defaults: Opts = {
  silent: false,
};
class Migrations {
  constructor(
    private readonly postgres: Postgres,
    private readonly rootPath: string
  ) {}

  public async execute({ silent }: Opts = defaults) {
    const options: RunnerOption = {
      databaseUrl: this.postgres.getConnectionString(),
      direction: "up",
      migrationsTable: "pgmigrations",
      dir: `${this.rootPath}/migrations/`,
      count: Infinity,
    };
    if (silent) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      options.log = () => {};
    }

    await runner(options);
  }
}

export { Migrations };
