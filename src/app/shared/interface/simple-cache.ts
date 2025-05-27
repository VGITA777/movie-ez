export interface SimpleCache {
  key: string;
  value: any;
  expiration?: number;
  createdAt?: number;
  updatedAt?: number;
}

export class ExpirableSimpleCache implements SimpleCache {
  constructor(public key: string, public value: any, public expiration: number, public createdAt: number, public updatedAt: number) {
  }

  get isValid(): boolean {
    return this.expiration > 0 && (Date.now() - this.createdAt) >= this.expiration;
  }
}
