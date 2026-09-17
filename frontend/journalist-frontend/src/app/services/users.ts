import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from './posts';

export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  postsCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

@Injectable({ providedIn: 'root' })
export class UsersService {
  private baseUrl = environment.apiUrl;

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private http: HttpClient) {}

  me(): Observable<UserProfile> {
    if (!this.isBrowser) return of({} as UserProfile);
    return this.http.get<UserProfile>(`${this.baseUrl}/users/me`);
  }

  updateMe(payload: Partial<UserProfile>): Observable<UserProfile> {
    if (!this.isBrowser) {
      throw new Error('UsersService.updateMe() called during SSR');
    }
    return this.http.put<UserProfile>(`${this.baseUrl}/users/me`, payload);
  }

  getProfile(id: string): Observable<UserProfile> {
    if (!this.isBrowser) return of({} as UserProfile);
    return this.http.get<UserProfile>(`${this.baseUrl}/users/${id}`);
  }

  getUserPosts(id: string): Observable<Post[]> {
    if (!this.isBrowser) return of([]);
    return this.http.get<Post[]>(`${this.baseUrl}/users/${id}/posts`);
  }
}