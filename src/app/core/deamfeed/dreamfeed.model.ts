import { Entity } from '../common/common.model';
import { User } from '../user/user.model';

export interface DreamFeed extends Entity {
    type: string;
    action: string;
    title: string;
    description: string;
    cover: string;
    createdId: string;
    createdBy: User;
}

export interface CreateDreamFeed extends Entity {
  description: string;
  cover: string;
}

export interface DreamFeedMessage extends Entity {
  id: string;
  text: string;
  createdBy: User;
}

export interface CreateDreamFeedMessage {
  text: string;
}

export interface DreamFeedThread extends Entity {
  id: string;
  text: string;
  createdBy: User;
}

export interface CreateDreamFeedThread {
  text: string;
}
