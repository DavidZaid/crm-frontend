import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private api: ApiService, private router: Router) { }

  login() {
    // Código real con API - CORREGIDO
    this.api.post('usuarios/login', this.credentials).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/clientes']);
      },
      error: (error) => {
        alert('Error: ' + (error.error.message || 'Credenciales incorrectas'));
      }
    });
  }
}