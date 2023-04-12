export interface CreateTransactionCommand {
  walletId: number;
  amount: number;
  description: string;
  categoryId: number;
  date: Date;
}
