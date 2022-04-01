import { Category } from '../category/category.model';
import { Entity } from '../common/common.model';
import { User } from '../user/user.model';

export interface Topic extends Entity {
    cover: string;
    title: string;
    description: string;
    categories: Category[];
    createdBy: User;
}

export interface SearchTopic {
    categoryFilter: string;
    queryFilter: string;
    skip: number;
    take: number;
}

export interface CreateTopic {
	title: string;
    cover: string;
	description: string;
    categories: string[];
}

export interface Message extends Entity {
    id: string;
    text: string;
    createdBy: User;
}

export interface CreateMessage {
    text: string;
}

export interface Comment extends Entity {
    id: string;
    text: string;
    createdBy: User;
}

export interface CreateComment {
    text: string;
}

export interface Profile
{
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    about?: string;
}

export interface Contact
{
    id?: string;
    avatar?: string;
    name?: string;
    about?: string;
    details?: {
        emails?: {
            email?: string;
            label?: string;
        }[];
        phoneNumbers?: {
            country?: string;
            phoneNumber?: string;
            label?: string;
        }[];
        title?: string;
        company?: string;
        birthday?: string;
        address?: string;
    };
    attachments?: {
        media?: any[];
        docs?: any[];
        links?: any[];
    };
}

export interface Chat
{
    id?: string;
    contactId?: string;
    contact?: Contact;
    unreadCount?: number;
    muted?: boolean;
    lastMessage?: string;
    lastMessageAt?: string;
    messages?: {
        id?: string;
        chatId?: string;
        contactId?: string;
        isMine?: boolean;
        value?: string;
        createdAt?: string;
    }[];
}
