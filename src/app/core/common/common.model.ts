export interface Entity {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Option<T> {
  value: T;
  label: string;
  image?: string;
}
