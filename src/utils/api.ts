import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";

import { RootState } from "@/utils/store";
import { AuthState, SignInParams } from "@/utils/auth";
import {
  NewTransactionInput,
  Transaction,
  transactionValidator,
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
    baseUrl: "https://urkulngsrbxxxpcvtkqq.supabase.co",
    prepareHeaders(headers, { getState }) {
      const state = getState() as RootState;
      headers.set(
        "apikey",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVya3VsbmdzcmJ4eHhwY3Z0a3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM0MDM1NjYsImV4cCI6MTk3ODk3OTU2Nn0.bda9D6kQs8eSW5vkykb4I_Yl-SELT2ekq-MrPWmp5LY"
      );
      if (state.auth.accessToken) {
        headers.set("Authorization", `Bearer ${state.auth.accessToken}`);
      }
      return headers;
    },
  }),
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
      transformResponse: (rawData: unknown) => {
        const validated = transactionValidator.array().parse(rawData);
        return validated;
      },
    }),
    addTransaction: builder.mutation<Transaction, NewTransactionInput>({
      query: (input) => ({
        url: "rest/v1/Transactions",
        method: "POST",
        body: input,
      }),
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
