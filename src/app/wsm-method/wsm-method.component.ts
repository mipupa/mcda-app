import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-wsm-method',
  templateUrl: './wsm-method.component.html',
  styleUrl: './wsm-method.component.css'
})
export class WsmMethodComponent {

  @ViewChild('targetSection') targetSection!: ElementRef;

  constructor(private cdr: ChangeDetectorRef) { }

  selectedData: any[] = [];
  criteria: string[] = [];
  weights: number[] = [0.3, 0.5, 0.2];
  totalWeight: number = 0;
  ranking: { alternativa: string; rezultat: number }[] = [];

  ngOnInit(): void {
    const storedData = localStorage.getItem('selectedData');
    if (storedData) {
      this.selectedData = JSON.parse(storedData);
      // Glave stolpcev pridobimo iz prve vrstice
      this.criteria = this.selectedData[0];
      // Odstranimo glave stolpcev iz podatkov
      this.selectedData = this.selectedData.slice(1);

    } else {
      alert('No data in localStorage!');
    }
  }

  updateWeights(index: number, value: number): void {
    const remainingWeight = 1 - value; // Preostanek teže za razporeditev
    let otherWeightsSum = 0;

    // Prilagodimo ostale uteži
    for (let i = 0; i < this.weights.length; i++) {
      if (i !== index) {
        if (value === 1) {
          // Če je ena utež nastavljena na 1, druge postavimo na 0
          this.weights[i] = 0;
        } else {
          // Prilagodimo ostale uteži sorazmerno
          otherWeightsSum += this.weights[i];
        }
      }
    }

    if (value !== 1) {
      for (let i = 0; i < this.weights.length; i++) {
        if (i !== index && otherWeightsSum > 0) {
          this.weights[i] = (this.weights[i] / otherWeightsSum) * remainingWeight;
        }
      }
    }

    this.totalWeight = this.weights.reduce((sum, w) => sum + w, 0);
  }

  isDisabled(index: number): boolean {
    // Preveri, ali je ena utež 1 in trenutni indeks ni ta utež
    return this.weights.some(w => w === 1) && this.weights[index] !== 1;
  }

  // Funkcija za izračun trenutne skupne uteži
  getTotalWeight(): number {
    return this.weights.reduce((sum, weight) => sum + weight, 0);
  }

  analyze(): void {
    // Pripravi in razvrsti podatke za rangiranje
    this.ranking = this.selectedData.map(row => {
      const alternativa = row[0];
      const rezultat = row.slice(1).reduce((sum: number, value: number, index: number) => sum + value * this.weights[index], 0);
      return { alternativa, rezultat };
    });

    // Sortiraj rezultate po točkah (padajoče)
    this.ranking.sort((a, b) => b.rezultat - a.rezultat);
    localStorage.setItem('WSM_Results', JSON.stringify(this.ranking));

    // Zahtevaj Angularju, da ponovno preveri DOM, preden izrišemo graf
    this.cdr.detectChanges();

    // Počisti graf in ga prikaži
    this.createChart();
    //scrolldown page
    this.targetSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  createChart(): void {
    // Preveri, če so podatki za graf na voljo
    if (!this.ranking || this.ranking.length === 0) {
      console.error('Ni podatkov za graf!');
      return;
    }
    console.log('Ranking:', this.ranking);
    d3.select('#chart').selectAll('*').remove(); // Počisti obstoječi graf

    const data = this.ranking;
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
