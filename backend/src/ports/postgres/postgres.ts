import {
  Pool,
  QueryArrayConfig,
  QueryArrayResult,
  QueryConfig,
  QueryResult,
  QueryResultRow,
  Submittable,
} from "pg";
import polly from "polly-js";

class RetryableQueryPool extends Pool {
  query<T extends Submittable>(queryStream: T): T;
  // I know.... THESE ARE NOT MY TYPINGS OKAY?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query<R extends any[] = any[], I extends any[] = any[]>(
    queryConfig: QueryArrayConfig<I>,
    values?: I
  ): Promise<QueryArrayResult<R>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryConfig: QueryConfig<I>
  ): Promise<QueryResult<R>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    values?: I
  ): Promise<QueryResult<R>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query<R extends any[] = any[], I extends any[] = any[]>(
    queryConfig: QueryArrayConfig<I>,
    callback: (err: Error, result: QueryArrayResult<R>) => void
  ): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    callback: (err: Error, result: QueryResult<R>) => void
  ): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryText: string,
    values: I,
    callback: (err: Error, result: QueryResult<R>) => void
  ): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query(...args: any[]): unknown {
    // Don't do this at home, or in production. Please
    if (args.length == 1) {
      return polly()
        .waitAndRetry(2)
        .executeForPromise(() => super.query(args[0]));
    }
    if (args.length == 2) {
      return polly()
        .waitAndRetry(2)
        .executeForPromise(() => super.query(args[0], args[1]));
    }
    if (args.length == 3) {
      return polly()
        .waitAndRetry(2)
        .executeForNode(() => super.query(args[0], args[1], args[2]));
    }
  }
}
class Postgres {
  private readonly pool: RetryableQueryPool;
  private readonly connectionString: string;
  constructor(
    host: string,
    port: number,
    dbName: string,
    username: string,
    password: string
  ) {
    this.connectionString = `postgres://${username}:${password}@${host}:${port}/${dbName}`;
    this.pool = new RetryableQueryPool({
      connectionString: this.connectionString,
      min: 20,
      max: 40,
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
