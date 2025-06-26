import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notificacao {
  mensagem: string;
  rota?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificacoesSubject = new BehaviorSubject<Notificacao[]>([]);
  notificacoes$ = this.notificacoesSubject.asObservable();

  private notificacoes: Notificacao[] = [];

  adicionar(notificacao: Notificacao) {
    this.notificacoes.push(notificacao);
    this.notificacoesSubject.next(this.notificacoes);
  }

  limpar() {
    this.notificacoes = [];
    this.notificacoesSubject.next(this.notificacoes);
  }
}
