import { Entity } from '../common/common.model';
import { User } from '../user/user.model';

export interface Dreamboard extends Entity {
    title: string;
    description: string;
    createdBy: User;
}

export interface CreateDreamboard {
    title: string;
    description: string;
}
