import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../api/registro.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  formType: 'login' | 'register' = 'login';

  showForm(type: 'login' | 'register') {
    this.formType = type;
  }

  // Registro
  username = '';
  email = '';
  password = '';
  errorMsg = '';
  successMsg = '';

  // Login
  loginEmail = '';
  loginPassword = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegisterSubmit(): void {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.authService.registerUser(userData).subscribe({
      next: (response) => {
        this.successMsg = response?.message || 'Registrado com sucesso!';
        this.errorMsg = '';
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMsg = err.error.message || 'Erro ao registrar.';
        this.successMsg = '';
      },
    });
  }

  onLoginSubmit(): void {
    const loginData = {
      email: this.loginEmail,
      password: this.loginPassword,
    };
  }

    // Aqui você deve chamar o service que faz login (não implementado no exemplo)
    // Exemplo:
    // this.authService.loginUser(loginData).subscribe( ... )
  
}