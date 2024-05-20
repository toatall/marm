import { ExcelColumn } from "../excel/column"
import { ExcelData } from "../excel/data"


export interface TaxPayerUl {

    // ИНН ЮЛ
    inn: string
    
    // Название региона ЮЛ
    regionName: string
    
    // Дата регистрации ЮЛ
    registrationDate: Date
    
    // ИНН ЮЛ/ИП
    name: string 
    
    // Риск-балл
    riskRatio: number 

    // УВН компании
    uvn: number

    // Наличие организации в Белом списке
    whiteListExists: boolean

    // Дата первого чека в пользу ЮЛ
    firstReceiptDate: Date

    // Всего СМЗ
    allTpCount: number

    // Активных СМЗ
    activeTpCount: number

    // Сумма дохода
    income: number

    // В среднем месяцев работы с ЮЛ
    avgMonthOfWorks: number

    // Средняя доля дохода от ЮЛ
    avgIncomeShare: number

    // Средняя сумма чека
    avgReceiptAmount: number

    // В среднем чеков в месяц в пользу ЮЛ
    avgReceiptsCount: number

    // Среднемесячный доход
    avgIncome: number

    // Массовая постановка на учет (НП/устройств)
    massReg: number

    // Массовая постановка на учет (ip)
    massIp4: number

    // Массовые регистрации дохода (НП/устройств)
    massIncome: number

    // Кол-во групп (работодателей-доноров)
    groupCount: number

    // Порог группы
    groupSize: number

    // Объем перехода по НДФЛ
    ndflTransferSize: number

    // Кол-во групп (работодателей-доноров) (РСВ)
    rsvGroupSize: number

    // Объем перехода по РСВ
    rsvTransferSize: number

    // Прямые нарушения НДФЛ
    ndflViolation: number

    // % Прямых нарушений НДФЛ
    ndflViolationP: number

    // Прямые нарушения РСВ
    rsvViolation: number

    // % Прямых нарушений РСВ
    rsvViolationP: number

    // Коэф. периодичности выплат
    paymentSchedule: number

    // Продолжительность работы
    workDuration: boolean

    // Единственный источник дохода
    onceSourceOfIncome: boolean

    // Периодичность выплат
    paymentFrequency: boolean

    // Централизованный учет
    centralizedAccounting: boolean

    // Групповые переходы
    groupTransitions: boolean

    // Прямые нарушения
    violation: boolean

    // Централизованный учет (ip)
    centralizedAccountingIp: boolean

}

export class TaxPayerUlHelper extends ExcelData {

    public override getData(): ExcelColumn[] {
        return [
            new ExcelColumn("regionName", "Название региона ЮЛ", 24),
            new ExcelColumn("inn", "ИНН ЮЛ/ИП", 13),
            new ExcelColumn("registrationDate", "Дата регистрации ЮЛ", 12),
            new ExcelColumn("name", "Наименование ЮЛ", 25),
            new ExcelColumn("riskRatio", "Риск-балл", 6),
            new ExcelColumn("uvn", "УВН компании", 10),
            new ExcelColumn("whiteListExists", "Наличие организации в Белом списке", 12),
            new ExcelColumn("firstReceiptDate", "Дата первого чека в пользу ЮЛ", 13),
            new ExcelColumn("allTpCount", "Всего СМЗ", 9),
            new ExcelColumn("activeTpCount", "Активных СМЗ", 9),
            new ExcelColumn("income", "Сумма дохода", 9),
            new ExcelColumn("avgMonthOfWorks", "В среднем месяцев работы с ЮЛ", 13),
            new ExcelColumn("avgIncomeShare", "Средняя доля дохода от ЮЛ", 12),
            new ExcelColumn("avgReceiptAmount", "Средняя сумма чека", 12),
            new ExcelColumn("avgReceiptsCount", "В среднем чеков в месяц в пользу ЮЛ", 14),
            new ExcelColumn("avgIncome", "Среднемесячный доход", 16),
            new ExcelColumn("massReg", "Массовая постановка на учет (НП/устройств)", 15),
            new ExcelColumn("massIp4", "Массовая постановка на учет (ip)", 15),
            new ExcelColumn("massIncome", "Массовые регистрации дохода (НП/устройств)", 15),
            new ExcelColumn("groupCount", "Кол-во групп (работодателей-доноров)", 15),
            new ExcelColumn("groupSize", "Порог группы", 8),
            new ExcelColumn("ndflTransferSize", "Объем перехода по НДФЛ", 10),
            new ExcelColumn("rsvGroupSize", "Кол-во групп (работодателей-доноров) (РСВ)", 14),
            new ExcelColumn("rsvTransferSize", "Объем перехода по РСВ", 11),
            new ExcelColumn("ndflViolation", "Прямые нарушения НДФЛ", 12),
            new ExcelColumn("ndflViolationP", "% Прямых нарушений НДФЛ", 11),
            new ExcelColumn("rsvViolation", "Прямые нарушения РСВ", 11),
            new ExcelColumn("rsvViolationP", "% Прямых нарушений РСВ", 11),
            new ExcelColumn("paymentSchedule", "Коэф. периодичности выплат", 13),
            new ExcelColumn("workDuration", "Продолжительность работы", 13),
            new ExcelColumn("onceSourceOfIncome", "Единственный источник дохода", 13),
            new ExcelColumn("paymentFrequency", "Периодичность выплат", 15),
            new ExcelColumn("centralizedAccounting", "Централизованный учет", 12),
            new ExcelColumn("groupTransitions", "Групповые переходы", 11),
            new ExcelColumn("violation", "Прямые нарушения", 12),
            new ExcelColumn("centralizedAccountingIp", "Централизованный учет (ip)", 12),
        ];
    }

    public override transform(data: any) {
        data['registrationDate'] = new Date(data['registrationDate'])
        data['firstReceiptDate'] = new Date(data['firstReceiptDate'])
        data['whiteListExists'] = data['whiteListExists'] ? 'Да' : 'Нет'
        data['workDuration'] = data['workDuration'] ? 'Да' : 'Нет'
        data['onceSourceOfIncome'] = data['onceSourceOfIncome'] ? 'Да' : 'Нет'
        data['paymentFrequency'] = data['paymentFrequency'] ? 'Да' : 'Нет'
        data['centralizedAccounting'] = data['centralizedAccounting'] ? 'Да' : 'Нет'
        data['groupTransitions'] = data['groupTransitions'] ? 'Да' : 'Нет'
        data['violation'] = data['violation'] ? 'Да' : 'Нет'
        data['centralizedAccountingIp'] = data['centralizedAccountingIp'] ? 'Да' : 'Нет'
        return data
    }
    
}