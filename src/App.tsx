import clsx from "clsx";

type BGItem = {
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

type Item = BGItem | Income;

const dummyData: Item[] = [
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

function TransactionItem(props: { item: Item }) {
  const { item } = props;

  if (item.type === "INCOME") {
    return (
      <div className="w-full bg-white border-b text-sm text-center my-2 py-4 font-medium text-gray-900">
        NEW MONIEZ: {item.amount} 🎉
      </div>
    );
  }

  return (
    <div className="grid grid-cols-table bg-white border-b text-sm">
      <div className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
        {item.boardgame}
      </div>
      <div className="py-4 px-6">{item.date}</div>
      <div className="py-4 px-6 text-center">
        <span
          className={clsx({
            "py-2 px-4 rounded": true,
            "bg-green-300": item.type === "SELL",
            "bg-red-500 text-white": item.type === "BUY",
            "bg-yellow-200": item.type === "SWAP-B" || item.type === "SWAP-S",
          })}
        >
          {item.type}
        </span>
      </div>
      <div className="py-4 px-6">{item.amount}</div>
    </div>
  );
}

function App() {
  return (
    <div className="bg-sky-100 h-screen w-screen items-center flex flex-col p-10">
      <h1 className="text-4xl">BG Transactions</h1>
      <div className="w-10/12 rounded-xl overflow-x-auto shadow-sm mt-10">
        <div className="w-full grid grid-cols-table text-xs text-gray-700 uppercase bg-gray-50">
          <div className="py-3 px-6">Boardgame</div>
          <div className="py-3 px-6">Date</div>
          <div className="py-3 px-6 text-center">Type</div>
          <div className="py-3 px-6">Amount</div>
        </div>
        {dummyData.map((item) => (
          <TransactionItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default App;
