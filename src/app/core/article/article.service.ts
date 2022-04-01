import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../common/pagination.model';
import { Article, CreateArticle, CreateArticleMessage, ArticleMessage , CreateArticleThread , ArticleThread} from './article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(
    private http: HttpClient
  ) { }

  createArticle(payload: CreateArticle): Observable<Article> {
    return this.http.post<Article>(environment.api + '/article/article', payload);
  }

  updateArticle(id: string, payload: CreateArticle): Observable<Article> {
    return this.http.put<Article>(environment.api + '/article/article/' + id, payload);
  }

  getArticles(): Observable<PaginatedResponse<Article>> {
    return this.http.post<PaginatedResponse<Article>>(environment.api + '/article/article/search', null);
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(environment.api + '/article/article/' + id);
  }

  createArticleMessageByArticleId(id: string, payload: CreateArticleMessage): Observable<ArticleMessage> {
    return this.http.post<ArticleMessage>(environment.api + '/article/article/' + id + '/message', payload);
  }

  getArticleMessagesByArticleId(id: string): Observable<PaginatedResponse<ArticleMessage>> {
    return this.http.post<PaginatedResponse<ArticleMessage>>(environment.api + '/article/article/' + id + '/messages', null);
  }

  createArticleMessage(id: string, payload: CreateArticleMessage): Observable<ArticleMessage> {
    return this.http.post<ArticleMessage>(environment.api + '/article/article/' + id + '/message', payload);
  }

  getArticleThreadsByArticleMessageId(id: string): Observable<PaginatedResponse<ArticleThread>> {
    return this.http.post<PaginatedResponse<ArticleThread>>(environment.api + '/article/message/' + id + '/threads/search', null);
  }

  createArticleThread(id: string, payload: CreateArticleThread): Observable<ArticleThread> {
    return this.http.post<ArticleThread>(environment.api + '/article/message/' + id + '/thread', payload);
  }

}
