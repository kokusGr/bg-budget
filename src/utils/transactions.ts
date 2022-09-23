import { z } from "zod";

const amount = z
  .number({ invalid_type_error: "Amount cannot be empty " })
  .nonnegative({ message: "Amount cannot be negative" });

const boardgame = z
  .string()
  .min(1, { message: "Boardgame name cannot be empty" })
  .max(255, {
    message: "Boardgame name cannot be longer than 255 characters",
  });

const baseTransactionValidator = z.object({
  date: z.string(),
  amount,
});

const incomeTransaction = z
  .object({ type: z.literal("INCOME") })
  .merge(baseTransactionValidator);
const swapTransaction = z
  .object({
    type: z.literal("SWAP"),
    boardgame,
    boardgame_sent: boardgame,
    amount_sent: amount,
  })
  .merge(baseTransactionValidator);
const buyTransaction = z
  .object({
    type: z.literal("BUY"),
    boardgame,
  })
  .merge(baseTransactionValidator);
const sellTransaction = z
  .object({
    type: z.literal("SELL"),
    boardgame,
  })
  .merge(baseTransactionValidator);

export const newTransactionValidator = z.discriminatedUnion("type", [
  incomeTransaction,
  swapTransaction,
  buyTransaction,
  sellTransaction,
]);

export type NewTransactionInput = z.infer<typeof newTransactionValidator>;

export const transactionValidator = newTransactionValidator.and(
  z.object({ id: z.string().min(1) })
);
export type Transaction = z.infer<typeof transactionValidator>;

const transactionFields = incomeTransaction
  .merge(swapTransaction)
  .merge(buyTransaction)
  .merge(sellTransaction)
  .omit({ type: true })
  .extend({ type: z.enum(["SELL", "INCOME", "BUY", "SWAP"]) });
export type TransactionFields = z.infer<typeof transactionFields>;
