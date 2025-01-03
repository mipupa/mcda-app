import { Component, OnInit } from '@angular/core';
import { AHPData } from './ahp.model';

@Component({
  selector: 'app-ahp-method',
  templateUrl: './ahp-method.component.html',
  styleUrl: './ahp-method.component.css'
})


export class AhpMethodComponent implements OnInit {

  selectedData: AHPData = { alternatives: [], criteria: [], comparisons: [] };
  consistencyRatio: number | null = null;

  ngOnInit(): void {
    this.loadAHPData();
  }

  loadAHPData(): void {
    const data = localStorage.getItem('selectedData');
    if (data) {
      const parsedData = JSON.parse(data) as any[]; // any[] to handle nested arrays
      this.selectedData.alternatives = parsedData.map(d => d[0]);
      this.selectedData.comparisons = parsedData.map(d => d.slice(1));
      this.selectedData.criteria = this.extractCriteria(parsedData);
    }
  }

  extractCriteria(data: any[]): string[] {
    if (data.length > 0) {
      return Object.keys(data[0]).slice(1).map((_, index) => `Criterion ${index + 1}`);
    }
    return [];
  }

  calculateConsistency(): void {
    const n = this.selectedData.criteria.length;
    const consistencyMatrix = this.calculateConsistencyMatrix();
    const consistencyIndex = this.calculateConsistencyIndex(consistencyMatrix);
    this.consistencyRatio = consistencyIndex / (n - 1);
  }

  calculateConsistencyMatrix(): number[][] {
    const n = this.selectedData.criteria.length;
    const matrix = this.selectedData.comparisons;
    let consistencyMatrix: number[][] = [];

    for (let i = 0; i < n; i++) {
      consistencyMatrix[i] = [];
      for (let j = 0; j < n; j++) {
        if (i === j) {
          consistencyMatrix[i][j] = 1; // Diagonal elements are always 1
        } else {
          consistencyMatrix[i][j] = matrix[i][j]; // User-input values
        }
      }
    }

    // Fill reciprocals for the matrix
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        consistencyMatrix[j][i] = 1 / consistencyMatrix[i][j];
      }
    }

    return consistencyMatrix;
  }

  calculateConsistencyIndex(matrix: number[][]): number {
    const n = this.selectedData.criteria.length;
    const consistencyVector = matrix.map((row, i) => row[i] / matrix[i][i]);
    const lambdaMax = consistencyVector.reduce((sum, val) => sum + val) / n;
    const CI = (lambdaMax - n) / (n - 1);
    const CR = CI / 0.58;
    return CI * 100; // Convert CI to percentage
  }

  getRandomConsistencyIndex(n: number): number {
    const RI = [0, 0, 0.52, 0.89, 1.11]; // Random Index values for n=3 to n=5
    return RI[n - 1];
  }
}