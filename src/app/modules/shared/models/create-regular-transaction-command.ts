import { EPeriodicityType } from '../enums/eperiodicity-type';

export interface CreateRegularTransactionCommand {
  walletId: number;
  amount: number;
  description: string;
  categoryId: number;
  start: Date;
  periodicityType: EPeriodicityType;
}
