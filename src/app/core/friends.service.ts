import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Friend {
  id: string;
  name: string;
  gender: string;
}

export interface BaseResponseListDto<T> {
  statusCode: number;
  data: T[];
  message: string;
}

@Injectable({ providedIn: 'root' })
export class FriendsService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getFriends(): Observable<Friend[]> {
    return this.http
      .get<BaseResponseListDto<Friend>>(`${this.apiBaseUrl}/api/friends`)
      .pipe(map((response) => response.data || []));
  }

  getFriendById(id: string): Observable<Friend> {
    return this.http.get<Friend>(`${this.apiBaseUrl}/api/friends/${id}`);
  }
}
