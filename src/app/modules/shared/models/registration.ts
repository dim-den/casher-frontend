import { ECurrency } from '../enums';

export interface Registration {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  walletCurrencyId: ECurrency;
  walletBalance: number;
}
