import { Category } from '../category/category.model';
import { Entity } from '../common/common.model';
import { User } from '../user/user.model';

export interface News extends Entity {
    cover: string;
    title: string;
    hDescription: string;
    description: string;
    categories: Category[];
    createdBy: User;
}

export interface SearchNews {
    categoryFilter: string;
    queryFilter: string;
    skip: number;
    take: number;
}

export interface CreateNews {
    cover: string;
    title: string;
    hDescription: string;
	  description: string;
    categories: string[];
}

export interface NewsMessage extends Entity {
    id: string;
    text: string;
    createdBy: User;
    threads: NewsThread[];
}

export interface CreateNewsMessage {
    text: string;
}

export interface NewsThread extends Entity {
    id: string;
    text: string;
    createdBy: User;
}

export interface CreateNewsThread {
    text: string;
}
