import { Component, OnInit } from '@angular/core';
import { TareaService } from '../../services/tarea.service';
import { ApiService } from '../../services/api.service';
import { finalize } from 'rxjs/operators';

// Declaración para Bootstrap (si cargas bootstrap.js globalmente)
declare var bootstrap: any;

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {

  tareas: any[] = [];
  pendientes: any[] = [];
  enProceso: any[] = [];
  completadas: any[] = [];

  clientes: any[] = [];

  tarea: any = {
    titulo: '',
    descripcion: '',
    cliente: '',
    fechaVencimiento: '',
    estado: 'pendiente'
  };

  editando = false;
  tareaDrag: any = null;
  private modalInstance: any = null;

  cargandoTareasFlag = false;
  mensajeInfo = '';

  constructor(
    private tareaService: TareaService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarTareas();
  }

  cargarClientes() {
    this.apiService.get('clientes').subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) this.clientes = data;
        else if (data && Array.isArray(data.clientes)) this.clientes = data.clientes;
      },
      error: (e) => {
        console.error('Error cargando clientes', e);
        this.clientes = [];
      }
    });
  }

  cargarTareas() {
    this.cargandoTareasFlag = true;
    this.mensajeInfo = 'Cargando tareas...';

    this.tareaService.getTareas()
      .pipe(finalize(() => this.cargandoTareasFlag = false))
      .subscribe({
        next: (data: any) => {
          let listaTareas: any[] = [];
          if (Array.isArray(data)) listaTareas = data;
          else if (data && Array.isArray(data.tareas)) listaTareas = data.tareas;
          else if (data && Array.isArray(data.data)) listaTareas = data.data;

          // fallback a caché si viene vacío
          this.tareas = listaTareas && listaTareas.length ? listaTareas : [];
          if (this.tareas.length === 0) {
            const cache = localStorage.getItem('tareas_cache');
            if (cache) {
              try {
                this.tareas = JSON.parse(cache);
                this.mensajeInfo = 'Mostrando caché local (API vacía).';
              } catch (e) {
                console.warn('Error parseando caché', e);
                this.mensajeInfo = 'No hay tareas disponibles.';
              }
            } else {
              this.mensajeInfo = 'No hay tareas disponibles.';
            }
          } else {
            localStorage.setItem('tareas_cache', JSON.stringify(this.tareas));
            this.mensajeInfo = '';
          }

          this.procesarEstados();
        },
        error: (err: any) => {
          console.error('Error API:', err);
          const cache = localStorage.getItem('tareas_cache');
          if (cache) {
            try {
              this.tareas = JSON.parse(cache);
              this.mensajeInfo = 'Modo Offline: Mostrando caché.';
              this.procesarEstados();
            } catch (e) {
              this.mensajeInfo = 'Error de conexión y sin caché.';
            }
          } else {
            this.mensajeInfo = 'Error de conexión y sin caché.';
          }
        }
      });
  }

  procesarEstados() {
    this.tareas = this.tareas.map(t => {
      if (!t) return null;
      if (!t.estado) t.estado = 'pendiente';
      t.estado = String(t.estado).trim().toLowerCase();

      if (['pendientes','todo','sin_iniciar'].includes(t.estado)) t.estado = 'pendiente';
      if (['proceso','procesando','doing','enproceso','en proceso'].includes(t.estado)) t.estado = 'en_proceso';
      if (['finalizada','finalizado','hecho','done','terminada'].includes(t.estado)) t.estado = 'completada';
      return t;
    }).filter(Boolean);

    this.pendientes = this.tareas.filter(t => t.estado === 'pendiente');
    this.enProceso = this.tareas.filter(t => t.estado === 'en_proceso');
    this.completadas = this.tareas.filter(t => t.estado === 'completada');
  }

  // DRAG & DROP (ahora con evento nativo)
  dragStart(event: DragEvent, t: any) {
    this.tareaDrag = t;
    try {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', t._id || JSON.stringify(t));
        // indicate copy/move
        event.dataTransfer.effectAllowed = 'move';
      }
    } catch (e) { /* no crítico */ }
  }

  dragEnd(_: DragEvent) {
    // limpiamos referencia
    this.tareaDrag = null;
  }

  allowDrop(event: DragEvent) {
    event.preventDefault(); // necesario para permitir el drop
  }

  // drop recibe el evento y el estado destino
  drop(event: DragEvent, newEstado: string) {
    event.preventDefault();
    if (!this.tareaDrag) {
      // intentar leer del dataTransfer si no tenemos referencia (fallback)
      try {
        const id = event.dataTransfer?.getData('text/plain');
        if (id) {
          const encontrada = this.tareas.find(x => x._id === id);
          if (encontrada) this.tareaDrag = encontrada;
        }
      } catch (e) { /* ignore */ }
    }
    if (!this.tareaDrag) return;

    const tareaCopia = { ...this.tareaDrag, estado: newEstado };

    // Optimistic UI: actualizar localmente primero
    this.tareas = this.tareas.map(t => t._id === tareaCopia._id ? tareaCopia : t);
    this.procesarEstados();

    // Llamada API para persistir cambio
    const tareaId = this.tareaDrag._id;
    this.tareaService.actualizarTarea(tareaId, { estado: newEstado }).subscribe({
      next: () => {
        // refrescar para asegurar consistencia
        this.cargarTareas();
      },
      error: (err) => {
        console.error('Error al mover tarea', err);
        alert('Error al mover la tarea. Revirtiendo cambio local.');
        // revertir: recargar desde API/caché
        this.cargarTareas();
      }
    });

    // limpiar referencia
    this.tareaDrag = null;
  }

  // Crear / Editar / Guardar / Eliminar
  nuevaTarea() {
    this.editando = false;
    this.tarea = {
      titulo: '',
      descripcion: '',
      cliente: '',
      fechaVencimiento: '',
      estado: 'pendiente'
    };
    this.openModal();
  }

  editarTarea(t: any) {
    this.editando = true;
    this.tarea = { ...t, cliente: t.cliente && t.cliente._id ? t.cliente._id : t.cliente };
    if (this.tarea.fechaVencimiento) {
      this.tarea.fechaVencimiento = new Date(this.tarea.fechaVencimiento).toISOString().split('T')[0];
    }
    this.openModal();
  }

  guardarTarea() {
    if (!this.tarea.titulo || this.tarea.titulo.trim() === '') {
      alert('El título es obligatorio');
      return;
    }

    // Preparar payload: si cliente es id y no objeto
    const payload = { ...this.tarea };
    if (this.tarea.cliente && typeof this.tarea.cliente === 'object') {
      payload.cliente = this.tarea.cliente._id || this.tarea.cliente;
    }

    if (this.editando && this.tarea._id) {
      this.tareaService.actualizarTarea(this.tarea._id, payload).subscribe({
        next: () => {
          this.cargarTareas();
          this.closeModal();
        },
        error: (e) => {
          console.error('Error guardando tarea', e);
          alert('Error al guardar la tarea.');
        }
      });
    } else {
      this.tareaService.crearTarea(payload).subscribe({
        next: () => {
          this.cargarTareas();
          this.closeModal();
        },
        error: (e) => {
          console.error('Error creando tarea', e);
          alert('Error al crear la tarea.');
        }
      });
    }
  }

  eliminarTarea(id: string) {
    if (!id) return;
    if (confirm('¿Seguro de eliminar esta tarea?')) {
      this.tareaService.eliminarTarea(id).subscribe({
        next: () => this.cargarTareas(),
        error: (e) => {
          console.error('Error eliminando tarea', e);
          alert('Error al eliminar.');
        }
      });
    }
  }

  marcarComoCompleta(t: any) {
    if (!t || !t._id) return;
    this.tareaService.completarTarea(t._id).subscribe({
      next: () => this.cargarTareas(),
      error: (e) => {
        console.error('Error completando tarea', e);
        alert('No se pudo marcar como completada.');
      }
    });
  }

  // Modal
  openModal() {
    const modalElement = document.getElementById('modalTareas');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement, { backdrop: 'static' });
      this.modalInstance.show();
    } else {
      console.warn('No se encontró #modalTareas en el DOM');
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    } else {
      const modalElement = document.getElementById('modalTareas');
      try {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
      } catch (e) { /* ignore */ }
    }
    // limpieza de backdrop y scroll
    document.querySelectorAll('.modal-backdrop').forEach(n => n.remove());
    document.body.classList.remove('modal-open');
  }
}
