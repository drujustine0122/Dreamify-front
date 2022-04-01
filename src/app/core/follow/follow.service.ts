import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Follow, CreateFollow, SuccessFollow } from './follow.model';

@Injectable({
  providedIn: 'root'
})

export class FollowService {

  constructor(
    private http: HttpClient
  ) { }

  createFollow(payload: CreateFollow): Observable<Follow> {
    return this.http.post<Follow>(environment.api + '/follow', payload);
  }

  isFolloingById(payload: CreateFollow): Observable<SuccessFollow> {
    return this.http.get<SuccessFollow>(environment.api + '/follow/state/' + payload.followUserId);
  }

  removeFollow(payload: CreateFollow): Observable<boolean> {
    return this.http.delete<boolean>(environment.api + '/follow/' + payload.followUserId);
  }
}
