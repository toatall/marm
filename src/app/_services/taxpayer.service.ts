import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

const URL = 'http://marmnpd.tax.nalog.ru:8081/api/v2/fin_profile'

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
        return this.http.post<any>(`${URL}/taxpayers`, {
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
        return this.http.get<any>(`${URL}/taxpayer/${inn}`, { responseType: 'json' })
            .pipe(map(data => data.taxpayer))
    }

    /**
     * Журнал регистраций НП
     * @param fid ФИД 
     * @returns 
     */
    public getRegLog(fid: Number): Observable<any> {
        return this.http.post<any>(`${URL}/taxpayer_reg_log/data`, {
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
        return this.http.post<any>(`${URL}/taxpayer_receipts/data`, {
            fid: fid,
            filtered: [],
            page: 0,
            pageSize: 99999,
            sorted: [],
        })
        .pipe(map(data => data.rows))
    }

}