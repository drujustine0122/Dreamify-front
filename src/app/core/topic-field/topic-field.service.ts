import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../common/pagination.model';
import { CreateComment, CreateMessage, CreateTopic, Message, Topic, Comment, SearchTopic } from './topic-field.model';

@Injectable({
  providedIn: 'root'
})
export class TopicFieldService {

  constructor(
    private http: HttpClient
  ) { }

  createTopic(payload: CreateTopic): Observable<Topic> {
    return this.http.post<Topic>(environment.api + '/discussion/topic', payload);
  }

  updateTopic(id: string, payload: CreateTopic): Observable<Topic> {
    return this.http.put<Topic>(environment.api + '/discussion/topic/' + id, payload);
  }

  getTopics(searchFilter: SearchTopic): Observable<PaginatedResponse<Topic>> {
    return this.http.post<PaginatedResponse<Topic>>(environment.api + '/discussion/topic/search', searchFilter);
  }

  getTopicById(id: string): Observable<Topic> {
    return this.http.get<Topic>(environment.api + '/discussion/topic/' + id);
  }

  createCommentByTopicId(id: string, payload: CreateComment): Observable<Comment> {
    return this.http.post<Comment>(environment.api + '/discussion/topic/' + id + '/comment', payload);
  }

  getCommentsByTopicId(id: string): Observable<PaginatedResponse<Comment>> {
    return this.http.post<PaginatedResponse<Comment>>(environment.api + '/discussion/topic/' + id + '/comments', null);
  }

  createComment(id: string, payload: CreateComment): Observable<Comment> {
    return this.http.post<Comment>(environment.api + '/discussion/topic/' + id + '/comment', payload);
  }

  getMessagesByCommentId(id: string): Observable<PaginatedResponse<Message>> {
    return this.http.post<PaginatedResponse<Message>>(environment.api + '/discussion/comment/' + id + '/messages/search', null);
  }

  createMessage(id: string, payload: CreateMessage): Observable<Message> {
    return this.http.post<Message>(environment.api + '/discussion/comment/' + id + '/message', payload);
  }

}
