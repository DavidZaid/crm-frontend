import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userData = {
    nombre: '',
    email: '',
    password: '',
    telefono: ''
  };

  constructor(private api: ApiService, private router: Router) { }

  register() {
    // Código real con API - CORREGIDO
    this.api.post('usuarios/registro', this.userData).subscribe({
      next: (response: any) => {
        alert('Usuario registrado exitosamente');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        alert('Error: ' + (error.error.message || 'Error al registrar'));
      }
    });
  }
}