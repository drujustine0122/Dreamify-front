import { Category } from '../category/category.model';

export interface CustomerProfile {
  bio: string;
  latitude: number;
  longitude: number;
  address: string;
  banner?: string;
  title?: string;
  categories: Category[];
}

export interface UpdateCustomerProfile {
  bio?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  banner?: string;
  title?: string;
}
