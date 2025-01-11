import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  
  ahpResults: any[] = [];
  topsisResults: any[] = [];
  prometheeResults: any[] = [];
  wsmResults: any[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    
      // Pridobimo in obdelamo podatke za AHP Results
  const ahpRawData = JSON.parse(localStorage.getItem('AHP_Results_Combined') || '[]');
  this.ahpResults = ahpRawData.map((item: { values: any[]; ahpResult: any; rank: any; }) => ({
    Alternative: item.values[0],
    Value1: item.values[1],
    Value2: item.values[2],
    Value3: item.values[3],
    Result: item.ahpResult,
    Rank: item.rank
  }));
  
    // TOPSIS Results
    const topsisRawData = JSON.parse(localStorage.getItem('TOPSIS_Results') || '[]');
    if (Array.isArray(topsisRawData)) {
      this.topsisResults = topsisRawData.map((item: any) => ({
        Alternative: item.Alternative,
        Ideal_Distance: item.Ideal_Distance,
        Anti_Ideal_Distance: item.Anti_Ideal_Distance,
        Result: item.Result,
        Rank: parseInt(item.rank, 10)
      }));
    } else {
      console.warn('TOPSIS Results is not an array:', topsisRawData);
    }
  
    // Promethee II Results
    const prometheeRawData = JSON.parse(localStorage.getItem('PrometheeII_Results') || '[]');
    if (Array.isArray(prometheeRawData)) {
      this.prometheeResults = prometheeRawData.map((item: any) => ({
        Alternative: item.Alternative,
        PositiveFlow: item.PositiveFlow,
        NegativeFlow: item.NegativeFlow,
        NetFlow: item.NetFlow,
        Result: item.Result,
        Rank: parseInt(item.Ranking, 10)
      }));
    } else {
      console.warn('Promethee II Results is not an array:', prometheeRawData);
    }
  
    // WSM Results
    const wsmRawData = JSON.parse(localStorage.getItem('WSM_Results') || '[]');
    if (Array.isArray(wsmRawData)) {
      this.wsmResults = wsmRawData.map((item: any) => ({
        Alternative: item.alternative,
        Result: item.rezultat,
        Rank: 0 // Calculate rank dynamically
      }));
      this.wsmResults = this.rankResults(this.wsmResults, 'Result');
    } else {
      console.warn('WSM Results is not an array:', wsmRawData);
    }
  }
  rankResults(data: any[], key: string): any[] {
    const sortedData = [...data].sort((a, b) => b[key] - a[key]);
    sortedData.forEach((item, index) => {
      item.Rank = index + 1;
    });
    return sortedData;
  }
}


interface AHPResult {
  values: [string, number, number, number];
  ahpResult: number;
  rank: number;
}

interface TOPSISResult {
  Alternative: string;
  Ideal_Distance: number;
  Anti_Ideal_Distance: number;
  Result: number;
  rank: string;
}

interface PrometheeResult {
  Alternative: string;
  PositiveFlow: number;
  NegativeFlow: number;
  NetFlow: number;
  Result: number;
  Ranking: string;
}

interface WSMResult {
  alternative: string;
  rezultat: number;
}
