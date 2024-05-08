import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://marmnpd.tax.nalog.ru:8081/api/v1/auth/pwd';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) { }

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

    register(username: string, email: string, password: string): Observable<any> {
        return this.http.post(
            AUTH_API + 'signup',
            {
                username,
                email,
                password,
            },
            httpOptions
        );
    }

    // logout(): Observable<any> {
    //     return this.http.post(AUTH_API + 'signout', {}, httpOptions);
    // }

    logout(): void {
        
    }
}
