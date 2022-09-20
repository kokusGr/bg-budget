import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { transactionsReducer } from "@/utils/transactions";
import { authReducer, authMiddleware } from "@/utils/auth";
import apiSlice from "@/utils/api";

const rootReducer = combineReducers({
  transactions: transactionsReducer,
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(apiSlice.middleware, authMiddleware);
  },
});

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
