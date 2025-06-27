import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SettingsService } from './settings.service';

export interface Notificacao {
  mensagem: string;
  rota?: string;
  lida?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificacoesSubject = new BehaviorSubject<Notificacao[]>([]);
  notificacoes$ = this.notificacoesSubject.asObservable();

  private notificacoes: Notificacao[] = [];
  private settingsSubscription: Subscription;

  constructor(private settingsService: SettingsService) {
    // Escuta mudanças no estado das notificações para limpar quando desligar
    this.settingsSubscription = this.settingsService.notificationsEnabled$.subscribe(enabled => {
      if (!enabled) {
        this.limpar();
      }
    });
  }

  adicionar(notificacao: Notificacao) {
    if (!this.settingsService.notificationsEnabled) {
      // Ignora se notificações estiverem desativadas
      return;
    }
    this.notificacoes.push(notificacao);
    this.notificacoesSubject.next(this.notificacoes);
  }

  limpar() {
    this.notificacoes = [];
    this.notificacoesSubject.next(this.notificacoes);
  }

  marcarTodasComoLidas() {
    this.notificacoes.forEach(n => (n.lida = true));
    this.notificacoesSubject.next(this.notificacoes);
  }

  // Para evitar leaks, chame quando destruir o serviço/componente se necessário
  unsubscribe() {
    this.settingsSubscription.unsubscribe();
  }
}
