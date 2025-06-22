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

  username = '';
  email = '';
  password = '';

  errorMsg = '';
  successMsg = '';

  currentYear: number = new Date().getFullYear(); // Para o rodapé dinâmico

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.showForm('register');
  }

  showForm(type: 'login' | 'register'): void {
    this.formType = type;
    this.errorMsg = '';
    this.successMsg = '';
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  onRegister(): void {
    if (!this.username.trim()) {
      this.errorMsg = 'Nome de usuário é obrigatório.';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMsg = 'E-mail inválido.';
      return;
    }

    if (!this.isValidPassword(this.password)) {
      this.errorMsg = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }

    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.authService.registerUser(userData).subscribe({
      next: (response) => {
        this.successMsg = response?.message || 'Registrado com sucesso!';
        this.errorMsg = '';
        this.authService.saveToken(response.access);
        localStorage.setItem('refresh_token', response.refresh);
        this.authService.setLoggedIn(true);
        this.router.navigate(['chatbot']);
      },
      error: (err) => {
        this.errorMsg = err.error.message || 'Erro ao registrar.';
        this.successMsg = '';
      },
    });
  }

  onLogin(): void {
    if (!this.isValidEmail(this.email)) {
      this.errorMsg = 'E-mail inválido.';
      return;
    }

    if (!this.isValidPassword(this.password)) {
      this.errorMsg = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }

    const data = { email: this.email, password: this.password };

    this.authService.loginUser(data).subscribe({
      next: (res) => {
        this.authService.saveToken(res.access);
        localStorage.setItem('refresh_token', res.refresh);
        this.authService.setLoggedIn(true);
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

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
