import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../modules/core/services';
import { BehaviorSubject } from 'rxjs';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  noAuth?: boolean;
  hidden?: boolean;
}

export const ROUTES: RouteInfo[] = [
  {
    path: '/auth/login',
    title: 'Login',
    class: '',
    noAuth: true,
    hidden: true,
    icon: '',
  },
  {
    path: '/auth/register',
    title: 'Register',
    class: '',
    noAuth: true,
    hidden: true,
    icon: '',
  },
  {
    path: '/auth/recovery',
    title: 'Recovery',
    class: '',
    noAuth: true,
    hidden: true,
    icon: '',
  },
  {
    path: '/auth/reset',
    title: 'Reset',
    class: '',
    noAuth: true,
    hidden: true,
    icon: '',
  },
  {
    path: '/welcome',
    title: 'Welcome',
    icon: 'nc-bank',
    class: '',
    noAuth: true,
  },
  {
    path: '/wallets',
    title: 'Wallets',
    icon: 'nc-bank',
    class: '',
  },
  {
    path: '/transactions',
    title: 'Transactions',
    icon: 'nc-money-coins',
    class: '',
  },
  {
    path: '/search',
    title: 'Search',
    icon: 'nc-zoom-split',
    class: '',
  },
  { path: '/user', title: 'Profile', icon: 'nc-single-02', class: '' },
];

@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  constructor(public authService: AuthenticationService) {}

  public menuItems$ = new BehaviorSubject<any[]>([]);
  ngOnInit() {
    this.authService.currentUser$.subscribe(() => {
      this.menuItems$.next(
        this.authService.isAuthorized
          ? ROUTES.filter((x) => !x.noAuth && !x.hidden)
          : ROUTES.filter((x) => x.noAuth && !x.hidden)
      );
    });
  }
}
