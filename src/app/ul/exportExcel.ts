import { ExcelService } from "../_services/excel.service";
import { ExcelColumn } from "../models/excel/column";
import { ExcelSheet } from "../models/excel/sheet";
import { TaxPayerFlHelper } from "../models/fl/taxpayerFl";
import { TaxPayerFlReceiptHelper } from "../models/fl/taxpayerFlReceipt";
import { TaxPayerUlHelper } from "../models/ul/taxpayerUl";
import { TaxPayerUlBasicHelper } from "../models/ul/taxpayerUlBasic";
import { TaxPayerUlData } from "../models/ul/taxpayerUlData";
import { TaxPayerUlSmzHelper } from "../models/ul/taxpayerUlSmz";

/**
 * Экспорт данных ЮЛ/ИП в Excel
 */
export class ExportExcel {
    
    // листы Excel
    private excelSheetList: ExcelSheet[] = []
    // главный лист
    private sheetMain: ExcelSheet = new ExcelSheet('Главная')
    
    private taxPayerUlHelper = new TaxPayerUlHelper()
    private taxPayerUlBasicHelper = new TaxPayerUlBasicHelper()
    private taxPayerUlSmzHelper = new TaxPayerUlSmzHelper()
    private taxPayerFlHelper = new TaxPayerFlHelper()
    private taxPayerFlReceiptHelper = new TaxPayerFlReceiptHelper()

    /**
     * 
     * @param {TaxPayerUlData[]} taxPayersUlData
     */
    public constructor(
        private taxPayersUlData: TaxPayerUlData[], 
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
            '!cols': this.taxPayerUlHelper.colsWidth(),
            '!autofilter': { ref: this.excelService.encodeRange({ c: 0, r: 0}, { c: (this.taxPayerUlHelper.countCols() - 1), r: 0 }) },
        })

        this.taxPayersUlData.forEach((taxPayerUlData) => {
            // если нет данных, то пропускаем
            if (!taxPayerUlData.detail) {
                return
            }
            // подготовка данных для excel
            this.castToExcelSheet(taxPayerUlData)
        })
        // экспорт в файл
        this.excelService.export(this.excelService.addBordersToData(this.excelSheetList), "ЮЛ_ИП")
    }

    /**
     * Подготовка данных для экспорта
     * @param {TaxPayerUlData} taxPayerUlData данные НП ЮЛ/ИП
     */
    private castToExcelSheet(taxPayerUlData: TaxPayerUlData): void {

        // Главная вкладка
        const detail = this.taxPayerUlHelper.transform(taxPayerUlData.detail);
        const dataTaxPayerUl: any = {};
        this.taxPayerUlHelper.getData().forEach((excelColumn: ExcelColumn) => {
            dataTaxPayerUl[excelColumn.label] = detail[excelColumn.name];
        })
        this.sheetMain.dataAdd(dataTaxPayerUl)
        this.sheetMain.setOptions(this.setHeadOptions(this.taxPayerUlHelper.countCols()))        

        // основные показатели ЮЛ/ИП
        if (taxPayerUlData.basicList.length > 0) {
            
            // добавление ссылки на основные показатели
            const optionsUl: any = {}
            const cellUlInn: string = this.excelService.encodeCell({ c: 1, r: this.sheetMain.countRows() })
            optionsUl[cellUlInn] = {
                l: { Target: `#${taxPayerUlData.inn}!A1` }, 
                s: { font: { underline: true, color: { rgb: '0000FF' } } }, 
            }
            this.sheetMain.setOptions(optionsUl)

            const sheetUlBasic: ExcelSheet = new ExcelSheet(taxPayerUlData.inn)
            this.excelSheetList.push(sheetUlBasic)

            taxPayerUlData.basicList.forEach((taxPayerUlBasic: any) => {
                taxPayerUlBasic = this.taxPayerUlBasicHelper.transform(taxPayerUlBasic);
                const dataUlBasic: any = {}
                this.taxPayerUlBasicHelper.getData().forEach((excelColumn: ExcelColumn) => {
                    dataUlBasic[excelColumn.label] = taxPayerUlBasic[excelColumn.name]
                })
                sheetUlBasic.dataAdd(dataUlBasic)
            })

            // ширина столбцов и автофильтр
            sheetUlBasic.setOptions({ 
                '!cols': this.taxPayerUlBasicHelper.colsWidth(),
                '!autofilter': { ref: this.excelService.encodeRange({ c: 0, r: 0}, { c: (this.taxPayerUlBasicHelper.countCols() - 1), r: 0 }) },
            })
            // формат заголовков
            sheetUlBasic.setOptions(this.setHeadOptions(this.taxPayerUlBasicHelper.countCols()))
        }

        // реестр самозанятых
        if (taxPayerUlData.smzList.length > 0) {

            const sheetUlSmz: ExcelSheet = new ExcelSheet(`${taxPayerUlData.inn}_СМЗ`)
            sheetUlSmz.setOptions({ 
                '!cols': this.taxPayerUlSmzHelper.colsWidth(),
                '!autofilter': { ref: this.excelService.encodeRange({ c: 0, r: 0}, { c: (this.taxPayerUlSmzHelper.countCols() - 1), r: 0 }) },
            }) 
            sheetUlSmz.setOptions(this.setHeadOptions(this.taxPayerUlSmzHelper.countCols()))
            this.excelSheetList.push(sheetUlSmz)

            taxPayerUlData.smzList.forEach((taxPayerSmz: any, index: number) => {
                const dataSmz: any = {}                
                const cellSmz: string = this.excelService.encodeCell({ c: 0, r: (index + 1) })
                const optionsSmz: any = {}
                optionsSmz[cellSmz] = {
                    l: { Target: `#${taxPayerSmz.inn}!A1` }, 
                    s: { font: { underline: true, color: { rgb: '0000FF' } } }, 
                }
                sheetUlSmz.setOptions(optionsSmz)
                taxPayerSmz = this.taxPayerUlSmzHelper.transform(taxPayerSmz);
                this.taxPayerUlSmzHelper.getData().forEach((excelColumn: ExcelColumn) => {
                    dataSmz[excelColumn.label] = taxPayerSmz[excelColumn.name];
                })
                sheetUlSmz.dataAdd(dataSmz);

                // если нет листа с таким ИНН самозанятого
                if (!this.sheetExists(taxPayerSmz.inn) && taxPayerSmz.taxPayerFl) {
                    
                    const taxPayerFl = this.taxPayerFlHelper.transform(taxPayerSmz.taxPayerFl)
                    const sheetFl: ExcelSheet = new ExcelSheet(taxPayerSmz.inn)                                        
                    sheetFl.setOptions({
                        '!cols': this.taxPayerFlHelper.colsWidth(),
                        '!autofilter': { ref: this.excelService.encodeRange({ c: 0, r: 0}, { c: (this.taxPayerFlHelper.countCols() - 1), r: 0 }) },
                    })                     
                    sheetFl.setOptions(this.setHeadOptions(this.taxPayerFlHelper.countCols()))
                    this.excelSheetList.push(sheetFl)
                    const dataFl: any = {}

                    this.taxPayerFlHelper.getData().forEach((excelColumn: ExcelColumn) => {
                        dataFl[excelColumn.label] = taxPayerFl[excelColumn.name];
                    })
                    sheetFl.dataAdd(dataFl)

                    // чеки самозанятого
                    if (taxPayerFl.receipts && Array.isArray(taxPayerFl.receipts) && taxPayerFl.receipts.length > 0) {
                        const sheetFlReceipts: ExcelSheet = new ExcelSheet(`${taxPayerSmz.inn}_Чеки`);
                        sheetFlReceipts.setOptions({ 
                            '!cols': this.taxPayerFlReceiptHelper.colsWidth(),
                            '!autofilter': { ref: this.excelService.encodeRange({ c: 0, r: 0}, { c: (this.taxPayerFlReceiptHelper.countCols() - 1), r: 0 }) },
                        }) 
                        sheetFlReceipts.setOptions(this.setHeadOptions(this.taxPayerFlReceiptHelper.countCols()))
                        this.excelSheetList.push(sheetFlReceipts);
                        
                        taxPayerFl.receipts.forEach((receipt: any) => {
                            const dataFlReceipts: any = {};
                            receipt = this.taxPayerFlReceiptHelper.transform(receipt);
                            this.taxPayerFlReceiptHelper.getData().forEach((excelColumn: ExcelColumn) => {
                                dataFlReceipts[excelColumn.label] = receipt[excelColumn.name];
                            });
                            sheetFlReceipts.dataAdd(dataFlReceipts);
                        });
                    }

                }
            })            
        }
    }

    /**
     * Проверка существования листа sheetName в списке листов 
     * @param {string} sheetName 
     * @returns {boolean}
     */
    private sheetExists(sheetName: string): boolean {
        let result = false
        this.excelSheetList.forEach((sheet: ExcelSheet) => {
            if (sheet.getName() == sheetName) {
                result = true
            }
        })
        return result
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