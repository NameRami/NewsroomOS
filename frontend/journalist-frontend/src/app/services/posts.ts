import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';

export type Post = {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: { _id: string; name: string; email: string; avatarUrl?: string };
  __optimistic?: boolean;
};

@Injectable({ providedIn: 'root' })
export class PostsService {
  private baseUrl = environment.apiUrl;

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private http: HttpClient) {}

  list(): Observable<Post[]> {
    if (!this.isBrowser) return of([]);
    return this.http.get<Post[]>(`${this.baseUrl}/posts`);
  }

  create(content: string): Observable<Post> {
    if (!this.isBrowser) {
      throw new Error('PostsService.create() called during SSR');
    }
    return this.http.post<Post>(`${this.baseUrl}/posts`, { content });
  }

  generate(prompt: string): Observable<{ content: string }> {
    if (!this.isBrowser) {
      throw new Error('PostsService.generate() called during SSR');
    }
    return this.http.post<{ content: string }>(`${this.baseUrl}/posts/generate`, { prompt });
  }

  update(postId: string, content: string): Observable<Post> {
    if (!this.isBrowser) {
      throw new Error('PostsService.update() called during SSR');
    }
    return this.http.put<Post>(`${this.baseUrl}/posts/${postId}`, { content });
  }

  delete(postId: string): Observable<{ message: string; _id: string }> {
    if (!this.isBrowser) {
      throw new Error('PostsService.delete() called during SSR');
    }
    return this.http.delete<{ message: string; _id: string }>(`${this.baseUrl}/posts/${postId}`);
  }
}