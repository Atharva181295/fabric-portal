import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = 'http://localhost:8000';
  private usersApiUrl = `${this.baseUrl}/api/users`;
  private registerApiUrl = `${this.baseUrl}/api/register/`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.usersApiUrl);
  }

  addUser(userData: any): Observable<any> {
    return this.http.post(this.registerApiUrl, userData);
  }

  deleteUser(userId: number): Observable<any> {
    const deleteUrl = `${this.usersApiUrl}/${userId}`;
    return this.http.delete(deleteUrl);
  }

  getUserById(id: number): Observable<any> {
    const apiUrl = `${this.usersApiUrl}/${id}`;
    return this.http.get(apiUrl);
  }

  updateUser(userId: number, userData: any): Observable<any> {
    const apiUrl = `${this.usersApiUrl}/${userId}`;
    return this.http.put(apiUrl, userData);
  }

}
