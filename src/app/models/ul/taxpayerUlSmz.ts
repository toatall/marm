import { ExcelColumn } from "../excel/column"
import { ExcelData } from "../excel/data"
import { TaxPayerFl } from "../fl/taxpayerFl"

export interface TaxPayerUlSmz {

    // ИНН
    inn: string

    // ФИО
    name: string

    // Регион ведения деят.
    regionName: string

    // Код НО
    authorityCode: string

    // Сумма дохода от данного ЮЛ/ИП
    income: number

    // % дохода от данного ЮЛ/ИП
    incomePart: number

    // Средний чек от данного ЮЛ/ИП
    avgReceipt: number

    // Сумма дохода от ЮЛ/ИП
    incomeLE: number

    // Средняя сумма чека,  по зарегистрированным чекам в сторону всех ЮЛ
    avgReceiptLE: number

    // Сумма дохода общая
    incomeAll: number

    // Средний чек по всем доходам
    avgReceiptAll: number

    // Среднемесячный доход
    monthAverageIncomeAll: number

    // Количество чеков
    receiptCountAll: number

    // Прямые нарушения
    ndfl: boolean


    // данные о самозанятом
    taxPayerFl: TaxPayerFl

}

export class TaxPayerUlSmzHelper extends ExcelData {

    public override getData(): ExcelColumn[] {
        return [
            new ExcelColumn("inn", "ИНН", 13),
            new ExcelColumn("name", "ФИО", 35),
            new ExcelColumn("regionName", "Регион ведения деят.", 35),
            new ExcelColumn("authorityCode", "Код НО", 7),
            new ExcelColumn("income", "Сумма дохода от данного ЮЛ/ИП", 10),
            new ExcelColumn("incomePart", "% дохода от данного ЮЛ/ИП", 10),
            new ExcelColumn("avgReceipt", "Средний чек от данного ЮЛ/ИП", 8),
            new ExcelColumn("incomeLE", "Сумма дохода от ЮЛ/ИП", 8),
            new ExcelColumn("avgReceiptLE", "Средняя сумма чека, по зарегистрированным чекам в сторону всех ЮЛ", 15),
            new ExcelColumn("incomeAll", "Сумма дохода общая", 10),
            new ExcelColumn("avgReceiptAll", "Средний чек по всем доходам", 10),
            new ExcelColumn("monthAverageIncomeAll", "Среднемесячный доход", 9),
            new ExcelColumn("receiptCountAll", "Количество чеков", 11),
            new ExcelColumn("ndfl", "Прямые нарушения", 11),
        ];
    }

    public override transform(data: any) {
        data['ndfl'] = data['ndfl'] ? 'Да' : 'Нет';
        return data;
    }
    
}