import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.BACKEND_URL,
  credentials: "include",
});

export const apiSlice = createApi({
  baseQuery,

  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: "/signup",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSignupMutation } = apiSlice;
