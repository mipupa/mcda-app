import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface PopupData {
  isVisible: boolean;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private popupDataSubject = new BehaviorSubject<PopupData>({
    isVisible: false,
    title: '',
    message: '',
  });

  popupData$ = this.popupDataSubject.asObservable();
  private actionCallback: (() => void) | null = null;

  showPopup(title: string, message: string, actionCallback?: () => void) {
    this.actionCallback = actionCallback || null;
    this.popupDataSubject.next({ isVisible: true, title, message });
  }

  closePopup() {
    this.popupDataSubject.next({ ...this.popupDataSubject.value, isVisible: false });
  }

  confirmAction() {
    if (this.actionCallback) {
      this.actionCallback();
    }
  }
}