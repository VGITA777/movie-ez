import {ExpirableSimpleCache, SimpleCache} from "./simple-cache";

export interface CacheManager<T extends SimpleCache<any>> {
  get(key: string): Promise<T | undefined>;

  set(key: string, value: any, expiration: number): Promise<T>;

  delete(key: string): Promise<void>;

  clear(): Promise<void>;

  has(key: string): Promise<boolean>;

  values(): Promise<T[]>;

  keys(): Promise<any[]>;

  reload(): Promise<void>;
}

export class LocalStorageCacheManager<T> implements CacheManager<ExpirableSimpleCache<T>> {
  private data: Map<string, ExpirableSimpleCache<T>> = new Map<string, ExpirableSimpleCache<T>>();

  constructor(private readonly namespace: string) {
    this._load();
  }

  private get now(): number {
    return Date.now();
  }

  async clear(): Promise<void> {
    this.data.clear();
    localStorage.removeItem(this.namespace);
    return Promise.resolve();
  }

  async delete(key: string): Promise<void> {
    await this.reload();
    this.data.delete(key);
    await this._save();
    return Promise.resolve();
  }

  async get(key: string): Promise<ExpirableSimpleCache<T> | undefined> {
    await this.reload();
    return this.data.get(key);
  }

  async has(key: string): Promise<boolean> {
    await this.reload();
    return this.data.has(key);
  }

  async set(key: string, value: any, expiration: number): Promise<ExpirableSimpleCache<T>> {
    await this.reload();
    const existingData: ExpirableSimpleCache<T> | undefined = await this.get(key);
    const data: ExpirableSimpleCache<T> = {
      key: key,
      value: value,
      expiration: expiration,
      createdAt: existingData ? existingData.createdAt : this.now,
      updatedAt: this.now
    }
    this.data.set(key, data);
    await this._save();
    return data;
  }

  async keys(): Promise<string[]> {
    await this.reload();
    return Array.from(this.data.keys());
  }

  async values(): Promise<ExpirableSimpleCache<T>[]> {
    await this.reload();
    return Array.from(this.data.values());
  }

  async reload(): Promise<void> {
    this._load();
    return Promise.resolve();
  }

  private _load(): void {
    try {
      JSON.parse(localStorage.getItem(this.namespace) ?? '[]').forEach((d: ExpirableSimpleCache<T>) => this.data.set(d.key, d));
    } catch (e) {
      localStorage.setItem(this.namespace, '[]');
    }
  }

  private async _save(): Promise<void> {
    localStorage.setItem(this.namespace, JSON.stringify(Array.from(this.data.values())));
  }
}
