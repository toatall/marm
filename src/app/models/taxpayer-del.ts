export interface Taxpayer {    
    inn: string
    fid: number
    email: string
    fio: string
    status: string
    tsunRegistrationDate: any // Дата последней постановки на учет
    tsunUnregisterDate: any // Дата последнего снятия с учета
    registrationType: string // Тип последней постановки
    registeredBy: string // Приложение последней постановки
    region: string // Текущий регион ведения деятельности
    phone: string // Актуальный номер телефона
    authority_code: string // Код инспекции учета НПД
    isIp: any // ИП
    usnStatusExists: any // УСН
    eshnStatusExists: any // ЕСХН
    deadLine: string // Срок снятия с СНР
    
    regLogs: any  // Массив: Журнал регистраций НП
    receipts: any // Массив: Чеки НП   
}