import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  clientes: any[] = [];
  
  // Se cambió el nombre de 'cliente' a 'nuevoCliente' para que el HTML lo reconozca
  nuevoCliente: any = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  };
  
  editando = false;
  clienteEditId: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    console.log('ClienteComponent iniciado');
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.apiService.get('clientes').subscribe({
      next: (data: any) => {
        console.log('Datos recibidos del backend:', data);
        this.clientes = data;
      },
      error: (error: any) => {
        console.error('Error cargando clientes:', error);
        this.clientes = [];
        alert('Error al cargar clientes. Verifica la conexión con el backend.');
      }
    });
  }

  guardarCliente(): void {
    if (this.editando) {
      this.apiService.put('clientes', this.clienteEditId, this.nuevoCliente).subscribe({
        next: (response: any) => {
          console.log('Cliente actualizado:', response);
          this.cargarClientes();
          alert('Cliente actualizado exitosamente');
          this.limpiarForm();
        },
        error: (error: any) => {
          console.error('Error actualizando:', error);
          alert('Error al actualizar cliente: ' + error.message);
        }
      });
    } else {
      this.apiService.post('clientes', this.nuevoCliente).subscribe({
        next: (response: any) => {
          console.log('Cliente creado:', response);
          this.cargarClientes();
          alert('Cliente creado exitosamente');
          this.limpiarForm();
        },
        error: (error: any) => {
          console.error('Error creando:', error);
          alert('Error al crear cliente: ' + error.message);
        }
      });
    }
  }

  editarCliente(clienteData: any): void {
    this.editando = true;
    this.clienteEditId = clienteData._id;
    // Copiamos los datos al objeto que usa el formulario (modal)
    this.nuevoCliente = { ...clienteData };
  }

  eliminarCliente(id: string): void {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.apiService.delete('clientes', id).subscribe({
        next: (response: any) => {
          console.log('Cliente eliminado:', response);
          this.cargarClientes();
          alert('Cliente eliminado exitosamente');
        },
        error: (error: any) => {
          console.error('Error eliminando:', error);
          alert('Error al eliminar cliente: ' + error.message);
        }
      });
    }
  }

  limpiarForm(): void {
    this.nuevoCliente = {
      nombre: '',
      email: '',
      telefono: '',
      direccion: ''
    };
    this.editando = false;
    this.clienteEditId = '';
  }
}