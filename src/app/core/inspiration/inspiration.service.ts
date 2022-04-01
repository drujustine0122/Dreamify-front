import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../common/pagination.model';
import {CreateInspiration, Inspiration} from './inspiration.model';
import { Dreamboard } from '../dreamboard/dreamboard.model';

@Injectable({
  providedIn: 'root'
})
export class InspirationService {

  constructor(
    private http: HttpClient
  ) {
  }

  getInspirationsByDreamboard(id: string): Observable<PaginatedResponse<Inspiration>> {
    return this.http.post<PaginatedResponse<Inspiration>>(environment.api + '/dreamboard/' + id + '/inspirations/search', null);
  }

  getInspirations(id: string): Observable<PaginatedResponse<Inspiration>> {
    return this.http.post<PaginatedResponse<Inspiration>>(environment.api + '/inspiration/search', null);
  }

  createInspiration(payload: CreateInspiration): Observable<Inspiration> {
    return this.http.post<Inspiration>(environment.api + '/inspiration', payload);
  }

  addInspirationDreamboard(id: string, inspirations: Inspiration[]): Observable<Dreamboard>  {
    const inspirationArray: string[] = [];

    for( let i = 0; i < inspirations.length; i++){
      inspirationArray[i] = inspirations[i].id;
    }
    return this.http.post<Dreamboard>(environment.api + '/dreamboard/' + id + '/inspirations/add', { inspirations: inspirationArray });
  }

  getInspirationById(id: string): Observable<Inspiration> {
    return this.http.get<Inspiration>(environment.api + '/inspiration/' + id);
  }

}
