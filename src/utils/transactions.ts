import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

const baseTransactionValidator = z.object({
  date: z.string(),
  amount: z.number(),
  notes: z.string().optional(),
});

export const newTransactionValidator = z.discriminatedUnion("type", [
  z.object({ type: z.literal("INCOME") }).merge(baseTransactionValidator),
  z
    .object({
      type: z.literal("SWAP"),
      boardgame: z.string(),
      boardgameSent: z.string(),
    })
    .merge(baseTransactionValidator),
  z
    .object({
      type: z.literal("BUY"),
      boardgame: z.string(),
    })
    .merge(baseTransactionValidator),
  z
    .object({
      type: z.literal("SELL"),
      boardgame: z.string(),
    })
    .merge(baseTransactionValidator),
]);

export type NewTransactionInput = z.infer<typeof newTransactionValidator>;
export type Transaction = NewTransactionInput & { id: string };

const dummyData: Transaction[] = [
  {
    id: "003",
    date: "2022-01-01",
    type: "INCOME",
    amount: 5000,
    notes: "Budget addition for new year",
  },
  {
    id: "001",
    boardgame: "Maracaibo",
    date: "2022-09-16",
    type: "BUY",
    amount: 201.3,
    notes: "First edition, ENG version, used but complete, bought on OLX",
  },
  {
    id: "002",
    boardgame: "Massive Darkness 2",
    date: "2022-08-16",
    type: "SELL",
    amount: 1482,
  },
  {
    id: "005",
    boardgame: "Coimbra",
    boardgameSent: "Le Havre",
    date: "2021-10-10",
    type: "SWAP",
    amount: 0,
  },
];

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    value: dummyData,
  },
  reducers: {
    add: {
      reducer(state, action: PayloadAction<Transaction>) {
        const { payload } = action;
        state.value.push(payload);
      },
      prepare(data: NewTransactionInput) {
        return { payload: { ...data, id: nanoid() } };
      },
    },
  },
});

export const transactionsReducer = transactionsSlice.reducer;
export const transactionsActions = transactionsSlice.actions;
