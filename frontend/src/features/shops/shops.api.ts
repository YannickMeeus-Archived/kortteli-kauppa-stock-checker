import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiBaseUrl } from "../../lib/configuration";
import { Shops } from "./types/shops.type";

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
