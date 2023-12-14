import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/';
  private loginUrl = 'api/login/';
  private logoutUrl = 'api/logout/';
  private checkAuth = 'api/checkauth/';
  private userInfoUrl = 'api/whoami/';
  private changePasswordUrl = 'api/change_password/';
  private userUpdateUrl = 'api/user_update/';
  private isAuthenticatedFlag: boolean = false;
  private reloadUserData = new BehaviorSubject<boolean>(false);
  reloadUserData$ = this.reloadUserData.asObservable();

  setReloadUserData(value: boolean) {
    this.reloadUserData.next(value);
  }

  constructor(private http: HttpClient) { }

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

      await this.http.post<any>(this.getUrl(this.logoutUrl), {}).toPromise();

      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedFlag;
  }

  async whoami(): Promise<any> {
    return await this.http.get<any>(`${this.baseUrl}${this.checkAuth}`)
      .toPromise()
      .then(response => {
        console.log(response)
        this.isAuthenticatedFlag = response.is_authenticated;
        return true;
      }).catch((error) => console.log(error));
  }

  async getUserInfo(): Promise<any> {
    try {
      const userInfoUrl = `${this.baseUrl}${this.userInfoUrl}`;
      const response = await this.http.get<any>(userInfoUrl).toPromise();
      console.log('User Info Response:', response);
      return response;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      const url = this.getUrl(this.changePasswordUrl);
      const body = { old_password: oldPassword, new_password: newPassword };

      await this.http.post<any>(url, body).toPromise();

      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  }

  async updateUserProfile(file: File): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      await this.http.put<any>(this.getUrl(this.userUpdateUrl), formData).toPromise();
      this.setReloadUserData(true);
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
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
