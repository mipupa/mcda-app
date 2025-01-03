import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as topsis from 'topsis2';
import * as d3 from 'd3';
import 'd3-selection';
import 'd3-scale';
import 'd3-axis';
import 'd3-shape';
import 'd3-scale-chromatic';

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


  constructor(private cdr: ChangeDetectorRef) {}

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

 
 try {
  const ranked = topsis.rank(criteria, matrix, true);
  console.log('Ranked:', ranked); // Debug

  // Pretvori ranked v pravilno obliko za tabelo
  this.result = Object.entries(ranked).map(([key, value]) => ({
    alternativa: this.alternatives[+value].name,
    rank: key, // Pravilno določimo razvrstitev glede na rank
    rezultat: matrix[+value][0] // Ali drugačno vrednost, če imaš boljši kazalnik
  }));


  console.log('Sorted Results:', this.result); // Debug
   // Shranjevanje v localStorage
   localStorage.setItem('topsisResults', JSON.stringify(this.result));
   console.log('Rezultati shranjeni v localStorage.');

} catch (error) {
  console.error('Napaka pri analizi:', error);
}
// Zahtevaj Angularju, da ponovno preveri DOM, preden izrišemo graf
this.cdr.detectChanges();

// Počisti graf in ga prikaži
this.createChart();
}

//implementacija metode createChart

createChart(): void {
  // Preberi podatke iz localStorage
  const storedResults = localStorage.getItem('selectedData');
  if (!storedResults) {
    console.error('Ni podatkov za izris grafa v localStorage.');
    return;
  }
  d3.select('#chart').selectAll('*').remove(); // Počisti obstoječi graf

  const result = JSON.parse(storedResults);
  console.log('Graf podatki:', result);

   const data = this.result;
      const width = 500;
      const height = 300;
      const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    
      const svg = d3
        .select('#chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
      const x = d3
        .scaleBand()
        .domain(data.map(d => d.alternativa))
        .range([margin.left, width - margin.right])
        .padding(0.1);
    
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.rezultat) || 0])
        .nice()
        .range([height - margin.bottom, margin.top]);
    
      svg
        .append('g')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => x(d.alternativa)!)
        .attr('y', d => y(d.rezultat))
        .attr('height', d => y(0) - y(d.rezultat))
        .attr('width', x.bandwidth())
        .attr('fill', 'steelblue');
    
      svg
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));
    
      svg
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
    }
}
