import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../common/pagination.model';
import { CreateIdea, Idea, SearchIdea } from './idea.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {

  count = 0;
  count$: BehaviorSubject<number> = new BehaviorSubject(this.count);

  searchIdea: SearchIdea;

  ideas: Idea[] = [];
  ideas$: BehaviorSubject<Idea[]> = new BehaviorSubject<Idea[]>(this.ideas);

  constructor(
    private http: HttpClient
  ) { }

  ideaCreated(idea: Idea) {
    this.ideas.unshift(idea);
    this.ideas$.next([...this.ideas]);
  }

  ideaRemoved(idea: Idea) {
    const index = this.ideas.findIndex(x => x.id === idea.id);
    this.ideas.splice(index, 1);
    this.ideas$.next([...this.ideas]);
  }

  ideaUpdated(idea: Idea) {
    const index = this.ideas.findIndex(x => x.id === idea.id);
    this.ideas[index] = idea;
    this.ideas$.next([...this.ideas]);
  }

  createIdea(payload: CreateIdea): Observable<Idea> {
    return this.http.post<Idea>(environment.api + '/idea', payload);
  }

  updateIdea(id: string, payload: CreateIdea): Observable<Idea> {
    return this.http.put<Idea>(environment.api + '/idea/' + id, payload);
  }

  getIdeas(searchFilter: SearchIdea): Observable<PaginatedResponse<Idea>> {
    return this.http.post<PaginatedResponse<Idea>>(environment.api + '/idea/search', searchFilter);
  }

  getIdeaById(id: string): Observable<Idea> {
    return this.http.get<Idea>(environment.api + '/idea/' + id);
  }

  removeIdeaById(id: string): Observable<boolean> {
    return this.http.delete<boolean>(environment.api + '/idea/' + id);
  }

  initIdeas(): void {
    this.ideas = [];
    this.searchIdea = { dreamType: '', queryFilter: '', categoryFilter: [], skip: 0, take: 0 };
    this.loadIdeas();
  }

  setQueryFilter(query: string): void {
    this.searchIdea.queryFilter = query;
  }

  setCategoryFilter(categories: []): void {
    this.searchIdea.categoryFilter = categories;
  }

  setDreamType(dreamType: string): void {
    this.searchIdea.dreamType = dreamType;
  }

  getDreamType(): string {
    return this.searchIdea.dreamType;
  }

  loadIdeas(): void {
    this.getIdeas(this.searchIdea).pipe(
      map((res) => {
        this.count = res.count;
        this.count$.next(this.count);
        this.ideas = [...res.data];
        this.ideas$.next(this.ideas);
      })
    ).subscribe();
  }

}
