import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id?: number; rollNumber: string; fullName: string; className: string;
  section?: string; email?: string; phone?: string; guardianName?: string;
  guardianPhone?: string; status?: string; dateOfBirth?: string; address?: string;
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly URL = '/api/students';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Student[]> { return this.http.get<Student[]>(this.URL); }
  getActive(): Observable<Student[]> { return this.http.get<Student[]>(`${this.URL}/active`); }
  getById(id: number): Observable<Student> { return this.http.get<Student>(`${this.URL}/${id}`); }
  create(s: Student): Observable<Student> { return this.http.post<Student>(this.URL, s); }
  update(id: number, s: Student): Observable<Student> { return this.http.put<Student>(`${this.URL}/${id}`, s); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.URL}/${id}`); }
  getByClass(className: string, section?: string): Observable<Student[]> {
    const url = section ? `${this.URL}/class/${className}?section=${section}` : `${this.URL}/class/${className}`;
    return this.http.get<Student[]>(url);
  }
}
