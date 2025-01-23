import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {

  private apiUrl = '';
  response: any;

  constructor() { }

  form = {

    name: '',
    email: '',
    phone: '',
    message: ''
  }

  onSubmit(kontaktForm: NgForm) {

    if (kontaktForm.valid) {
      this.sendPostRequest();
     
    } 
  }

  sendKontaktForm(data: any) {

    
    return ;
  }

  sendPostRequest(): void {

    const postData = {
      name: this.form.name,
      email: this.form.email,
      phone: this.form.phone,
      msg: this.form.message
    };

  
    
  }
}
