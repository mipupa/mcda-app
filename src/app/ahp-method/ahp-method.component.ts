import { Component, OnInit } from '@angular/core';
import { AhpService } from './services/ahp.service';

@Component({
  selector: 'app-ahp-method',
  templateUrl: './ahp-method.component.html',
  styleUrl: './ahp-method.component.css'
})


export class AhpMethodComponent implements OnInit {

  //selectedData: AHPData = { alternatives: [], criteria: [], comparisons: [] };

  public matrix: number[][] = [];
  public results: number[] = [];
  public options: string[] = [];

  constructor(private ahpService: AhpService) {}

  ngOnInit(): void {
    this.initializeMatrix();
  }

  private initializeMatrix(): void {
    const selectedDataString = localStorage.getItem('selectedData');
    const selectedData = selectedDataString ? JSON.parse(selectedDataString) : [];
    this.options = selectedData.map((item: any) => item[0]); // Extract option names
    const size = this.options.length;

    // Create a square matrix filled with 1s
    this.matrix = Array.from({ length: size }, () => Array(size).fill(1));
  }

  public updateMatrix(row: number, col: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const numValue = parseFloat(input.value);
    if (!isNaN(numValue)) {
      this.matrix[row][col] = numValue;
      this.matrix[col][row] = 1 / numValue;
    }
  }

  public submitMatrix(): void {
    this.ahpService.setComparisonMatrix(this.matrix);
    this.results = this.ahpService.calculateAHP();
  }
}