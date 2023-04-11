import { ECurrency } from '../enums';

export interface CreateWalletCommand {
  currency: ECurrency;
  name: string;
  balance: number;
  isDefault: boolean;
}
