import { createSlice } from "@reduxjs/toolkit";

type BGTransaction = {
  id: string;
  boardgame: string;
  date: string;
  type: "BUY" | "SELL" | "SWAP-S" | "SWAP-B";
  amount: number;
  notes?: string;
};

type Income = {
  id: string;
  date: string;
  type: "INCOME";
  amount: number;
  notes?: string;
};

export type Transaction = BGTransaction | Income;

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
    id: "004",
    boardgame: "Coimbra",
    date: "2021-10-10",
    type: "SWAP-B",
    amount: 0,
  },
  {
    id: "005",
    boardgame: "Le Havre",
    date: "2021-10-10",
    type: "SWAP-S",
    amount: 0,
  },
];

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    value: dummyData,
  },
  reducers: {},
});

export const transactionsReducer = transactionsSlice.reducer;
