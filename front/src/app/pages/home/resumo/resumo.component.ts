import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../api/chat.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-resumo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumo.component.html',
  styleUrl: './resumo.component.scss'
})
export class ResumoComponent implements OnInit {
  respostas: any;
  registros: any[] = [];

  constructor(private chatService: ChatService, private http: HttpClient) {}

  ngOnInit() {
    // Carrega do localStorage, se houver
    const salvas = localStorage.getItem('resumoRespostas');
    if (salvas) {
      this.respostas = JSON.parse(salvas);
    }

    // Escuta atualizações do ChatService e salva sempre que mudar
    this.chatService.respostas$.subscribe(res => {
      if (res) {
        this.respostas = res;
        localStorage.setItem('resumoRespostas', JSON.stringify(res));
      }
    });

    this.consultaImcBase().subscribe({
      next: dados => (this.registros = dados),
      error: err => console.error('Erro ao consultar IMC base:', err)
    });
  }

  obterMensagemIMC(imc: number): string {
    if (imc < 18.5) return '🧊 Você está abaixo do peso';
    if (imc < 25) return '🥦 Você está saudável!';
    if (imc < 30) return '⚠️ Você está com sobrepeso';
    return '🔥 Você está com obesidade';
  }

  calcularPosicao(imc: number): number {
    const min = 15;
    const max = 40;
    const clamped = Math.max(min, Math.min(imc, max));
    return ((clamped - min) / (max - min)) * 100;
  }

  temRespostas(): boolean {
    return this.respostas && Object.keys(this.respostas).length > 0;
  }

  consultaImcBase(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:8000/imc_base_dashboard/', { headers });
  }
}
