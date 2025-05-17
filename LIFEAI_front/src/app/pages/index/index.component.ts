import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../api/autenticacaoUser.service';
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

  constructor(private authService: AuthService, private router: Router) {}

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
        this.router.navigate(['/']);
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
        console.log('Login bem-sucedido!', res);
        this.router.navigate(['chatbot/']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
      }
    });
  }
  
}