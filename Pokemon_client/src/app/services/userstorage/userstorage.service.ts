import { Injectable } from '@angular/core';

const TOKEN_KEY = 'pokemon-token';
const USER_KEY = 'pokemon-user';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  constructor() {}
  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public getUser(): any {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public getUserId(): string {
    const user = this.getUser();
    if (user == null) {
      return '';
    }
    return user.userId;
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public clear(): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }
}
