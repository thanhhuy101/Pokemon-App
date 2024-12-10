import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserStorageService } from '../userstorage/userstorage.service';

const API_URL = 'http://localhost:5001';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  constructor(
    private httpClient: HttpClient,
    private userStorageService: UserStorageService
  ) {
    this.isLoggedInSubject.next(this.userStorageService.isLoggedIn());
  }

  signup(signupRequest: any): Observable<any> {
    return this.httpClient.post(`${API_URL}/api/auth/signup`, signupRequest);
  }

  login(loginData: any) {
    return this.httpClient
      .post<any>(`${API_URL}/api/auth/login`, loginData)
      .pipe(
        tap((response) => {
          if (response.token) {
            this.userStorageService.saveToken(response.token);
            this.userStorageService.saveUser(response);
            this.isLoggedInSubject.next(true);
          }
        })
      );
  }
  logout(): Observable<any> {
    return this.httpClient.post(`${API_URL}/api/auth/logout`, {}).pipe(
      tap(() => {
        this.userStorageService.clear();
        this.isLoggedInSubject.next(false);
      })
    );
  }

  getToken(): string | null {
    return this.userStorageService.getToken();
  }

  getUser(): any {
    return this.userStorageService.getUser();
  }
}
