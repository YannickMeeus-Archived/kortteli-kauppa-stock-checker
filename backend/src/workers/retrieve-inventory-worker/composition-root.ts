import { ScheduledJob } from "../../lib/scheduling/scheduledJob";
import { Postgres } from "../../postgres/postgres";

interface RetrieveInventoryWorkerConfiguration {
  database: Postgres;
  schedule: string;
}
const makeRetrieveInventoryWorker = ({
  database,
  schedule,
}: RetrieveInventoryWorkerConfiguration): ScheduledJob => {
  const scheduledJob = new ScheduledJob(
    database,
    "retrieve-inventory-worker",
    schedule
  );
  return scheduledJob;
};

export { makeRetrieveInventoryWorker };
