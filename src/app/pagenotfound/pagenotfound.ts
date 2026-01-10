import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pagenotfound',
  imports: [
    ButtonModule,
  ],
  templateUrl: './pagenotfound.html',
  styleUrl: './pagenotfound.css',
})
export class Pagenotfound {
  gotoHome() {
    window.location.href = '/home';
  }
}
