import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {    
    isLoggedIn = false;
    showAdminBoard = false;
    showModeratorBoard = false;
    username?: string;

    eventBusSub?: Subscription;

    constructor(
        private storageService: StorageService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.isLoggedIn = this.storageService.isLoggedIn();

        if (this.isLoggedIn) {
            const user = this.storageService.getUser();
            this.username = user.username;
        }        
    }

    logout(): void {       
        this.authService.logout()
    }
}
