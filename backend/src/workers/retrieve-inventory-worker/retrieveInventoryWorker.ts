import { Postgres } from "../../postgres/postgres";
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
class RetrieveInventoryWorker {
  private readonly jobRunner: PgBoss;
  private readonly jobQueueName: string;
  private readonly schedule: string;
  private handler: PgBoss.SubscribeHandler<unknown, unknown>;

  constructor(database: Postgres, schedule: string) {
    this.jobRunner = new PgBoss(database.getConnectionString());
    this.jobQueueName = "retrieve-inventory-worker-queue";
    this.schedule = schedule;
    this.handler = (job) => console.log(`Handler not set for job: ${job.name}`);
    this.jobRunner.on("error", (error) => console.error(error));
  }

  withHandler(
    handler: PgBoss.SubscribeHandler<unknown, unknown>
  ): RetrieveInventoryWorker {
    this.handler = handler;
    return this;
  }

  async start(): Promise<StopScheduler> {
    await this.jobRunner.start();
    await this.jobRunner.schedule(this.jobQueueName, this.schedule);
    await this.jobRunner.subscribe(this.jobQueueName, this.handler);

    console.log(`${RetrieveInventoryWorker.name} started`);

    const stopAndLog = () => {
      console.log(`${RetrieveInventoryWorker.name} stopped`);
      return this.jobRunner.stop();
    };
    return stopAndLog;
  }
}
export { RetrieveInventoryWorker };
