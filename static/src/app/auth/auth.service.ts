import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/';
  private loginUrl = 'api/login/';
  private logoutUrl = 'api/logout/';
  private tokenCookieName = 'isAuthenticated';

  private isAuthenticatedFlag: boolean = false;

  constructor(private cookieService: CookieService, private http: HttpClient){}

  async login(username: string, password: string): Promise<boolean> {
    try {
      const dynamicLoginUrl = this.getUrl(this.loginUrl);

      const response = await this.http.post<any>(dynamicLoginUrl, { username, password }).toPromise();

      this.cookieService.set(this.tokenCookieName, "true");

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

      this.cookieService.delete(this.tokenCookieName);

      const response = await this.http.post<any>(this.getUrl(this.logoutUrl), {}).toPromise();

      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    // Check if the token exists in the cookie
    console.log("isAuthenticated", this.cookieService.get('isAuthenticated'))
    return this.cookieService.get('isAuthenticated') == "true" ;
    
  }

  private getUrl(endpoint: string): string {
    return this.baseUrl + endpoint;
  }

  private setCookie(name: string, value: string): void {
    document.cookie = `${name}=${value}; path=/`;
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  private removeCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
