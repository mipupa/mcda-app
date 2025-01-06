import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrometheeService {

  constructor() {}

  // Method to fetch data from localStorage
  getSelectedData(): any[] {
    const data = localStorage.getItem('selectedData');
    return data ? JSON.parse(data) : [];
  }

  // Method to calculate preference matrix
  calculatePreferences(data: any[], weights: number[], criteriaTypes: string[]): number[][] {
    const preferenceMatrix: number[][] = [];
    const numCriteria = weights.length;

    for (let i = 1; i < data.length; i++) {
      const row = [];
      for (let j = 1; j < data.length; j++) {
        if (i === j) {
          row.push(0); // No preference for the same alternative
        } else {
          let preference = 0;
          for (let k = 1; k < numCriteria + 1; k++) {
            let difference = data[i][k] - data[j][k];
            // Adjust difference for nonbeneficial criteria
            if (criteriaTypes[k - 1] === 'nonbeneficial') {
              difference = -difference;
            }
            preference += weights[k - 1] * Math.max(0, difference); // Linear preference function
          }
          row.push(preference);
        }
      }
      preferenceMatrix.push(row);
    }
    return preferenceMatrix;
  }

  // Method to aggregate preference flows
  calculateFlows(preferenceMatrix: number[][]): { positive: number[], negative: number[], net: number[] } {
    const numAlternatives = preferenceMatrix.length;
    const positiveFlows = Array(numAlternatives).fill(0);
    const negativeFlows = Array(numAlternatives).fill(0);

    for (let i = 0; i < numAlternatives; i++) {
      for (let j = 0; j < numAlternatives; j++) {
        positiveFlows[i] += preferenceMatrix[i][j];
        negativeFlows[i] += preferenceMatrix[j][i];
      }
    }

    const netFlows = positiveFlows.map((flow, index) => flow - negativeFlows[index]);
    return { positive: positiveFlows, negative: negativeFlows, net: netFlows };
  }

  // Main method to execute the Promethee II algorithm
  runPromethee(weights: number[], criteriaTypes: string[]): { rankedAlternatives: { alternative: string, score: number, positiveFlow: number, negativeFlow: number }[] } {
    const data = this.getSelectedData();
    if (!data || data.length < 2) {
      throw new Error('Invalid or insufficient data');
    }

    const alternatives = data.slice(1).map(row => row[0]);
    const preferenceMatrix = this.calculatePreferences(data, weights, criteriaTypes);
    const flows = this.calculateFlows(preferenceMatrix);

    const rankedAlternatives = alternatives.map((alternative, index) => ({
      alternative,
      score: flows.net[index],
      positiveFlow: flows.positive[index],
      negativeFlow: flows.negative[index]
    })).sort((a, b) => b.score - a.score);

    // Add rank to each alternative and save to localStorage
    const resultsWithRank = rankedAlternatives.map((item, index) => ({
      alternativa: item.alternative,
      rank: (index + 1).toString(),
      rezultat: item.score,
      positiveFlow: item.positiveFlow,
      negativeFlow: item.negativeFlow
    }));
    localStorage.setItem('PrometheeII', JSON.stringify(resultsWithRank));

    return { rankedAlternatives };
  }
}