import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService, Student } from '../../services/student.service';
import { AttendanceService, Attendance, AttendanceSummary } from '../../services/attendance.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="margin-bottom:20px"><h2 style="font-size:22px;font-weight:700;color:#1e3a5f">Attendance Management</h2><p style="color:#888;font-size:14px">Mark and view student attendance</p></div>

    <div *ngIf="success" class="alert alert-success">{{success}}</div>
    <div *ngIf="error" class="alert alert-danger">{{error}}</div>

    <div class="tabs">
      <button [class.active]="tab==='mark'" (click)="tab='mark'">Mark Attendance</button>
      <button [class.active]="tab==='view'" (click)="tab='view';loadView()">View Records</button>
      <button [class.active]="tab==='report'" (click)="tab='report'">Student Report</button>
    </div>

    <!-- MARK TAB -->
    <div *ngIf="tab==='mark'">
      <div class="card">
        <h3>Mark Class Attendance</h3>
        <div class="d-flex gap-2" style="flex-wrap:wrap;align-items:flex-end">
          <div class="form-group" style="flex:1;min-width:140px"><label>Class *</label><input class="form-control" [(ngModel)]="mf.className" placeholder="e.g. 10th" /></div>
          <div class="form-group" style="width:120px"><label>Section</label>
            <select class="form-control" [(ngModel)]="mf.section">
              <option value="">All</option><option value="A">A</option><option value="B">B</option><option value="C">C</option>
            </select>
          </div>
          <div class="form-group" style="width:180px"><label>Date</label><input class="form-control" type="date" [(ngModel)]="mf.date" /></div>
          <div class="form-group" style="align-self:flex-end"><button class="btn btn-primary" (click)="loadForMark()" [disabled]="!mf.className">Load Students</button></div>
        </div>
      </div>

      <div class="card" *ngIf="markItems.length > 0">
        <div class="d-flex justify-between align-center mb-3">
          <h3>{{mf.className}} {{mf.section}} — {{mf.date}}</h3>
          <div class="d-flex gap-2">
            <button class="btn btn-success btn-sm" (click)="markAll('PRESENT')">All Present</button>
            <button class="btn btn-danger btn-sm" (click)="markAll('ABSENT')">All Absent</button>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Roll No.</th><th>Name</th><th>Status</th><th>Remarks</th></tr></thead>
          <tbody>
            <tr *ngFor="let item of markItems; let i=index">
              <td>{{i+1}}</td>
              <td><strong>{{item.student.rollNumber}}</strong></td>
              <td>{{item.student.fullName}}</td>
              <td>
                <div class="status-btns">
                  <button [class.sp]="item.status==='PRESENT'" (click)="item.status='PRESENT'">Present</button>
                  <button [class.sa]="item.status==='ABSENT'" (click)="item.status='ABSENT'">Absent</button>
                  <button [class.sl]="item.status==='LATE'" (click)="item.status='LATE'">Late</button>
                  <button [class.sh]="item.status==='HALF_DAY'" (click)="item.status='HALF_DAY'">Half</button>
                </div>
              </td>
              <td><input class="form-control" [(ngModel)]="item.remarks" placeholder="Remark" style="width:150px" /></td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex gap-2 mt-3">
          <span class="badge badge-success">Present: {{cnt('PRESENT')}}</span>
          <span class="badge badge-danger">Absent: {{cnt('ABSENT')}}</span>
          <span class="badge badge-warning">Late: {{cnt('LATE')}}</span>
          <span class="badge badge-info">Half: {{cnt('HALF_DAY')}}</span>
        </div>
        <button class="btn btn-primary mt-3" (click)="submitBulk()" [disabled]="submitting">
          {{submitting ? 'Saving...' : 'Save Attendance'}}
        </button>
      </div>
    </div>

    <!-- VIEW TAB -->
    <div *ngIf="tab==='view'">
      <div class="card">
        <div class="d-flex gap-2" style="flex-wrap:wrap;align-items:flex-end">
          <div class="form-group" style="flex:1;min-width:140px"><label>Class (optional)</label><input class="form-control" [(ngModel)]="vf.className" placeholder="Filter by class" /></div>
          <div class="form-group" style="width:180px"><label>Date</label><input class="form-control" type="date" [(ngModel)]="vf.date" /></div>
          <div class="form-group" style="align-self:flex-end"><button class="btn btn-primary" (click)="loadView()">Search</button></div>
        </div>
      </div>
      <div class="card">
        <div *ngIf="viewLoading" class="spinner"></div>
        <table *ngIf="!viewLoading">
          <thead><tr><th>Date</th><th>Roll No.</th><th>Student</th><th>Class</th><th>Status</th><th>Marked By</th><th>Remarks</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of viewRecords">
              <td>{{r.date}}</td>
              <td><strong>{{r.rollNumber}}</strong></td>
              <td>{{r.studentName}}</td>
              <td>{{r.className}} {{r.section}}</td>
              <td><span class="badge" [class]="badge(r.status)">{{r.status}}</span></td>
              <td>{{r.markedBy||'N/A'}}</td>
              <td>{{r.remarks||'-'}}</td>
            </tr>
            <tr *ngIf="viewRecords.length===0"><td colspan="7" style="text-align:center;padding:30px;color:#888">No records found</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- REPORT TAB -->
    <div *ngIf="tab==='report'">
      <div class="card">
        <h3>Student Attendance Report</h3>
        <div class="d-flex gap-2" style="flex-wrap:wrap;align-items:flex-end">
          <div class="form-group" style="flex:1;min-width:200px"><label>Select Student</label>
            <select class="form-control" [(ngModel)]="rf.studentId">
              <option value="">-- Select Student --</option>
              <option *ngFor="let s of allStudents" [value]="s.id">{{s.rollNumber}} - {{s.fullName}}</option>
            </select>
          </div>
          <div class="form-group" style="width:180px"><label>From</label><input class="form-control" type="date" [(ngModel)]="rf.from" /></div>
          <div class="form-group" style="width:180px"><label>To</label><input class="form-control" type="date" [(ngModel)]="rf.to" /></div>
          <div class="form-group" style="align-self:flex-end"><button class="btn btn-primary" (click)="loadReport()" [disabled]="!rf.studentId">Generate</button></div>
        </div>
      </div>

      <div class="card" *ngIf="summary">
        <h3>{{summary.studentName}} ({{summary.rollNumber}})</h3>
        <div class="report-stats">
          <div class="rs"><div class="rs-val">{{summary.totalDays}}</div><div class="rs-lbl">Total Days</div></div>
          <div class="rs green"><div class="rs-val">{{summary.presentDays}}</div><div class="rs-lbl">Present</div></div>
          <div class="rs red"><div class="rs-val">{{summary.absentDays}}</div><div class="rs-lbl">Absent</div></div>
          <div class="rs orange"><div class="rs-val">{{summary.lateDays}}</div><div class="rs-lbl">Late</div></div>
          <div class="rs blue"><div class="rs-val">{{summary.attendancePercentage}}%</div><div class="rs-lbl">Attendance</div></div>
        </div>
        <div style="margin-top:16px">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px"><span>Attendance Rate</span><span [style.color]="summary.attendancePercentage>=75?'#10b981':'#ef4444'">{{summary.attendancePercentage}}%</span></div>
          <div style="background:#e5e7eb;border-radius:8px;height:12px"><div style="border-radius:8px;height:100%;transition:width 0.5s" [style.width]="summary.attendancePercentage+'%'" [style.background]="summary.attendancePercentage>=75?'#10b981':'#ef4444'"></div></div>
        </div>
        <div *ngIf="summary.attendancePercentage < 75" class="alert alert-danger" style="margin-top:12px">
          Warning: Attendance below 75%! Student may not be eligible for exams.
        </div>
      </div>

      <div class="card" *ngIf="reportRecords.length > 0">
        <h3>Detailed Records ({{reportRecords.length}} days)</h3>
        <table>
          <thead><tr><th>Date</th><th>Status</th><th>Marked By</th><th>Remarks</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of reportRecords">
              <td>{{r.date}}</td>
              <td><span class="badge" [class]="badge(r.status)">{{r.status}}</span></td>
              <td>{{r.markedBy||'N/A'}}</td>
              <td>{{r.remarks||'-'}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .tabs{display:flex;margin-bottom:20px;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;width:fit-content;}
    .tabs button{padding:10px 20px;border:none;background:#f5f5f5;cursor:pointer;font-size:14px;transition:all 0.2s;}
    .tabs button.active{background:#3b82f6;color:white;font-weight:600;}
    .status-btns{display:flex;gap:4px;}
    .status-btns button{padding:4px 8px;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:12px;background:#f5f5f5;transition:all 0.2s;}
    .sp{background:#10b981!important;color:white!important;border-color:#10b981!important;}
    .sa{background:#ef4444!important;color:white!important;border-color:#ef4444!important;}
    .sl{background:#f59e0b!important;color:white!important;border-color:#f59e0b!important;}
    .sh{background:#3b82f6!important;color:white!important;border-color:#3b82f6!important;}
    .report-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-top:12px;}
    .rs{background:#f8fafc;border-radius:8px;padding:16px;text-align:center;border-left:4px solid #ddd;}
    .rs.green{border-color:#10b981;}.rs.red{border-color:#ef4444;}.rs.orange{border-color:#f59e0b;}.rs.blue{border-color:#3b82f6;}
    .rs-val{font-size:26px;font-weight:700;color:#1e3a5f;}
    .rs-lbl{font-size:12px;color:#888;margin-top:4px;}
    .mt-3{margin-top:12px;}
  `]
})
export class AttendanceComponent implements OnInit {
  tab = 'mark';
  success = ''; error = '';
  markItems: {student: Student; status: string; remarks: string}[] = [];
  submitting = false;
  viewRecords: Attendance[] = [];
  viewLoading = false;
  reportRecords: Attendance[] = [];
  summary: AttendanceSummary | null = null;
  allStudents: Student[] = [];

  mf = { className: '', section: '', date: this.today() };
  vf = { className: '', date: this.today() };
  rf = { studentId: '', from: this.firstDay(), to: this.today() };

  constructor(private studentSvc: StudentService, private attendanceSvc: AttendanceService) {}

  ngOnInit() {
    this.studentSvc.getActive().subscribe(s => this.allStudents = s);
    this.loadView();
  }

  today() { return new Date().toISOString().split('T')[0]; }
  firstDay() { const d = new Date(); d.setDate(1); return d.toISOString().split('T')[0]; }

  loadForMark() {
    this.studentSvc.getByClass(this.mf.className, this.mf.section || undefined).subscribe(students => {
      const active = students.filter(s => s.status === 'ACTIVE');
      this.markItems = active.map(s => ({student: s, status: 'PRESENT', remarks: ''}));
    });
  }

  markAll(status: string) { this.markItems.forEach(i => i.status = status); }
  cnt(status: string) { return this.markItems.filter(i => i.status === status).length; }

  submitBulk() {
    this.submitting = true; this.error = '';
    const payload = {
      className: this.mf.className, section: this.mf.section, date: this.mf.date,
      attendances: this.markItems.map(i => ({
        studentId: i.student.id, rollNumber: i.student.rollNumber,
        studentName: i.student.fullName, className: i.student.className,
        section: i.student.section, date: this.mf.date,
        status: i.status, remarks: i.remarks
      }))
    };
    this.attendanceSvc.markBulk(payload).subscribe({
      next: () => { this.submitting = false; this.success = 'Attendance saved successfully!'; setTimeout(() => this.success = '', 3000); },
      error: (e: any) => { this.submitting = false; this.error = e.error?.message || 'Failed to save'; }
    });
  }

  loadView() {
    this.viewLoading = true;
    this.attendanceSvc.getByDate(this.vf.date).subscribe({
      next: records => {
        this.viewRecords = this.vf.className
          ? records.filter(r => r.className?.toLowerCase().includes(this.vf.className.toLowerCase()))
          : records;
        this.viewLoading = false;
      },
      error: () => this.viewLoading = false
    });
  }

  loadReport() {
    if (!this.rf.studentId) return;
    const id = Number(this.rf.studentId);
    this.attendanceSvc.getSummary(id, this.rf.from, this.rf.to).subscribe(s => this.summary = s);
    this.attendanceSvc.getByStudent(id, this.rf.from, this.rf.to).subscribe(r => this.reportRecords = r);
  }

  badge(status: string): string {
    const m: any = {PRESENT:'badge-success', ABSENT:'badge-danger', LATE:'badge-warning', HALF_DAY:'badge-info'};
    return m[status] || 'badge-info';
  }
}
