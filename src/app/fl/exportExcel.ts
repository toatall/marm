import { ExcelService } from "../_services/excel.service"
import { ExcelColumn } from "../models/excel/column"
import { ExcelSheet } from "../models/excel/sheet"
import { TaxPayerFlHelper } from "../models/fl/taxpayerFl"
import { TaxPayerFlData } from "../models/fl/taxpayerFlData"
import { TaxPayerFlReceiptHelper } from "../models/fl/taxpayerFlReceipt"

/**
 * Экспорт данных по самозанятым в Excel
 */
export class ExportExcel {
    
    // листы Excel
    private excelSheetList: ExcelSheet[] = []
    // главный лист
    private sheetMain: ExcelSheet = new ExcelSheet('Главная')
    
    private taxPayerFlHelper = new TaxPayerFlHelper()
    private taxPayerFlReceiptHelper = new TaxPayerFlReceiptHelper()

    /**
     * 
     */
    public constructor(
        private taxPayersFlData: TaxPayerFlData[], 
        private excelService: ExcelService,             
    ) {
        this.excelSheetList.push(this.sheetMain)
    }

    /**
     * запуск экспорта
     * @returns {void}
     */
    public export(): void {       

        // размер на главной странице
        this.sheetMain.setOptions({
            '!cols': this.taxPayerFlHelper.colsWidth(),
            '!autofilter': { ref: this.excelService.encodeRange({ c: 0, r: 0}, { c: (this.taxPayerFlHelper.countCols() - 1), r: 0 }) },
        });
        this.sheetMain.setOptions(this.setHeadOptions(this.taxPayerFlHelper.countCols()));

        this.taxPayersFlData.forEach((taxPayerFlData) => {
            // если нет данных, то пропускаем
            if (!taxPayerFlData.detail) {
                return
            }
            // подготовка данных для excel
            this.castToExcelSheet(taxPayerFlData)
        })
        // экспорт в файл
        this.excelService.export(this.excelService.addBordersToData(this.excelSheetList), "Самозанятые")
    }


    /**
     * Подготовка данных для экспорта
     * @param {TaxPayerFlData} taxPayerFlData 
     */
    private castToExcelSheet(taxPayerFlData: TaxPayerFlData): void {
        
        // Главная вкладка
        const detail = this.taxPayerFlHelper.transform(taxPayerFlData.detail);
        const dataTaxPayerFl: any = {};
        this.taxPayerFlHelper.getData().forEach((excelColumn: ExcelColumn) => {
            dataTaxPayerFl[excelColumn.label] = detail[excelColumn.name];
        });
        this.sheetMain.dataAdd(dataTaxPayerFl);
       
        const optionsFl: any = {};
        const cellFl: string = this.excelService.encodeCell({ c: 0, r: this.sheetMain.countRows() });
        optionsFl[cellFl] = {
            l: { Target: `#${taxPayerFlData.inn}!A1` }, 
            s: { font: { underline: true, color: { rgb: '0000FF' } } }, 
        };
        console.log(cellFl);
        this.sheetMain.setOptions(optionsFl);

        // Чеки
        if (taxPayerFlData.detail.receipts.length > 0) {            
            const sheetReceipt: ExcelSheet = new ExcelSheet(taxPayerFlData.inn);
            sheetReceipt.setOptions({ 
                '!cols': this.taxPayerFlReceiptHelper.colsWidth(),
                '!autofilter': { ref: this.excelService.encodeRange({ c: 0, r: 0}, { c: (this.taxPayerFlReceiptHelper.countCols() - 1), r: 0 }) },
            });
            
            sheetReceipt.setOptions(this.setHeadOptions(this.taxPayerFlReceiptHelper.countCols()));
            this.excelSheetList.push(sheetReceipt);

            taxPayerFlData.detail.receipts.forEach((taxPayerReceipt: any, index: number) => {
                const dataReceipt: any = {};
                
                taxPayerReceipt = this.taxPayerFlReceiptHelper.transform(taxPayerReceipt);
                this.taxPayerFlReceiptHelper.getData().forEach((excelColumn: ExcelColumn) => {
                    dataReceipt[excelColumn.label] = taxPayerReceipt[excelColumn.name];
                });
                sheetReceipt.dataAdd(dataReceipt);
            });
        }
    }


    /**
     * Возвращает объект для оформления заголовков
     * @param {number} cols количество колонок
     * @returns {any}
     */
    private setHeadOptions(cols: number): any {
        const options: any = {};
        for(let i:number = 0; i < cols; i++) {
            const cell = this.excelService.encodeCell({ c: i, r: 0 });
            options[cell] = {
                s: {
                    font: { bold: true, color: { rgb: 'FFFFFF' } }, 
                    fill: { fgColor: { rgb: '4F81BD' } }, 
                    alignment: { wrapText: true, vertical: 'center', horizontal: 'center' },                   
                }
            };
        }
        return options;
    }


}