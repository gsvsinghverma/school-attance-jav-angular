import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div *ngIf="isLoggedIn; else loginView">
      <nav class="navbar">
        <div class="nav-brand">&#127979; School Attendance System</div>
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/students" routerLinkActive="active">Students</a>
          <a routerLink="/attendance" routerLinkActive="active">Attendance</a>
        </div>
        <div class="nav-user">
          <span>{{currentUser?.fullName}}</span>
          <span class="role-badge">{{currentUser?.role}}</span>
          <button (click)="logout()">Logout</button>
        </div>
      </nav>
      <main class="main-content"><router-outlet></router-outlet></main>
    </div>
    <ng-template #loginView><router-outlet></router-outlet></ng-template>
  `,
  styles: [`
    .navbar{background:linear-gradient(135deg,#1e3a5f,#3b82f6);color:white;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:60px;box-shadow:0 2px 8px rgba(0,0,0,0.2);}
    .nav-brand{font-size:18px;font-weight:700;}
    .nav-links{display:flex;gap:4px;}
    .nav-links a{color:rgba(255,255,255,0.85);text-decoration:none;padding:8px 16px;border-radius:6px;transition:all 0.2s;font-size:14px;}
    .nav-links a:hover,.nav-links a.active{background:rgba(255,255,255,0.2);color:white;}
    .nav-user{display:flex;align-items:center;gap:10px;font-size:14px;}
    .role-badge{background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:12px;font-size:12px;}
    .nav-user button{background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3);padding:6px 14px;border-radius:6px;cursor:pointer;}
    .nav-user button:hover{background:rgba(255,255,255,0.3);}
    .main-content{padding:24px;min-height:calc(100vh - 60px);}
  `]
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any = null;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      if (!user && !this.router.url.includes('/login')) this.router.navigate(['/login']);
    });
  }
  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}
