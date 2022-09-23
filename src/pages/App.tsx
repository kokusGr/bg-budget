import clsx from "clsx";
import { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  NewTransactionInput,
  newTransactionValidator,
  Transaction,
  TransactionFields,
} from "@/utils/transactions";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import {
  useAddTransactionMutation,
  useGetTransactionsQuery,
  useSignInMutation,
} from "@/utils/api";
import { authActions, SignInParams, signInParamsValidator } from "@/utils/auth";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";

function formatTransactionAmount(tr: Transaction) {
  const prefix = (() => {
    if (tr.type === "BUY") return "-";
    if (tr.type === "SELL") return "+";
    return "";
  })();

  return `${prefix}${tr.amount} PLN`;
}

function TransactionItem(props: { transaction: Transaction }) {
  const { transaction } = props;

  if (transaction.type === "INCOME") {
    return (
      <div className="w-full bg-white border-b text-sm text-center my-2 py-4 font-medium text-gray-900">
        NEW MONIEZ: {transaction.amount} 🎉
      </div>
    );
  }

  return (
    <div className="grid grid-cols-table bg-white border-b text-sm">
      <div className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
        {transaction.type === "SWAP" && `${transaction.boardgame_sent}  ==> `}
        {transaction.boardgame}
      </div>
      <div className="py-4 px-6">{transaction.date}</div>
      <div className="py-4 px-6 text-center">
        <span
          className={clsx({
            "py-2 px-4 rounded": true,
            "bg-green-300": transaction.type === "BUY",
            "bg-red-400 text-white": transaction.type === "SELL",
            "bg-yellow-200": transaction.type === "SWAP",
          })}
        >
          {transaction.type}
        </span>
      </div>
      <div className="py-4 px-6">{formatTransactionAmount(transaction)}</div>
    </div>
  );
}

const inputClassName = `block w-full p-2.5 bg-neutral-50 border border-gray-300 text-gray-900 text-sm rounded-lg
focus:ring-blue-500 focus:border-blue-500
disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed
`;

const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
    label: string;
  }
>((props, ref) => {
  const { label, error, ...inputProps } = props;

  return (
    <>
      <label
        htmlFor={inputProps.name}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        {...inputProps}
        ref={ref}
        id={inputProps.name}
        className={inputClassName}
      />
      {error && <div className="text-sm text-red-500 pt-2">{error}</div>}
    </>
  );
});

const getInitialDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const dayFormatted = day < 10 ? `0${day}` : day;
  const monthFormatted = month < 10 ? `0${month}` : month;

  return `${year}-${monthFormatted}-${dayFormatted}`;
};

function NewTransactionModal(props: { onHide: () => void }) {
  const { onHide } = props;

  const [addTransaction, { isLoading, error }] = useAddTransactionMutation();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFields>({
    resolver: zodResolver(newTransactionValidator),
  });

  const type = watch("type");

  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 z-50">
      <div className="bg-gray-900 w-full h-full opacity-70" onClick={onHide} />
      <div className="bg-white absolute top-10 left-1/2 -translate-x-1/2 py-6 w-[34rem] rounded-lg shadow ">
        <div className="flex justify-between border-b border-gray-300 pb-4 px-7">
          <h3 className="text-xl text-gray-900">Add new transaction</h3>
          <button
            type="button"
            className="bg-transparent text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition rounded"
            onClick={onHide}
          >
            <svg
              aria-hidden={true}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <form
          className="space-y-6 pt-4 pb-2 px-7"
          onSubmit={handleSubmit((data) => {
            addTransaction(data);
          })}
        >
          <div>
            <label
              htmlFor="type"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Select type
            </label>
            <select
              {...register("type")}
              defaultValue="BUY"
              disabled={isLoading}
              id="type"
              className={inputClassName}
            >
              <option value="BUY">Buy</option>
              <option value="INCOME">Income</option>
              <option value="SELL">Sell</option>
              <option value="SWAP">Swap</option>
            </select>
            {errors.type?.message && (
              <div className="text-sm text-red-500 pt-2">
                {errors.type.message}
              </div>
            )}
          </div>
          {type !== "INCOME" && (
            <div>
              <Input
                type="text"
                label={`Boardgame ${type === "SWAP" ? "received" : ""}`}
                disabled={isLoading}
                placeholder="Massive Darkness 2"
                error={errors.boardgame?.message}
                {...register("boardgame")}
              />
            </div>
          )}
          {type === "SWAP" && (
            <div>
              <Input
                type="text"
                label="Boardgame sent"
                disabled={isLoading}
                placeholder="Imperium Antyk"
                error={errors.boardgame_sent?.message}
                {...register("boardgame_sent")}
              />
            </div>
          )}
          <div>
            <Input
              type="date"
              label="Date"
              disabled={isLoading}
              error={errors.date?.message}
              defaultValue={getInitialDate()}
              {...register("date")}
            />
          </div>
          <div>
            <Input
              type="number"
              label="Amount (in PLN)"
              disabled={isLoading}
              error={errors.amount?.message}
              placeholder="200"
              {...register("amount", { valueAsNumber: true })}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">
              Something went wrong. Please try again later.
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center items-center w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Save
            {isLoading && (
              <div className="h-5 w-5 ml-3 border-2 border-cyan-300 border-l-transparent border-b-transparent rounded-full animate-spin"></div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function TransactionsList() {
  const [isAddingNewTransaction, setIsAddingNewTransaction] = useState(false);
  const { data = [], isLoading, error } = useGetTransactionsQuery();
  const dispatch = useAppDispatch();

  if (isLoading) return <Loading />;

  return (
    <div className="bg-sky-100 h-screen w-screen items-center flex flex-col p-10 pb-0">
      <div className="w-10/12 relative flex items-center justify-center mb-8">
        <h1 className="text-4xl mr-6">BG Transactions</h1>
        <button
          className="py-2 px-4 flex items-center justify-center bg-white rounded-lg shadow-md"
          onClick={() => setIsAddingNewTransaction(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          className="py-2 px-4 flex items-center justify-center bg-white rounded-lg shadow-md absolute right-0"
          onClick={() => dispatch(authActions.logout())}
        >
          Log out
        </button>
      </div>
      <div className="w-10/12 relative overflow-x-auto pb-10">
        <div className="rounded-xl shadow-sm overflow-hidden">
          <div className="w-full grid grid-cols-table text-xs bg-gray-50 text-gray-700 uppercase">
            <div className="py-3 px-6">Boardgame</div>
            <div className="py-3 px-6">Date</div>
            <div className="py-3 px-6 text-center">Type</div>
            <div className="py-3 px-6">Amount</div>
          </div>
          {data.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
      {isAddingNewTransaction && (
        <NewTransactionModal onHide={() => setIsAddingNewTransaction(false)} />
      )}
    </div>
  );
}

function hasErrorMessage(data: unknown): data is { error: string } {
  try {
    const { error } = data as any;
    return typeof error === "string";
  } catch (err) {
    return false;
  }
}
const formatError = (error: FetchBaseQueryError | SerializedError) => {
  if (
    "status" in error &&
    error.status === 400 &&
    hasErrorMessage(error.data) &&
    error.data.error === "invalid_grant"
  ) {
    return "Invalid login credentials. Please check your email and password.";
  }

  return "Something went wrong. Please try again later.";
};

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInParams>({
    resolver: zodResolver(signInParamsValidator),
  });
  const [signIn, { isLoading, error }] = useSignInMutation();

  return (
    <div className="bg-sky-100 h-screen w-screen flex items-center justify-center">
      <div className="bg-white w-10/12 max-w-md rounded shadow-sm p-6">
        <div className="border-b border-gray-300 pb-4">
          <h3>Login to use the app</h3>
        </div>
        <form
          className="space-y-6 pt-4"
          onSubmit={handleSubmit((data) => signIn(data))}
        >
          <div>
            <Input
              type="email"
              label="Email"
              placeholder="your.email@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
          <div>
            <Input
              type="password"
              label="Password"
              placeholder="*******"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">{formatError(error)}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center items-center w-full px-5 py-3 text-white bg-blue-600 hover:bg-blue-700
              focus:ring-blue-800 focus:ring-4 focus:outline-none
              disabled:bg-blue-800 disabled:hover:bg-blue-800 disabled:text-gray-400"
          >
            Log in
            {isLoading && (
              <div className="h-5 w-5 ml-3 border-2 border-cyan-300 border-l-transparent border-b-transparent rounded-full animate-spin"></div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="bg-sky-100 h-screen w-screen flex items-center justify-center">
      Loading…
    </div>
  );
}

function App() {
  const user = useAppSelector((state) => state.auth.userId);
  const isAuthInitialized = useAppSelector((state) => state.auth.isInitialized);

  if (!isAuthInitialized) return <Loading />;

  if (!user) return <Login />;

  return <TransactionsList />;
}

export default App;
