import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private notificationsEnabledSubject = new BehaviorSubject<boolean>(false);
  notificationsEnabled$ = this.notificationsEnabledSubject.asObservable();

  setNotificationsEnabled(enabled: boolean) {
    this.notificationsEnabledSubject.next(enabled);
  }

  get notificationsEnabled(): boolean {
    return this.notificationsEnabledSubject.value;
  }
}
