export interface Follow {
  id: string;
  userId: string;
  followUserId: string;
}

export interface CreateFollow {
  followUserId: string;
}

export interface SuccessFollow {
  success: boolean;
  id: string;
}
