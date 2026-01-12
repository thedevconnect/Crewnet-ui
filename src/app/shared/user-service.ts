import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * UserService
 * Sidebar state management और event system के लिए service
 * Signal-based state management का उपयोग करता है
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  // Event System - BehaviorSubject का उपयोग component communication के लिए
  private eventSource = new BehaviorSubject<any>({ eventName: 'INIT' });
  public currentEvent: Observable<any> = this.eventSource.asObservable();

  // Sidebar State - Signal का उपयोग reactive state management के लिए
  sidebarState = signal(true);

  /**
   * Change Event - Event emit करने के लिए
   * @param data - Event data object जिसमें eventName होना चाहिए
   */
  changeEvent(data: any): void {
    this.eventSource.next(data);
  }
}
