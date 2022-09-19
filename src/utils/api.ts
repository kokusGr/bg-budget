import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";

import { RootState } from "@/utils/store";
import { AuthState, SignInParams } from "@/utils/auth";

const authResponseValidator = z.object({
  access_token: z.string(),
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
    signIn: builder.mutation<AuthState | null, SignInParams>({
      query: (signInParams) => ({
        url: "auth/v1/token?grant_type=password",
        method: "POST",
        body: signInParams,
      }),
      transformResponse: (rawData: any) => {
        try {
          const validated = authResponseValidator.parse(rawData);
          return {
            accessToken: validated.access_token,
            userId: validated.user.id,
          };
        } catch (err) {
          return null;
        }
      },
    }),
  }),
});

export default apiSlice;

export const { useSignInMutation } = apiSlice;
