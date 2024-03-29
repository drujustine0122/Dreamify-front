import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MyService {

    private messageSource = new BehaviorSubject<string>('service');
    currentMessage = this.messageSource.asObservable();


    constructor() { }

    changeMessage(message: string) {
        this.messageSource.next(message)
    }
}
