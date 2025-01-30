import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComerciantesService } from '../../core/comerciantes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-comerciante',
  standalone: true,
  templateUrl: './formulario-comerciante.component.html',
  styleUrl: './formulario-comerciante.component.scss',
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class FormularioComercianteComponent implements OnInit {
  comercianteForm!: FormGroup;
  municipios: string[] = [];

  constructor(private fb: FormBuilder, private comerciantesService : ComerciantesService,  private router: Router) {}

  ngOnInit() {
    this.inicializarFormulario();
    this.obtenerMunicipios();
  }

  cambiarPagina(){
    this.router.navigate(['/dashboard'])
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');

    this.router.navigate(['/login']); // Redirige al login
  }

  // Inicializa el formulario con validaciones
  inicializarFormulario() {
    this.comercianteForm = this.fb.group({
      nombreRazonSocial: ['', [Validators.required, Validators.minLength(3)]],
      municipio: ['', [Validators.required]],
      telefono: ['', [Validators.pattern('^[0-9]{7,10}$')]],
      correoElectronico: ['', [Validators.email]],
      fechaRegistro: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      poseeEstablecimientos: [false]
    });
  }

  // Llama al servicio para obtener los municipios
  obtenerMunicipios() {
    this.comerciantesService.obtenerMunicipios().subscribe((data:any) => {
      this.municipios = data;
    });
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    if (this.comercianteForm.valid) {
      console.log('Formulario enviado:', this.comercianteForm.value);
      // Aquí puedes llamar al servicio para guardar los datos
    } else {
      console.log('Formulario inválido');
    }
  }
}
