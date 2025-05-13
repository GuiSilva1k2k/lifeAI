import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const links: NodeListOf<HTMLElement> = this.el.nativeElement.querySelectorAll('.sidebar a[routerLink]');
    links.forEach(link => {
      this.renderer.listen(link, 'click', () => {
        links.forEach(l => this.renderer.removeClass(l, 'active'));
        this.renderer.addClass(link, 'active');
      });
    });
  }

  logout(): void {
    if (confirm('Você realmente deseja sair?')) {
      console.log('Logout confirmado — a lógica real será feita no backend');
    }
  }
}
