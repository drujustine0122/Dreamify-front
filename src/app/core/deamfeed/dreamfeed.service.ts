import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../common/pagination.model';
import { CreateDreamFeed, CreateDreamFeedMessage, CreateDreamFeedThread, DreamFeed, DreamFeedMessage, DreamFeedThread} from './dreamfeed.model';

@Injectable({
  providedIn: 'root'
})
export class DreamFeedService {

  constructor(
    private http: HttpClient
  ) { }

  getDreamFeeds(): Observable<PaginatedResponse<DreamFeed>> {
    return this.http.post<PaginatedResponse<DreamFeed>>(environment.api + '/feed/search', null);
  }

  getDreamFeedById(id: string): Observable<DreamFeed> {
    return this.http.get<DreamFeed>(environment.api + '/feed/' + id);
  }

  getDreamFeedMessagesByDreamFeedId(id: string): Observable<PaginatedResponse<DreamFeedMessage>> {
    return this.http.post<PaginatedResponse<DreamFeedMessage>>(environment.api + '/feed/' + id + '/messages', null);
  }

  createDreamFeedMessage(id: string, payload: CreateDreamFeedMessage): Observable<DreamFeedMessage> {
    return this.http.post<DreamFeedMessage>(environment.api + '/feed/' + id + '/message', payload);
  }

  getDreamFeedThreadsByDreamFeedMessageId(id: string): Observable<PaginatedResponse<DreamFeedThread>> {
    return this.http.post<PaginatedResponse<DreamFeedThread>>(environment.api + '/dreamfeed/message/' + id + '/threads/search', null);
  }

  createDreamFeedThread(id: string, payload: CreateDreamFeedThread): Observable<DreamFeedThread> {
    return this.http.post<DreamFeedThread>(environment.api + '/dreamfeed/message/' + id + '/thread', payload);
  }

  createDreamFeed(payload: CreateDreamFeed): Observable<DreamFeed> {
    return this.http.post<DreamFeed>(environment.api + '/feed', payload);
  }

}
