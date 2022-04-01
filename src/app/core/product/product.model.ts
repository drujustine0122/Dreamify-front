import { Entity } from '../common/common.model';

export interface Product extends Entity {
    name: string;
}

export interface SearchProduct {
    type: string;
}
