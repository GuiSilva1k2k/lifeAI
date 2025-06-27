import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notificacao {
  mensagem: string;
  rota?: string;
  lida?: boolean; // ✅ necessário para controle de leitura
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificacoes: Notificacao[] = [];

  private notificacoesSubject = new BehaviorSubject<Notificacao[]>([]);
  notificacoes$ = this.notificacoesSubject.asObservable();

  constructor() {}

  adicionar(notificacao: Notificacao) {
    // Adiciona notificação já marcada como não lida
    this.notificacoes.unshift({ ...notificacao, lida: false });
    this.notificacoesSubject.next(this.notificacoes);
  }

  marcarTodasComoLidas() {
    this.notificacoes = this.notificacoes.map(n => ({ ...n, lida: true }));
    this.notificacoesSubject.next(this.notificacoes);
  }

  limpar() {
    this.notificacoes = [];
    this.notificacoesSubject.next(this.notificacoes);
  }
}
