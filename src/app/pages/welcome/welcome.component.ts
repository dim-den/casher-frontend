import { Component } from '@angular/core';
import { AuthenticationService } from '../../modules/core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  constructor(
    private router: Router,
    public authService: AuthenticationService
  ) {}
  navigateToLogin() {
    void this.router.navigate(['auth', 'login']);
  }

  navigateToRegister() {
    void this.router.navigate(['auth', 'register']);
  }
}
