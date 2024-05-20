import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environment";


@Injectable({
    providedIn: 'root',
})
export class TaxpayerService {

    constructor(private http: HttpClient) {}

    /**
     * Список НП
     * @param inn 
     * @returns 
     */
    public getTaxpayers(inn: string): Observable<any> {
        return this.http.post<any>(environment.urlTaxPayers(), {
            filtered: [{id: "inn", value: inn}],
            page: 0,
            pageSize: 1,
            sorted: [],
        }).pipe(map(data => data.rows.pop()))
    }

    /**
     * Данные НП
     * @param inn ИНН
     * @returns 
     */
    public getProfile(inn: string): Observable<any> {
        return this.http.get<any>(environment.urlTaxPayerProfile(inn), { responseType: 'json' })
            .pipe(map(data => data.taxpayer))
    }

    /**
     * Журнал регистраций НП
     * @param fid ФИД 
     * @returns 
     */
    public getRegLog(fid: Number): Observable<any> {
        return this.http.post<any>(environment.urlTaxPayerRegLog(), {
            fid: fid,
            filtered: [],
            page: 0,
            pageSize: 99999,
            sorted: [],
        })
        .pipe(map(data => data.rows))
    }

    /**
     * Чеки НП
     * @param fid ФИД 
     * @returns 
     */
    public getReceipts(fid: Number): Observable<any> {
        return this.http.post<any>(environment.urlTaxPayerReceipts(), {
            fid: fid,
            filtered: [],
            page: 0,
            pageSize: 99999,
            sorted: [{id: "approvalTime", desc: true}],
        })
        .pipe(map(data => data.rows))
    }



    /**
     * Поиск ПН ЮЛ(ИП) в разделе "Контрольная панель"  
     * @param {string} inn 
     * @returns {Observable<any>}
     */
    public getOrgInRisk(inn: string): Observable<any> {
        return this.http.post<any>(environment.urlOrgInRisk(), {
            startDate: "202312",
            endDate: "202403",

            filtered: [{id: "inn", value: inn}],
            page: 0,
            pageSize: 1,
            regions: [],
            sorted: [{id: "regionName", desc: false}],            
        })    
        .pipe(map(data => data.infoToDate[0]))
    }

    /**
     * Информация ПН ЮЛ(ИП) вкладка "Основные показатели"
     * @param {string} inn 
     * @param {string} reportDate 
     * @returns {Observable<any>}
     */
    public getUlBasic(inn: string, reportDate: string): Observable<any> {
        return this.http.get<any>(environment.urlUlBasic(), {
            params: {
                inn: inn,
                reportDate: reportDate,
            }
        })
        .pipe(map(data => data.listInfo))
    }

    /**
     * Информация ПН ЮЛ(ИП) вкладка "Реестр самозанятых"
     * @param {string} inn 
     * @param {string} reportDate 
     * @returns {Observable<any>}
     */
    public getUlSmzRegistry(inn: string, reportDate: string): Observable<any> {
        return this.http.post<any>(environment.urlSmzRegistry(), {
            "inn": inn,
            "reportDate": reportDate,
            "page": 0,
            "pageSize": 99999,
            "sorted": [
                {
                    "id": "income",
                    "desc": true
                }
            ],
            "filtered": [],
        })
        .pipe(map(data => data.listInfo))
    }

    /**
     * Информация о карточках расчетах с бюджетом НП
     * @param {number} fid 
     * @returns {Observable<any>}
     */
    public getKrsb(fid: number): Observable<any> {
        return this.http.post<any>(environment.urlKrsb(), {            
            "fid": fid,
            "page": 0,
            "pageSize": 1,
            "filtered": [],
            "sorted": [
                {
                    "id": "updatedAt",
                    "desc": false
                }
            ],
        })
        .pipe(map(data => data.rows[0]));
    }

}