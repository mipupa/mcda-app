import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-wsm-method',
  templateUrl: './wsm-method.component.html',
  styleUrl: './wsm-method.component.css'
})
export class WsmMethodComponent implements OnInit {

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
    this.createCharts();
    //scrolldown page
    this.targetSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  
  
  createCharts(): void {
      const storedResults = localStorage.getItem('selectedData');
      if (!storedResults) {
        console.error('Ni podatkov za izris grafov v localStorage.');
        return;
      }
  
      d3.select('#chart-container').selectAll('*').remove();
  
      const result: (string | number)[][] = JSON.parse(storedResults);
      const headers: string[] = result[0] as string[];
      const rows: (string | number)[][] = result.slice(1);
  
      headers.slice(1).forEach((header: string, metricIndex: number) => {
        const data = rows.map(row => ({
          alternativa: row[0] as string,
          rezultat: +(row[metricIndex + 1] as number),
        }));
  
        const width = 400;
        const height = 500;
        const margin = { top: 50, right: 30, bottom: 80, left: 70 };
  
        const chartContainer = d3
          .select('#chart-container')
          .append('div')
          .style('display', 'inline-block')
          .style('margin', '10px');
  
        const svg = chartContainer
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
  
        // Definiramo barvno lestvico (od modre do rdeče)
        const colorScale = d3.scaleLinear<string>()
          .domain([0, d3.max(data, d => d.rezultat)!]) // Najnižja in najvišja vrednost
          .range(['grey', '#454545']); // Barvni prehod od modre do rdeče
  
        // Dodajanje gradienta v SVG
        const gradient = svg.append('defs')
          .append('linearGradient')
          .attr('id', 'bar-gradient') // ID gradienta
          .attr('x1', '0%')
          .attr('y1', '100%')
          .attr('x2', '0%')
          .attr('y2', '0%'); // Gradient gre od spodaj navzgor
  
        // Definiramo barvne stopnje v gradientu
        gradient.append('stop')
          .attr('offset', '0%') // Spodnja barva
          .attr('stop-color', 'grey');
        gradient.append('stop')
          .attr('offset', '100%') // Zgornja barva
          .attr('stop-color', '#454545');
  
        // Dodajanje stolpcev z gradientom
        svg
          .append('g')
          .selectAll('rect')
          .data(data)
          .join('rect')
          .attr('x', d => x(d.alternativa)!)
          .attr('y', y(0)) // Začetna višina stolpca na osi X (dno grafa)
          .attr('height', 0) // Začetna višina stolpcev je 0
          .attr('width', x.bandwidth())
          .attr('fill', 'url(#bar-gradient)') // Uporaba gradienta
          .transition() // Dodamo prehodno animacijo
          .duration(2000) // Trajanje animacije (v milisekundah)
          .attr('y', d => y(d.rezultat)) // Končni položaj stolpca glede na vrednost
          .attr('height', d => y(0) - y(d.rezultat)); // Končna višina stolpca
  
        svg
          .append('g')
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x))
          .selectAll('text')
          .transition()
          .duration(2000)
          .ease(d3.easePolyIn)
          .attr('transform', 'rotate(-45)')
          .style('text-anchor', 'end')
          .style('font-size', '14px'); // Povečana velikost pisave za x os
  
        svg
          .append('g')
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y))
          .selectAll('text')
          .transition()
          .duration(2000)
          .ease(d3.easeBounceIn)
          .style('font-size', '14px'); // Povečana velikost pisave za y os
  
        svg
          .append('text')
          .attr('x', width / 2)
          .attr('y', margin.top / 2 - 20) // Začetna pozicija nekoliko višje od ciljne
          .attr('text-anchor', 'middle')
          .style('font-size', '16px')
          .style('font-weight', 'bold')
          .style('opacity', 0) // Začetna prosojnost (nevidno)
          .text(header)
          .transition() // Dodamo animacijo
          .duration(2000) // Trajanje animacije (v milisekundah)
          .attr('y', margin.top / 2) // Premik na končno pozicijo
          .style('opacity', 1); // Besedilo postane vidno
  
        // Dodajanje vrednosti na vrh stolpcev
        svg
          .append('g')
          .selectAll('text')
          .data(data)
          .join('text')
          .attr('x', d => x(d.alternativa)! + x.bandwidth() / 2) // Središče stolpca
          .attr('y', d => y(d.rezultat) - 5) // Nekoliko nad vrhom stolpca
          .attr('text-anchor', 'middle') // Poravnava besedila na sredino stolpca
          .style('font-size', '14px') // Velikost pisave
          .style('font-weight', 'bold') // Krepka pisava (opcijsko)
          .text(d => d.rezultat) // Vrednost, ki jo prikažemo
  
      });
  
    }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  /*
  createChart(): void {
    // Preveri, če so podatki za graf na voljo
    if (!this.ranking || this.ranking.length === 0) {
      console.error('Ni podatkov za graf!');
      return;
    }
    console.log('Ranking:', this.ranking);
    d3.select('#chart').selectAll('*').remove(); // Počisti obstoječi graf

    const data = this.ranking;
    const width = 400;
    const height = 500;
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
  }  */


}
