import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { AttendanceService } from '../../services/attendance.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h2>Dashboard</h2>
      <p>Welcome back, <strong>{{user?.fullName}}</strong> ({{user?.role}})</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="stat-icon">&#128100;</div>
        <div><div class="stat-value">{{totalStudents}}</div><div class="stat-label">Total Students</div></div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon">&#9989;</div>
        <div><div class="stat-value">{{activeStudents}}</div><div class="stat-label">Active Students</div></div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon">&#128197;</div>
        <div><div class="stat-value">{{todayPresent}}</div><div class="stat-label">Present Today</div></div>
      </div>
      <div class="stat-card red">
        <div class="stat-icon">&#10060;</div>
        <div><div class="stat-value">{{todayAbsent}}</div><div class="stat-label">Absent Today</div></div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <h3>Quick Actions</h3>
        <div class="action-list">
          <a routerLink="/attendance" class="action-item blue-bg">Mark Today's Attendance</a>
          <a routerLink="/students" class="action-item green-bg">Add New Student</a>
          <a routerLink="/attendance" class="action-item orange-bg">View Attendance Report</a>
        </div>
      </div>
      <div class="card">
        <h3>Today's Summary</h3>
        <p class="date-text">{{today}}</p>
        <div *ngIf="todayRecords.length === 0" style="text-align:center;padding:20px;color:#888">
          <p>No attendance marked yet</p>
          <a routerLink="/attendance" class="btn btn-primary btn-sm" style="margin-top:8px;display:inline-block">Mark Now</a>
        </div>
        <div *ngIf="todayRecords.length > 0">
          <div class="prog-wrap">
            <div class="prog-labels"><span>Present Rate</span><span>{{presentRate}}%</span></div>
            <div class="prog-bar"><div class="prog-fill" [style.width]="presentRate+'%'"></div></div>
          </div>
          <div class="breakdown">
            <span class="badge badge-success">Present: {{todayPresent}}</span>
            <span class="badge badge-danger">Absent: {{todayAbsent}}</span>
            <span class="badge badge-warning">Late: {{todayLate}}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>Recent Attendance Records</h3>
      <div *ngIf="loading" class="spinner"></div>
      <table *ngIf="!loading && todayRecords.length > 0">
        <thead><tr><th>Student</th><th>Roll No.</th><th>Class</th><th>Status</th><th>Marked By</th></tr></thead>
        <tbody>
          <tr *ngFor="let r of todayRecords.slice(0,10)">
            <td>{{r.studentName}}</td>
            <td>{{r.rollNumber}}</td>
            <td>{{r.className}} {{r.section}}</td>
            <td><span class="badge" [class]="badge(r.status)">{{r.status}}</span></td>
            <td>{{r.markedBy || 'N/A'}}</td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="!loading && todayRecords.length === 0" style="text-align:center;color:#888;padding:20px">No records for today yet</p>
    </div>
  `,
  styles: [`
    .page-header{margin-bottom:24px;}
    .page-header h2{font-size:24px;font-weight:700;color:#1e3a5f;}
    .page-header p{color:#888;margin-top:4px;}
    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;}
    .stat-card{background:white;border-radius:12px;padding:20px;display:flex;align-items:center;gap:16px;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-left:4px solid;}
    .stat-card.blue{border-color:#3b82f6;}.stat-card.green{border-color:#10b981;}.stat-card.orange{border-color:#f59e0b;}.stat-card.red{border-color:#ef4444;}
    .stat-icon{font-size:28px;}
    .stat-value{font-size:28px;font-weight:700;color:#1e3a5f;}
    .stat-label{font-size:13px;color:#888;}
    .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;}
    .action-list{display:flex;flex-direction:column;gap:10px;margin-top:16px;}
    .action-item{display:block;padding:12px 16px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;transition:all 0.2s;}
    .blue-bg{background:#eff6ff;color:#1d4ed8;}.blue-bg:hover{background:#dbeafe;}
    .green-bg{background:#f0fdf4;color:#166534;}.green-bg:hover{background:#dcfce7;}
    .orange-bg{background:#fffbeb;color:#92400e;}.orange-bg:hover{background:#fef3c7;}
    .date-text{color:#888;font-size:13px;margin-bottom:16px;}
    .prog-wrap{margin-bottom:12px;}
    .prog-labels{display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;font-weight:500;}
    .prog-bar{background:#e5e7eb;border-radius:8px;height:10px;}
    .prog-fill{background:linear-gradient(90deg,#10b981,#3b82f6);border-radius:8px;height:100%;transition:width 0.5s;}
    .breakdown{display:flex;gap:8px;flex-wrap:wrap;}
  `]
})
export class DashboardComponent implements OnInit {
  user: any = null;
  totalStudents = 0; activeStudents = 0;
  todayRecords: any[] = [];
  todayPresent = 0; todayAbsent = 0; todayLate = 0;
  presentRate = 0; loading = true;
  today = new Date().toLocaleDateString('en-IN', {weekday:'long',year:'numeric',month:'long',day:'numeric'});

  constructor(private studentSvc: StudentService, private attendanceSvc: AttendanceService, private authSvc: AuthService) {}

  ngOnInit() {
    this.user = this.authSvc.getCurrentUser();
    this.studentSvc.getAll().subscribe(s => {
      this.totalStudents = s.length;
      this.activeStudents = s.filter(x => x.status === 'ACTIVE').length;
    });
    this.attendanceSvc.getToday().subscribe({
      next: records => {
        this.todayRecords = records;
        this.todayPresent = records.filter(r => r.status === 'PRESENT').length;
        this.todayAbsent = records.filter(r => r.status === 'ABSENT').length;
        this.todayLate = records.filter(r => r.status === 'LATE').length;
        this.presentRate = records.length ? Math.round((this.todayPresent + this.todayLate) / records.length * 100) : 0;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  badge(status: string): string {
    const m: any = {PRESENT:'badge-success',ABSENT:'badge-danger',LATE:'badge-warning',HALF_DAY:'badge-info'};
    return m[status] || 'badge-info';
  }
}
