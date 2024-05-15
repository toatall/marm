import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

@Injectable({
    providedIn: 'root'
})
/**
 * Работа с хранилищем
 */
export class StorageService {
    
    /**
     * {@inheritdoc}
     */
    constructor() { }

    /**
     * Очистка хранилища
     * @returns {void}
     */
    public clean(): void {
        window.sessionStorage.clear();
    }

    /**
     * Сохранение информации о пользователе в хранилище
     * @param user 
     * @returns {void}
     */
    public saveUser(user: any): void {
        window.sessionStorage.removeItem(USER_KEY);
        window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    /**
     * Получение информации из хранилища
     * @returns {any}
     */
    public getUser(): any {
        const user = window.sessionStorage.getItem(USER_KEY);
        if (user) {
            return JSON.parse(user);
        }
        return null;
    }

    /**
     * Проверка аутентификации пользователя
     * путем наличия информации о пользователе
     * в хранилище
     * @returns {boolean}
     */
    public isLoggedIn(): boolean {
        const user = window.sessionStorage.getItem(USER_KEY);
        if (user) {
            return true;
        }
        return false;
    }
}
