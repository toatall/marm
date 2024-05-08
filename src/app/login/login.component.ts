import { Component, Inject, OnInit, inject } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    form: any = {
        username: null,
        password: null
    };
    isLoggedIn = false;
    isLoginFailed = false;
    errorMessage = '';
    roles: string[] = [];
    user?: any; 
    isLoading: boolean = false;

    constructor(private authService: AuthService, private storageService: StorageService, private router: Router) { }

    ngOnInit(): void {
        if (this.storageService.isLoggedIn()) {
            this.isLoggedIn = true;
            this.roles = this.storageService.getUser().roles;
            this.user = this.storageService.getUser();
        }
    }

    onSubmit(): void {
        const { username, password } = this.form;
        this.isLoading = true;
        this.authService.login(username, password)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: data => {
                    this.storageService.saveUser(Object.assign(data, { username: username }));

                    this.isLoginFailed = false;
                    this.isLoggedIn = true;
                    this.roles = this.storageService.getUser().roles;
                    this.user = this.storageService.getUser();
                    this.toHomePage();
                },
                error: err => {
                    this.errorMessage = err.error.message;
                    this.isLoginFailed = true;
                }
        });
    }

    toHomePage(): void {       
        this.router.navigate(['/']).finally(() => {
            window.location.reload()
        });
    }
}
