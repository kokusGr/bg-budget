import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

const authStateValidator = z.object({
  userId: z.string().min(1).nullable(),
  accessToken: z.string().min(1).nullable(),
});

export type AuthState = z.infer<typeof authStateValidator>;

export const signInParamsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignInParams = z.infer<typeof signInParamsValidator>;

const emptyState: AuthState = {
  userId: null,
  accessToken: null,
};

function getInitialState() {
  const auth = localStorage.getItem("auth");
  if (!auth) {
    return emptyState;
  }

  try {
    const parsed = JSON.parse(auth);
    return authStateValidator.parse(parsed);
  } catch (err) {
    return emptyState;
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setUser(state, action: PayloadAction<AuthState>) {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
    },
  },
});

export function persistAuth(user: AuthState) {
  localStorage.setItem("auth", JSON.stringify(user));
}

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
