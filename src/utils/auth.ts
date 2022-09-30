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
  email: z.string().min(1, { message: "Email cannot be empty" }).email(),
  password: z
    .string()
    .min(8, { message: "Password must containt at least 8 characters" }),
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
    setUser(_state, action: PayloadAction<AuthState>) {
      const { payload } = action;
      return {
        ...payload,
        isInitialized: true,
      };
    },
    logout(state) {
      state.userId = null;
      state.accessToken = null;
      state.expiresAt = null;
      state.refreshToken = null;
    },
    initialized(state) {
      state.isInitialized = true;
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;

const matchAuthSuccess = isAnyOf(
  api.endpoints.refreshAuthToken.matchFulfilled,
  api.endpoints.signIn.matchFulfilled
);

export const authMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const dispatch = store.dispatch as AppDispatch;
    if (matchAuthSuccess(action)) {
      localStorage.setItem("auth", JSON.stringify(action.payload));
      dispatch(authActions.setUser(action.payload));
    }

    if (api.endpoints.refreshAuthToken.matchRejected(action)) {
      dispatch(authActions.logout());
    }

    if (authActions.logout.match(action)) {
      localStorage.removeItem("auth");
      dispatch(api.endpoints.logout.initiate());
    }

    return next(action);
  };
