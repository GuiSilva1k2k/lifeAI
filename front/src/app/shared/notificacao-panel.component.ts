import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { NotificationService, Notificacao } from '../api/notification.service';

@Component({
  selector: 'app-notificacao-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule
  ],
  templateUrl: './notificacao-panel.component.html',
  styleUrls: ['./notificacao-panel.component.scss']
})
export class NotificacaoPanelComponent implements OnInit {
  @Input() aberto = false;
  notificacoes: Notificacao[] = [];

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notificationService.notificacoes$.subscribe(n => {
      this.notificacoes = n;
      this.atualizarTitulo();
    });
  }

  togglePainel() {
    this.aberto = !this.aberto;

    if (this.aberto) {
      this.notificationService.marcarTodasComoLidas();
    }
  }

  atualizarTitulo() {
    const naoLidas = this.notificacoes.filter(n => !n.lida).length;
    document.title = naoLidas > 0 ? `(${naoLidas}) LifeAI` : 'LifeAI';
  }

  get notificacoesNaoLidas(): number {
    return this.notificacoes.filter(n => !n.lida).length;
  }

  irPara(notificacao: Notificacao) {
    if (notificacao.rota) {
      this.router.navigate([notificacao.rota]);
    }
  }
}
