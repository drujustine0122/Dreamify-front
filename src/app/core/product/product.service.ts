import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Product, SearchProduct } from './product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    products: Product[] = [];
    products$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(this.products);

    constructor(
        private http: HttpClient
    ) {
    }

    async getProducts(searchProduct: SearchProduct) {
        // return new Promise<Array>((resolve, reject)) =>{
        //   this.http.post<Category[]>(environment.api + '/category/search', searchCategory).subscribe((categories) => {
        //     resolve
        //     this.categories = categories;
        //     console.log("sd:", this.categories);
        //     this.categories$.next(this.categories);
        //   });
        // } 

        // console.log(environment.api + '/category/search');
        // this.products = await this.http.post<Product[]>(environment.api + '/product/search', searchProduct).toPromise();
        // console.log("sd:", this.categories);
        // this.products$.next(this.products);

    }
}
