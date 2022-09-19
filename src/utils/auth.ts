import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

export type AuthState = {
  userId: string | null;
  accessToken: string | null;
};

export const signInParamsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignInParams = z.infer<typeof signInParamsValidator>;

const initialState: AuthState = {
  userId: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthState>) {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
