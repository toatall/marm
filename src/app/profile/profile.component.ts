import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    
    public profile: any;
    public permissions: any;

    constructor(
        private authService: AuthService,
    ) { }

    ngOnInit(): void {        
        this.authService.userProfile().subscribe((profile: any) => {
            this.profile = profile;
            if (Array.isArray(profile.permissions)) {
                const permissions: Array<string> = profile.permissions.map((item: any) => `${item.subject} (${item.actions})`);
                this.permissions = permissions.join(', ');
            }
        });
    }
}
