import { Component } from '@angular/core';
import { TaxpayerService } from '../_services/taxpayer.service';
import { Queues, Runner } from '../_helpers/queues';
import { ExcelService } from '../_services/excel.service';
import { NotifierService } from 'angular-notifier'
import { ExportExcel } from './exportExcel';
import { TaxPayerFlData } from '../models/fl/taxpayerFlData';
import { TaxPayerFl } from '../models/fl/taxpayerFl';

@Component({
    selector: 'app-fl',
    templateUrl: './fl.component.html',
    styleUrls: ['./fl.component.css']
})
export class FlComponent {


    public innTextarea!: string
    public listInn!: string[]
    public isRunning: boolean = false
    public isCancel: boolean = false
    public isExporting: boolean = false
    
    public taxPayerFlDataList: TaxPayerFlData[] = [];

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
            this.notifierService.notify('warning', 'Не заполнен список ИНН');
            return;
        }

        const listInn = this.innTextarea.trim().split("\n");
        
        this.listInn = listInn;
        this.isRunning = true;
        this.flData = [];
        this.isCancel = false;
        this.taxPayerFlDataList = [];
        this.start();
    }

    /**
     * Отмена выполнения
     */
    public cancel() {
        this.isCancel = true;
        this.queues.stop();
    }

    /**
     * Поочередное извлечение каждой ИНН и получение по ней данных
     */
    private start() {
        const inn = this.listInn.shift();
        if (inn == null || inn.trim().length == 0 || this.isCancel) {
            this.stop();
            return;
        }
        
        const taxPayerFlData = new TaxPayerFlData(inn);

        // поиск самозанятого
        this.taxpayerService.getTaxpayers(inn)
            .subscribe((taxPayerFl: TaxPayerFl) => {
                                       
                taxPayerFlData.setDetail(taxPayerFl);
                this.taxPayerFlDataList.push(taxPayerFlData);

                // если НП с таким ИНН не найден,
                // то завершаем текущий поиск и 
                // передаем поиск для следующей записи
                if (!taxPayerFl) {                                             
                    taxPayerFlData.isRun = false;
                    this.start();
                    return;
                }
                

                // данные НП
                this.queues.add({ 
                    funcHttp: this.taxpayerService.getProfile(inn), 
                    funcSubscribe: (data: any) => {
                        taxPayerFlData.detail.registrationType = data.registrationType                                
                    },
                    description: `Получение данных о самозанятом с ИНН ${taxPayerFl.inn}`,
                })

                // Данные по задолженности
                this.queues.add({
                    funcHttp: this.taxpayerService.getKrsb(taxPayerFl.fid),
                    funcSubscribe: (data: any) => {
                        taxPayerFl.debt = data.debt;
                        taxPayerFl.updatedAt = data.updatedAt;
                    },
                    description: `Получение информации о задолженности по самозанятому с ИНН ${taxPayerFl.inn}`,
                });

                // Журнал регистраций НП
                this.queues.add({
                    funcHttp: this.taxpayerService.getRegLog(taxPayerFl.fid),
                    funcSubscribe: ((regLogs: any) => {
                        if (Array.isArray(regLogs) && regLogs.length > 0) {
                            // информация с вкладки "Журнал регистраций"
                            const regLog: any = regLogs.shift()
                            taxPayerFlData.detail.deviceId = regLog['deviceId'];
                            taxPayerFlData.detail.ipAddress = regLog['ipAddress'];
                            taxPayerFlData.detail.isMassReg = regLog['isMassReg'] ?  'Да' : 'Нет';
                        }
                    }),
                    description: `Получение журнала регистраций по самозанятому с ИНН ${taxPayerFl.inn}`,
                })

                // Чеки НП
                this.queues.add({
                    funcHttp: this.taxpayerService.getReceipts(taxPayerFl.fid),
                    funcSubscribe: ((receipts: any[]) => 
                            taxPayerFl.receipts = receipts.filter((item) => (new Date(item.approvalTime)).getFullYear() >= 2022)
                        
                    ),
                    description: `Получение чеков по самозанятому с ИНН ${taxPayerFl.inn}`,
                })

                // запуск 
                this.queues.run(
                    // функция при запуске каждого задания
                    (queue: Runner) => {
                        taxPayerFlData.currentState = queue.description;
                    }, 
                    // функция при завершении выполнения всех заданий
                    () => {                        
                        taxPayerFlData.isRun = false;
                        this.start()
                    },
                )

            }, () => {
                taxPayerFlData.isRun = false;
                this.start();
            });
    }

    /**
     * Функция выполняемая при остановке заданий
     */
    private stop() {
        this.isRunning = false;     
        console.log(this.taxPayerFlDataList)   
    }

    /**
     * Выгрузка данных в Excel
     */
    public exportToExcel() {                
        const exportExcel = new ExportExcel(this.taxPayerFlDataList, this.excelService);
        exportExcel.export();
    }

}
