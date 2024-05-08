import { Component } from '@angular/core';
import { TaxpayerService } from '../_services/taxpayer.service';
import { Queues } from '../_helpers/queues';
import { Taxpayer } from '../models/taxpayer';
import { TaxpayerData } from '../models/taxpayerData';
import { ExcelService } from '../_services/excel.service';

@Component({
    selector: 'app-fl',
    templateUrl: './fl.component.html',
    styleUrls: ['./fl.component.css']
})
export class FlComponent {

    inn: string = '';    
    listInn?: string[]
    isRunning: boolean = false
    
    // очередь заданий
    private queues: Queues = new Queues()
    
    // результат данных
    public flData: any[] = []


    /**
     * @param taxpayerService 
     */
    public constructor (private taxpayerService: TaxpayerService, private excelService: ExcelService) {}

    /**
     * Запуск поиска
     */
    public onSubmit() {
        const listInn = this.inn?.split("\n")       
        if (!Array.isArray(listInn) || listInn.length == 0) {
            console.log('НЕ ЗАПОЛНЕНО ПОЛЕ!');
        }
        this.listInn = listInn
        this.isRunning = true
        this.flData = []
        this.start()
    }

    /**
     * Поочередное извлечение каждой ИНН и получение по ней данных
     * @returns 
     */
    private start() {
        const inn = this.listInn?.shift()
        if (inn == null || inn.trim().length == 0) {
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

                // если НП с таким ИНН не найден
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
                    funcSubscribe: ((receipts: any) => taxpayer.receipts = receipts)
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

    private stop() {
        this.isRunning = false                
    }

    public exportToExcel() {        
        this.excelService.exportToExcel(this.convertToExcel(), "nalog")
    }


    private convertToExcel(): any {
        let result: any = {}

        this.flData.forEach((item) => {
            if (item.data != null) {
                
                // наполнение главной страницы

                if (result['Главная'] == null) {
                    result['Главная'] = []
                }

                let main: any = {
                    "ИНН": item.inn,
                    "ФИО": item.data.fio,
                    "Статус": item.data.status, 
                    "Дата последней постановки на учет": new Date(item.data.tsunRegistrationDate), 
                    "Дата последнего снятия с учета": new Date(item.data.tsunUnregisterDate), 
                    "Тип последней постановки": item.data.registrationType, 
                    "Приложение последней постановки": item.data.registeredBy, 
                    "Текущий регион ведения деятельности": item.data.region, 
                    "Актуальный номер телефона": item.data.phone, 
                    "Код инспекции учета НПД": item.data.authority_code, 
                    "ИП": item.data.isIp ? "Да" : "Нет", 
                    "УСН": item.data.usnStatusExists ? "Да" : "Нет", 
                    "ЕСХН": item.data.eshnStatusExists ? "Да" : "Нет", 
                    "Срок снятия с СНР": item.data.deadLine,
                }
                if (Array.isArray(item.data.regLogs) && item.data.regLogs.length > 0) {                    
                    const regLog = item.data.regLogs.shift()
                    main['Устройство'] = regLog.deviceId
                    main['IP-адрес регистрации'] = regLog.ipAddress
                    main['Массовая постановка'] = regLog.isMassReg ? 'Да' : 'Нет'
                }                

                result['Главная'].push(main)

                             
                // чеки
                if (Array.isArray(item.data.receipts) && item.data.receipts.length > 0) {
                    let receipts: any[] = []
                    item.data.receipts.forEach((receipt: any) => {
                        receipts.push({
                            "Номер чека": receipt.receiptId,
                            "Наименование товаров": receipt.servicesSerialized,
                            "Сумма дохода": receipt.totalAmount,
                            "Сумма налога": receipt.tax,
                            "Налоговый вычет": receipt.usedTaxDeduction,
                            "Статус чека": receipt.receiptType,
                            "Время операции": new Date(receipt.approvalTime),
                            "Тип клиента": receipt.incomeType,
                            "ИНН клиента": receipt.clientInn,
                            "Название ИП/ЮЛ клиента": receipt.clientDisplayName,
                            "Партнер, зарегистрировавший чек": receipt.partnerName,
                            "Код партнера": receipt.partnerCode,
                            "Время отмены":  new Date(receipt.cancellationTime),
                            "Причина отмены": receipt.cancellationComment,
                            "Код устройства, с которого был отменен чек": receipt.cancellationSourceDeviceId,
                            "Код устройства, с которого был зарегистрирован чек": receipt.sourceDeviceId,
                            "Время регистрации дохода": new Date(receipt.requestTime),
                            "Время регистрации чека в ПП НПД": new Date(receipt.registerTime),
                            "Налоговый период": receipt.taxPeriodId,
                            "Регион ведения деятельности в момент создания чека": receipt.region,
                        })
                    });
                    result[item.inn] = receipts
                }
               
            }
        })
        

        return result
    }



}
