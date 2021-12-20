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
      min: 20,
      max: 20,
    });
    this.pool.on("error", (e) => console.log(e.message));
  }

  public getConnectionString() {
    return this.connectionString;
  }

  public get sql() {
    return this.pool;
  }
}

export { Postgres };
