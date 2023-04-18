import { BaseModel } from './base-model';
import { CategoryInfo } from './category-info';
import { WalletOverview } from './wallet-overview';

export interface WalletLimitationOverview extends BaseModel {
  amount: number;
  category: CategoryInfo;
  wallet: WalletOverview;
  currentMonthSpent: number;
}
