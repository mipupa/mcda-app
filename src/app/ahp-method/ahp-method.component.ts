import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AhpService } from './services/ahp.service';
import * as d3 from 'd3';
import 'd3-selection';
import 'd3-scale';
import 'd3-axis';
import 'd3-shape';
import 'd3-scale-chromatic';

@Component({
  selector: 'app-ahp-method',
  templateUrl: './ahp-method.component.html',
  styleUrl: './ahp-method.component.css'
})
export class AhpMethodComponent implements OnInit {

  @ViewChild('targetSection') targetSection!: ElementRef;

  selectedData: any[] = [];
  alternatives: string[] = [];
  criteria: string[] = [];

  //for criteria vs criteria
  public matrix0: number[][] = [];
  public results0: number[] = [];
  public options0: string[] = [];

  //PriorityVectors values
  public c0_PriorityVectors_Weights: number[] = [];
  public c1_PriorityVectors: number[] = [];
  public c2_PriorityVectors: number[] = [];
  public c3_PriorityVectors: number[] = [];

  //for alternatives vs criteria1
  public matrix1: number[][] = [];
  public results1: number[] = [];
  public options1: string[] = [];

  //for alternatives vs criteria2
  public matrix2: number[][] = [];
  public results2: number[] = [];
  public options2: string[] = [];

  //for alternatives vs criteria3
  public matrix3: number[][] = [];
  public results3: number[] = [];
  public options3: string[] = [];

  matrix0Consistency: any;
  matrix1Consistency: any;
  matrix2Consistency: any;
  matrix3Consistency: any;

  //for display final results in table
  combinedData: any[] = [];
  tableHeaders: string[] = [];

  constructor(private ahpServiceMatrix0: AhpService,
    private ahpServiceMatrix1: AhpService,
    private ahpServiceMatrix2: AhpService,
    private ahpServiceMatrix3: AhpService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const storedData = JSON.parse(localStorage.getItem('selectedData') || '[]');
    const selectedData = localStorage.getItem('selectedData');
    if (selectedData) {
      this.selectedData = JSON.parse(selectedData);
      //pridobi alternative
      this.alternatives = storedData.slice(1);
      console.log(this.alternatives);
      // Glave stolpcev pridobimo iz prve vrstice
      this.criteria = this.selectedData[0];
      // Odstranimo glave stolpcev iz podatkov
      this.selectedData = this.selectedData.slice(1);
    } else {
      alert('Ni izbranih podatkov v localStorage!');
    }

    this.initializeMatrix0();
    this.initializeMatrix1();
    this.initializeMatrix2();
    this.initializeMatrix3();
  }

  private initializeMatrix0(): void {
    this.options0 = this.criteria.slice(1);
    const size = this.options0.length;
    // Create a square matrix filled with 1s
    this.matrix0 = Array.from({ length: size }, () => Array(size).fill(1));
  }


  private initializeMatrix1(): void {
    this.options1 = this.alternatives.map(item => item[0]);
    const size = this.options1.length;
    // Create a square matrix filled with 1s
    this.matrix1 = Array.from({ length: size }, () => Array(size).fill(1));
  }

  private initializeMatrix2(): void {
    this.options2 = this.alternatives.map(item => item[0]);
    const size = this.options2.length;
    // Create a square matrix filled with 1s
    this.matrix2 = Array.from({ length: size }, () => Array(size).fill(1));
  }

  private initializeMatrix3(): void {
    this.options3 = this.alternatives.map(item => item[0]);
    const size = this.options3.length;
    // Create a square matrix filled with 1s
    this.matrix3 = Array.from({ length: size }, () => Array(size).fill(1));
  }



  public updateMatrix0(row: number, col: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const numValue = parseFloat(input.value);

    if (!isNaN(numValue) && numValue > 0) {
      // Zaokroži na dve decimalni mesti
      const roundedValue = Math.round(numValue * 100) / 100;

      // Posodobi trenutno celico
      this.matrix0[row][col] = roundedValue;

      // Posodobi transponirano celico kot recipročni element in zaokroži
      this.matrix0[col][row] = Math.round((1 / roundedValue) * 100) / 100;
    } else {
      // Če je vrednost neveljavna, ponastavi na prejšnjo vrednost
      input.value = this.matrix0[row][col].toFixed(2);
    }
  }

  public updateMatrix1(row: number, col: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const numValue = parseFloat(input.value);

    if (!isNaN(numValue) && numValue > 0) {
      // Zaokroži na dve decimalni mesti
      const roundedValue = Math.round(numValue * 100) / 100;

      // Posodobi trenutno celico
      this.matrix1[row][col] = roundedValue;

      // Posodobi transponirano celico kot recipročni element in zaokroži
      this.matrix1[col][row] = Math.round((1 / roundedValue) * 100) / 100;
    } else {
      // Če je vrednost neveljavna, ponastavi na prejšnjo vrednost
      input.value = this.matrix1[row][col].toFixed(2);
    }
  }

  public updateMatrix2(row: number, col: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const numValue = parseFloat(input.value);

    if (!isNaN(numValue) && numValue > 0) {
      // Zaokroži na dve decimalni mesti
      const roundedValue = Math.round(numValue * 100) / 100;

      // Posodobi trenutno celico
      this.matrix2[row][col] = roundedValue;

      // Posodobi transponirano celico kot recipročni element in zaokroži
      this.matrix2[col][row] = Math.round((1 / roundedValue) * 100) / 100;
    } else {
      // Če je vrednost neveljavna, ponastavi na prejšnjo vrednost
      input.value = this.matrix2[row][col].toFixed(2);
    }
  }

  public updateMatrix3(row: number, col: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const numValue = parseFloat(input.value);

    if (!isNaN(numValue) && numValue > 0) {
      // Zaokroži na dve decimalni mesti
      const roundedValue = Math.round(numValue * 100) / 100;

      // Posodobi trenutno celico
      this.matrix3[row][col] = roundedValue;

      // Posodobi transponirano celico kot recipročni element in zaokroži
      this.matrix3[col][row] = Math.round((1 / roundedValue) * 100) / 100;
    } else {
      // Če je vrednost neveljavna, ponastavi na prejšnjo vrednost
      input.value = this.matrix3[row][col].toFixed(2);
    }
  }

  public CheckMatrix0(): void {
    this.ahpServiceMatrix0.setComparisonMatrix(this.matrix0);
    this.c0_PriorityVectors_Weights = this.ahpServiceMatrix1.calculateAHP();
    localStorage.setItem('c0_PriorityVectors_Weights', JSON.stringify(this.c0_PriorityVectors_Weights));
    // Consistency checks
    this.matrix0Consistency = this.ahpServiceMatrix0.calculateConsistency();
    this.cdr.detectChanges();
  }

  public CheckMatrix1(): void {
    this.ahpServiceMatrix1.setComparisonMatrix(this.matrix1);
    this.c1_PriorityVectors = this.ahpServiceMatrix1.calculateAHP();
    localStorage.setItem('c1_PriorityVectors', JSON.stringify(this.c1_PriorityVectors));
    // Consistency checks
    this.matrix1Consistency = this.ahpServiceMatrix1.calculateConsistency();
    this.cdr.detectChanges();
  }

  public CheckMatrix2(): void {
    this.ahpServiceMatrix2.setComparisonMatrix(this.matrix2);
    this.c2_PriorityVectors = this.ahpServiceMatrix2.calculateAHP();
    localStorage.setItem('c2_PriorityVectors', JSON.stringify(this.c2_PriorityVectors));
    // Consistency checks
    this.matrix2Consistency = this.ahpServiceMatrix2.calculateConsistency();
    this.cdr.detectChanges();
  }

  public CheckMatrix3(): void {
    this.ahpServiceMatrix3.setComparisonMatrix(this.matrix3);
    this.c3_PriorityVectors = this.ahpServiceMatrix3.calculateAHP();
    localStorage.setItem('c3_PriorityVectors', JSON.stringify(this.c3_PriorityVectors));
    // Consistency checks
    this.matrix3Consistency = this.ahpServiceMatrix3.calculateConsistency();
    this.cdr.detectChanges();
  }

  //Save all and Process Analysis 
  public submitAllMatrices(): void {

    //refresh Matrices
    this.CheckMatrix0();
    this.CheckMatrix1();
    this.CheckMatrix2();
    this.CheckMatrix3();

    this.ahpServiceMatrix0.setComparisonMatrix(this.matrix0);
    this.results0 = this.ahpServiceMatrix0.calculateAHP();
    localStorage.setItem('Criteria_0_Weights', JSON.stringify(this.results0));
    // Consistency checks
    this.matrix0Consistency = this.ahpServiceMatrix0.calculateConsistency();
    this.cdr.detectChanges();

    this.ahpServiceMatrix1.setComparisonMatrix(this.matrix1);
    this.results1 = this.ahpServiceMatrix1.calculateAHP();
    localStorage.setItem('Criteria_1_Weights', JSON.stringify(this.results1));
    // Consistency checks
    this.matrix1Consistency = this.ahpServiceMatrix1.calculateConsistency();
    this.cdr.detectChanges();

    this.ahpServiceMatrix2.setComparisonMatrix(this.matrix2);
    this.results2 = this.ahpServiceMatrix2.calculateAHP();
    localStorage.setItem('Criteria_2_Weights', JSON.stringify(this.results2));
    // Consistency checks    
    this.matrix2Consistency = this.ahpServiceMatrix2.calculateConsistency();

    this.ahpServiceMatrix3.setComparisonMatrix(this.matrix3);
    this.results3 = this.ahpServiceMatrix3.calculateAHP();
    localStorage.setItem('Criteria_3_Weights', JSON.stringify(this.results3));
    // Consistency checks     
    this.matrix3Consistency = this.ahpServiceMatrix3.calculateConsistency();

    this.calculateAHPResults();
    this.displayCombinedResults();

    // Zahtevaj,da Angular, ponovno preveri DOM, preden izrišemo graf
    this.cdr.detectChanges();

    // Počisti obstoječe grafe in izriši nove
    this.createCharts();

    //scrolldown page
    this.targetSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


  //calculate AHP Final Results

  public calculateAHPResults(): void {
    // Retrieve data from localStorage
    const c0_PriorityVectors_Weights = JSON.parse(
      localStorage.getItem("c0_PriorityVectors_Weights") || "[]"
    );
    const c1_PriorityVectors = JSON.parse(
      localStorage.getItem("c1_PriorityVectors") || "[]"
    );
    const c2_PriorityVectors = JSON.parse(
      localStorage.getItem("c2_PriorityVectors") || "[]"
    );
    const c3_PriorityVectors = JSON.parse(
      localStorage.getItem("c3_PriorityVectors") || "[]"
    );

    // Ensure weights array and priority vectors are valid
    if (
      !Array.isArray(c0_PriorityVectors_Weights) ||
      c0_PriorityVectors_Weights.length !== 3 ||
      !Array.isArray(c1_PriorityVectors) ||
      !Array.isArray(c2_PriorityVectors) ||
      !Array.isArray(c3_PriorityVectors)
    ) {
      console.error("Invalid data in localStorage");
      return;
    }

    // Helper function to calculate weighted sum
    const calculateWeightedSum = (priorityVector: number[], weight: number): number => {
      return priorityVector.reduce((sum, value) => sum + value * weight, 0);
    };

    // Calculate sums for c1, c2, and c3
    const c1Sum = calculateWeightedSum(c1_PriorityVectors, c0_PriorityVectors_Weights[0]);
    const c2Sum = calculateWeightedSum(c2_PriorityVectors, c0_PriorityVectors_Weights[1]);
    const c3Sum = calculateWeightedSum(c3_PriorityVectors, c0_PriorityVectors_Weights[2]);

    // Store the results in localStorage
    const AHP_Results = {
      c1: c1Sum,
      c2: c2Sum,
      c3: c3Sum,

    };
    localStorage.setItem("AHP_Results", JSON.stringify(AHP_Results));

    console.log("AHP Results calculated and stored:", AHP_Results);

  }


  //for displaying combined results in table
  displayCombinedResults(): void {
    const storedAHPResults = localStorage.getItem('AHP_Results');
    const storedSelectedData = localStorage.getItem('selectedData');

    if (storedAHPResults && storedSelectedData) {
      const ahpResults = JSON.parse(storedAHPResults);
      const selectedData = JSON.parse(storedSelectedData);

      // Extract table headers from the first row of selectedData
      this.tableHeaders = [...selectedData[0], "AHP Result"];

      // Combine selectedData with AHP results
      this.combinedData = selectedData.slice(1).map((row: any, index: number) => {
        const ahpResult = ahpResults[`c${index + 1}`] || 0; // Use c1, c2, c3...
        return {
          values: row,
          ahpResult: ahpResult
        };
      });
    } else {
      console.error('AHP_Results or selectedData is missing in localStorage');
    }
  }

  //createCharts Method
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


}
