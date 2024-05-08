import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

const AUTH_API = 'http://marmnpd.tax.nalog.ru:8081/api/v1/auth/pwd';
const REFRESH_TOKEN = 'http://marmnpd.tax.nalog.ru:8081/api/v1/auth/token';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient, private storageService: StorageService) { }

    login(username: string, password: string): Observable<any> {
        return this.http.post(
            AUTH_API,
            {
                username,
                password,
            },
            httpOptions
        );
    }    

    tokenRefresh(req: HttpRequest<any>) {        
        const user = this.storageService.getUser()
        if (user == null) {
            this.logout()
            return            
        }
        this.http.post(REFRESH_TOKEN, {
            refreshToken: user.refreshToken,
        }, { headers: {} })
        .subscribe((data) => {
            this.storageService.saveUser(Object.assign(data, { username: user.username }));
            this.http.request(req).subscribe()
        })
    }

    logout() {
        this.storageService.clean();
        window.location.reload();
    }

}
