import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/';
  private loginUrl = 'api/login/';
  private logoutUrl = 'api/logout/';

  private isAuthenticatedFlag: boolean = false;

  constructor(private http: HttpClient) {}

  async login(username: string, password: string): Promise<boolean> {
    try {
      const dynamicLoginUrl = this.getUrl(this.loginUrl);

      const response = await this.http.post<any>(dynamicLoginUrl, { username, password }).toPromise();

      this.isAuthenticatedFlag = true;

      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    try {
      this.isAuthenticatedFlag = false;

      const response = await this.http.post<any>(this.getUrl(this.logoutUrl), {}).toPromise();
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedFlag;
  }

  private getUrl(endpoint: string): string {
    return this.baseUrl + endpoint;
  }
}
