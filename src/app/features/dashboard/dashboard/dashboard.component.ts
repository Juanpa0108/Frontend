import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Auth_service } from '../../../core/auth.service';
import { Traders_service } from '../../../core/traders.service';
import { TraderI } from '../../../interfaces/traders.interface';
import { CommonModule } from '@angular/common';
import {  map, Observable } from 'rxjs';
import { Pagination_traderI } from '../../../interfaces/Pagination_trader.interface';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit{

  traders$!: Observable<TraderI[]>;
  userRole: string = '';
  size: number = 5; 
  private toast = inject(ToastrService);
  private auth_service = inject(Auth_service);
  private trader_service = inject(Traders_service);

  constructor( ) {}

  ngOnInit() {
    
    this.get_user_role();
    this.get_traders();
    
  }

  get_user_role(){
    this.userRole = this.auth_service.get_user_role();
  }

  get_traders(){
    this.traders$ = this.trader_service.get_traders().pipe(
      map((res: Pagination_traderI) => res.content)
    );
  }


  close(){
    this.auth_service.close_seccion()
  }

  change_size() {
    this.traders$ = this.trader_service.get_traders_size(this.size).pipe(
      map((res) => res.content)
    )
  }


  generate_report() {
    this.trader_service.generate_report().subscribe((res) => {
      const blob = new Blob([res], { type: 'text/csv' }); 
      const url = window.URL.createObjectURL(blob); 
      const a = document.createElement('a'); 
      a.href = url;
      a.download = 'reporte_comerciantes.csv'; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); 
      window.URL.revokeObjectURL(url); 
    }, (error) => {
      //TODO TOASTTT
    });
  }
  


  change_state(trader: TraderI) {
    const new_state = trader.estado === 'Activo' ? 'Inactivo' : 'Activo';
  
    this.trader_service.change_state(trader.id, new_state).subscribe({
      next: () => {
        trader.estado = new_state;
        this.toast.success('El estado del usuario se ha modificado!!')
      },
      error: (err) => {
        this.toast.warning('Las credenciales no lograron ser modificadas')
      }
    });
  }  

  delete_trader(trader: any) {
    this.trader_service.delete_trader(trader.id).subscribe((res) => {
      this.toast.success('El usuario se ha eliminado correctamente');
    }, () => {
      this.toast.error('El usuario no se pudo eliminar')
    })
  }



 }
