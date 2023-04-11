import { Route, Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';
import { WelcomeComponent } from '../../pages/welcome/welcome.component';
import { AuthGuard } from '../../modules/core/guards';
import { WalletsComponent } from '../../pages/wallets/wallets.component';

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
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'wallets',
    component: WalletsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'table', component: TableComponent, canActivate: [AuthGuard] },
  {
    path: 'typography',
    component: TypographyComponent,
    canActivate: [AuthGuard],
  },
  { path: 'icons', component: IconsComponent, canActivate: [AuthGuard] },
  { path: 'maps', component: MapsComponent, canActivate: [AuthGuard] },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'upgrade', component: UpgradeComponent, canActivate: [AuthGuard] },
];
