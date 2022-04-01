import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'app/core/user/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

  constructor(
    private http: HttpClient
  ) {
  }

  set user(value: User) {
    this._user.next(value);
  }

  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  update(user: User): Observable<any> {
    return this.http.put<User>(environment.api + '/auth/profile', { ...user }).pipe(
      map((response) => {
        this._user.next(response);
      })
    );
  }
}
