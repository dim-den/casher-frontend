import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfo } from '../../shared/models/user-info';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _baseUrl = '/user';

  constructor(private http: HttpClient) {}

  public getInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this._baseUrl}/info`);
  }
}
