import { Injectable } from '@angular/core';

const PREFIX_TOKEN_KEY = 'car_rental';
const TOKEN = `${PREFIX_TOKEN_KEY}.token`;
const USER = `${PREFIX_TOKEN_KEY}.user`;

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  static saveToken(token: string) {
    localStorage.removeItem(TOKEN);
    localStorage.setItem(TOKEN, token);
  }

  static saveUser(user: any) {
    localStorage.removeItem(USER);
    localStorage.setItem(USER, JSON.stringify(user));
  }

  static getToken(): string | null {
    return localStorage.getItem(TOKEN);
  }

  static getUser(): any {
    return JSON.parse(localStorage.getItem(USER) || '{}');
  }

  static getUserId(): string {
    const user = this.getUser();
    return user?.id || '';
  }

  static getUserRole(): string {
    const user = this.getUser();
    return user?.role || '';
  }

  static getUserName(): string {
    const user = this.getUser();
    return user?.name || '';
  }

  static isAdminLoggedIn(): boolean {
    return this.getToken() != null && this.getUserRole() === 'ADMIN';
  }

  static isCustomerLoggedIn(): boolean {
    return this.getToken() != null && this.getUserRole() === 'CUSTOMER';
  }

  static logout() {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
  }
}
