import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { NotifierService } from 'angular-notifier'

const EXCEL_EXTENSION = '.xlsx'
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

@Injectable({
    providedIn: 'root',
})
export class ExcelService {
    public constructor(
        private notifierService: NotifierService
    ) {}

    public exportToExcel(data: any, fileName: string) {
        if (Object.keys(data).length == 0) {
            this.notifierService.notify('info', 'Нет данных для экспорта в Excel!')
            return
        }        

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
        
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        this.saveAsExcelFile(excelBuffer, fileName + EXCEL_EXTENSION)
    }

    
    private saveAsExcelFile(buffer: any, fileName: string) {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE })
        FileSaver.saveAs(data, fileName)
    }
    
}