import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export type UserLite = { _id: string; name: string; email: string };

export type Thread = {
  user: UserLite;
  lastMessage: {
    _id: string;
    body: string;
    from: string;
    to: string;
    createdAt: string;
  };
};

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchUsers(q: string): Observable<UserLite[]> {
    return this.http.get<UserLite[]>(`${this.baseUrl}/users/search?q=${encodeURIComponent(q)}`);
  }

  conversationWith(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/messages/with/${userId}`);
  }

  send(to: string, body: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/messages`, { to, body });
  }

  threads(): Observable<Thread[]> {
    return this.http.get<Thread[]>(`${this.baseUrl}/messages/threads`);
  }
}
