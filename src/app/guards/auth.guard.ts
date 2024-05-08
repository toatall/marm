import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { StorageService } from "../_services/storage.service";


@Injectable()
class PermissionService {
    constructor(private storageService: StorageService) {}
    canActivate() {
        return this.storageService.isLoggedIn()
    }
    
}

// export const canAuth: CanActivateFn = (
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot,
// ) => {
//     return inject(PermissionService).canActivate()
// }

export const canAuth = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const storageService = inject(StorageService)
    if (!storageService.isLoggedIn()) {
        return inject(Router).createUrlTree(['/login'])
    }
    return true
}