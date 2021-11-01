import { makeHttpApi } from "../../src/http-server/composition-root";

const testingApiKey = "testing-api-key";
const makeFakeHttpApi = () => makeHttpApi({ apiKey: testingApiKey });
export { testingApiKey, makeFakeHttpApi };
