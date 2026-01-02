import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-leaves',
  imports: [
    SelectModule,
    ButtonModule,
    DrawerModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    CommonModule,
    DatePickerModule,
  ],
  templateUrl: './leaves.html',
  //styleUrls: ['./leaves.css'],
  standalone: true,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Leaves {
  leaveDrawerVisible = false;
  leaveTypes = [
    { label: 'Casual Leave', value: 'CL' },
    { label: 'Sick Leave', value: 'SL' },
    { label: 'Paid Leave', value: 'PL' },
  ];
  openLeaveDrawer() {
    this.leaveDrawerVisible = true;
  }
}
