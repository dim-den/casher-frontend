import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryInfo } from '../../shared/models/category-info';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly _baseUrl = '/category';

  constructor(private http: HttpClient) {}

  public getAll(): Observable<CategoryInfo[]> {
    return this.http.get<CategoryInfo[]>(`${this._baseUrl}`);
  }
}
