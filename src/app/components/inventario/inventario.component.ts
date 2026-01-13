import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  productos: any[] = [];
  producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: ''
  };
  editando = false;
  productoEditId: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.apiService.get('inventario').subscribe({
      next: (data: any) => {
        console.log('Productos cargados:', data);
        this.productos = data;
      },
      error: (error: any) => {
        console.error('Error cargando productos:', error);
        this.productos = [];
      }
    });
  }

  guardarProducto() {
    if (this.editando) {
      this.apiService.put('inventario', this.productoEditId, this.producto).subscribe({
        next: (response: any) => {
          console.log('Producto actualizado:', response);
          this.cargarProductos();
          alert('Producto actualizado exitosamente');
          this.limpiarForm();
        },
        error: (error: any) => {
          console.error('Error actualizando:', error);
          alert('Error al actualizar producto: ' + error.message);
        }
      });
    } else {
      this.apiService.post('inventario', this.producto).subscribe({
        next: (response: any) => {
          console.log('Producto creado:', response);
          this.cargarProductos();
          alert('Producto creado exitosamente');
          this.limpiarForm();
        },
        error: (error: any) => {
          console.error('Error creando:', error);
          alert('Error al crear producto: ' + error.message);
        }
      });
    }
  }

  editarProducto(producto: any) {
    this.editando = true;
    this.productoEditId = producto._id;
    this.producto = { ...producto };
  }

  eliminarProducto(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.apiService.delete('inventario', id).subscribe({
        next: (response: any) => {
          console.log('Producto eliminado:', response);
          this.cargarProductos();
          alert('Producto eliminado exitosamente');
        },
        error: (error: any) => {
          console.error('Error eliminando:', error);
          alert('Error al eliminar producto: ' + error.message);
        }
      });
    }
  }

  limpiarForm() {
    this.producto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoria: ''
    };
    this.editando = false;
    this.productoEditId = '';
  }
}