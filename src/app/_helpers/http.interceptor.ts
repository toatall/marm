import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { StorageService } from '../_services/storage.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    private isRefreshing = false;

    constructor(
        private storageService: StorageService, 
        private eventBusService: EventBusService, 
        private notifierService: NotifierService,
        private authService: AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.storageService.getUser()?.token
        if (token != null) {
            if (!req.url.includes('token')) {
                req = req.clone({
                    // withCredentials: true,                
                    headers: req.headers.set('Authorization', 'Bearer ' + this.storageService.getUser()?.token)
                })
            }
        }

        return next.handle(req).pipe(
            catchError((error) => {    
                this.notifierService.notify('error', error.message);                
                
                // update token
                if (error instanceof HttpErrorResponse && !req.url.includes('login') && error.status == 401) {                    
                    this.authService.tokenRefresh(req)
                    return next.handle(req);
                }
                
                return throwError(() => error);
            })
        );
    }
    
}

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
