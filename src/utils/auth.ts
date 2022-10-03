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

const VALIDATION_BUFFER = 1000 * 60;

export async function restoreUserSession(dispatch: AppDispatch) {
  const auth = getPersistedAuth();
  if (!auth) {
    dispatch(authActions.initialized());
    return;
  }

  if (auth.expiresAt && auth.expiresAt > Date.now() + VALIDATION_BUFFER) {
    dispatch(authActions.setUser(auth));
    return;
  }

  if (auth.refreshToken) {
    dispatch(api.endpoints.refreshAuthToken.initiate(auth.refreshToken));
    return;
  }

  dispatch(authActions.initialized());
  return;
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

let timer: number;

const scheduleTokenRefresh = (
  dispatch: AppDispatch,
  expiresAt: number
): void => {
  if (timer) {
    clearTimeout(timer);
  }

  const timeout = expiresAt - Date.now() - VALIDATION_BUFFER;

  timer = setTimeout(() => {
    const auth = getPersistedAuth();
    if (auth?.refreshToken) {
      dispatch(api.endpoints.refreshAuthToken.initiate(auth.refreshToken));
    } else {
      dispatch(authActions.logout());
    }
  }, timeout);
};

export const authMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const dispatch = store.dispatch as AppDispatch;
    if (matchAuthSuccess(action)) {
      const { expiresAt } = action.payload;
      localStorage.setItem("auth", JSON.stringify(action.payload));

      expiresAt && scheduleTokenRefresh(dispatch, expiresAt);
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

function getPersistedAuth(): AuthState | null {
  const auth = localStorage.getItem("auth");
  if (!auth) return null;

  try {
    const parsed = JSON.parse(auth);
    const validated = authStateValidator.parse(parsed);
    return validated;
  } catch (err) {
    return null;
  }
}
