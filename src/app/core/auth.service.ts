import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import { Router } from '@angular/router';
import {  ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root',
})
export class Auth_service {

  private api_url = 'http://localhost:8080/auth/login';
  private http = inject(HttpClient)
  private router = inject(Router)
  private toast = inject(ToastrService);

  constructor( ) {}

  login( email: string, password: string ): void {
    this.http.post<any>(this.api_url, {correo:email, contrasena: password}).subscribe(
      (res) => {
        const token = res.token;
        this.save_token(token);

        const role = this.get_user_role();
        localStorage.setItem('userRole', role);
        
         this.router.navigate(['/dashboard']);
    }, (err) => {
      this.toast.error('Las credenciales ingresadas con incorrectas')
    })
  }

  save_token(token: string) {
    localStorage.setItem('token', token);
  }

  get_token(): string | null {

    if (typeof window !== 'undefined') { 
      return localStorage.getItem('token');
    }
    return null;
  }

  decode_token(): any {
    const token = this.get_token();
    return token ? jwtDecode(token) : null;
  }

  get_user_role(): string {
    const decoded = this.decode_token();
    return decoded ? decoded.role : '';
  }

  close_seccion() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  
    this.router.navigate(['/login']);
  }
}
