import { Category } from '../category/category.model';
import { User } from '../user/user.model';
import { Entity } from '../common/common.model';

export interface Idea extends Entity {
  cover: string;
  title: string;
  description: string;
  categories: Category[];
  createdBy: User;
  likedCount: number;
  dreamboardsCount: number;
}

export interface CreateIdea {
  title: string;
  description: string;
  cover: string;
  categories: string[];
}

export interface SearchIdea {
  dreamType: string;
  categoryFilter: [];
  queryFilter: string;
  skip: number;
  take: number;
}

export interface DreamLists {
  dreamId: number;
  dreamName: string;
  children: [];
}
