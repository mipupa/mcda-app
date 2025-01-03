import { Component, OnInit } from '@angular/core';
import { AhpService } from './services/ahp.service';

@Component({
  selector: 'app-ahp-method',
  templateUrl: './ahp-method.component.html',
  styleUrl: './ahp-method.component.css'
})


export class AhpMethodComponent implements OnInit {

  //selectedData: AHPData = { alternatives: [], criteria: [], comparisons: [] };
  selectedData: any[] = [];
  criteria: string[] = ['Criterion1', 'Criterion2', 'Criterion3']; // Kriteriji 

  public matrix1: number[][] = [];
  public results1: number[] = [];
  public options1: string[] = [];

  public matrix2: number[][] = [];
  public results2: number[] = [];
  public options2: string[] = [];

  public matrix3: number[][] = [];
  public results3: number[] = [];
  public options3: string[] = [];

  constructor(private ahpService: AhpService) {}

  ngOnInit(): void {
    const storedData = JSON.parse(localStorage.getItem('selectedData') || '[]');

    const storedDataTable = localStorage.getItem('selectedData');
    if (storedDataTable) {
      this.selectedData = JSON.parse(storedDataTable);
      this.criteria = this.selectedData[0].slice(1).map((_: unknown, index: number) => `Criteria ${index + 1}`);
    } else {
      alert('Ni izbranih podatkov v localStorage!');
    }

    this.initializeMatrix1();
    this.initializeMatrix2();
    this.initializeMatrix3();
  }

  private initializeMatrix1(): void {
    const selectedDataString = localStorage.getItem('selectedData');
    const selectedData = selectedDataString ? JSON.parse(selectedDataString) : [];
    this.options1 = selectedData.map((item: any) => item[0]); // Extract option names
    const size = this.options1.length;

    // Create a square matrix filled with 1s
    this.matrix1 = Array.from({ length: size }, () => Array(size).fill(1));
  }

  private initializeMatrix2(): void {
    const selectedDataString = localStorage.getItem('selectedData');
    const selectedData = selectedDataString ? JSON.parse(selectedDataString) : [];
    this.options2 = selectedData.map((item: any) => item[0]); // Extract option names
    const size = this.options2.length;

    // Create a square matrix filled with 1s
    this.matrix2 = Array.from({ length: size }, () => Array(size).fill(1));
  }

  private initializeMatrix3(): void {
    const selectedDataString = localStorage.getItem('selectedData');
    const selectedData = selectedDataString ? JSON.parse(selectedDataString) : [];
    this.options3 = selectedData.map((item: any) => item[0]); // Extract option names
    const size = this.options3.length;

    // Create a square matrix filled with 1s
    this.matrix3 = Array.from({ length: size }, () => Array(size).fill(1));
  }

  public updateMatrix1(row: number, col: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const numValue = parseFloat(input.value);
    if (!isNaN(numValue)) {
      this.matrix1[row][col] = numValue;
      this.matrix1[col][row] = 1 / numValue;
    }
  }

  public updateMatrix2(row: number, col: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const numValue = parseFloat(input.value);
    if (!isNaN(numValue)) {
      this.matrix2[row][col] = numValue;
      this.matrix2[col][row] = 1 / numValue;
    }
  }

  public updateMatrix3(row: number, col: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const numValue = parseFloat(input.value);
    if (!isNaN(numValue)) {
      this.matrix3[row][col] = numValue;
      this.matrix3[col][row] = 1 / numValue;
    }
  }

  /*
  public submitMatrix(): void {
    this.ahpService.setComparisonMatrix(this.matrix1);
    this.results1 = this.ahpService.calculateAHP();
     // Shranjevanje v localStorage
   localStorage.setItem('Criteria_1_Weights', JSON.stringify(this.results1));
  }
   */

  public submitAllMatrices(): void {
    this.ahpService.setComparisonMatrix(this.matrix1);
    this.results1 = this.ahpService.calculateAHP();
    localStorage.setItem('Criteria_1_Weights', JSON.stringify(this.results1));
    this.ahpService.setComparisonMatrix(this.matrix2);
    this.results2 = this.ahpService.calculateAHP();
    localStorage.setItem('Criteria_2_Weights', JSON.stringify(this.results2));
    this.ahpService.setComparisonMatrix(this.matrix3);
    this.results3 = this.ahpService.calculateAHP();
    localStorage.setItem('Criteria_3_Weights', JSON.stringify(this.results3));
  }
}