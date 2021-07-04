import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface VersionResponse {
  data: string;
}

export const versionApi = createApi({
  reducerPath: "versionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
  }),
  endpoints: (builder) => ({
    getVersion: builder.query<VersionResponse, void>({
      query: () => "_version",
    }),
  }),
});

export const { useGetVersionQuery } = versionApi;
