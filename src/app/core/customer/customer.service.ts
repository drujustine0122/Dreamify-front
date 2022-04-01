import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { UpdateCustomerProfile } from './customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
  }

  updateCategoryPreference(ids: string[]): Observable<User> {
    return this.http.post<User>(environment.api + '/customer/preference/category', { ids }).pipe(
      map(user => this.userService.user = user)
    );
  }

  updateProfilePreference(payload: UpdateCustomerProfile): Observable<User> {
    return this.http.post<User>(environment.api + '/customer/preference/profile', payload).pipe(
      map(user => this.userService.user = user)
    );
  }

}
