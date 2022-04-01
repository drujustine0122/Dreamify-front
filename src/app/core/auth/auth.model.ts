import { User } from '../user/user.model';

export interface TokenResponse {
  accessToken: string;
  user: User;
}

