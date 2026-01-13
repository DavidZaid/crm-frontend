import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { RutaComponent } from './components/ruta/ruta.component';
import { VentaComponent } from './components/venta/venta.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TareasComponent } from './components/tareas/tareas.component'; // 👈 Import correcto

// ================================
//   RUTAS DEL SISTEMA COMPLETAS
// ================================
const routes: Routes = [

  // Ruta por defecto --> dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Autenticación
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Dashboard
  { path: 'dashboard', component: DashboardComponent },

  // Módulos del CRM
  { path: 'clientes', component: ClienteComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'rutas', component: RutaComponent },
  { path: 'ventas', component: VentaComponent },
  { path: 'tareas', component: TareasComponent },

  // Ruta comodín (siempre de última)
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
