import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private http = inject(HttpClient);

  // API URL
  private api = 'https://your-backend-railway-url.app/api/attendance';

  swipeInStatus = signal(false);
  swipeOutStatus = signal(false);

  swipeIn() {
    return this.http.post(`${this.api}/swipe-in`, {});
  }

  swipeOut() {
    return this.http.post(`${this.api}/swipe-out`, {});
  }

  getTodayStatus() {
    return this.http.get(`${this.api}/today-status`);
  }
}

