import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InitialData } from 'app/app.types';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any> {

  constructor(
    private http: HttpClient,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InitialData> {
    // Fork join multiple API endpoint calls to wait all of them to finish
    return forkJoin([
      this.http.get<any>('api/common/messages'),
      this.http.get<any>('api/common/navigation'),
      this.http.get<any>('api/common/notifications'),
      this.http.get<any>('api/common/shortcuts'),
      this.http.get<any>(`${environment.api}/auth`)
    ]).pipe(
      map(([messages, navigation, notifications, shortcuts, user]) => ({
          messages,
          navigation: {
            horizontal: navigation.horizontal,
            superAdmin: navigation.superAdmin,
            admin: navigation.admin,
            merchant: navigation.merchant,
            customer: navigation.customer,
          },
          notifications,
          shortcuts,
          user
        })
      )
    );
  }
}
