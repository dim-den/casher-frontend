export interface CategoryStat {
  categoryName: string;
  totalAmount: number;
}

export interface TransactionsByCategory {
  incomes: CategoryStat[];
  expenses: CategoryStat[];
}
