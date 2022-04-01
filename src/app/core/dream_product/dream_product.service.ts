import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DreamProductService {

    products: any = [];
    products$: BehaviorSubject<any> = new BehaviorSubject(this.products);

    constructor(
        private http: HttpClient
    ) {
    }

    getAllProducts() {
        const products = [
            { name: 'Itinerary', likes: 'ocean' },
            { name: 'Planner    ', likes: 'pond' },
            { name: 'Calendar', likes: 'fish biscuits' },
            { name: 'Information', likes: 'pond' },
            { name: 'Articles', likes: 'pond' },
            { name: 'News', likes: 'pond' },
            { name: 'Discussions', likes: 'pond' },
            { name: 'community', likes: 'pond' },
            { name: 'Stories', likes: 'pond' },
            { name: 'Advice', likes: 'pond' },
            { name: 'Help', likes: 'pond' },
            { name: 'Products', likes: 'pond' },
            { name: 'Boards', likes: 'pond' },
            { name: 'Team', likes: 'pond' },
            { name: 'Support', likes: 'pond' },
            { name: 'Journal', likes: 'pond' },
            { name: 'Resources', likes: 'pond' },
            { name: 'Settings', likes: 'pond' },
        ]
        // return products;
        //return this.http.get(environment.api + '/dream_product').pipe(res => res);
        return this.http.get(environment.api + '/dream_category').pipe(res => res);

    }
}
