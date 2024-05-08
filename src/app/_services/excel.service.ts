import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

const EXCEL_EXTENSION = '.xlsx'

@Injectable({
    providedIn: 'root',
})
export class ExcelService {
    public constructor() {}

    public exportToExcel(data: any, fileName: string) {
        let sheets: any = {}
        let sheetNames: string[] = []

        Object.keys(data).forEach((key) => {
            sheets[key] = XLSX.utils.json_to_sheet(data[key])
            sheetNames.push(key)
        })        
        
        const workbook: XLSX.WorkBook = {
            Sheets: sheets,
            SheetNames: sheetNames,
        }
        XLSX.writeFile(workbook, fileName + "_export" + EXCEL_EXTENSION, { bookType: 'xlsx', type: 'array' })        
    }
    
}