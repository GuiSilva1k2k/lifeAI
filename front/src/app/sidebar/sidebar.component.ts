import {
  Component,
  AfterViewInit,
  ElementRef,
  Renderer2,
  Signal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NotificacaoPanelComponent } from '../shared/notificacao-panel.component'; // ajuste o caminho se necessário

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    HttpClientModule,
    NotificacaoPanelComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements AfterViewInit {
  mostrarPainel = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private http: HttpClient,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    const links: NodeListOf<HTMLElement> =
      this.el.nativeElement.querySelectorAll('.sidebar a[routerLink]');
    links.forEach((link) => {
      this.renderer.listen(link, 'click', () => {
        links.forEach((l) => this.renderer.removeClass(l, 'active'));
        this.renderer.addClass(link, 'active');
      });
    });
  }

  togglePainel(): void {
    this.mostrarPainel = !this.mostrarPainel;
  }

  logout(): void {
    if (confirm('Você realmente deseja sair?')) {
      this.http.post('http://localhost:8000/logout/', {}).subscribe({
        next: () => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.clear();
          alert('Usuário deslogado com sucesso.');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Erro ao fazer logout:', err);
          alert('Erro ao sair. Tente novamente.');
        },
      });
    }
  }
}
