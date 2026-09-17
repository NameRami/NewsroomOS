import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  mode: 'login' | 'signup' = 'login';

  name = '';
  email = '';
  password = '';

  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  toggleMode() {
    this.error = '';
    this.mode = this.mode === 'login' ? 'signup' : 'login';
  }

  submit() {
    this.error = '';
    this.loading = true;

    const req =
      this.mode === 'signup'
        ? this.auth.signup(this.name, this.email, this.password)
        : this.auth.login(this.email, this.password);

    req.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Something went wrong';
      },
    });
  }
}
