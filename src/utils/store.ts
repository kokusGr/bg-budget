import { configureStore, createSlice } from "@reduxjs/toolkit";

import { transactionsReducer } from "@/utils/transactions";
import { authReducer } from "@/utils/auth";
import apiSlice from "@/utils/api";

const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
