import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;   // <--- ESTE ES EL FIX

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`, this.getHeaders());
  }

  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data, this.getHeaders());
  }

  put(endpoint: string, id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${endpoint}/${id}`, data, this.getHeaders());
  }

  delete(endpoint: string, id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}/${id}`, this.getHeaders());
  }
}
