import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Traders_service } from '../../core/traders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth_service } from '../../core/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-formulario-comerciante',
  standalone: true,
  templateUrl: './formulario-comerciante.component.html',
  styleUrl: './formulario-comerciante.component.scss',
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class FormularioComercianteComponent implements OnInit {
  trader_form!: FormGroup;
  towns: string[] = [];
  trader_ID!: number;
  show_footer: boolean = false;
  total_worker: number | null = null;
  total_income: number | null = null;
  state:string = 'Activo';
  private toast = inject(ToastrService);
  private fb = inject(FormBuilder);
  private traders_service = inject(Traders_service);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth_service = inject(Auth_service);

  constructor() {}

  ngOnInit() {
    this.form_start();
    this.get_towns();
    this.get_param();
  }

  get_param(){
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.trader_ID = +id;
        this.show_footer = true; 
        this.get_summary();
      }
    });
  }

  get_summary() {
    this.traders_service.get_summary_institution(this.trader_ID).subscribe(resumen => {
      this.total_worker = resumen.totalEmpleados;
      this.total_income = resumen.totalIngresos;
    });
  }


  change_page(){
    this.router.navigate(['/dashboard'])
  }

  close() {
    this.auth_service.close_seccion();
  }

  
  form_start() {

    this.trader_form = this.fb.group({
      nombreRazonSocial: ['', [Validators.required, Validators.minLength(3)]],
      municipio: ['', Validators.required],
      telefono: ['', Validators.pattern('^[0-9]{7,10}$')],
      correoElectronico: ['', [Validators.email]],
      fechaRegistro: ['', Validators.required],
      poseeEstablecimientos: [false]
    });

  }

  
  get_towns() {
    this.traders_service.get_towns().subscribe((data:any) => {
      this.towns = data;
    });
  }

  on_submit() {
    if (this.trader_form.valid) {
      if (this.trader_ID) {
        this.traders_service.get_trader_by_ID(this.trader_ID)
        .subscribe((res)=> {
          this.state = res.estado
        })
        const { poseeEstablecimientos, ...formData } = this.trader_form.value;
        const comercianteData = {
          ...formData,
          estado: this.state
        };
        this.traders_service.edit_trader(comercianteData, this.trader_ID)
        .subscribe((res)=> {
          this.toast.success(`El usuario ${res.nombreRazonSocial} ha sido editado`);
          this.trader_form.reset();
        }, (err) => {
          this.toast.error('El usuario no se ha podido modificar, intentelo nuevamente');
        })
        


      } else {
        const { poseeEstablecimientos, ...formData } = this.trader_form.value;
        const comercianteData = {
          ...formData,
          estado: this.state
        };
    
        this.traders_service.save_trader(comercianteData).subscribe((res)=> {
          this.toast.success('El usuario se creo correctamente');
          this.trader_form.reset();
        }, (err) => {
          this.toast.error('El usuario no se ha podido crear');
        })
      }
    } else {
      this.show_errors();
    }
  }
  
  show_errors() {
    Object.keys(this.trader_form.controls).forEach(key => {
      const control = this.trader_form.get(key);
      if (control?.invalid) {
          this.toast.warning(`El campo "${key}" es inválido.`)

        if (control.errors?.['required']) {
          this.toast.warning(`El campo "${key}" es obligatorio.`)
        }
        if (control.errors?.['minlength']) {
          this.toast.warning(`El campo"${key}" debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`)
        }
        if (control.errors?.['pattern']) {
          this.toast.warning(`Ingrese un numero de telefono valido`)
        }
        if (control.errors?.['email']) {
          this.toast.warning(`El campo "${key}" debe ser un correo válido.`)
        }
      }
    });
  }
  
  
}
