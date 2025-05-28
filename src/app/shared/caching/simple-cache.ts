export interface SimpleCache {
  key: string;
  value: any;
  expiration?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface ExpirableSimpleCache extends SimpleCache {
  expiration: number;
}
