import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DreamCategoryService {

  categories: any = [];
  categories$: BehaviorSubject<any> = new BehaviorSubject(this.categories);

  constructor(
    private http: HttpClient
  ) {
  }

  getAllCategories() {
    return this.http.get(environment.api + '/dream_category').pipe(res => res);
  }
}
