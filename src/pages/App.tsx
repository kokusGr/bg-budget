import clsx from "clsx";

import { Transaction } from "@/utils/transactions";
import { useAppSelector } from "@/utils/hooks";

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
        {transaction.boardgame}
      </div>
      <div className="py-4 px-6">{transaction.date}</div>
      <div className="py-4 px-6 text-center">
        <span
          className={clsx({
            "py-2 px-4 rounded": true,
            "bg-green-300": transaction.type === "SELL",
            "bg-red-500 text-white": transaction.type === "BUY",
            "bg-yellow-200":
              transaction.type === "SWAP-B" || transaction.type === "SWAP-S",
          })}
        >
          {transaction.type}
        </span>
      </div>
      <div className="py-4 px-6">{transaction.amount}</div>
    </div>
  );
}

function App() {
  const transactions = useAppSelector((state) => state.transactions.value);

  return (
    <div className="bg-sky-100 h-screen w-screen items-center flex flex-col p-10 pb-0">
      <h1 className="text-4xl">BG Transactions</h1>
      <div className="w-10/12 overflow-x-auto mt-10 pb-10">
        <div className="rounded-xl shadow-sm overflow-hidden">
          <div className="w-full grid grid-cols-table text-xs bg-gray-50 text-gray-700 uppercase">
            <div className="py-3 px-6">Boardgame</div>
            <div className="py-3 px-6">Date</div>
            <div className="py-3 px-6 text-center">Type</div>
            <div className="py-3 px-6">Amount</div>
          </div>
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
