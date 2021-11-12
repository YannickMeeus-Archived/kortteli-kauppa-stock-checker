import { Pool } from "pg";

class Postgres {
  private readonly pool: Pool;
  private readonly connectionString: string;
  constructor(
    host: string,
    port: number,
    dbName: string,
    username: string,
    password: string
  ) {
    this.connectionString = `postgres://${username}:${password}@${host}:${port}/${dbName}`;
    this.pool = new Pool({
      connectionString: this.connectionString,
    });
  }

  public getConnectionString() {
    return this.connectionString;
  }
}

export { Postgres };
