import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Attendance {
  id?: number; studentId: number; rollNumber?: string; studentName?: string;
  className?: string; section?: string; date: string; status: string; remarks?: string; markedBy?: string;
}
export interface AttendanceSummary {
  studentId: number; studentName: string; rollNumber: string;
  totalDays: number; presentDays: number; absentDays: number; lateDays: number; attendancePercentage: number;
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly URL = '/api/attendance';
  constructor(private http: HttpClient) {}
  mark(a: Attendance): Observable<Attendance> { return this.http.post<Attendance>(`${this.URL}/mark`, a); }
  markBulk(data: any): Observable<Attendance[]> { return this.http.post<Attendance[]>(`${this.URL}/mark-bulk`, data); }
  getToday(): Observable<Attendance[]> { return this.http.get<Attendance[]>(`${this.URL}/today`); }
  getByStudent(id: number, from?: string, to?: string): Observable<Attendance[]> {
    let url = `${this.URL}/student/${id}`;
    if (from && to) url += `?from=${from}&to=${to}`;
    return this.http.get<Attendance[]>(url);
  }
  getSummary(id: number, from: string, to: string): Observable<AttendanceSummary> {
    return this.http.get<AttendanceSummary>(`${this.URL}/student/${id}/summary?from=${from}&to=${to}`);
  }
  getByClass(className: string, section?: string, date?: string): Observable<Attendance[]> {
    let url = `${this.URL}/class/${className}`;
    const p: string[] = [];
    if (section) p.push(`section=${section}`);
    if (date) p.push(`date=${date}`);
    if (p.length) url += '?' + p.join('&');
    return this.http.get<Attendance[]>(url);
  }
  getByDate(date: string): Observable<Attendance[]> { return this.http.get<Attendance[]>(`${this.URL}/date?date=${date}`); }
}
