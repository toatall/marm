import { ExcelColumn } from "../excel/column"
import { ExcelData } from "../excel/data"
import { TaxPayerFlReceipt } from "./taxpayerFlReceipt"

export interface TaxPayerFl {

    // ИНН
    inn: string

    // ФИД
    fid: number

    // Email
    email: string

    // ФИО
    fio: string

    // Статус
    status: string

    // Дата последней постановки на учет
    tsunRegistrationDate: any

    // Дата последнего снятия с учета
    tsunUnregisterDate: any 

    // Тип последней постановки
    registrationType: string

    // Приложение последней постановки
    registeredBy: string 

    // Текущий регион ведения деятельности
    region: string 

    // Актуальный номер телефона
    phone: string 

    // Код инспекции учета НПД
    authority_code: string 

    // ИП
    isIp: any 

    // УСН
    usnStatusExists: any

    // ЕСХН
    eshnStatusExists: any

    // Срок снятия с СНР
    deadLine: any 

    // Устройство
    deviceId: string

    // IP-адрес регистрации
    ipAddress: string

    // Массовая постановка
    isMassReg: string


    // Задолженность по налогу
    debt: number;

    // Дата последнего обновления
    updatedAt: Date;


    regLogs: any
    receipts: TaxPayerFlReceipt[]
    
}

export class TaxPayerFlHelper extends ExcelData {

    public override getData(): ExcelColumn[] {
        return [
            new ExcelColumn("inn", "ИНН", 13),
            new ExcelColumn("fio", "ФИО", 35),
            new ExcelColumn("status", "Статус", 8),
            new ExcelColumn("email", "Email", 10),
            new ExcelColumn("tsunRegistrationDate", "Дата последней постановки на учет", 11),
            new ExcelColumn("tsunUnregisterDate", "Дата последнего снятия с учета", 11),
            new ExcelColumn("registrationType", "Тип последней постановки", 11),
            new ExcelColumn("registeredBy", "Приложение последней постановки", 12),
            new ExcelColumn("region", "Текущий регион ведения деятельности", 30),
            new ExcelColumn("phone", "Актуальный номер телефона", 12),
            new ExcelColumn("authority_code", "Код инспекции учета НПД", 11),
            new ExcelColumn("isIp", "ИП", 4),
            new ExcelColumn("usnStatusExists", "УСН", 4),
            new ExcelColumn("eshnStatusExists", "ЕСХН", 5),
            new ExcelColumn("deadLine", "Срок снятия с СНР", 10),
            new ExcelColumn("deviceId", "Устройство", 11),
            new ExcelColumn("ipAddress", "IP-адрес регистрации", 12),
            new ExcelColumn("isMassReg", "Массовая постановка", 11),
            new ExcelColumn('debt', 'Задолженность по налогу'),
            new ExcelColumn('updatedAt', 'Дата последнего обновления (задолженности)', 12),        
        ];
    }

    public override transform(data: any) {
        data['tsunRegistrationDate'] = data['tsunRegistrationDate'] ? new Date(data['tsunRegistrationDate']) : '';
        data['tsunUnregisterDate'] = data['tsunUnregisterDate'] ? new Date(data['tsunUnregisterDate']) : '';
        data['isIp'] = data['isIp'] ? 'Да' : 'Нет';
        data['usnStatusExists'] = data['usnStatusExists'] ? 'Да' : 'Нет';
        data['eshnStatusExists'] = data['eshnStatusExists'] ? 'Да' : 'Нет';
        data['updatedAt'] = data['updatedAt'] ? new Date(data['updatedAt']) : '';
        return data;
    }

}