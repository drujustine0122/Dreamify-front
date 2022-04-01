import { Entity } from '../common/common.model';
import { CustomerProfile } from '../customer/customer.model';

export enum UserRole {
  superAdmin = 'SUPER_ADMIN',
  admin = 'ADMIN',
  merchant = 'MERCHANT',
  customer = 'CUSTOMER',
}

export enum Gender {
  male = 'MALE',
  female = 'FEMALE',
  other = 'OTHER'
}

export interface User extends Entity {
  name: string; // TODO: delete me
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: UserRole;
  gender?: Gender;
  birthday?: string;
  avatar?: string;
  status?: string;
  customerProfile?: CustomerProfile;
}
