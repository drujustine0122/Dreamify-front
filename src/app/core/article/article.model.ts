import { Category } from '../category/category.model';
import { Entity } from '../common/common.model';
import { User } from '../user/user.model';

export interface Article extends Entity {
    cover: string;
    title: string;
    hDescription: string;
    description: string;
    categories: Category[];
    createdBy: User;
}

export interface CreateArticle {
    cover: string;
    title: string;
    hDescription: string;
	  description: string;
    categories: string[];
}

export interface ArticleMessage extends Entity {
    id: string;
    text: string;
    createdBy: User;
    threads: ArticleThread[];
}

export interface CreateArticleMessage {
    text: string;
}

export interface ArticleThread extends Entity {
    id: string;
    text: string;
    createdBy: User;
}

export interface CreateArticleThread {
    text: string;
}
