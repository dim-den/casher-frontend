import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../modules/core/services';
import { ActivatedRoute, Router } from '@angular/router';

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
    void this.router.navigate(['auth', 'login']);
  }
}
