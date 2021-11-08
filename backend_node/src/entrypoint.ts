import { randomUUID } from "crypto";
import listEndpoints from "express-list-endpoints";
import { makeHttpApi } from "./http-server/composition-root";

const serverPort = process.env.PORT || 3000;
const apiKey = process.env.API_KEY || randomUUID(); // TODO: Fix this up so that it blows up when it's not set
const httpApi = makeHttpApi({ apiKey });

httpApi.listen(serverPort, () => {
  console.log(listEndpoints(httpApi));
  console.log(`Server is listening on port ${serverPort}`);
});
