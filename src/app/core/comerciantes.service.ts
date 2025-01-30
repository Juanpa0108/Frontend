import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComercianteI } from '../interfaces/Comerciante.interface';
import { PaginacionComerciantesI } from '../interfaces/PaginacionComerciantesI.interface.ts';

@Injectable({
  providedIn: 'root'
})
export class ComerciantesService {

   private apiUrl = 'http://localhost:8080/comerciantes';
   private apiAdmin = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) {}

  token = localStorage.getItem('token');
    
    
    headers = new HttpHeaders({
       Authorization: `Bearer ${this.token}`
    });
  

  obtenerComerciantes(): Observable<PaginacionComerciantesI> {
      return this.http.get<PaginacionComerciantesI>(`${this.apiUrl}/buscar`, { headers: this.headers });
  }


  obtenerComerciantesSize(size: number): Observable<{ content: ComercianteI[] }> {
    return this.http.get<{ content: ComercianteI[] }>(`${this.apiUrl}/buscar?size=${size}`, { headers: this.headers });
  }

  cambiarEstado(id: number, estado: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/estado/${id}?estado=${estado}`, null,  {headers : this.headers}); 
  }

  eliminarComerciante(id:number):Observable<void>{
    return this.http.delete<void>(`${this.apiAdmin}/comerciante/${id}`, {headers: this.headers});
  }

  generarReport(): Observable<Blob> {
    return this.http.get(`${this.apiAdmin}/activos`, {
      headers: this.headers,
      responseType: 'blob' 
    });
  }

  obtenerMunicipios(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:8080/municipios', {headers: this.headers});
  }
  

}
