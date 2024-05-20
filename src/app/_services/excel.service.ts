import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';
import { NotifierService } from 'angular-notifier';
import { ExcelSheet } from '../models/excel/sheet';


// расширение файла
const EXCEL_EXTENSION = '.xlsx';

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
        private notifierService: NotifierService,
    ) {}

    /**
     * Запуск выгрузки
     * @param {ExcelSheet[]} sheets 
     * @param {string} fileName 
     * @returns {void}
     */
    public export(sheets: ExcelSheet[], fileName: string): void {
        if (sheets.length == 0) {
            this.notifierService.notify('info', 'Нет данных для экспорта в Excel!');
            return;
        }

        const wb = XLSX.utils.book_new();
        sheets.forEach((sheet) => {
            let ws = XLSX.utils.json_to_sheet(sheet.getData());
            Object.keys(sheet.getOptions()).forEach(key => {
                if (ws[key] != null) {
                    ws[key] = Object.assign(ws[key], sheet.getOptions()[key]);
                }
                else {
                    ws[key] = sheet.getOptions()[key];
                }
            });
            XLSX.utils.book_append_sheet(wb, ws, sheet.getName());

        });
        XLSX.writeFile(wb, fileName + EXCEL_EXTENSION);
    }

    /**
     * Преобразование диапазона из индексного формата в текстовый формат
     * @param {Object} addressFrom 
     * @param {Object} addressTo 
     * @returns {string}
     */
    public encodeRange(addressFrom: { c: number; r: number }, addressTo: { c: number, r: number }): string {
        return XLSX.utils.encode_range(addressFrom, addressTo);
    }

    /**
     * Преобразование ячейки из индексного формата в текстовый формат
     * @param {Object} address 
     * @returns {string} 
     */
    public encodeCell(address: { c: number; r: number }): string {
        return XLSX.utils.encode_cell(address);
    }

    /**
     * Добавление рамок к данным в Excel (исключая заголовки)
     * @param {ExcelSheet[]} excelSheets 
     * @returns {ExcelSheet[]}
     */
    public addBordersToData(excelSheets: ExcelSheet[]): ExcelSheet[] {
        excelSheets.forEach((sheet) => {
            const rows = sheet.getData().length;
            const options = sheet.getOptions();
            if (rows >= 1) {
                const cols = Object.keys(sheet.getData()[0]).length;
                for(let row=0; row<=(rows+1); row++) {
                    for(let col=0; col<cols; col++) {
                        const cell = XLSX.utils.encode_cell({c: col, r: row});
                        const s: any = {};
                        s[cell]= { s: {
                            border: { 
                                left: { style: 'thin', color: { rgb: '555555' } },
                                right: { style: 'thin', color: { rgb: '555555' } },
                                top: { style: 'thin', color: { rgb: '555555' } },
                                bottom: { style: 'thin', color: { rgb: '555555' } },
                            },
                        }};
                        if (options[cell] != null && options[cell]['s'] != null) {
                            options[cell]['s'] = Object.assign(s[cell]['s'], options[cell]['s']);
                        }
                        else {
                            options[cell] = s[cell];
                        }
                    }
                }
            }
        })
        return excelSheets;
    }

}