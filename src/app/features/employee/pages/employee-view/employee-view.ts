import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-view',
  imports: [RouterLink],
  templateUrl: './employee-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeView {
  private readonly svc = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  protected data: Employee | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(id).subscribe(e => (this.data = e || null));
  }
}
