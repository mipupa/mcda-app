import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-data-import',
  templateUrl: './data-import.component.html',
  styleUrl: './data-import.component.css'
})
export class DataImportComponent {

  constructor(private router: Router) {}

  data: any[] = [];
  columns: string[] = [];
  selectedRows: number[] = []; // Indeksi izbranih vrstic
  selectedData: any[] = [];   // Izbrani podatki za shranjevanje

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) throw new Error('Only one file at a time.');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const arrayBuffer: ArrayBuffer = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(arrayBuffer, { type: 'array' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });      
      this.columns = jsonData[0] as string[];
      this.data = jsonData.slice(1);
      
      // Shrani celotno tabelo (vključno z glavo in podatki) v localStorage
      localStorage.setItem('importedData', JSON.stringify(jsonData));
            
    };
    reader.readAsArrayBuffer(target.files[0]);
  }

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
