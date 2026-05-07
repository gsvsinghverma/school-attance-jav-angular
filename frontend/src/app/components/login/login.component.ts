import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">&#127979;</div>
          <h1>School Attendance System</h1>
          <p>Sign in to your account</p>
        </div>
        <div class="tab-buttons">
          <button [class.active]="mode==='login'" (click)="mode='login'">Login</button>
          <button [class.active]="mode==='signup'" (click)="mode='signup'">Sign Up</button>
        </div>
        <div *ngIf="error" class="alert alert-danger">{{error}}</div>
        <div *ngIf="success" class="alert alert-success">{{success}}</div>

        <div *ngIf="mode==='login'" class="form-section">
          <div class="form-group">
            <label>Username</label>
            <input class="form-control" [(ngModel)]="loginData.username" placeholder="Enter username" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input class="form-control" type="password" [(ngModel)]="loginData.password" placeholder="Enter password" (keyup.enter)="login()" />
          </div>
          <button class="btn btn-primary full-width" (click)="login()" [disabled]="loading">
            {{loading ? 'Signing in...' : 'Sign In'}}
          </button>
          <div class="demo-creds">
            <p>Demo Credentials:</p>
            <div class="demo-btns">
              <button (click)="fillAdmin()">Admin (admin/admin123)</button>
              <button (click)="fillTeacher()">Teacher (teacher1/teacher123)</button>
            </div>
          </div>
        </div>

        <div *ngIf="mode==='signup'" class="form-section">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name</label>
              <input class="form-control" [(ngModel)]="signupData.fullName" placeholder="Full name" />
            </div>
            <div class="form-group">
              <label>Username</label>
              <input class="form-control" [(ngModel)]="signupData.username" placeholder="Username" />
            </div>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input class="form-control" type="email" [(ngModel)]="signupData.email" placeholder="Email address" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Password</label>
              <input class="form-control" type="password" [(ngModel)]="signupData.password" placeholder="Password" />
            </div>
            <div class="form-group">
              <label>Role</label>
              <select class="form-control" [(ngModel)]="signupData.role">
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <button class="btn btn-success full-width" (click)="signup()" [disabled]="loading">
            {{loading ? 'Creating...' : 'Create Account'}}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1e3a5f 0%,#3b82f6 50%,#60a5fa 100%);}
    .login-card{background:white;border-radius:16px;padding:40px;width:100%;max-width:480px;box-shadow:0 20px 60px rgba(0,0,0,0.3);}
    .login-header{text-align:center;margin-bottom:24px;}
    .logo{font-size:48px;margin-bottom:8px;}
    .login-header h1{font-size:22px;font-weight:700;color:#1e3a5f;margin-bottom:4px;}
    .login-header p{color:#888;font-size:14px;}
    .tab-buttons{display:flex;margin-bottom:24px;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;}
    .tab-buttons button{flex:1;padding:10px;border:none;background:#f5f5f5;cursor:pointer;font-size:14px;transition:all 0.2s;}
    .tab-buttons button.active{background:#3b82f6;color:white;font-weight:600;}
    .form-section{}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
    .full-width{width:100%;padding:12px;font-size:16px;margin-top:8px;}
    .demo-creds{margin-top:16px;padding:12px;background:#f8fafc;border-radius:8px;text-align:center;}
    .demo-creds p{font-size:12px;color:#888;margin-bottom:8px;}
    .demo-btns{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;}
    .demo-btns button{padding:6px 12px;border:1px solid #ddd;border-radius:6px;background:white;cursor:pointer;font-size:12px;transition:all 0.2s;}
    .demo-btns button:hover{background:#3b82f6;color:white;border-color:#3b82f6;}
  `]
})
export class LoginComponent {
  mode = 'login';
  loading = false;
  error = '';
  success = '';
  loginData = { username: '', password: '' };
  signupData = { username: '', password: '', email: '', fullName: '', role: 'STUDENT' };

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) this.router.navigate(['/dashboard']);
  }

  login() {
    this.error = ''; this.loading = true;
    this.authService.login(this.loginData.username, this.loginData.password).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/dashboard']); },
      error: (e: any) => { this.loading = false; this.error = e.error?.message || 'Invalid username or password!'; }
    });
  }

  signup() {
    this.error = ''; this.loading = true;
    this.authService.signup(this.signupData).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/dashboard']); },
      error: (e: any) => { this.loading = false; this.error = e.error?.message || 'Signup failed!'; }
    });
  }

  fillAdmin() { this.loginData = { username: 'admin', password: 'admin123' }; }
  fillTeacher() { this.loginData = { username: 'teacher1', password: 'teacher123' }; }
}
