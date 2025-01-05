import { Component, OnInit } from '@angular/core';
import { AhpService } from './services/ahp.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ahp-method',
  templateUrl: './ahp-method.component.html',
  styleUrl: './ahp-method.component.css'
})
export class AhpMethodComponent implements OnInit {

  selectedData: any[] = [];
  alternatives: string[] = [];
  criteria: string[] = [];

  //for criteria vs criteria
  public matrix0: number[][] = [];
  public results0: number[] = [];
  public options0: string[] = [];

  //PriorityVectors values
  public c0_PriorityVectors_Weights: number[] =[];
  public c1_PriorityVectors: number[] =[];
  public c2_PriorityVectors: number[] =[];
  public c3_PriorityVectors: number[] =[];

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

  constructor(private ahpServiceMatrix0: AhpService,
              private ahpServiceMatrix1: AhpService,
              private ahpServiceMatrix2: AhpService,
              private ahpServiceMatrix3: AhpService,
              private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const storedData = JSON.parse(localStorage.getItem('selectedData') || '[]');
    const selectedData = localStorage.getItem('selectedData');
      if (selectedData) {
         this.selectedData = JSON.parse(selectedData);
         //pridobi alternative
         this.alternatives=storedData.slice(1);
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
    if (!isNaN(numValue)) {
      this.matrix0[row][col] = numValue;      
      this.matrix0[col][row] = 1 / numValue;
    }
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
  
   public submitAllMatrices(): void {

    this.ahpServiceMatrix1.setComparisonMatrix(this.matrix1);
    this.results1 = this.ahpServiceMatrix1.calculateAHP();    
    localStorage.setItem('Criteria_1_Weights', JSON.stringify(this.results1));
    // Consistency checks
    this.matrix1Consistency = this.ahpServiceMatrix1.calculateConsistency();    
    this.cdr.detectChanges();
    //console.log('matrix1Consistency',this.matrix1Consistency);
    
        
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
  }

}