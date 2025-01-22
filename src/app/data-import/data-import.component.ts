import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-data-import',
  templateUrl: './data-import.component.html',
  styleUrl: './data-import.component.css'
})
export class DataImportComponent implements OnInit {

  constructor(private router: Router, private toastr: ToastrService, private popup: PopupService) {}

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
      this.toastr.success('Data imported successfuly.');
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

    localStorage.clear();
    const target: DataTransfer = <DataTransfer>event.target;

    if (target.files.length !== 1) {
        this.toastr.error('Only one file at a time can be uploaded.');
        throw new Error('Only one file at a time.');
    }

    const file: File = target.files[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['xlsx', 'xls'];

    if (!validExtensions.includes(fileExtension || '')) {
        this.popup.showPopup('Invalid file type', 'Please upload an Excel file (.xlsx or .xls).');
        return;
    }

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

    reader.readAsArrayBuffer(file);
    this.isData = true;
    this.toastr.success('Data imported successfully.');
}

 
   proceedToSelectData() {
    this.router.navigate(['/select-data']);
   }
}
