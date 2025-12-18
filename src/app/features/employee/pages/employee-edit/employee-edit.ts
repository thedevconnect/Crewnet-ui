import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeForm } from '../../components/employee-form/employee-form';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-edit',
  imports: [RouterLink, EmployeeForm],
  templateUrl: './employee-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeEdit {
  private readonly svc = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected data: Employee | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(id).subscribe(e => (this.data = e || null));
  }

  onSubmit(val: any) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.update(id, val).subscribe(() => {
      this.router.navigate(['/employees']);
    });
  }
}
