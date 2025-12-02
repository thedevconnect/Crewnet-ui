import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EmployeeForm } from '../../components/employee-form/employee-form';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-add',
  imports: [RouterLink, EmployeeForm],
  templateUrl: './employee-add.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeAdd {
  private readonly svc = inject(EmployeeService);
  private readonly router = inject(Router);

  onSubmit(val: any) {
    this.svc.create(val).subscribe(() => {
      this.router.navigate(['/employees']);
    });
  }
}
