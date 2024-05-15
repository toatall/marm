import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    
    constructor(
        private storageService: StorageService,         
        private notifierService: NotifierService,
        private authService: AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.storageService.getUser()?.token
        if (token != null) {
            if (!req.url.includes('token')) {
                req = req.clone({
                    headers: req.headers.set('Authorization', 'Bearer ' + this.storageService.getUser()?.token)
                })
            }            
        }

        return next.handle(req).pipe(            
            catchError((error) => {
                                            
                // update token
                if (error instanceof HttpErrorResponse && !req.url.includes('login') && error.status == 401) {                    
                    this.notifierService.notify('error', 'Токен пользователя просрочен!')
                    this.authService.tokenRefresh(req)                   
                    return next.handle(req)
                }

                this.notifierService.notify('error', error.message);
                
                return throwError(() => error);
            })           
        );
    }
    
}

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
