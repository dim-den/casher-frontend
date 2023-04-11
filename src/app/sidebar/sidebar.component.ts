import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../modules/core/services';
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
  { path: '/dashboard', title: 'Dashboard', icon: 'nc-bank', class: '' },
  { path: '/icons', title: 'Icons', icon: 'nc-diamond', class: '' },
  { path: '/maps', title: 'Maps', icon: 'nc-pin-3', class: '' },
  {
    path: '/notifications',
    title: 'Notifications',
    icon: 'nc-bell-55',
    class: '',
  },
  { path: '/user', title: 'User Profile', icon: 'nc-single-02', class: '' },
  { path: '/table', title: 'Table List', icon: 'nc-tile-56', class: '' },
  {
    path: '/typography',
    title: 'Typography',
    icon: 'nc-caps-small',
    class: '',
  },
  {
    path: '/upgrade',
    title: 'Upgrade to PRO',
    icon: 'nc-spaceship',
    class: 'active-pro',
  },
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
