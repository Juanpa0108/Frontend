import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth_service } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  login_form!: FormGroup;
  private fb = inject(FormBuilder);
  private auth_service = inject(Auth_service)

  constructor() {}

  ngOnInit(): void {
    this.form_start();
  }

  form_start(){
    this.login_form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, Validators.requiredTrue]
    });
  }

  get email() { return this.login_form.get('email')!; }
  get password() { return this.login_form.get('password')!; }
  get terms() { return this.login_form.get('terms')!; }

  on_submit(): void {
    if (this.login_form.invalid) return;
    this.auth_service.login(this.login_form.value['email'], this.login_form.value['password']);
  }
}
