import { BaseModel } from './base-model';
import { CategoryInfo } from './category-info';

export interface TransactionSearch extends BaseModel {
  description: string;
  amount: number;
  date: Date;
  category: CategoryInfo;
  walletName: string;
}
