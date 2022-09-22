import { z } from "zod";

const baseTransactionValidator = z.object({
  date: z.string(),
  amount: z.number(),
});

export const newTransactionValidator = z.discriminatedUnion("type", [
  z.object({ type: z.literal("INCOME") }).merge(baseTransactionValidator),
  z
    .object({
      type: z.literal("SWAP"),
      boardgame: z.string(),
      boardgame_sent: z.string(),
      amount_sent: z.number(),
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

export const transactionValidator = newTransactionValidator.and(
  z.object({ id: z.string().min(1) })
);

export type Transaction = z.infer<typeof transactionValidator>;
