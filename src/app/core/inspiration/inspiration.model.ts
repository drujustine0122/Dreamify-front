import { Entity } from '../common/common.model';
import { Category } from '../category/category.model';
import { User } from '../user/user.model';

export enum InspirationType {
  photo = 'PHOTO',
  video = 'VIDEO'
}

export interface Inspiration extends Entity {
  url: string;
  type: InspirationType;
  category: Category;
  createdBy: User;
  createdAt: string;
  likesCount: number;
}

export interface CreateInspiration {
  url: string;
  type: InspirationType;
  category: string;
}
