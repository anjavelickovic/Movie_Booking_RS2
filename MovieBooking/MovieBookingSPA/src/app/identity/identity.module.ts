import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IdentityRoutingModule } from './identity-routing.module';
import { IdentityComponent } from './identity.component';
import { LoginFormComponent } from './feature-authentication/login-form/login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterFormComponent } from './feature-authentication/register-form/register-form.component';


@NgModule({
  declarations: [
    IdentityComponent,
    LoginFormComponent,
    RegisterFormComponent
  ],
  imports: [
    CommonModule,
    IdentityRoutingModule,
    ReactiveFormsModule
  ]
})
export class IdentityModule { }