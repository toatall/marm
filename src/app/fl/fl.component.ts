import { Component } from '@angular/core';
import { TaxpayerService } from '../_services/taxpayer.service';
import { Queues } from '../_helpers/queues';
import { TaxpayerData } from '../models/taxpayerData';
import { ExcelService, ExcelSheet } from '../_services/excel.service';
import { NotifierService } from 'angular-notifier'
import { Taxpayer } from '../models/taxPayer';
import * as XLSX from 'xlsx-js-style';

@Component({
    selector: 'app-fl',
    templateUrl: './fl.component.html',
    styleUrls: ['./fl.component.css']
})
export class FlComponent {


    public innTextarea: string    
    public listInn: string[]
    public isRunning: boolean = false
    public isCancel: boolean = false
    public isExporting: boolean = false
    
    // очередь заданий
    private queues: Queues = new Queues()
    
    // результат данных
    public flData: any[] = []


    /**
     * {@inheritdoc}
     */
    public constructor (
        private taxpayerService: TaxpayerService, 
        private excelService: ExcelService,
        private notifierService: NotifierService,
    ) {}    
  

    /**
     * Запуск поиска
     */
    public onSubmit() {
        
        if (!this.innTextarea || this.innTextarea.trim() == '') {
            this.notifierService.notify('warning', 'Не заполнен список ИНН')   
            return
        }

        const listInn = this.innTextarea.trim().split("\n")
        
        this.listInn = listInn
        this.isRunning = true
        this.flData = []
        this.isCancel = false
        this.start()
    }

    /**
     * Отмена выполнения
     */
    public cancel() {
        this.isCancel = true
        this.queues.stop()
    }

    /**
     * Поочередное извлечение каждой ИНН и получение по ней данных
     */
    private start() {
        const inn = this.listInn.shift()
        if (inn == null || inn.trim().length == 0 || this.isCancel) {
            this.stop()
            return
        }
        
        // поиск самозанятого
        this.taxpayerService.getTaxpayers(inn)            
            .subscribe((taxpayer: Taxpayer) => {
                        
                let taxpayerData = new TaxpayerData()
                taxpayerData.data = taxpayer

                taxpayerData.inn = inn
                taxpayerData.isRun = true
                this.flData.push(taxpayerData)

                // если НП с таким ИНН не найден,
                // то завершаем текущий поиск и 
                // передаем поиск для следующей записи
                if (taxpayerData.data == null) {                          
                    taxpayerData.isRun = false
                    taxpayerData.result = `Налогоплательщик не найден!`
                    this.start()
                    return
                }
                

                // данные НП
                this.queues.add({ 
                    funcHttp: this.taxpayerService.getProfile(inn), 
                    funcSubscribe: (taxpayer: Taxpayer) => {
                        taxpayerData.data.registrationType = taxpayer.registrationType                                
                    }
                })

                // Журнал регистраций НП
                this.queues.add({
                    funcHttp: this.taxpayerService.getRegLog(taxpayer.fid),
                    funcSubscribe: ((regLogs: any) => taxpayer.regLogs = regLogs)
                })

                // Чеки НП
                this.queues.add({
                    funcHttp: this.taxpayerService.getReceipts(taxpayer.fid),
                    funcSubscribe: ((receipts: any[]) => taxpayer.receipts = receipts.filter((item) => (new Date(item.approvalTime)).getFullYear() >= 2022))
                })

                // запуск 
                this.queues.run(() => {
                    // функция при завершении выполнения всех заданий
                    taxpayerData.isRun = false
                    taxpayerData.result = taxpayer.fio
                    this.start()
                })

            }, () => {
                this.start()
            })                               
        
    }

    /**
     * Функция выполняемая при остановке заданий
     */
    private stop() {
        this.isRunning = false                
    }

    /**
     * Выгрузка данных в Excel
     */
    public exportToExcel() {        
        try{ 
            this.isExporting = true
            this.excelService.export(this.toExcel(), "Самозанятые")
        }
        catch(error: any) {
            this.notifierService.notify('error', error)
            throw error
        }
        finally {
            this.isExporting = false
        }
    }

    /**
     * Подготовка данных для выгрузки в Excel
     * @returns {ExcelSheet[]}
     */
    private toExcel(): ExcelSheet[] {
        let result: ExcelSheet[] = []
        let sheetMainOptions: any = { 
            '!cols': [ {wch: 13}, {wch: 30}, {wch: 9}, {wch: 16}, {wch: 16}, 
                {wch: 17}, {wch: 17}, {wch: 22}, {wch: 15}, {wch: 20}, {wch: 7},
                {wch: 7}, {wch: 7}, {wch: 12}, {wch: 16}, {wch: 11}, {wch: 12},
            ],
            '!autofilter': { ref: XLSX.utils.encode_range({ c: 0, r: 0}, { c: 16, r: 0 }) },
        }

        for(let i:number = 0; i < 17; i++) {
            const cell = XLSX.utils.encode_cell({c: i, r: 0})
            sheetMainOptions[cell] = {s: {
                font: { bold: true, color: { rgb: 'FFFFFF' } }, 
                fill: { fgColor: { rgb: '4F81BD' } }, 
                alignment: { wrapText: true, vertical: 'center', horizontal: 'center' },
                border: { 
                    left: { style: 'thin', color: { rgb: '555555' } },
                    right: { style: 'thin', color: { rgb: '555555' } },
                    top: { style: 'thin', color: { rgb: '555555' } },
                    bottom: { style: 'thin', color: { rgb: '555555' } },
                },
            }}
        }

        // создание главного листа в Excel
        const excelSheet = new ExcelSheet('Главная', [], sheetMainOptions)
        result.push(excelSheet)

        this.flData.forEach((item) => {
            if (item.data != null) {
                
                // главная страница
                let data: any = {
                    "ИНН": item.inn,
                    "ФИО": item.data.fio,
                    "Статус": item.data.status, 
                    "Дата последней постановки на учет": item.data.tsunRegistrationDate ? new Date(item.data.tsunRegistrationDate) : '', 
                    "Дата последнего снятия с учета": item.data.tsunUnregisterDate ? new Date(item.data.tsunUnregisterDate) : '', 
                    "Тип последней постановки": item.data.registrationType, 
                    "Приложение последней постановки": item.data.registeredBy, 
                    "Текущий регион ведения деятельности": item.data.region, 
                    "Актуальный номер телефона": item.data.phone, 
                    "Код инспекции учета НПД": item.data.authority_code, 
                    "ИП": item.data.isIp ? "Да" : "Нет", 
                    "УСН": item.data.usnStatusExists ? "Да" : "Нет", 
                    "ЕСХН": item.data.eshnStatusExists ? "Да" : "Нет", 
                    "Срок снятия с СНР": item.data.deadLine ?? '',
                    "Устройство": '',
                    "IP-адрес регистрации": '',
                    "Массовая постановка": '',
                }
                if (Array.isArray(item.data.regLogs) && item.data.regLogs.length > 0) {
                    const regLog = item.data.regLogs.shift()
                    data['Устройство'] = regLog.deviceId
                    data['IP-адрес регистрации'] = regLog.ipAddress
                    data['Массовая постановка'] = regLog.isMassReg ? 'Да' : 'Нет'
                }                                                
                excelSheet.dataAdd(data)

                             
                // чеки
                if (Array.isArray(item.data.receipts) && item.data.receipts.length > 0) {
                    let receipts: any[] = []
                    item.data.receipts.forEach((receipt: any) => {
                        receipts.push({
                            "Номер чека": receipt.receiptId ?? '',
                            "Наименование товаров": receipt.servicesSerialized ?? '',
                            "Сумма дохода": receipt.totalAmount ?? '',
                            "Сумма налога": receipt.tax ?? '',
                            "Налоговый вычет": receipt.usedTaxDeduction ?? '',
                            "Статус чека": receipt.receiptType ?? '',
                            "Время операции": receipt.approvalTime ? new Date(receipt.approvalTime) : '',
                            "Тип клиента": receipt.incomeType ?? '',
                            "ИНН клиента": receipt.clientInn ?? '',
                            "Название ИП/ЮЛ клиента": receipt.clientDisplayName ?? '',
                            "Партнер, зарегистрировавший чек": receipt.partnerName ?? '',
                            "Код партнера": receipt.partnerCode ?? '',
                            "Время отмены":  receipt.cancellationTime ? new Date(receipt.cancellationTime) : '',
                            "Причина отмены": receipt.cancellationComment ?? '',
                            "Код устройства, с которого был отменен чек": receipt.cancellationSourceDeviceId ?? '',
                            "Код устройства, с которого был зарегистрирован чек": receipt.sourceDeviceId ?? '',
                            "Время регистрации дохода": receipt.requestTime ? new Date(receipt.requestTime) : '',
                            "Время регистрации чека в ПП НПД": receipt.registerTime ? new Date(receipt.registerTime) : '',
                            "Налоговый период": receipt.taxPeriodId ?? '',
                            "Регион ведения деятельности в момент создания чека": receipt.region ?? '',
                        })
                    })
                    // добавление ссылки на вкладку
                    sheetMainOptions['A' + (excelSheet.countRows()+1)] = { 
                        l: { Target: `#${item.inn}!A1` }, 
                        s: { font: { underline: true, color: { rgb: '0000FF' } } } }

                    // стиль заголовка
                    const styleHeaderReceipts: any = {}
                    for(let i=0; i<20; i++) {
                        const cell = XLSX.utils.encode_cell({c: i, r: 0})
                        styleHeaderReceipts[cell] = {s: {
                            font: { bold: true, color: { rgb: 'FFFFFF' } }, 
                            fill: { fgColor: { rgb: '4F81BD' } }, 
                            alignment: { wrapText: true, vertical: 'center', horizontal: 'center' },
                            border: { 
                                left: { style: 'thin', color: { rgb: '555555' } },
                                right: { style: 'thin', color: { rgb: '555555' } },
                                top: { style: 'thin', color: { rgb: '555555' } },
                                bottom: { style: 'thin', color: { rgb: '555555' } },
                            },
                        }}
                    }

                    result.push(new ExcelSheet(item.inn, receipts, Object.assign(
                        {
                            '!cols': [{wch: 11}, {wch: 22}, {wch: 13}, {wch: 13}, {wch: 17}, {wch: 16}, {wch: 16}, {wch: 16}, 
                                {wch: 12}, {wch: 30}, {wch: 24}, {wch: 13}, {wch: 13}, {wch: 11}, {wch: 18}, {wch: 17}, 
                                {wch: 13}, {wch: 13}, {wch: 11}, {wch: 17}],
                            '!autofilter': { ref: XLSX.utils.encode_range({ c: 0, r: 0}, { c: 19, r: 0 }) },
                        },
                        styleHeaderReceipts)
                    ))
                }

            }
        })

        return this.addBorderData(result)
    }

    /**
     * Добавление рамок к данным в Excel (исключая заголовки)
     * @param {ExcelSheet[]} excelSheets 
     * @returns {ExcelSheet[]}
     */
    private addBorderData(excelSheets: ExcelSheet[]): ExcelSheet[] {
        excelSheets.forEach((sheet) => {
            const rows = sheet.getData().length
            const options = sheet.getOptions()
            if (rows >= 1) {
                const cols = Object.keys(sheet.getData()[0]).length
                for(let row=1; row<=(rows+1); row++) {
                    for(let col=0; col<cols; col++) {
                        const cell = XLSX.utils.encode_cell({c: col, r: row})
                        const s: any = {}
                        s[cell]= { s: {
                            border: { 
                                left: { style: 'thin', color: { rgb: '555555' } },
                                right: { style: 'thin', color: { rgb: '555555' } },
                                top: { style: 'thin', color: { rgb: '555555' } },
                                bottom: { style: 'thin', color: { rgb: '555555' } },
                            },
                        }}
                        if (options[cell] != null && options[cell]['s'] != null) {
                            options[cell]['s'] = Object.assign(s[cell]['s'], options[cell]['s'])
                        }
                        else {
                            options[cell] = s[cell]
                        }
                    }
                }
            }
        })
        return excelSheets
    }

}
