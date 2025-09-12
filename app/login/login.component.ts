import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.loginForm.invalid) return;

  const payload = {
  email: this.loginForm.value.email, // use email instead of username
  password: this.loginForm.value.password
};

    this.http.post<any>('http://localhost:4040/login', payload, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (res) => {
        this.auth.setToken(res.data); // store JWT

        const role = this.auth.getRole();
        if (role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else if (role === 'USER') {
          this.router.navigate(['/landingpage']);
        } else {
          this.errorMsg = 'Unknown role, cannot login';
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.errorMsg = 'Invalid email or password';
        } else {
          this.errorMsg = 'Login failed. Please try again later';
        }
        console.error('Login failed', err);
      }
    });
  }
}
