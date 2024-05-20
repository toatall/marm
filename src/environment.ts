export const environment = {

    // базовая ссылка
    baseUrl: 'http://marmnpd.tax.nalog.ru:8081/api',

    // аутентификация
    urlLogin: function() { return `${this.baseUrl}/v1/auth/pwd` },
    urlTokenRefresh: function() { return `${this.baseUrl}/v1/auth/token` },

    // профиль пользователя
    urlUserProfile() { return `${this.baseUrl}/v1/user` },    

    
    // список финансовых профилей
    urlTaxPayers: function() { return `${this.baseUrl}/v2/fin_profile/taxpayers` },

    // финансовый профиль
    urlTaxPayerProfile: function(inn: string) { return `${this.baseUrl}/v2/fin_profile/taxpayer/${inn}` },

    // журнал регистраций НП
    urlTaxPayerRegLog: function() { return `${this.baseUrl}/v2/fin_profile/taxpayer_reg_log/data` },

    // чеки НП
    urlTaxPayerReceipts: function() { return `${this.baseUrl}/v2/fin_profile/taxpayer_receipts/data` },
    

    
    // список компаний с риск-баллом
    urlOrgInRisk: function() { return `${this.baseUrl}/v2/control/org_in_risk` },
    
    // основные показатели
    urlUlBasic: function() { return `${this.baseUrl}/v3/control/le/basic` },

    // реестр самозанятых
    urlSmzRegistry: function() { return `${this.baseUrl}/v3/control/le/smz_registry` },

    // карточки расчетов с бюджетом
    urlKrsb: function() { return `${this.baseUrl}/v2/fin_profile/taxpayer_krsb/data` },
    
}