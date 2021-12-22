import { Postgres } from "../../ports/postgres/postgres";
import PgBoss from "pg-boss";

type StopScheduler = (
  options?: PgBoss.StopOptions | undefined
) => Promise<void>;
/**
 * Will ensure a job is scheduled every 30 minutes to pull down all current inventory
 * for all shops
 *
 * @class RetrieveInventoryScheduler
 */
class ScheduledJob {
  private readonly jobRunner: PgBoss;
  private readonly scheduleName: string;
  private readonly schedule: string;
  private handler: PgBoss.WorkHandler<unknown, unknown>;

  constructor(
    database: Postgres,
    scheduleName: string,
    schedule: string,
    handler: PgBoss.WorkHandler<unknown, unknown>
  ) {
    this.jobRunner = new PgBoss(database.getConnectionString());
    this.scheduleName = scheduleName;
    this.schedule = schedule;
    this.handler = handler;
    this.jobRunner.on("error", (error) => console.error(error));
  }

  async start(): Promise<StopScheduler> {
    await this.jobRunner.start();

    await this.jobRunner.schedule(this.scheduleName, this.schedule, undefined, {
      singletonKey: this.scheduleName, // Only allow for one concurrent job to be run of this type.
      singletonHours: 6, // Only allow for one concurrent job to be run for this long. It's overkill but there's a lot of stuff to run right now...
    });
    await this.jobRunner.work(this.scheduleName, this.handler);

    console.log(`${this.scheduleName} started`);

    const stopAndLog = () => {
      console.log(`${this.scheduleName} stopped`);
      return this.jobRunner.stop();
    };
    return stopAndLog;
  }
}
export { ScheduledJob };
