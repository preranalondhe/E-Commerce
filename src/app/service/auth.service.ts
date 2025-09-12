import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode'; // ✅ Named import

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token); // ✅ Use named import
      return decoded.role || null;
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }
  getUserInfo(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }
}
