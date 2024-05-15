import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';
import { NotifierService } from 'angular-notifier'

// расширение файла
const EXCEL_EXTENSION = '.xlsx'

/**
 * Описание листа Excel
 */
export class ExcelSheet {

    // имя листа
    private name: string

    // данные на листе
    private data: Array<any> = []

    // настройки (оформление)
    private options: any

    /**
     * {@inheritdoc}
     */
    public constructor(
        name: string, 
        data: Array<any> = [], 
        options: any = null,
    ) {
        this.name = name
        this.data = data
        this.options = options
    }

    /**
     * Добавить строку данных
     * @param {any} row 
     * @returns {void}
     */
    public dataAdd(row: any): void {
        this.data.push(row)
    }

    /**
     * Количество строк данных
     * @returns {number}
     */
    public countRows(): number {
        return this.data.length
    }

    /**
     * Сохранение настроек
     * @param {any} options 
     * @returns {void}
     */
    public setOptions(options: any): void {
        this.options = options
    }

    /**
     * Имя листа
     * @returns {string}
     */
    public getName(): string {
        return this.name        
    }

    /**
     * Данные
     * @returns {Array<any>} 
     */
    public getData(): Array<any> {
        return this.data
    }

    /**
     * Опции
     * @returns {any}
     */
    public getOptions(): any {
        return this.options
    }
}

/**
 * Экспорт в Excel
 * 
 * @example
 * 
 * excelData = {
 *     'Лист 1': {
 *         data: [
 *             { "Сумма": 2000, "Год": 2022 },
 *             { "Сумма": 3000, "Год": 2023 },
 *             { "Сумма": 4000, "Год": 2024 },
 *         ],
 *         options: {
 *             "!cols": [{wch: 15}, {wch: 10}],
 *         },
 *     },
 * }
 * 
 * excelService.export(excelData, "example_report")
 * 
 */
@Injectable({
    providedIn: 'root',
})
export class ExcelService {

    /**
     * @param {NotifierService} notifierService сервис уведомлений
     */
    public constructor(
        private notifierService: NotifierService
    ) {}

    /**
     * Запуск выгрузки
     * @param {ExcelSheet[]} sheets 
     * @param {string} fileName 
     * @returns {void}
     */
    public export(sheets: ExcelSheet[], fileName: string): void {
        if (sheets.length == 0) {
            this.notifierService.notify('info', 'Нет данных для экспорта в Excel!')
            return
        }

        const wb = XLSX.utils.book_new()
        sheets.forEach((sheet) => {
            let ws = XLSX.utils.json_to_sheet(sheet.getData())           
            Object.keys(sheet.getOptions()).forEach(key => {
                if (ws[key] != null) {
                    ws[key] = Object.assign(ws[key], sheet.getOptions()[key])
                }
                else {
                    ws[key] = sheet.getOptions()[key]
                }
            })                
            XLSX.utils.book_append_sheet(wb, ws, sheet.getName())

        })
        XLSX.writeFile(wb, fileName + EXCEL_EXTENSION)
    }

}