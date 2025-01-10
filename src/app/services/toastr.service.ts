import { Injectable } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  constructor(private toastr: NgxToastrService) { }

  showSuccess(message: string, title: string = 'Success'): void {
    this.toastr.success(message, title);
  }

  showError(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title, {
      positionClass: 'toast-center-center', // Toaster na sredini
      closeButton: true,             // Omogoči gumb za zapiranje
      timeOut: 0,                    // Onemogoči samodejno zapiranje
      extendedTimeOut: 0,            // Onemogoči podaljšano zapiranje
      tapToDismiss: false            // Onemogoči zapiranje na klik
    });
  }

  showInfo(message: string, title: string = 'Info'): void {
    this.toastr.info(message, title);
  }

  showWarning(message: string, title: string = 'Warning'): void {
    this.toastr.error(message, title, {
      positionClass: 'toast-center-center', // Toaster na sredini
      closeButton: true,             // Omogoči gumb za zapiranje
      timeOut: 0,                    // Onemogoči samodejno zapiranje
      extendedTimeOut: 0,            // Onemogoči podaljšano zapiranje
      tapToDismiss: false            // Onemogoči zapiranje na klik
      
    });
  }
}
