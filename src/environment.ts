export const environment = {

    // базовая ссылка
    baseUrl: 'http://marmnpd.tax.nalog.ru:8081/api/v1',

    // аутентификация
    urlLogin: function() { return `${this.baseUrl}/auth/pwd` },
    urlTokenRefresh: function() { return `${this.baseUrl}/auth/token` },

    
}