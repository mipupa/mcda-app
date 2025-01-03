import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-data',
  templateUrl: './choose-data.component.html',
  styleUrl: './choose-data.component.css'
})
export class ChooseDataComponent implements OnInit {

  data: any[] = [];
  columns: string[] = [];
  selectedRows: number[] = []; // Indeksi izbranih vrstic
  selectedData: any[] = [];   // Izbrani podatki za shranjevanje

  ngOnInit(): void {
    const importedTable = localStorage.getItem('importedData');
  if (importedTable) {
    const tableData = JSON.parse(importedTable);
    this.columns = tableData[0] as string[]; // Prva vrstica kot glave stolpcev
    this.data = tableData.slice(1);         // Preostale vrstice kot podatki
  } else {
    console.warn('No table data found in localStorage.');
    this.columns = [];
    this.data = [];
  }
  }

  constructor(private router: Router) {} 

  toggleSelection(index: number, row: any): void {
    const selectedIndex = this.selectedRows.indexOf(index);

    if (selectedIndex > -1) {
      // Odstrani vrstico iz izbire
      this.selectedRows.splice(selectedIndex, 1);
      this.selectedData = this.selectedRows.map(i => this.data[i]);
    } else if (this.selectedRows.length < 3) {
      // Dodaj vrstico v izbiro
      this.selectedRows.push(index);
      this.selectedData.push(row);
    }

    // Posodobi localStorage
    localStorage.setItem('selectedData', JSON.stringify(this.selectedData));
  }

  proceedToAnalysis(): void {
    if (this.selectedRows.length === 3) {
      this.router.navigate(['/choose-method']);
    } else {
      alert('Izberite točno 3 podjetja pred nadaljevanjem!');
    }
  }

}
