import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../core/services';
import { first, take } from 'rxjs';
import { Credential } from '../../shared/models/credential';
import { NotificationService } from '../../core/services/notification.service';

export interface LoginFg {
  email: FormControl<string>;
  password: FormControl<string>;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup<LoginFg>;
  public errorMsg = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group<LoginFg>({
      email: this.fb.control(null, [Validators.required, Validators.email]),
      password: this.fb.control(null, [Validators.required]),
    });

    setTimeout(() => this.loginForm.updateValueAndValidity(), 1000);
  }

  navigateToRegistration() {
    void this.router.navigate(['auth', 'register']);
  }

  ngOnInit(): void {
    if (this.authService.isAuthorized) {
      //this.navigateReturnUrl();
    }
  }

  submit(): void {
    const value = this.loginForm.value as Credential;
    this.authService
      .signIn(value)
      .pipe(first())
      .subscribe((x) => {
        if ('Error' in x) {
          this.errorMsg = x.Error;

          this.loginForm.valueChanges
            .pipe(take(1))
            .subscribe(() => (this.errorMsg = null));
        } else {
          this.notificationService.showSuccess('Enjoy using app :)');
          this.navigateReturnUrl();
        }
      });
  }

  private get returnUrl(): string {
    return this.route.snapshot.queryParams.returnUrl as string;
  }

  private navigateReturnUrl() {
    const returnUrl = this.returnUrl || '/';
    void this.router.navigateByUrl(returnUrl);
  }
}
