import { Component } from '@angular/core';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private popup: PopupService) { }

  dataExportClick(): void {

    this.popup.showPopup('We are sorry :(', 'Feature under development and will be covered soon');
  }

}
