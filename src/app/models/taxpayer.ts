import { IModel } from "./model";

export class Taxpayer implements IModel {
            
    public inn: string;
    public fid: number;
    public email: string;
    public fio: string;
    public status: string;
    public tsunRegistrationDate: any; // Дата последней постановки на учет
    public tsunUnregisterDate: any; // Дата последнего снятия с учета
    public registrationType: string; // Тип последней постановки
    public registeredBy: string; // Приложение последней постановки
    public region: string; // Текущий регион ведения деятельности
    public phone: string; // Актуальный номер телефона
    public authority_code: string; // Код инспекции учета НПД
    public isIp: any; // ИП
    public usnStatusExists: any; // УСН
    public eshnStatusExists: any; // ЕСХН
    public deadLine: any; // Срок снятия с СНР
    public deviceId: string;
    public ipAddress: string;
    public isMassReg: string;
    
    public regLogs: any;  // Массив: Журнал регистраций НП
    public receipts: any; // Массив: Чеки НП   

    public constructor() {}


    public labels(): Map<string, string> {        
        return new Map<string, string>()
            .set("inn", "ИНН")            
            .set("fio", "ФИО")
            .set("status", "Статус")    
            .set("tsunRegistrationDate", "Дата последней постановки на учет")
            .set("tsunUnregisterDate", "Дата последнего снятия с учета")
            .set("registrationType", "Тип последней постановки")
            .set("registeredBy", "Приложение последней постановки")
            .set("region", "Текущий регион ведения деятельности")
            .set("phone", "Актуальный номер телефона")
            .set("authority_code", "Код инспекции учета НПД")
            .set("isIp", "ИП")
            .set("usnStatusExists", "УСН")
            .set("eshnStatusExists", "ЕСХН")
            .set("deadLine", "Срок снятия с СНР")
            .set("deviceId", "Устройство")
            .set("ipAddress", "IP-адрес регистрации")
            .set("isMassReg", "Массовая постановка")
    }
    
    
}