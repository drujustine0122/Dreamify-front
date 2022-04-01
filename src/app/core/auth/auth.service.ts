import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from '../../../environments/environment';
import { TokenResponse } from './auth.model';
import { Gender, User } from '../user/user.model';

@Injectable()
export class AuthService {
  private _authenticated: boolean = false;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post('api/auth/forgot-password', email);
  }

  resetPassword(password: string): Observable<any> {
    return this.http.post('api/auth/reset-password', password);
  }

  signIn(credentials: { email: string; password: string }): Observable<any> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError('User is already logged in.');
    }

    return this.http.post(`${environment.api}/auth/login`, credentials).pipe(
      switchMap((response: TokenResponse) => {
        // Store the access token in the local storage
        this.accessToken = response.accessToken;

        // Set the authenticated flag to true
        this._authenticated = true;

        // Store the user on the user service
        this.userService.user = response.user;

        // Return a new observable with the response
        return of(response);
      })
    );
  }

  signInUsingToken(): Observable<any> {
    // Get current user profile using existing token
    return this.http.get(`${environment.api}/auth`).pipe(
      catchError(() => of(false)),
      switchMap((user: User) => {
        this._authenticated = true;
        this.userService.user = user;
        return of(true);
      })
    );
  }

  signOut(): Observable<any> {
    // Remove the access token from the local storage
    localStorage.removeItem('accessToken');

    // Set the authenticated flag to false
    this._authenticated = false;

    // Return the observable
    return of(true);
  }

  signUp(user: { firstName: string; lastName: string; email: string; password: string; phone: string; birthday: string; gender: Gender }): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${ environment.api }/auth/customer-register`, user).pipe(
      switchMap((response: TokenResponse) => {
        // Store the access token in the local storage
        this.accessToken = response.accessToken;

        // Set the authenticated flag to true
        this._authenticated = true;

        // Store the user on the user service
        this.userService.user = response.user;

        // Return a new observable with the response
        return of(response);
      })
    );
  }

  unlockSession(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post('api/auth/unlock-session', credentials);
  }

  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this._authenticated) {
      return of(true);
    }

    // Check the access token availability
    if (!this.accessToken) {
      return of(false);
    }

    // Check the access token expire date
    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false);
    }

    // If the access token exists and it didn't expire, sign in using it
    // TODO: api for refresh token doesn't exists, need to be created this flow
    return this.signInUsingToken();
  }
}
