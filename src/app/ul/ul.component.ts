import { Component } from '@angular/core';
import { Queues, Runner } from '../_helpers/queues';
import { TaxpayerService } from '../_services/taxpayer.service';
import { ExcelService } from '../_services/excel.service';
import { NotifierService } from 'angular-notifier';
import { TaxPayerUl } from '../models/ul/taxpayerUl';
import { TaxPayerUlData } from '../models/ul/taxpayerUlData';
import { TaxPayerUlBasic } from '../models/ul/taxpayerUlBasic';
import { TaxPayerUlSmz } from '../models/ul/taxpayerUlSmz';
import { TaxPayerFl } from '../models/fl/taxpayerFl';
import { TaxPayerFlReceipt } from '../models/fl/taxpayerFlReceipt';
import { ExportExcel } from './exportExcel';

@Component({
    selector: 'app-ul',
    templateUrl: './ul.component.html',
    styleUrls: ['./ul.component.css']
})
export class UlComponent {

    public innTextarea!: string;   
    public monthInput: string;
    public listInn!: string[];
    public isRunning: boolean = false;
    public isCancel: boolean = false;
    public isExporting: boolean = false;

    public taxPayerUlDataList: TaxPayerUlData[] = [];


    // очередь заданий
    private queues: Queues = new Queues();
    
    // результат обработки
    public processList: any[] = [];


    /**
     * {@inheritdoc}
     */
    public constructor (
        private taxpayerService: TaxpayerService, 
        private excelService: ExcelService,
        private notifierService: NotifierService
        ,
    ) {
        const d = new Date()
        d.setDate(0)
        this.monthInput = d.toISOString().slice(0, 7)
    }  

    /**
     * Запуск поиска
     */
    public onSubmit() {
        
        if (!this.validate()) {
            return;
        }

        const listInn = this.innTextarea.trim().split("\n")
        
        this.listInn = listInn
        this.isRunning = true
        this.processList = []
        this.isCancel = false
        this.taxPayerUlDataList = []
        this.start()
    }

    /**
     * Валидация вводимых данных
     * @returns {boolean}
     */
    private validate(): boolean {
        if (!this.innTextarea || this.innTextarea.trim() == '') {
            this.notifierService.notify('warning', 'Не заполнен список ИНН ЮЛ/ИП');
            return false;
        }
        if (!this.monthInput) {
            this.notifierService.notify('warning', 'Не выбран "Месяц отчета"');
            return false;
        }
        return true;
    }

    /**
     * Поочередное извлечение каждой ИНН и получение по ней данных
     */
    private start(): void {

        // берем первый инн из списка
        const inn = this.listInn.shift();

        // если инн пустой или нажата отмена, то все завершаем
        if (inn == null || inn.trim().length == 0 || this.isCancel) {
            this.stop();
            return;
        }

        // преобразование даты в нужный формат (без тире)
        const reportDate = this.monthInput.replace('-', '');
        const taxPayerUlData = new TaxPayerUlData(inn);

        // поиск ЮЛ или ИП
        this.taxpayerService.getOrgInRisk(inn)            
            .subscribe((taxPayer: TaxPayerUl) => {

                taxPayerUlData.setDetail(taxPayer);
                this.taxPayerUlDataList.push(taxPayerUlData);
                
                // если не найдено, то передаем выполнение другому ИНН
                if (!taxPayer) {
                    taxPayerUlData.isRun = false;
                    this.start()
                    return
                }

                // вкладка "Основные показатели"
                this.queues.add({
                    funcHttp: this.taxpayerService.getUlBasic(inn, reportDate),
                    funcSubscribe: (taxPayerUlBasics: TaxPayerUlBasic[]) => {
                        taxPayerUlData.basicList = taxPayerUlBasics
                    },
                    description: 'Получение данных с вкладки "Основные показатели"...',
                });

                // вкладка "Реестр самозанятых"
                this.queues.add({
                    funcHttp: this.taxpayerService.getUlSmzRegistry(inn, reportDate), 
                    funcSubscribe: (taxPayerUlSmzList: TaxPayerUlSmz[]) => {
                        taxPayerUlData.smzList = taxPayerUlSmzList;

                        // перебор самозанятых из реестра самозанятых
                        taxPayerUlSmzList.forEach((taxPayerUlSmz) => {

                            // получение информации о самозанятом
                            this.queues.add({
                                funcHttp: this.taxpayerService.getTaxpayers(taxPayerUlSmz.inn),
                                funcSubscribe: (taxPayerFl: TaxPayerFl) => {
                                    
                                    // сохранение информации о самозанятом
                                    taxPayerUlSmz.taxPayerFl = taxPayerFl;

                                    // если НП не найден
                                    if (!taxPayerFl) {
                                        return;
                                    }

                                    // Данные НП (самозанятого)
                                    this.queues.add({ 
                                        funcHttp: this.taxpayerService.getProfile(taxPayerUlSmz.inn), 
                                        funcSubscribe: (data: any) => {                                            
                                            taxPayerFl.registrationType = data.registrationType;
                                        },
                                        description: `Получение данных по самозанятому с ИНН ${taxPayerUlSmz.inn}`,
                                    });

                                    // Данные по задолженности
                                    this.queues.add({
                                        funcHttp: this.taxpayerService.getKrsb(taxPayerFl.fid),
                                        funcSubscribe: (data: any) => {
                                            taxPayerFl.debt = data.debt;
                                            taxPayerFl.updatedAt = data.updatedAt;
                                        },
                                        description: `Получение информации о задолженности по самозанятому с ИНН ${taxPayerUlSmz.inn}`,
                                    });

                                    // Журнал регистраций НП (самозанятого)
                                    this.queues.add({
                                        funcHttp: this.taxpayerService.getRegLog(taxPayerFl.fid),
                                        funcSubscribe: ((regLogs: any) => taxPayerFl.regLogs = regLogs),
                                        description: `Получение журнала регистраций по самозанятому с ИНН ${taxPayerUlSmz.inn}`,
                                    });

                                    // Чеки НП (самозанятого)
                                    this.queues.add({
                                        funcHttp: this.taxpayerService.getReceipts(taxPayerFl.fid),
                                        funcSubscribe: ((receipts: TaxPayerFlReceipt[]) => {
                                            taxPayerFl.receipts = receipts
                                                // берем данные только с 2022 года
                                                .filter((item) => (new Date(item.approvalTime)).getFullYear() >= 2022)
                                        }),
                                        description: `Получение чеков по самозанятому с ИНН ${taxPayerUlSmz.inn}`,
                                    });

                                },
                                description: `Поиск данных по самозанятому с ИНН ${taxPayerUlSmz.inn}`,
                            })                        
                        })                      
                    },
                    description: 'Получение данных с вкладки "Реестр самозанятых"...',
                })
                
                this.queues.run(
                    // функция при запуске каждого задания
                    (queue: Runner) => {
                        taxPayerUlData.currentState = queue.description;
                    },
                    // функция при завершении 
                    () => { 
                        taxPayerUlData.isRun = false;
                        this.start();       
                    },
                )
            }, () => {
                taxPayerUlData.isRun = false;
                this.start();
            });
    }

    /**
     * Отмена выполнения
     */
    public cancel() {
        this.isCancel = true
        this.queues.stop()
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
        const exportExcel = new ExportExcel(this.taxPayerUlDataList, this.excelService)
        exportExcel.export()
    }
}
