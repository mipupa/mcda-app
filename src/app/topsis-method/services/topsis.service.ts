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
  normalizeMatrix(data: any[], weights: number[]): number[][] {
    const numCriteria = weights.length;
    const normalizedMatrix: number[][] = [];

    // Calculate normalization denominator for each criterion
    const denominators = Array(numCriteria).fill(0);
    for (let j = 1; j <= numCriteria; j++) {
      denominators[j - 1] = Math.sqrt(data.slice(1).reduce((sum, row) => sum + Math.pow(row[j], 2), 0));
    }

    // Normalize each value
    for (let i = 1; i < data.length; i++) {
      const row = [];
      for (let j = 1; j <= numCriteria; j++) {
        row.push(data[i][j] / denominators[j - 1]);
      }
      normalizedMatrix.push(row);
    }

    console.log('Normalized Matrix:', normalizedMatrix);
    return normalizedMatrix;
  }

  // Calculate weighted normalized matrix
  applyWeights(normalizedMatrix: number[][], weights: number[]): number[][] {
    const weightedMatrix = normalizedMatrix.map(row => row.map((value, index) => value * weights[index]));
    console.log('Weighted Matrix:', weightedMatrix);
    return weightedMatrix;
  }

  // Determine ideal best and worst solutions
  determineIdealSolutions(weightedMatrix: number[][], criteriaTypes: string[]): { idealBest: number[], idealWorst: number[] } {
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

    console.log('Ideal Best:', idealBest);
    console.log('Ideal Worst:', idealWorst);
    return { idealBest, idealWorst };
  }

  // Calculate distances to ideal best and worst solutions
  calculateDistances(weightedMatrix: number[][], idealBest: number[], idealWorst: number[]): { bestDistances: number[], worstDistances: number[] } {
    const bestDistances = weightedMatrix.map(row => {
      return Math.sqrt(row.reduce((sum, value, index) => sum + Math.pow(value - idealBest[index], 2), 0));
    });

    const worstDistances = weightedMatrix.map(row => {
      return Math.sqrt(row.reduce((sum, value, index) => sum + Math.pow(value - idealWorst[index], 2), 0));
    });

    console.log('Best Distances:', bestDistances);
    console.log('Worst Distances:', worstDistances);
    return { bestDistances, worstDistances };
  }

  // Calculate TOPSIS scores
  calculateScores(bestDistances: number[], worstDistances: number[]): number[] {
    return bestDistances.map((dBest, index) => {
      const dWorst = worstDistances[index];
      return dBest + dWorst === 0 ? 0 : dWorst / (dBest + dWorst);
    });
  }

  // Main method to execute the TOPSIS algorithm
  runTopsis(weights: number[], criteriaTypes: string[]): {
    rankedAlternatives: { alternative: string, score: number, bestDistance: number, worstDistance: number, idealBest: number[], idealWorst: number[] }[]
  } {
    const data = this.getSelectedData();
    if (!data || data.length < 2) {
      throw new Error('Invalid or insufficient data');
    }

    const alternatives = data.slice(1).map(row => row[0]);
    const normalizedMatrix = this.normalizeMatrix(data, weights);
    const weightedMatrix = this.applyWeights(normalizedMatrix, weights);
    const { idealBest, idealWorst } = this.determineIdealSolutions(weightedMatrix, criteriaTypes);
    const { bestDistances, worstDistances } = this.calculateDistances(weightedMatrix, idealBest, idealWorst);
    const scores = this.calculateScores(bestDistances, worstDistances);
    const rankedAlternatives = alternatives.map((alternative, index) => ({
      alternative,
      score: scores[index],
      bestDistance: bestDistances[index],
      worstDistance: worstDistances[index],
      idealBest,
      idealWorst
    })).sort((a, b) => b.score - a.score);

    // Save results to localStorage
    const resultsWithRank = rankedAlternatives.map((item, index) => ({
      ...item,
      rank: (index + 1).toString()
    }));
    localStorage.setItem('TOPSIS_Results', JSON.stringify(resultsWithRank));

    return { rankedAlternatives };
  }
}


