import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);

  // Mock store (simulate API). In real app, replace with real endpoints.
  private store = signal<Employee[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@corp.com', phone: '555-1010', department: 'HR', status: 'Active', joiningDate: '2023-03-10' },
    { id: 2, name: 'Bob Smith', email: 'bob@corp.com', phone: '555-2020', department: 'Engineering', status: 'Active', joiningDate: '2022-11-25' },
    { id: 3, name: 'Carol Diaz', email: 'carol@corp.com', phone: '555-3030', department: 'Finance', status: 'Inactive', joiningDate: '2021-06-14' },
  ]);

  getAll(): Observable<Employee[]> {
    return of(this.store()).pipe(delay(200));
  }

  getById(id: number): Observable<Employee | undefined> {
    return this.getAll().pipe(map(list => list.find(e => e.id === id)));
  }

  create(payload: Omit<Employee, 'id'>): Observable<Employee> {
    const nextId = Math.max(0, ...this.store().map(e => e.id)) + 1;
    const created: Employee = { id: nextId, ...payload } as Employee;
    this.store.set([...this.store(), created]);
    return of(created).pipe(delay(200));
  }

  update(id: number, payload: Partial<Employee>): Observable<Employee | undefined> {
    const updated = this.store().map(e => (e.id === id ? { ...e, ...payload } : e));
    this.store.set(updated);
    return of(updated.find(e => e.id === id)).pipe(delay(200));
  }

  delete(id: number): Observable<boolean> {
    const filtered = this.store().filter(e => e.id !== id);
    const changed = filtered.length !== this.store().length;
    this.store.set(filtered);
    return of(changed).pipe(delay(200));
  }
}
