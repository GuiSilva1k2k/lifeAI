import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { ImcBaseService } from '../../../../api/imc_perfil_base.service';
import { IaService } from '../../../../api/ia.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-dicas',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './dicas.component.html',
  styleUrls: ['./dicas.component.scss'],
})
export class DicasComponent implements OnInit {
  recomendacoesMarkdown: string = '';
  sessaoId: string = '';

  constructor(
    private imcBaseService: ImcBaseService,
    private iaService: IaService
  ) {}

  ngOnInit(): void {
    const salvas = localStorage.getItem('recomendacoesMarkdown');
    if (salvas) {
      this.recomendacoesMarkdown = salvas;
      return;
    }

    this.sessaoId = uuidv4();

    this.imcBaseService.getImcBase().subscribe({
      next: data => {
        if (data.length > 0 && data[0].imc_res && data[0].objetivo) {
          this.gerarRecomendacoes(data[0]);
        } else {
          console.warn('Dados incompletos para gerar recomendações.');
        }
      },
      error: err => console.error('Erro ao buscar IMC:', err),
    });
  }

  gerarRecomendacoes(pessoa: any): void {
    const prompt = `
Você é um especialista em saúde e bem-estar.

Com base nos seguintes dados:
IMC: ${pessoa.imc_res}
Objetivo: ${pessoa.objetivo}

Gere recomendações personalizadas para auxiliar essa pessoa a atingir seus objetivos de forma saudável e eficaz. 
As recomendações devem ser diretas, com tom motivador, e adaptadas ao perfil da pessoa. Não use listas numeradas, nem seções. Escreva um único bloco de texto contínuo com no máximo 200 palavras.
`.trim();

    this.iaService.enviarPergunta(prompt, this.sessaoId).subscribe({
      next: res => {
        this.recomendacoesMarkdown = res.resposta;
        localStorage.setItem('recomendacoesMarkdown', this.recomendacoesMarkdown);
      },
      error: err => console.error('Erro ao gerar recomendações da IA:', err),
    });
  }
}
