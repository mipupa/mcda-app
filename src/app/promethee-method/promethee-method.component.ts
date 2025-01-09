import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { PrometheeService } from './services/promethee.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-promethee-method',
  templateUrl: './promethee-method.component.html',
  styleUrl: './promethee-method.component.css'
})
export class PrometheeMethodComponent implements OnInit {

  @ViewChild('targetSection') targetSection!: ElementRef;

  selectedData: any[] = [];
  criteria: string[] = [];
  weights: number[] = [0.3, 0.5, 0.2];
  totalWeight: number = 0;
  types: string[] = [];
  result: { alternativa: string, rank: string, rezultat: number, positiveFlow: number, negativeFlow: number, netFlow: number }[] = [];

  alternatives: any[] = []; // Podatki o alternativah    


  constructor(private cdr: ChangeDetectorRef, private promethee: PrometheeService) { }

  ngOnInit(): void {

    // Fetch selected data and extract criteria
    this.selectedData = this.promethee.getSelectedData();
    if (this.selectedData.length > 0) {
      this.criteria = this.selectedData[0];
      this.types = Array(this.criteria.length - 1).fill('beneficial'); // Default criteria types
      const storedData = JSON.parse(localStorage.getItem('selectedData') || '[]');
      const selectedData = localStorage.getItem('selectedData');
      if (selectedData) {
        this.selectedData = JSON.parse(selectedData);
        // Glave stolpcev pridobimo iz prve vrstice
        this.criteria = this.selectedData[0];
        // Odstranimo glave stolpcev iz podatkov
        this.selectedData = this.selectedData.slice(1);
      } else {
        alert('Ni izbranih podatkov v localStorage!');
      }

      this.alternatives = storedData.slice(1).map((data: any) => ({ name: data[0], criteriaValues: [data[1], data[2], data[3]], }));

    }
  }

  // Funkcija za spremembo drsnika
onSliderChange(index: number, event: Event): void {
  const newValue = parseFloat((+(event.target as HTMLInputElement).value).toFixed(1));
  const totalOtherWeights = parseFloat(
    this.weights
      .reduce((sum, weight, i) => (i !== index ? sum + weight : sum), 0)
      .toFixed(1)
  );
  const maxAllowed = parseFloat((1 - newValue).toFixed(1));
  this.weights[index] = newValue;

  if (totalOtherWeights > maxAllowed) {
    // Prilagodi ostale drsnike sorazmerno
    const otherIndexes = this.weights
      .map((_, i) => i)
      .filter(i => i !== index);
    const [first, second] = otherIndexes;
    const ratio = this.weights[first] / (this.weights[first] + this.weights[second]);
    
    this.weights[first] = parseFloat((ratio * maxAllowed).toFixed(1));
    this.weights[second] = parseFloat((maxAllowed - this.weights[first]).toFixed(1));
  }
}

  isDisabled(index: number): boolean {
    // Preveri, ali je ena utež 1 in trenutni indeks ni ta utež
    return this.weights.some(w => w === 1) && this.weights[index] !== 1;
  }

  // Funkcija za izračun trenutne skupne uteži
  getTotalWeight(): number {
    return this.weights.reduce((sum, weight) => sum + weight, 0);
  }

  //Promethee method
  calculatePromethee(): void {
    try {
      const { rankedAlternatives } = this.promethee.runPromethee(this.weights, this.types);
      this.result = rankedAlternatives.map((item, index) => ({
        alternativa: item.alternative,
        rank: (index + 1).toString(),
        rezultat: item.score,
        positiveFlow: item.positiveFlow,
        negativeFlow: item.negativeFlow,
        netFlow: item.netFlow
      }));
    } catch (error) {
      console.error('Error during Promethee analysis:', error);
    }

    // Zahtevaj,da Angular, ponovno preveri DOM, preden izrišemo graf
    this.cdr.detectChanges();

    // Počisti obstoječe grafe in izriši nove

    this.createCharts();

    //scrolldown page
    this.targetSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  //implementacija metode createChart

  //createCharts Method
  createCharts(): void {
    const storedResults = localStorage.getItem('selectedData');
    if (!storedResults) {
      console.error('Ni podatkov za izris grafov.');
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

      const width = 300;
      const height = 400;
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
        .range(['grey', 'blue']); // Barvni prehod stolpca grafa

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
        .attr('stop-color', '#ddc1a08e');
      gradient.append('stop')
        .attr('offset', '100%') // Zgornja barva
        .attr('stop-color', '#3498db');

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
        .style('font-weight', 'normal') // Krepka pisava (opcijsko)
        .text(d => d.rezultat) // Vrednost, ki jo prikažemo

    });

  }

}