import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExemplosExercicioComponent } from './exemplos-exercicio/exemplos-exercicio.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ImcBaseService } from '../../api/imc_perfil_base.service';
import { IaService } from '../../api/ia.service';
import { v4 as uuidv4 } from 'uuid';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-exercicios',
  standalone: true,
  imports: [
    CommonModule,
    ExemplosExercicioComponent,
    RouterModule,
    SidebarComponent,
    MarkdownModule],
  templateUrl: './exercicios.component.html',
  styleUrls: ['./exercicios.component.scss'],
})
export class ExerciciosComponent implements OnInit {

  constructor(
    private ImcBaseService: ImcBaseService,
    private IaService: IaService
  ) {}

  imc_base: any[] = [];

  respostaIA: string = '';
  sessaoId: string = uuidv4();

  instrucoes: string[] = [];
  dadosExercicio: { label: string; valor: string }[] = [];

  ngOnInit(): void {
    this.ImcBaseService.getImcBase().subscribe({
      next: (data) => {
        this.imc_base = data;
      },
      error: (err) => console.error('Erro ao buscar IMC:', err)
    });
  }

  iniciarExercicio(): void {
    this.gerarPlanoComIA();
  }

  gerarPlanoComIA(): void {
    if (this.imc_base.length === 0) {
      return;
    }

    const promptPorPessoa = this.imc_base.map((pessoa) => {
      return `IMC: ${pessoa.imc_res}, Objetivo: ${pessoa.objetivo}`;
    }).join('\n');

    const prompt = `
    Recomendo um exercício físico.
    Responda APENAS usando o seguinte formato:

    **Instruções:**
    * ...

    **Dados exercício:**
    * ...
    + ...

    Dados:
    ${promptPorPessoa}`;

        this.IaService.enviarPergunta(prompt, this.sessaoId).subscribe({
          next: (res) => {
            this.respostaIA = res.resposta;
            this.gerarInstrucoesEDados();
          },
          error: (err) => console.error('Erro ao enviar pergunta para IA:', err)
        });
      }

  gerarInstrucoesEDados(): void {
    this.instrucoes = [];
    this.dadosExercicio = [];

    if (!this.respostaIA) return;

    const linhas = this.respostaIA.split('\n').map(l => l.trim()).filter(Boolean);

    const dadosTemp: { label: string; valor: string }[] = [];
    const instrucoesTemp: string[] = [];

    let capturandoInstrucoes = false;
    let capturandoDados = false;

    for (const linha of linhas) {

      if (/^\*\*\s*Instruções\s*[:：]?\s*\*\*/i.test(linha)) {
        capturandoInstrucoes = true;
        capturandoDados = false;
        continue;
      }

      if (/^\*\*\s*Dados.*exerc[ií]cio[s]?\s*[:：]?\s*\*\*/i.test(linha)) {
        capturandoInstrucoes = false;
        capturandoDados = true;
        continue;
      }

      // Se linha começa com *, trata como item
      if (linha.startsWith('*')) {
        const conteudo = linha.replace(/^\*\s*/, '');

        if (capturandoInstrucoes) {
          instrucoesTemp.push(conteudo);
        } else if (capturandoDados) {
          const partes = conteudo.split(':');
          if (partes.length >= 2) {
            const label = partes[0].trim();
            const valor = partes.slice(1).join(':').trim();
            dadosTemp.push({ label, valor });
          } else {
            // Sem dois pontos, usar como label genérico
            dadosTemp.push({ label: 'Info', valor: conteudo });
          }
        }

        continue;
      }

      // Se linha começa com + e estamos nos dados, adicionar como extra
      if (linha.startsWith('+') && capturandoDados) {
        const valor = linha.replace(/^\+\s*/, '');
        dadosTemp.push({ label: 'Benefício', valor });
        continue;
      }

      // Texto explicativo final também pode ser útil nos dados
      if (capturandoDados) {
        dadosTemp.push({ label: 'Descrição', valor: linha });
      }
    }

    this.dadosExercicio = dadosTemp;
    this.instrucoes = instrucoesTemp;
    
  }

}
