import {Postgres} from "./configuration";
import runner, {RunnerOption} from 'node-pg-migrate'

class Migrations {
  constructor(private readonly postgres: Postgres, private readonly rootPath: string) {
  }

  public async execute() {
    const options: RunnerOption = {
      databaseUrl: this.postgres.getUrl(),
      direction: 'up',
      migrationsTable: 'pg_migrations',
      dir: `${this.rootPath}/migrations/`,
      count: Infinity
    }
    await runner(options)
  }
}

export {Migrations}
