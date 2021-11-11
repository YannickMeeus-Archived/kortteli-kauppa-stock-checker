import { makeHttpApi } from "../../src/http-server/composition-root";

const testingApiKey = "testing-api-key";
const makeFakeHttpApi = () =>
  makeHttpApi({ security: { apiKey: testingApiKey } });
export { testingApiKey, makeFakeHttpApi };
