import listEndpoints from "express-list-endpoints";
import { makeHttpApi } from "./http-server/composition-root";

const serverPort = process.env.PORT || 3000;
const httpApi = makeHttpApi();

httpApi.listen(serverPort, () => {
  console.log(listEndpoints(httpApi));
  console.log(`Server is listening on port ${serverPort}`);
});
