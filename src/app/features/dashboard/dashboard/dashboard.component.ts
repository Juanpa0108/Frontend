import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { ComerciantesService } from '../../../core/comerciantes.service';
import { ComercianteI } from '../../../interfaces/Comerciante.interface';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { PaginacionComerciantesI } from '../../../interfaces/PaginacionComerciantesI.interface.ts';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit{

  comerciantes$!: Observable<ComercianteI[]>;
  userRole: string = '';
  pagina: number = 0;
  totalPaginas: number = 1;
  size: number = 5; // Tamaño inicial

  constructor(private authService: AuthService, private comercianteService:ComerciantesService, private router: Router ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.comerciantes$ = this.comercianteService.obtenerComerciantes().pipe(
      map((res: PaginacionComerciantesI) => res.content)
    );
    
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');

    this.router.navigate(['/login']); // Redirige al login
  }

  cambiarSize() {
    this.comerciantes$ = this.comercianteService.obtenerComerciantesSize(this.size).pipe(
      map((res) => res.content)
    )
    console.log(this.comerciantes$)
  }

  cambiarPagina(direccion: number) {
    this.pagina += direccion;
  }

  generarReporte() {
    this.comercianteService.generarReport().subscribe((res) => {
      const blob = new Blob([res], { type: 'text/csv' }); // Define el tipo de archivo
      const url = window.URL.createObjectURL(blob); // Crea la URL del archivo
      const a = document.createElement('a'); // Crea un elemento `<a>`
      a.href = url;
      a.download = 'reporte_comerciantes.csv'; // Nombre del archivo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // Elimina el enlace después de la descarga
      window.URL.revokeObjectURL(url); // Limpia la URL creada
    }, (error) => {
      console.error("Error al generar el reporte", error);
    });
  }
  


  cambiarEstado(comerciante: ComercianteI) {
    const nuevoEstado = comerciante.estado === 'Activo' ? 'Inactivo' : 'Activo';
  
    this.comercianteService.cambiarEstado(comerciante.id, nuevoEstado).subscribe({
      next: () => {
        comerciante.estado = nuevoEstado;
        //TODO agregar TOAST
      },
      error: (err) => {
        console.error('Error cambiando estado:', err);
      }
    });
  }  

  editarComerciante(comerciante: any) {
         this.router.navigate(['/nuevo-comerciante']);
  }

  eliminarComerciante(comerciante: any) {
    this.comercianteService.eliminarComerciante(comerciante.id).subscribe((res) => {
      //TODO Agregar TOAST
    })
  }


  navegar(){
    this.router.navigate(['/nuevo-comerciante']);
  }


 }
