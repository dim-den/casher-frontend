import { BaseModel } from './base-model';
import { ECurrency } from '../enums';

export interface WalletOverview extends BaseModel {
  balance: number;
  currencyId: ECurrency;
  name: string;
  isDefault: boolean;
}
