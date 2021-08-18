import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiBaseUrl } from "../../lib/configuration";

export interface Shop {
  id: string;
  name: string;
}
export type Shops = Shop[];

interface ShopsResponse {
  data: Shops;
}

export const shopsApi = createApi({
  reducerPath: "shopsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
  }),
  endpoints: (builder) => ({
    getShops: builder.query<ShopsResponse, void>({
      query: () => "shops",
    }),
  }),
});

export const { useGetShopsQuery } = shopsApi;
