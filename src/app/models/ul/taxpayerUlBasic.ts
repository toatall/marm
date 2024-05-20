import { ExcelColumn } from "../excel/column"
import { ExcelData } from "../excel/data"

export interface TaxPayerUlBasic {

    // Месяц отчета
    reportDate: number

    // Риск-балл 
    riskRatio: number

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

    // В среднем чеков в месяц пользу ЮЛ
    avgReceiptsCount: number

    // Среднемесячный  доход
    avgIncome: number

    // Массовая постановка на учет (НП/устройств)
    massReg: number

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

}

export class TaxPayerUlBasicHelper extends ExcelData {

    public override getData(): ExcelColumn[] {
        return [
            new ExcelColumn("reportDate", "Месяц отчета", 13),
            new ExcelColumn("riskRatio", "Риск-балл", 10),
            new ExcelColumn("allTpCount", "Всего СМЗ", 6),
            new ExcelColumn("activeTpCount", "Активных СМЗ", 9),
            new ExcelColumn("income", "Сумма дохода", 10),
            new ExcelColumn("avgMonthOfWorks", "В среднем месяцев работы с ЮЛ", 10),
            new ExcelColumn("avgIncomeShare", "Средняя доля дохода от ЮЛ", 9),
            new ExcelColumn("avgReceiptAmount", "Средняя сумма чека", 9),
            new ExcelColumn("avgReceiptsCount", "В среднем чеков в месяц пользу ЮЛ", 10),
            new ExcelColumn("avgIncome", "Среднемесячный  доход", 9),
            new ExcelColumn("massReg", "Массовая постановка на учет (НП/устройств)", 14),
            new ExcelColumn("massIncome", "Массовые регистрации дохода (НП/устройств)", 14),
            new ExcelColumn("groupCount", "Кол-во групп (работодателей-доноров)", 16),
            new ExcelColumn("groupSize", "Порог группы", 7),
            new ExcelColumn("ndflTransferSize", "Объем перехода по НДФЛ", 10),
            new ExcelColumn("rsvGroupSize", "Кол-во групп (работодателей-доноров) (РСВ)", 15),
            new ExcelColumn("rsvTransferSize", "Объем перехода по РСВ", 9),
            new ExcelColumn("ndflViolation", "Прямые нарушения НДФЛ", 10.5),
            new ExcelColumn("ndflViolationP", "% Прямых нарушений НДФЛ", 12),
            new ExcelColumn("rsvViolation", "Прямые нарушения РСВ", 10),
            new ExcelColumn("rsvViolationP", "% Прямых нарушений РСВ", 11),
            new ExcelColumn("paymentSchedule", "Коэф. периодичности выплат", 9),
            new ExcelColumn("workDuration", "Продолжительность работы", 9.5),
            new ExcelColumn("onceSourceOfIncome", "Единственный источник дохода", 9),
            new ExcelColumn("paymentFrequency", "Периодичность выплат", 8.5),
            new ExcelColumn("centralizedAccounting", "Централизованный учет", 8.5),
            new ExcelColumn("groupTransitions", "Групповые переходы", 10),
            new ExcelColumn("violation", "Прямые нарушения", 11),
        ];
    }

    public override transform(data: any) {
        data['workDuration'] = data['workDuration'] ? 'Да' : 'Нет'
        data['onceSourceOfIncome'] = data['onceSourceOfIncome'] ? 'Да' : 'Нет'
        data['paymentFrequency'] = data['paymentFrequency'] ? 'Да' : 'Нет'
        data['centralizedAccounting'] = data['centralizedAccounting'] ? 'Да' : 'Нет'
        data['groupTransitions'] = data['groupTransitions'] ? 'Да' : 'Нет'
        data['violation'] = data['violation'] ? 'Да' : 'Нет'
        return data
    }
    
}