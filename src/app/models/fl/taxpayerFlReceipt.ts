import { ExcelColumn } from "../excel/column"
import { ExcelData } from "../excel/data"

export interface TaxPayerFlReceipt {
    
    // Номер чека
    receiptId: string

    // Наименование товаров
    servicesSerialized: string

    // Сумма дохода
    totalAmount: number

    // Сумма налога
    tax: number

    // Налоговый вычет
    usedTaxDeduction: number

    // Статус чека
    receiptType: string

    // Время операции
    approvalTime: Date

    // Тип клиента
    incomeType: string

    // ИНН клиента
    clientInn: string

    // Название ИП/ЮЛ клиента
    clientDisplayName: string

    // Партнер,зарегистрировавший чек
    partnerName: string

    // Код партнера
    partnerCode: string

    // Время отмены
    cancellationTime?: Date

    // Причина отмены
    cancellationComment: string

    // Код устройства, с которого был отменен чек
    cancellationSourceDeviceId: string

    // Код устройства, с которого был зарегистрирован чек
    sourceDeviceId: string

    // Время регистрации дохода
    requestTime?: Date

    // Время регистрации чека в ПП НПД
    registerTime?: Date

    // Налоговый период
    taxPeriodId: number

    // Регион ведения деятельности в момент создания чека
    region: string

}

export class TaxPayerFlReceiptHelper extends ExcelData {

    public override getData(): ExcelColumn[] {
        return [
            new ExcelColumn("receiptId", "Номер чека", 13),
            new ExcelColumn("servicesSerialized", "Наименование товаров", 30),
            new ExcelColumn("totalAmount", "Сумма дохода", 8),
            new ExcelColumn("tax", "Сумма налога", 8),
            new ExcelColumn("usedTaxDeduction", "Налоговый вычет", 6),
            new ExcelColumn("receiptType", "Статус чека", 16),
            new ExcelColumn("approvalTime", "Время операции", 10),
            new ExcelColumn("incomeType", "Тип клиента", 16),
            new ExcelColumn("clientInn", "ИНН клиента", 12),
            new ExcelColumn("clientDisplayName", "Название ИП/ЮЛ клиента", 15),
            new ExcelColumn("partnerName", "Партнер,зарегистрировавший чек", 15),
            new ExcelColumn("partnerCode", "Код партнера", 35),
            new ExcelColumn("cancellationTime", "Время отмены", 11),
            new ExcelColumn("cancellationComment", "Причина отмены", 10),
            new ExcelColumn("cancellationSourceDeviceId", "Код устройства, с которого был отменен чек", 13),
            new ExcelColumn("sourceDeviceId", "Код устройства, с которого был зарегистрирован чек", 16),
            new ExcelColumn("requestTime", "Время регистрации дохода", 10),
            new ExcelColumn("registerTime", "Время регистрации чека в ПП НПД", 10),
            new ExcelColumn("taxPeriodId", "Налоговый период", 10),
            new ExcelColumn("region", "Регион ведения деятельности в момент создания чека", 45),
        ];
    }

    public override transform(data: any) {        
        data['approvalTime'] = data['approvalTime'] ? new Date(data['approvalTime']) : '';
        data['cancellationTime'] = data['cancellationTime'] ? new Date(data['cancellationTime']) : '';
        data['requestTime'] = data['requestTime'] ? new Date(data['requestTime']) : '';
        data['registerTime'] = data['registerTime'] ? new Date(data['registerTime']) : '';
        return data;
    }
    
}