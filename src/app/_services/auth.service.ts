import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from 'src/environment';
import { NotifierService } from 'angular-notifier';

const AUTH_API = environment.urlLogin()   
const REFRESH_TOKEN = environment.urlTokenRefresh()

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    /**
     * {@inheritdoc}
     */
    constructor(
        private http: HttpClient, 
        private storageService: StorageService,
        private notifierService: NotifierService,
    ) {}

    /**
     * Вход пользователя
     * @param {string} username 
     * @param {string} password 
     * @returns {Observable<any>}
     */
    public login(username: string, password: string): Observable<any> {
        return this.http.post(
            AUTH_API,
            {
                username,
                password,
            },
            httpOptions
        );
    }    

    /**
     * Обновление токена
     * @param {HttpRequest<any>} req 
     * @returns {void}
     */
    public tokenRefresh(req: HttpRequest<any>): void {
        const user = this.storageService.getUser()
        if (user == null) {
            this.logout()
            return
        }
        this.http.post(REFRESH_TOKEN, {
            refreshToken: user.refreshToken,
        }, { headers: {} })
        .subscribe((data) => {
            this.storageService.saveUser(Object.assign(data, { username: user.username }))
            this.notifierService.notify('info', 'Токен пользователя был обновлен! Повторите запрос еще раз!')            
        })
    }

    /**
     * Выход пользователя
     * @returns {void}
     */
    public logout(): void {
        this.storageService.clean();
        window.location.reload();
    }    

}
