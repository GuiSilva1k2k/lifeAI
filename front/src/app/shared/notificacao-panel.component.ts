import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';     // ✅ necessário para matBadge
import { MatButtonModule } from '@angular/material/button';   // ✅ necessário para mat-icon-button
import { Router } from '@angular/router';
import { NotificationService, Notificacao } from '../api/notification.service';

@Component({
  selector: 'app-notificacao-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,     // ✅ adicionado
    MatButtonModule     // ✅ adicionado
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
    });
  }

  irPara(notificacao: Notificacao) {
    if (notificacao.rota) {
      this.router.navigate([notificacao.rota]);
    }
  }
}
