import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Category, SearchCategory } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: Category[] = [];
  categories$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>(this.categories);

  constructor(
    private http: HttpClient
  ) {
  }

  async getCategories(searchCategory: SearchCategory) {
    // return new Promise<Array>((resolve, reject)) =>{
    //   this.http.post<Category[]>(environment.api + '/category/search', searchCategory).subscribe((categories) => {
    //     resolve
    //     this.categories = categories;
    //     console.log("sd:", this.categories);
    //     this.categories$.next(this.categories);
    //   });
    // } 

    // console.log(environment.api + '/category/search');
    this.categories = await this.http.post<Category[]>(environment.api + '/category/search', searchCategory).toPromise();
    // console.log("sd:", this.categories);
    this.categories$.next(this.categories);

  }
}
