import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  ventas: any[] = [];
  prospectos: any[] = [];
  negociaciones: any[] = [];
  cierres: any[] = [];

  productosInventario: any[] = [];

  nuevoItem = {
    productoId: '',
    nombre: '',
    cantidad: 1,
    precio: 0,
    subtotal: 0
  };

  venta = {
    cliente: '',
    items: [] as any[],
    total: 0,
    estado: 'prospecto'
  };

  draggedVenta: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarVentas();
    this.cargarInventario();
  }

  cargarInventario() {
    this.apiService.get('inventario').subscribe({
      next: (data) => this.productosInventario = data,
      error: (e) => console.error(e)
    });
  }

  cargarVentas() {
    this.apiService.get('ventas').subscribe({
      next: (data) => {
        this.ventas = data;
        this.actualizarListasYResumen();
      },
      error: (e) => console.error(e)
    });
  }

  actualizarListasYResumen() {
    this.prospectos = this.ventas.filter(v => v.estado === 'prospecto');
    this.negociaciones = this.ventas.filter(v => v.estado === 'negociacion');
    this.cierres = this.ventas.filter(v => v.estado === 'cierre');
  }

  agregarItem() {
    const p = this.productosInventario.find(x => x._id === this.nuevoItem.productoId);
    if (!p) return alert("Seleccione un producto");

    this.nuevoItem.nombre = p.nombre;
    this.nuevoItem.precio = p.precio;
    this.nuevoItem.subtotal = p.precio * this.nuevoItem.cantidad;

    this.venta.items.push({ ...this.nuevoItem });
    this.calcularTotal();

    this.nuevoItem = {
      productoId: '',
      nombre: '',
      cantidad: 1,
      precio: 0,
      subtotal: 0
    };
  }

  eliminarItem(i: number) {
    this.venta.items.splice(i, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.venta.total = this.venta.items.reduce((s, i) => s + i.subtotal, 0);
  }

  guardarVenta() {
    if (this.venta.items.length === 0) {
      return alert("Debe agregar productos.");
    }

    this.apiService.post('ventas', this.venta).subscribe({
      next: () => {
        alert("Venta registrada correctamente.");
        this.limpiarForm();
        this.cargarVentas();
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }

  limpiarForm() {
    this.venta = {
      cliente: '',
      items: [],
      total: 0,
      estado: 'prospecto'
    };
  }

  cambiarEstado(venta: any, estado: string) {
    this.apiService.put('ventas/estado', venta._id, { estado }).subscribe(() => {
      this.cargarVentas();
    });
  }

  eliminarVenta(id: string) {
    if (!confirm("¿Eliminar venta?")) return;
    this.apiService.delete('ventas', id).subscribe(() => this.cargarVentas());
  }

  dragStart(v: any) { this.draggedVenta = v; }
  dragEnd() { this.draggedVenta = null; }
  allowDrop(ev: DragEvent) { ev.preventDefault(); }
  drop(estado: string) {
    if (!this.draggedVenta) return;
    this.cambiarEstado(this.draggedVenta, estado);
    this.draggedVenta = null;
  }
}
