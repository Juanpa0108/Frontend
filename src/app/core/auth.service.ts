import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth/login';

  constructor(private http: HttpClient, private router: Router) {}

  login( email: string, password: string ): void {
    this.http.post<any>(this.apiUrl, {correo:email, contrasena: password}).subscribe(
      (res) => {
        const token = res.token;
        this.saveToken(token);

        const role = this.getUserRole();
        localStorage.setItem('userRole', role);
        
         this.router.navigate(['/dashboard']);
    }, ( err) => {
      console.log(err);
    })
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {

    if (typeof window !== 'undefined') { 
      return localStorage.getItem('token');
    }
    return null;
  }

  decodeToken(): any {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  getUserRole(): string {
    const decoded = this.decodeToken();
    return decoded ? decoded.role : '';
  }
}
