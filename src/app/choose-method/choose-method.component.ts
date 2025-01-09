import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-method',
  templateUrl: './choose-method.component.html',
  styleUrl: './choose-method.component.css'
})
export class ChooseMethodComponent implements OnInit {

  isData: boolean = false; 
  methods: string[] = ['WSM', 'AHP', 'TOPSIS', 'PROMETHEE II']; // Dodaj metode po potrebi
  selectedMethod: string | null = null;

  ngOnInit(): void {
    const selectedData = localStorage.getItem('selectedData');
    if (selectedData?.length) {
      this.isData = true;
    }
  }

  constructor(private router: Router) {}

  selectMethod(method: string): void {
    this.selectedMethod = method;
  }

  proceed(): void {
    if (!this.selectedMethod) {
      alert('Please, choose analysis method.');
      return;
    }

    // Shrani izbrano metodo v localStorage
    localStorage.setItem('selectedMethod', this.selectedMethod);

    // Preusmeri na ustrezno komponento glede na izbrano metodo
    switch (this.selectedMethod) {
      case 'WSM':
        this.router.navigate(['/wsm-method']);
        break;
      case 'AHP':
        this.router.navigate(['/ahp-method']);
        break;
      case 'TOPSIS':
        this.router.navigate(['/topsis-method']);
        break;
      case 'PROMETHEE II':
        this.router.navigate(['/promethee-method']);
        break;
      default:
        alert('Nepoznan izbor metode.');
    }
  }
}