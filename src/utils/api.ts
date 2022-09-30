import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";

import { RootState } from "@/utils/store";
import { AuthState, SignInParams } from "@/utils/auth";
import {
  NewTransactionInput,
  Transaction,
  transformTransactionResponse,
} from "@/utils/transactions";

const authResponseValidator = z.object({
  access_token: z.string(),
  expires_in: z.number().positive(),
  refresh_token: z.string(),
  user: z.object({
    id: z.string(),
  }),
});

const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders(headers, { getState }) {
      const state = getState() as RootState;
      headers.set("apikey", import.meta.env.VITE_API_KEY);
      if (state.auth.accessToken) {
        headers.set("Authorization", `Bearer ${state.auth.accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Transactions"],
  endpoints: (builder) => ({
    signIn: builder.mutation<AuthState, SignInParams>({
      query: (signInParams) => ({
        url: "auth/v1/token?grant_type=password",
        method: "POST",
        body: signInParams,
      }),
      transformResponse: transformAuthResponse,
    }),
    refreshAuthToken: builder.mutation<AuthState, string>({
      query: (token) => ({
        url: "auth/v1/token?grant_type=refresh_token",
        method: "POST",
        body: { refresh_token: token },
      }),
      transformResponse: transformAuthResponse,
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/v1/logout",
        method: "POST",
      }),
    }),
    getTransactions: builder.query<Transaction[], void>({
      query: () => ({
        url: "rest/v1/Transactions?select=*",
      }),
      transformResponse: transformTransactionResponse,
      providesTags: [{ type: "Transactions", id: "LIST" }],
    }),
    addTransaction: builder.mutation<Transaction, NewTransactionInput>({
      query: (input) => ({
        url: "rest/v1/Transactions",
        method: "POST",
        body: input,
      }),
      invalidatesTags: [{ type: "Transactions", id: "LIST" }],
    }),
  }),
});

function transformAuthResponse(rawData: unknown) {
  const validated = authResponseValidator.parse(rawData);
  return {
    accessToken: validated.access_token,
    userId: validated.user.id,
    expiresAt: Date.now() + validated.expires_in * 1000,
    refreshToken: validated.refresh_token,
  };
}

export default apiSlice;

export const {
  useSignInMutation,
  useGetTransactionsQuery,
  useAddTransactionMutation,
} = apiSlice;
