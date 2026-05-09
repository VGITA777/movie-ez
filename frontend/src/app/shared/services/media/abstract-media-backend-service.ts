import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class AbstractMediaBackendService {
  protected readonly client: HttpClient = inject(HttpClient);
  protected readonly baseUrl: string;

  protected constructor(url: string) {
    this.baseUrl = url;
  }

  protected performRequest<T extends object, I>(endpoint: string, input?: I): Observable<T> {
    if (!input) {
      return this.client.get<T>(`${this.baseUrl}${endpoint}`);
    }
    const convertedInput: Record<string, any> = AbstractMediaBackendService.buildHttpParams(input);
    const httpParam: HttpParams = new HttpParams({ fromObject: convertedInput });
    return this.client.get<T>(`${this.baseUrl}${endpoint}`, {
      params: httpParam,
    });
  }

  protected static buildHttpParams<T extends object>(data: T): Record<string, any> {
    return Object.entries(data).reduce<Record<string, any>>((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, []);
  }
}
