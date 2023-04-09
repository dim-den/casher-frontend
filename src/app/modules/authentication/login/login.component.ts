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
import { first } from 'rxjs';
import { Credential } from '../../shared/models/credential';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private fb: FormBuilder
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
      .subscribe(() => {
        this.navigateReturnUrl();
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
