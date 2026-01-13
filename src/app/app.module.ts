import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Importar componentes
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { RutaComponent } from './components/ruta/ruta.component';
import { VentaComponent } from './components/venta/venta.component';
import { TareasComponent } from './components/tareas/tareas.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

/* === Importación agregada para ng2-charts === */
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ClienteComponent,
    InventarioComponent,
    RutaComponent,
    VentaComponent,
    TareasComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    /* === Módulo requerido para las gráficas === */
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
