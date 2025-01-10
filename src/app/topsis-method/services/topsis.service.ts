import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TopsisService {

  constructor() { }

  // Method to fetch data from localStorage
  getSelectedData(): any[] {
    const data = localStorage.getItem('selectedData');
    return data ? JSON.parse(data) : [];
  }

  // Normalize the decision matrix
  normalizeMatrix(data: number[][], method: 'v' | 'l'): number[][] {
    if (method === 'v') {
      // Vector normalization
      const denominators = data[0].map((_, colIndex) =>
        Math.sqrt(data.reduce((sum, row) => sum + Math.pow(row[colIndex], 2), 0))
      );
      return data.map(row =>
        row.map((value, index) => +(value / denominators[index]).toFixed(3))
      );
    } else {
      // Linear normalization
      const maxValues = data[0].map((_, colIndex) =>
        Math.max(...data.map(row => row[colIndex]))
      );
      return data.map(row =>
        row.map((value, index) => +(value / maxValues[index]).toFixed(3))
      );
    }
  }

  // Apply weights to the normalized matrix
  applyWeights(matrix: number[][], weights: number[]): number[][] {
    return matrix.map(row =>
      row.map((value, index) => +(value * weights[index]).toFixed(3))
    );
  }

  // Determine ideal best and worst solutions
  determineIdealSolutions(
    weightedMatrix: number[][],
    criteriaTypes: string[]
  ): { idealBest: number[]; idealWorst: number[] } {
    const numCriteria = criteriaTypes.length;
    const idealBest = Array(numCriteria).fill(0);
    const idealWorst = Array(numCriteria).fill(0);

    for (let j = 0; j < numCriteria; j++) {
      const column = weightedMatrix.map(row => row[j]);
      if (criteriaTypes[j] === 'beneficial') {
        idealBest[j] = Math.max(...column);
        idealWorst[j] = Math.min(...column);
      } else {
        idealBest[j] = Math.min(...column);
        idealWorst[j] = Math.max(...column);
      }
    }

    return { idealBest, idealWorst };
  }

  // Calculate distances to ideal best and worst solutions
  calculateDistances(
    weightedMatrix: number[][],
    idealBest: number[],
    idealWorst: number[]
  ): { bestDistances: number[]; worstDistances: number[] } {
    const bestDistances = weightedMatrix.map(row =>
      Math.sqrt(row.reduce((sum, value, index) => sum + Math.pow(value - idealBest[index], 2), 0))
    );

    const worstDistances = weightedMatrix.map(row =>
      Math.sqrt(row.reduce((sum, value, index) => sum + Math.pow(value - idealWorst[index], 2), 0))
    );

    return { bestDistances, worstDistances };
  }

  // Calculate TOPSIS scores
  calculateScores(bestDistances: number[], worstDistances: number[]): number[] {
    return bestDistances.map((dBest, index) => {
      const dWorst = worstDistances[index];
      return +(dWorst / (dBest + dWorst)).toFixed(3);
    });
  }

  // Main method to execute the TOPSIS algorithm
  runTopsis(
    weights: number[],
    criteriaTypes: string[],
    normMethod: 'v' | 'l' = 'v'
  ): {
    alternatives: { alternative: string; idealDistance: number; antiIdealDistance: number; closenessCoefficient: number }[];
  } {
    const data = this.getSelectedData();
    if (!data || data.length < 2) {
      throw new Error('Invalid or insufficient data');
    }

    const alternatives = data.slice(1).map(row => row[0]);
    const matrix = data.slice(1).map(row => row.slice(1));
    const normalizedMatrix = this.normalizeMatrix(matrix, normMethod);
    const weightedMatrix = this.applyWeights(normalizedMatrix, weights);
    const { idealBest, idealWorst } = this.determineIdealSolutions(weightedMatrix, criteriaTypes);
    const { bestDistances, worstDistances } = this.calculateDistances(weightedMatrix, idealBest, idealWorst);
    const scores = this.calculateScores(bestDistances, worstDistances);

    const result = alternatives.map((alternative, index) => ({
      alternative,
      rank: (index + 1).toString(),
      idealDistance: bestDistances[index],
      antiIdealDistance: worstDistances[index],
      closenessCoefficient: scores[index],
    }));

    // Save results to localStorage
    localStorage.setItem('TOPSIS_Results', JSON.stringify(result));

    return { alternatives: result };
  }
}

