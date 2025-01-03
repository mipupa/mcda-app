import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AhpService {

  constructor() { }

  private comparisonMatrix: number[][] = [];

  // Set the pairwise comparison matrix
  public setComparisonMatrix(matrix: number[][]): void {
    this.comparisonMatrix = matrix;
  }

  // Calculate priority vector and eigenvalue
  private calculatePriorityVector(matrix: number[][]): { priorities: number[]; eigenValue: number } {
    const n = matrix.length;
    const sumCols = Array(n).fill(0);

    // Sum columns
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        sumCols[j] += matrix[i][j];
      }
    }

    // Normalize the matrix
    const normalizedMatrix = matrix.map((row, i) =>
      row.map((value, j) => value / sumCols[j])
    );

    // Calculate the priority vector
    const priorities = normalizedMatrix.map((row) =>
      row.reduce((sum, value) => sum + value, 0) / n
    );

    // Calculate eigenvalue
    const eigenValue = priorities
      .map((priority, i) => priority * sumCols[i])
      .reduce((sum, value) => sum + value, 0);

    return { priorities, eigenValue };
  }

  // Perform AHP calculation
  public calculateAHP(): number[] {
    const { priorities } = this.calculatePriorityVector(this.comparisonMatrix);
    return priorities.map(priority => parseFloat(priority.toFixed(2)));
  }

  // Get the size of the matrix from selectedData
  public getMatrixSize(): number {
    const selectedData = JSON.parse(localStorage.getItem('selectedData') || '[]');
    return selectedData.length;
  }
}

