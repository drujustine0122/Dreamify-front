import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../common/pagination.model';
import { News, CreateNews, CreateNewsMessage, NewsMessage , CreateNewsThread , NewsThread, SearchNews} from './news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(
    private http: HttpClient
  ) { }

  createNews(payload: CreateNews): Observable<News> {
    return this.http.post<News>(environment.api + '/news/news', payload);
  }

  updateNews(id: string, payload: CreateNews): Observable<News> {
    return this.http.put<News>(environment.api + '/news/news/' + id, payload);
  }

  getNews(searchFilter: SearchNews): Observable<PaginatedResponse<News>> {
    return this.http.post<PaginatedResponse<News>>(environment.api + '/news/news/search', searchFilter);
  }

  getNewsById(id: string): Observable<News> {
    return this.http.get<News>(environment.api + '/news/news/' + id);
  }

  createNewsMessageByNewsId(id: string, payload: CreateNewsMessage): Observable<NewsMessage> {
    return this.http.post<NewsMessage>(environment.api + '/news/news/' + id + '/message', payload);
  }

  getNewsMessagesByNewsId(id: string): Observable<PaginatedResponse<NewsMessage>> {
    return this.http.post<PaginatedResponse<NewsMessage>>(environment.api + '/news/news/' + id + '/messages', null);
  }

  createNewsMessage(id: string, payload: CreateNewsMessage): Observable<NewsMessage> {
    return this.http.post<NewsMessage>(environment.api + '/news/news/' + id + '/message', payload);
  }

  getNewsThreadsByNewsMessageId(id: string): Observable<PaginatedResponse<NewsThread>> {
    return this.http.post<PaginatedResponse<NewsThread>>(environment.api + '/news/message/' + id + '/threads/search', null);
  }

  createNewsThread(id: string, payload: CreateNewsThread): Observable<NewsThread> {
    return this.http.post<NewsThread>(environment.api + '/news/message/' + id + '/thread', payload);
  }

}
