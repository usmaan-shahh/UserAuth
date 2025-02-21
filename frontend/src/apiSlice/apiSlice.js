import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
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

    verifyEmail: builder.mutation({
      query: (code) => ({
        url: "/verify-email",
        method: "POST",
        body: { code },
      }),
    }),
  }),
});

export const { useSignupMutation, useVerifyEmailMutation } = apiSlice;
