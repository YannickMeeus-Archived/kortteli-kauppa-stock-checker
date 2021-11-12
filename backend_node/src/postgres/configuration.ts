class Postgres {
  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly dbName: string,
    private readonly username: string,
    private readonly password: string
  ) {}

  public getUrl() {
    return `postgres://${this.username}:${this.password}@${this.host}:${this.port}/${this.dbName}`;
  }
}

export { Postgres };
