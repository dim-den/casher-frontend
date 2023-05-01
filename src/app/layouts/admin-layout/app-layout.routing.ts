import { Route, Routes } from '@angular/router';

import { UserComponent } from '../../pages/user/user.component';
import { WelcomeComponent } from '../../pages/welcome/welcome.component';
import { AuthGuard } from '../../modules/core/guards';
import { WalletsComponent } from '../../pages/wallets/wallets.component';
import { TransactionsComponent } from '../../pages/transactions/transactions.component';
import { SearchComponent } from '../../pages/search/search.component';

export const CommonRoutes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('../../modules/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
];

export const AuthRoutes: Routes = [
  {
    path: 'wallets',
    component: WalletsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [AuthGuard],
  },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
];
