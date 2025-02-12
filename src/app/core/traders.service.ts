import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TraderI } from '../interfaces/traders.interface';
import { Pagination_traderI } from '../interfaces/Pagination_trader.interface';
import { Create_trader } from '../interfaces/Create_trader.interface';

@Injectable({
  providedIn: 'root'
})
export class Traders_service {

   private api_url = 'http://localhost:8080/comerciantes';
   private api_admin = 'http://localhost:8080/admin';
   private http = inject(HttpClient);

  constructor() {}

  token = localStorage.getItem('token');
    
    
    headers = new HttpHeaders({
       Authorization: `Bearer ${this.token}`
    });
  

  get_traders(): Observable<Pagination_traderI> {
      return this.http.get<Pagination_traderI>(`${this.api_url}/buscar`, { headers: this.headers });
  }


  get_traders_size(size: number): Observable<{ content: TraderI[] }> {
    return this.http.get<{ content: TraderI[] }>(`${this.api_url}/buscar?size=${size}`, { headers: this.headers });
  }

  change_state(id: number, state: string): Observable<void> {
    return this.http.patch<void>(`${this.api_url}/estado/${id}?estado=${state}`, null,  {headers : this.headers}); 
  }

  delete_trader(id:number):Observable<void>{
    return this.http.delete<void>(`${this.api_admin}/comerciante/${id}`, {headers: this.headers});
  }

  generate_report(): Observable<Blob> {
    return this.http.get(`${this.api_admin}/activos`, {
      headers: this.headers,
      responseType: 'blob' 
    });
  }

  get_towns(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:8080/municipios', {headers: this.headers});
  }

  get_summary_institution(id: number): Observable<{ totalEmpleados: number; totalIngresos: number }> {
    return this.http.get<{ totalEmpleados: number; totalIngresos: number }>(
      `${this.api_url}/resumen-establecimientos/${id}`,
      { headers: this.headers }
    );
  }

  save_trader(data:Create_trader): Observable<Create_trader>{
    return this.http.post<Create_trader>(`${this.api_url}/create`, data, {headers: this.headers})
  }


  get_trader_by_ID(id:number): Observable<TraderI>{
    return this.http.get<TraderI>(`${this.api_url}/${id}`, {headers:this.headers});
  }
  
  edit_trader(data:Create_trader, id:number):Observable<Create_trader>{
    return this.http.put<Create_trader>(`${this.api_url}/${id}`, data, {headers:this.headers})
  }
  

}
