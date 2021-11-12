import { makeHttpApi } from "../../../src/http-server/composition-root";
import { getTestDatabase } from "../../lifecycle/getTestDatabase";

const testingApiKey = "testing-api-key";

const makeFakeHttpApi = () =>
  makeHttpApi({
    security: { apiKey: testingApiKey },
    database: getTestDatabase().database,
  });

export { testingApiKey, makeFakeHttpApi };
