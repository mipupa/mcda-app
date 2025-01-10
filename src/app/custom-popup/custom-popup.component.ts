import { Component } from '@angular/core';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrl: './custom-popup.component.css'
})
export class CustomPopupComponent {
  isVisible: boolean = false;
  title: string = '';
  message: string = '';

  constructor(private popupService: PopupService) {
    this.popupService.popupData$.subscribe((data) => {
      this.title = data.title;
      this.message = data.message;
      this.isVisible = data.isVisible;
    });
  }

  closePopup() {
    this.isVisible = false;
    this.popupService.closePopup();
  }

  onAction() {
    this.popupService.confirmAction();
    this.isVisible = false;
  }
}

