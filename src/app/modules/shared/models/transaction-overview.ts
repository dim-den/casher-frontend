import { BaseModel } from './base-model';
import { CategoryInfo } from './category-info';

export interface TransactionOverview extends BaseModel {
  description: string;
  amount: number;
  date: Date;
  category: CategoryInfo;
  isRegular: boolean;
}
