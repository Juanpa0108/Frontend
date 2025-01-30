import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { FormularioComercianteComponent } from './pages/formulario-comerciante/formulario-comerciante.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'nuevo-comerciante', component: FormularioComercianteComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
