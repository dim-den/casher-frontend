import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layouts/admin-layout/app-layout.component';
import { AuthGuard } from './modules/core/guards';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./layouts/admin-layout/app-layout.module').then(
            (x) => x.AppLayoutModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
