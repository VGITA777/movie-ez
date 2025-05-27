import {SimpleCache} from "./simple-cache";

export interface CacheManager {
  get(key: string): any | null;

  set(key: string, value: any, expiration: number): Promise<any>;

  delete(key: string): Promise<void>;

  clear(): Promise<void>;

  has(key: string): Promise<boolean>;

  values(): Promise<any[]>;

  keys(): Promise<any[]>;
}

export class LocalStorageCacheManager implements CacheManager {
  private data: Map<string, SimpleCache> = new Map<string, SimpleCache>();

  constructor(private readonly namespace: string) {
    JSON.parse(localStorage.getItem(this.namespace) ?? '[]').forEach((d: SimpleCache) => this.data.set(d.key, d));
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

  async get(key: string): Promise<SimpleCache | undefined> {
    await this.load();
    return this.data.get(key);
  }

  async has(key: string): Promise<boolean> {
    await this.load();
    return this.data.has(key);
  }

  async set(key: string, value: any, expiration: number): Promise<SimpleCache> {
    await this.load();
    const now = Date.now();
    const existingData: SimpleCache | undefined = await this.get(key);
    const data: SimpleCache = existingData ? {...existingData, updatedAt: now} : {
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

  async values(): Promise<SimpleCache[]> {
    await this.load();
    return Array.from(this.data.values());
  }

  async load(): Promise<void> {
    JSON.parse(localStorage.getItem(this.namespace) ?? '[]').forEach((d: SimpleCache) => this.data.set(d.key, d));
    return Promise.resolve();
  }

  private async _save(): Promise<void> {
    localStorage.setItem(this.namespace, JSON.stringify(Array.from(this.data.values())));
  }
}
