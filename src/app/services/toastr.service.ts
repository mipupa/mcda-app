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
    this.toastr.error(message, title);
  }

  showInfo(message: string, title: string = 'Info'): void {
    this.toastr.info(message, title);
  }

  showWarning(message: string, title: string = 'Warning'): void {
    this.toastr.warning(message, title);
  }
}
