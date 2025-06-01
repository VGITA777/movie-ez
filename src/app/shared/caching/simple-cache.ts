export interface SimpleCache<T> {
  key: string;
  value: T;
  expiration?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface ExpirableSimpleCache<T> extends SimpleCache<T> {
  expiration: number;
}
