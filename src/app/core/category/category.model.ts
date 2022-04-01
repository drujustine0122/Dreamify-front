import { Entity } from '../common/common.model';

export interface Category extends Entity {
  name: string;
}

export interface SearchCategory {
  type: string;
}
