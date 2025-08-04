import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../../api/chat.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScoreSaudeComponent } from './score-saude/score-saude.component';
import html2canvas from 'html2canvas';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-resumo',
  standalone: true,
  imports: [CommonModule, ScoreSaudeComponent],
  templateUrl: './resumo.component.html',
  styleUrls: ['./resumo.component.scss']
})
export class ResumoComponent implements OnInit {
  respostas: any;
  registros: any[] = [];

  @ViewChild('resumoContainer', { static: false }) resumoContainer!: ElementRef;

  constructor(private chatService: ChatService, private http: HttpClient) {}

  ngOnInit() {
    const salvas = localStorage.getItem('resumoRespostas');
    if (salvas) {
      this.respostas = JSON.parse(salvas);
    }

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
    if (imc < 18.5) {
      return '🌱 Abaixo do ideal.';
    }
    if (imc < 25) {
      return '🏆 Equilíbrio ideal!';
    }
    if (imc < 30) {
      return '🎯 Leve sobrepeso.';
    }
      return '🚀 Acima do ideal.';
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
    return this.http.get(`${environment.djangoApiUrl}/imc_base_dashboard/`, { headers });
  }

  async compartilharResumo() {
    const element = this.resumoContainer.nativeElement;

    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2
    });

    const imageWithLogo = await this.adicionarLogoAoCanvas(canvas);

    imageWithLogo.toBlob(async blob => {
      if (!blob) return;

      const file = new File([blob], 'resumo-imc.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'Meu resumo IMC',
            text: 'Veja meu resultado no app Saúde AI!',
            files: [file]
          });
        } catch (error) {
          console.error('Erro ao compartilhar:', error);
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resumo-imc.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  }

  async adicionarLogoAoCanvas(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const logo = new Image();
    logo.src = 'assets/logo.png';

    await new Promise<void>(resolve => {
      logo.onload = () => resolve();
    });

    const size = 80;
    ctx.drawImage(logo, canvas.width - size - 10, canvas.height - size - 10, size, size);

    return canvas;
  }
}