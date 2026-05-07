import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService, Student } from '../../services/student.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-between align-center" style="margin-bottom:20px">
      <div><h2 style="font-size:22px;font-weight:700;color:#1e3a5f">Student Management</h2><p style="color:#888;font-size:14px">Manage student records</p></div>
      <button class="btn btn-primary" (click)="openAdd()">+ Add Student</button>
    </div>

    <div *ngIf="success" class="alert alert-success">{{success}}</div>
    <div *ngIf="error" class="alert alert-danger">{{error}}</div>

    <div *ngIf="showForm" class="card">
      <h3>{{editId ? 'Edit' : 'Add'}} Student</h3>
      <div class="form-grid">
        <div class="form-group"><label>Roll Number *</label><input class="form-control" [(ngModel)]="form.rollNumber" placeholder="e.g. S006" [disabled]="!!editId" /></div>
        <div class="form-group"><label>Full Name *</label><input class="form-control" [(ngModel)]="form.fullName" placeholder="Student full name" /></div>
        <div class="form-group"><label>Class *</label><input class="form-control" [(ngModel)]="form.className" placeholder="e.g. 10th" /></div>
        <div class="form-group"><label>Section</label><input class="form-control" [(ngModel)]="form.section" placeholder="e.g. A" /></div>
        <div class="form-group"><label>Email</label><input class="form-control" type="email" [(ngModel)]="form.email" placeholder="Email" /></div>
        <div class="form-group"><label>Phone</label><input class="form-control" [(ngModel)]="form.phone" placeholder="Phone number" /></div>
        <div class="form-group"><label>Guardian Name</label><input class="form-control" [(ngModel)]="form.guardianName" placeholder="Guardian name" /></div>
        <div class="form-group"><label>Guardian Phone</label><input class="form-control" [(ngModel)]="form.guardianPhone" placeholder="Guardian phone" /></div>
        <div class="form-group" style="grid-column:1/-1"><label>Address</label><input class="form-control" [(ngModel)]="form.address" placeholder="Full address" /></div>
      </div>
      <div class="d-flex gap-2 mt-3">
        <button class="btn btn-success" (click)="save()" [disabled]="saving">{{saving ? 'Saving...' : (editId ? 'Update' : 'Add Student')}}</button>
        <button class="btn" style="background:#eee;color:#333" (click)="cancelForm()">Cancel</button>
      </div>
    </div>

    <div class="card">
      <div class="d-flex gap-2" style="flex-wrap:wrap">
        <input class="form-control" [(ngModel)]="search" placeholder="Search by name or roll number..." style="flex:1;min-width:200px" />
        <input class="form-control" [(ngModel)]="filterClass" placeholder="Filter by class" style="width:140px" />
        <select class="form-control" [(ngModel)]="filterStatus" style="width:140px">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>
    </div>

    <div class="card">
      <div *ngIf="loading" class="spinner"></div>
      <table *ngIf="!loading">
        <thead><tr><th>Roll No.</th><th>Name</th><th>Class</th><th>Section</th><th>Email</th><th>Guardian</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let s of filtered()">
            <td><strong>{{s.rollNumber}}</strong></td>
            <td>{{s.fullName}}</td>
            <td>{{s.className}}</td>
            <td>{{s.section || '-'}}</td>
            <td>{{s.email || '-'}}</td>
            <td>{{s.guardianName || '-'}}</td>
            <td><span class="badge" [class]="s.status==='ACTIVE'?'badge-success':'badge-danger'">{{s.status}}</span></td>
            <td>
              <div class="d-flex gap-2">
                <button class="btn btn-warning btn-sm" (click)="editStudent(s)">Edit</button>
                <button class="btn btn-danger btn-sm" (click)="deactivate(s.id!)" *ngIf="s.status==='ACTIVE'">Deactivate</button>
              </div>
            </td>
          </tr>
          <tr *ngIf="filtered().length===0"><td colspan="8" style="text-align:center;padding:30px;color:#888">No students found</td></tr>
        </tbody>
      </table>
      <p *ngIf="!loading" style="color:#888;font-size:13px;margin-top:12px">Total: {{filtered().length}} students</p>
    </div>
  `,
  styles: [`
    .form-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
    @media(max-width:900px){.form-grid{grid-template-columns:repeat(2,1fr);}}
  `]
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  loading = true; saving = false; showForm = false;
  search = ''; filterClass = ''; filterStatus = '';
  editId: number | null = null;
  success = ''; error = '';
  form: Student = this.blank();

  constructor(private svc: StudentService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getAll().subscribe({ next: s => { this.students = s; this.loading = false; }, error: () => this.loading = false });
  }

  blank(): Student { return { rollNumber:'', fullName:'', className:'', section:'', email:'', phone:'', guardianName:'', guardianPhone:'', address:'' }; }

  filtered() {
    return this.students.filter(s => {
      const q = this.search.toLowerCase();
      return (!q || s.fullName.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q))
          && (!this.filterClass || s.className.toLowerCase().includes(this.filterClass.toLowerCase()))
          && (!this.filterStatus || s.status === this.filterStatus);
    });
  }

  openAdd() { this.editId = null; this.form = this.blank(); this.showForm = true; this.error = ''; }
  editStudent(s: Student) { this.editId = s.id!; this.form = {...s}; this.showForm = true; this.error = ''; }
  cancelForm() { this.showForm = false; this.editId = null; this.error = ''; }

  save() {
    this.error = ''; this.saving = true;
    const req = this.editId ? this.svc.update(this.editId, this.form) : this.svc.create(this.form);
    req.subscribe({
      next: () => { this.saving = false; this.showForm = false; this.success = this.editId ? 'Student updated!' : 'Student added!'; this.load(); setTimeout(() => this.success = '', 3000); },
      error: (e: any) => { this.saving = false; this.error = e.error?.message || 'Operation failed!'; }
    });
  }

  deactivate(id: number) {
    if (!confirm('Deactivate this student?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.success = 'Student deactivated!'; this.load(); setTimeout(() => this.success = '', 3000); },
      error: (e: any) => this.error = e.error?.message || 'Failed'
    });
  }
}
