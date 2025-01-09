import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-data-import',
  templateUrl: './data-import.component.html',
  styleUrl: './data-import.component.css'
})
export class DataImportComponent implements OnInit {

  constructor(private router: Router) {}

  isData:boolean = false;
  data: any[] = [];
  columns: string[] = [];
  //selectedRows: number[] = []; // Indeksi izbranih vrstic
  //selectedData: any[] = [];   // Izbrani podatki za shranjevanje

  ngOnInit(): void {
    
  }

  //Import from JSON file inside app method
  async importJsonToLocalStorage(filePath: string): Promise<void> {
    try {
      // Preberemo datoteko z uporabo fetch
      const response = await fetch(filePath);
      
      // Preverimo, ali je zahteva uspela
      if (!response.ok) {
        throw new Error(`Napaka pri branju datoteke: ${response.statusText}`);
      }
      
      // Parsiramo JSON vsebino
      const jsonData = await response.json();
  
      // Shranimo podatke v localStorage pod ključem "importedData"
      localStorage.setItem('importedData', JSON.stringify(jsonData));
  
      console.log('Podatki uspešno shranjeni v localStorage pod ključem "importedData".');
    } catch (error) {
      console.error('Napaka:', error);
    }
  }
  //klic funkcije za json import file
  fortuneGlobalData() {
    this.importJsonToLocalStorage('./assets/json-data/fortuneGlobal500-2024.json');
    this.isData=true;   
  }
  

  //Import from excel file outside app
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
 
   proceedToSelectData() {
    this.router.navigate(['/select-data']);
   }
}
