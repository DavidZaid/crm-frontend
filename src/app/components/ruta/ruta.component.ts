import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.component.html',
  styleUrls: ['./ruta.component.css']
})
export class RutaComponent implements OnInit {
  rutas: any[] = [];
  ruta = {
    nombre: '',
    descripcion: '',
    cliente: '',
    fecha: '',
    estado: 'pendiente'
  };
  editando = false;
  rutaEditId: string = '';

  constructor(private apiService: ApiService) {
    console.log('✅ RutaComponent - Constructor ejecutado');
  }

  ngOnInit() {
    console.log('✅ RutaComponent - ngOnInit ejecutado');
    this.cargarRutas();
  }

  cargarRutas() {
    console.log('🔄 RutaComponent - cargarRutas ejecutado');
    
    this.apiService.get('rutas').subscribe({
      next: (data: any) => {
        console.log('✅ Rutas cargadas exitosamente:', data);
        this.rutas = data;
      },
      error: (error: any) => {
        console.error('❌ Error cargando rutas:', error);
        console.log('🔍 Error completo:', error);
        this.rutas = [];
        alert('Error al cargar rutas: ' + error.message);
      }
    });
  }

  getBadgeClass(estado: string): string {
    switch(estado) {
      case 'completada': return 'bg-success';
      case 'en-proceso': return 'bg-warning text-dark';
      case 'pendiente': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  guardarRuta() {
    if (this.editando) {
      this.apiService.put('rutas', this.rutaEditId, this.ruta).subscribe({
        next: (response: any) => {
          console.log('Ruta actualizada:', response);
          this.cargarRutas();
          alert('Ruta actualizada exitosamente');
          this.limpiarForm();
        },
        error: (error: any) => {
          console.error('Error actualizando:', error);
          alert('Error al actualizar ruta: ' + error.message);
        }
      });
    } else {
      this.apiService.post('rutas', this.ruta).subscribe({
        next: (response: any) => {
          console.log('Ruta creada:', response);
          this.cargarRutas();
          alert('Ruta creada exitosamente');
          this.limpiarForm();
        },
        error: (error: any) => {
          console.error('Error creando:', error);
          alert('Error al crear ruta: ' + error.message);
        }
      });
    }
  }

  editarRuta(ruta: any) {
    this.editando = true;
    this.rutaEditId = ruta._id;
    this.ruta = { ...ruta };
  }

  eliminarRuta(id: string) {
    if (confirm('¿Estás seguro de eliminar esta ruta?')) {
      this.apiService.delete('rutas', id).subscribe({
        next: (response: any) => {
          console.log('Ruta eliminada:', response);
          this.cargarRutas();
          alert('Ruta eliminada exitosamente');
        },
        error: (error: any) => {
          console.error('Error eliminando:', error);
          alert('Error al eliminar ruta: ' + error.message);
        }
      });
    }
  }

  limpiarForm() {
    this.ruta = {
      nombre: '',
      descripcion: '',
      cliente: '',
      fecha: '',
      estado: 'pendiente'
    };
    this.editando = false;
    this.rutaEditId = '';
  }
}