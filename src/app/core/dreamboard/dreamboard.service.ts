import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../common/pagination.model';
import { CreateDreamboard, Dreamboard } from './dreamboard.model';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DreamboardService {

    count = 0;
    count$: BehaviorSubject<number> = new BehaviorSubject(this.count);

    dreamboards: Dreamboard[] = [];
    dreamboards$: BehaviorSubject<Dreamboard[]> = new BehaviorSubject<Dreamboard[]>(this.dreamboards);

    constructor(
        private http: HttpClient
    ) { }

    dreamboardCreated(dreamboard: Dreamboard) {
        this.dreamboards.unshift(dreamboard);
        this.dreamboards$.next([...this.dreamboards]);
    }

    dreamboardUpdated(dreamboard: Dreamboard) {
        const index = this.dreamboards.findIndex(x => x.id === dreamboard.id);
        this.dreamboards[index] = dreamboard;
        this.dreamboards$.next([...this.dreamboards]);
    }

    createDreamboard(payload: CreateDreamboard): Observable<Dreamboard> {
        return this.http.post<Dreamboard>(environment.api + '/dreamboard', payload);
    }

    getDreamboardsByIdea(id: string): Observable<PaginatedResponse<Dreamboard>> {
        return this.http.post<PaginatedResponse<Dreamboard>>(environment.api + '/idea/' + id + '/dreamboards/search', null);
    }

    addDreamboardIdea(id: string, dreamboards: Dreamboard[]): Observable<Dreamboard>  {
        const dreamboardArray: string[] = [];

        for( let i = 0; i < dreamboards.length; i++){
            dreamboardArray[i] = dreamboards[i].id;
        }
        return this.http.post<Dreamboard>(environment.api + '/idea/' + id + '/dreamboards/add', { dreamboards: dreamboardArray });
    }
}
