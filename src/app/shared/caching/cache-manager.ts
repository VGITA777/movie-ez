import {ExpirableSimpleCache} from "./simple-cache";

export interface CacheManager<T> {
  get(key: string): Promise<T | undefined>;

  set(key: string, value: any, expiration: number): Promise<T>;

  delete(key: string): Promise<void>;

  clear(): Promise<void>;

  has(key: string): Promise<boolean>;

  values(): Promise<T[]>;

  keys(): Promise<any[]>;
}

export class LocalStorageCacheManager implements CacheManager<ExpirableSimpleCache> {
  private data: Map<string, ExpirableSimpleCache> = new Map<string, ExpirableSimpleCache>();

  constructor(private readonly namespace: string) {
    JSON.parse(localStorage.getItem(this.namespace) ?? '[]').forEach((d: ExpirableSimpleCache) => this.data.set(d.key, d));
  }

  async clear(): Promise<void> {
    this.data.clear();
    localStorage.removeItem(this.namespace);
    return Promise.resolve();
  }

  async delete(key: string): Promise<void> {
    await this.load();
    this.data.delete(key);
    await this._save();
    return Promise.resolve();
  }

  async get(key: string): Promise<ExpirableSimpleCache | undefined> {
    await this.load();
    return this.data.get(key);
  }

  async has(key: string): Promise<boolean> {
    await this.load();
    return this.data.has(key);
  }

  async set(key: string, value: any, expiration: number): Promise<ExpirableSimpleCache> {
    await this.load();
    const now = Date.now();
    const existingData: ExpirableSimpleCache | undefined = await this.get(key);
    const data: ExpirableSimpleCache = existingData ? {...existingData, updatedAt: now} : {
      key: key,
      value: value,
      expiration: expiration,
      createdAt: now,
      updatedAt: now
    };
    this.data.set(key, data);
    await this._save();
    return data;
  }

  async keys(): Promise<string[]> {
    await this.load();
    return Array.from(this.data.keys());
  }

  async values(): Promise<ExpirableSimpleCache[]> {
    await this.load();
    return Array.from(this.data.values());
  }

  async load(): Promise<void> {
    JSON.parse(localStorage.getItem(this.namespace) ?? '[]').forEach((d: ExpirableSimpleCache) => this.data.set(d.key, d));
    return Promise.resolve();
  }

  private async _save(): Promise<void> {
    localStorage.setItem(this.namespace, JSON.stringify(Array.from(this.data.values())));
  }
}
