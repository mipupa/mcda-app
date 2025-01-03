import { Component, OnInit } from '@angular/core';
import * as topsis from 'topsis2';

@Component({
  selector: 'app-topsis-method',
  templateUrl: './topsis-method.component.html',
  styleUrl: './topsis-method.component.css'
})
export class TopsisMethodComponent implements OnInit{

  alternatives: any[] = []; // Podatki o alternativah
  criteria: string[] = ['Criterion1', 'Criterion2', 'Criterion3']; // Kriteriji
  result: any[] = []; // Rezultati TOPSIS
  weights: number[] = [0.5, 0.3, 0.2]; // Teže kriterijev, privzeto
  types: ('cost' | 'benefit')[] = ['cost', 'benefit', 'benefit']; // Tipi kriterijev
  selectedData: any[] = [];  


  constructor() {}

  ngOnInit(): void {
    
    const storedData = JSON.parse(localStorage.getItem('selectedData') || '[]');

    const storedDataTable = localStorage.getItem('selectedData');
    if (storedDataTable) {
      this.selectedData = JSON.parse(storedDataTable);
      this.criteria = this.selectedData[0].slice(1).map((_: unknown, index: number) => `Kriterij ${index + 1}`);
    } else {
      alert('Ni izbranih podatkov v localStorage!');
    }
  
  this.alternatives = storedData.map((data: any) => ({
    name: data[0],
    criteriaValues: [data[1], data[2], data[3]], // Preverite, da je tretja vrednost pravilna
  }));

  this.criteria = ['Kriterij 1', 'Kriterij 2', 'Kriterij 3'];
  this.weights = [20, 40, 40];
  this.types = ['benefit', 'cost', 'benefit'];

  console.log('Alternatives:', this.alternatives);
  }

  
 // Funkcija za spremembo drsnika
 onSliderChange(index: number, event: Event): void {
  const newValue = +(event.target as HTMLInputElement).value;
  const totalOtherWeights = this.weights.reduce((sum, weight, i) => (i !== index ? sum + weight : sum), 0);
  const maxAllowed = 100 - newValue;

  this.weights[index] = newValue;

  if (totalOtherWeights > maxAllowed) {
    // Prilagodi ostale drsnike sorazmerno
    const otherIndexes = this.weights.map((_, i) => i).filter(i => i !== index);
    const [first, second] = otherIndexes;

    const ratio = this.weights[first] / (this.weights[first] + this.weights[second]);
    this.weights[first] = Math.round(ratio * maxAllowed);
    this.weights[second] = maxAllowed - this.weights[first];
  }
}

// Funkcija za izračun trenutne skupne uteži
getTotalWeight(): number {
  return this.weights.reduce((sum, weight) => sum + weight, 0);
}

 //Topsis funkcija 
  calculateTopsis(): void {
    
  
  // Resetiraj prejšnje rezultate
  this.result = [];

  // Priprava kriterijev in matrike
  const criteria = this.weights.map((weight, index) => ({
    weight: weight,
    type: this.types[index],
  }));

  const matrix = this.alternatives.map(alt => alt.criteriaValues);

  console.log('Kriteriji:', criteria);
  console.log('Matrika:', matrix);

 // Izvedba TOPSIS analize
 try {
  const ranked = topsis.rank(criteria, matrix, true);
  console.log('Ranked:', ranked); // Debug

  // Pretvori ranked v pravilno obliko za tabelo
  this.result = Object.entries(ranked).map(([key, value]) => ({
    alternativa: this.alternatives[+value].name,
    rank: key, // Pravilno določimo razvrstitev glede na rank
    rezultat: matrix[+value][1] // Ali drugačno vrednost, če imaš boljši kazalnik
  }));


  console.log('Sorted Results:', this.result); // Debug

} catch (error) {
  console.error('Napaka pri analizi:', error);
}
}
}
