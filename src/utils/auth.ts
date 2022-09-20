import {
  createSlice,
  isAnyOf,
  Middleware,
  PayloadAction,
} from "@reduxjs/toolkit";
import { z } from "zod";
import { AppDispatch, RootState } from "@/utils/store";
import api from "@/utils/api";

const authStateValidator = z.object({
  userId: z.string().min(1).nullable(),
  accessToken: z.string().min(1).nullable(),
  expiresAt: z.number().positive().nullable(),
  refreshToken: z.string().min(1).nullable(),
});

export type AuthState = z.infer<typeof authStateValidator>;

export const signInParamsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignInParams = z.infer<typeof signInParamsValidator>;

export async function restoreUserSession(dispatch: AppDispatch) {
  const auth = localStorage.getItem("auth");
  if (!auth) {
    dispatch(authActions.initialized());
    return;
  }

  try {
    const parsed = JSON.parse(auth);
    const validated = authStateValidator.parse(parsed);
    if (validated.expiresAt && validated.expiresAt > Date.now() + 30 * 1000) {
      dispatch(authActions.setUser(validated));
      return;
    }

    validated.refreshToken &&
      dispatch(api.endpoints.refreshAuthToken.initiate(validated.refreshToken));
  } catch (err) {
    dispatch(authActions.initialized());
    return;
  }
}

const initialState: AuthState & { isInitialized: boolean } = {
  userId: null,
  accessToken: null,
  expiresAt: null,
  refreshToken: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthState>) {
      const { payload } = action;
      return {
        ...payload,
        isInitialized: true,
      };
    },
    initialized(state) {
      state.isInitialized = true;
    },
  },
});

const matchAuthSuccess = isAnyOf(
  api.endpoints.refreshAuthToken.matchFulfilled,
  api.endpoints.signIn.matchFulfilled
);

function persistAuth(user: AuthState) {
  localStorage.setItem("auth", JSON.stringify(user));
}

export const authMiddleware: Middleware<{}, RootState> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (matchAuthSuccess(action)) {
      persistAuth(action.payload);
      dispatch(authActions.setUser(action.payload));
    }

    return next(action);
  };

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
