import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaves',
<<<<<<< HEAD
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
=======
  imports: [SelectModule, ButtonModule, DrawerModule, DatePickerModule, DatePickerModule, InputTextModule, FormsModule, ReactiveFormsModule, ToastModule, CommonModule],
  providers: [MessageService],
>>>>>>> 33e1cc0456e09d8fdcbc6a080f547631646dcb95
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
