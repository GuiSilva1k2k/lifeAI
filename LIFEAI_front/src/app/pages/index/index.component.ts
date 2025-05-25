import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../api/autenticacaoUser.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  formType: 'login' | 'register' = 'login';

  // Registro/Login
  username = '';
  email = '';
  password = '';

  errorMsg = '';
  successMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Exibe por padrão o formulário de registro
    this.showForm('register');
  }

  showForm(type: 'login' | 'register'): void {
    this.formType = type;
    this.errorMsg = '';
    this.successMsg = '';
  }

  onRegister(): void {
  const userData = {
    username: this.username,
    email: this.email,
    password: this.password,
  };

  this.authService.registerUser(userData).subscribe({
    next: (response) => {
      this.successMsg = response?.message || 'Registrado com sucesso!';
      this.errorMsg = '';

      // Salva os tokens no localStorage
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);

      // Redireciona para a home ou dashboard
      this.router.navigate(['home']);
    },
    error: (err) => {
      this.errorMsg = err.error.message || 'Erro ao registrar.';
      this.successMsg = '';
    },
  });
}

  onLogin(): void {
    const data = { email: this.email, password: this.password };

    this.authService.loginUser(data).subscribe({
      next: (res) => {
        console.log('Login bem-sucedido!', res.access);
        this.router.navigate(['home']);
      },
      error: (err) => {
        this.errorMsg = err.error.message || 'Erro no login.';
        this.successMsg = '';
      }
    });
  }

  isActive(button: 'login' | 'register'): boolean {
    return this.formType === button;
  }
}
