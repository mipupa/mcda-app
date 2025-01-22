import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-data',
  templateUrl: './select-data.component.html',
  styleUrl: './select-data.component.css',
  
})
export class SelectDataComponent implements OnInit{

  isData: boolean = false;
  data: any[] = [];
  columns: string[] = [];
  selectedRows: number[] = []; // Indeksi izbranih vrstic
  selectedData: any[] = [];   // Izbrani podatki za shranjevanje

  ngOnInit(): void {
    const importedData = localStorage.getItem('importedData');

    if (importedData) {
      this.isData = true;
      try {
        const jsonData = JSON.parse(importedData);               
          this.columns = jsonData[0] as string[];
          this.data = jsonData.slice(1);
          
        console.log('Uspelo je branje JSON podatkov iz localStorage:', this.data);
        
      } catch (error) {
        console.error('Napaka pri parsiranju podatkov iz localStorage:', error);
      }
    } else {
      console.warn('localStorage ne vsebuje ključa "importedData".');
    }
  }


  constructor(private router: Router) {}  

  toggleSelection(index: number, row: any): void {
    const selectedIndex = this.selectedRows.indexOf(index);
    this.clearLocalStorageExceptKeys(['importedData', 'selectedData'])

    if (selectedIndex > -1) {
      // Odstrani vrstico iz izbire
      this.selectedRows.splice(selectedIndex, 1);
      this.selectedData = this.selectedRows.map(i => this.data[i]);
    } else if (this.selectedRows.length < 20) {
      // Dodaj vrstico v izbiro
      this.selectedRows.push(index);
      this.selectedData.push(row);
    }

    // Dinamično pridobi naslove stolpcev
    const columnHeaders = this.columns; // Pridobivanje naslovov stolpcev iz this.columns
    const dataWithHeaders = [columnHeaders, ...this.selectedData];
    localStorage.setItem('selectedData', JSON.stringify(dataWithHeaders));
}
  
 
  proceedToAnalysis(): void {
    if (this.selectedRows.length > 0) {
      this.router.navigate(['/choose-method']);
    } else {
      alert('Izberite točno 3 podjetja pred nadaljevanjem!');
    }
  }

  clearLocalStorageExceptKeys(keysToKeep: string[]): void {
    // Shrani vrednosti ključev, ki jih želiš obdržati
    const valuesToKeep = keysToKeep.reduce((acc, key) => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        acc[key] = value; // Shrani ključ in njegovo vrednost
      }
      return acc;
    }, {} as { [key: string]: string });
  
    // Počisti celoten localStorage
    localStorage.clear();
  
    // Ponovno shrani vrednosti ključev, ki jih želiš obdržati
    Object.entries(valuesToKeep).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  }

}
