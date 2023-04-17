import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgbCollapse, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResetPasswordEmailComponent } from './reset-password-email/reset-password-email.component';
import { RouterLink } from '@angular/router';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ResetPasswordEmailComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    FlexModule,
    MatFormFieldModule,
    MatSelectModule,
    NgbCollapse,
    NgbModule,
    RouterLink,
  ],
})
export class AuthenticationModule {}
