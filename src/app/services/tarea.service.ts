import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  private apiUrl = 'https://crm-backend-jby7.onrender.com/api/tareas';

  constructor(private http: HttpClient) {}

  getTareas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  crearTarea(tarea: any): Observable<any> {
    return this.http.post(this.apiUrl, tarea);
  }

  actualizarTarea(id: string, tarea: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tarea);
  }

  completarTarea(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/completar/${id}`, {});
  }

  eliminarTarea(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
