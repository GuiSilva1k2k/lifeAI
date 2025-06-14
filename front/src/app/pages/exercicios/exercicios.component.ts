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
    RouterModule,
    SidebarComponent,
    ExemplosExercicioComponent,
    MarkdownModule,
  ],
  templateUrl: './exercicios.component.html',
  styleUrls: ['./exercicios.component.scss'],
})
export class ExerciciosComponent implements OnInit {
  imcBase: any[] = [];
  respostaIA: string = '';
  sessaoId: string = '';
  instrucoesMarkdown: string = '';
  dadosMarkdown: string = '';
  nomeExercicio: string = 'Nome do Exercício';
  estaExecutando: boolean = false;
  tempoInicio: Date | null = null;
  tempoFim: Date | null = null;
  esperandoResposta: boolean = false;

  constructor(
    private imcBaseService: ImcBaseService,
    private iaService: IaService
  ) {}

  ngOnInit(): void {
    this.imcBaseService.getImcBase().subscribe({
      next: data => {
        this.imcBase = data;
      },
      error: err => console.error('Erro ao buscar IMC:', err),
    });
  }

  iniciarExercicio(): void {
    if (this.esperandoResposta) return;

    const confirmacao = this.respostaIA
      ? confirm('Tem certeza que deseja gerar um novo exercício? Isso substituirá o anterior.')
      : true;

    if (!confirmacao) return;

    if (this.imcBase.length === 0) {
      console.warn('Nenhum dado de pessoa encontrado.');
      return;
    }

    const pessoa = this.imcBase[0];

    if (!pessoa.imc_res || !pessoa.objetivo) {
      console.warn('Dados incompletos para gerar plano.');
      return;
    }

    this.respostaIA = '';
    this.instrucoesMarkdown = '';
    this.dadosMarkdown = '';
    this.nomeExercicio = 'Nome do Exercício';
    this.sessaoId = uuidv4();
    this.esperandoResposta = true;

    this.gerarPlanoComIA(pessoa);
  }

  gerarPlanoComIA(pessoa: any): void {
    const prompt = `
Você é um treinador físico especializado.

Com base nos dados fornecidos, gere um plano de exercício para a pessoa, considerando o IMC e o objetivo individual.

⚠️ Siga RIGOROSAMENTE o formato abaixo. NÃO modifique, não adicione outras seções e NÃO repita rótulos como "Descrição", "Info", "Exemplo de rotina", "Recomendações" ou qualquer outro título.

⚠️ SUA RESPOSTA DEVE CONTER EXATAMENTE AS SEGUINTES DUAS SEÇÕES:
1. **Instruções:**
2. **Dados exercício:**

❌ NÃO remova ou renomeie essas seções.
❌ NÃO adicione outras seções além dessas.

Formato obrigatório:

**Instruções:**
* Instruções gerais aplicáveis ao treino.
* Instruções específicas baseadas no exercício recomendado (ex: frequência, cuidados, dicas).

**Dados exercício:**
* Descrição: (explique a relação entre o IMC da pessoa, o objetivo e o exercício sugerido — essa linha deve aparecer apenas uma vez)
* Nome: (nome do exercício mais adequado)
* Intensidade: (leve, moderada ou alta)
* Tempo: (tempo recomendado — ex: 30 minutos, 3 vezes por semana)
+ (benefício principal do exercício — apenas uma linha iniciando com "+")

❗ REGRAS OBRIGATÓRIAS:
- NÃO adicione outras seções como "Exemplo de rotina", "Recomendações", "Observações", etc.
- NÃO repita nenhuma etiqueta ou campo como "Descrição", "Info" ou "Benefício".
- NÃO adicione listas de exercícios ou rotinas com números, traços ou colunas (ex: "- 1.", "2.", etc.).
- NÃO inclua múltiplos parágrafos por campo.
- Use exatamente um item por linha com os marcadores corretos (* ou +).
- Mantenha o conteúdo conciso, direto e fiel ao formato.

Agora, gere os dados com base nestas informações:

Pessoa - IMC: ${pessoa.imc_res}, Objetivo: ${pessoa.objetivo}

Código de sessão: ${this.sessaoId}
`.trim();

    this.iaService.enviarPergunta(prompt, this.sessaoId).subscribe({
      next: res => {
        this.respostaIA = res.resposta;
        this.gerarInstrucoesEDados();
        this.esperandoResposta = false;
      },
      error: err => {
        console.error('Erro ao enviar pergunta para IA:', err);
        this.esperandoResposta = false;
      },
    });
  }

  gerarInstrucoesEDados(): void {
    this.instrucoesMarkdown = '';
    this.dadosMarkdown = '';
    this.nomeExercicio = 'Nome do Exercício';

    if (!this.respostaIA) return;

    const linhas = this.respostaIA
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

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
      if (linha.startsWith('*')) {
        const conteudo = linha.replace(/^\*\s*/, '');
        const partes = conteudo.split(':');
        if (capturandoInstrucoes) {
          instrucoesTemp.push(conteudo);
        } else if (capturandoDados) {
          if (partes.length >= 2) {
            dadosTemp.push({ label: partes[0].trim(), valor: partes.slice(1).join(':').trim() });
          } else {
            dadosTemp.push({ label: 'Info', valor: conteudo.replace(/\*\*/g, '').trim() });
          }
        }
        continue;
      }
      if (linha.startsWith('+') && capturandoDados) {
        dadosTemp.push({ label: 'Benefício', valor: linha.replace(/^\+\s*/, '') });
        continue;
      }
    }

    const nomeIndex = dadosTemp.findIndex(d => d.label.toLowerCase() === 'nome');
    if (nomeIndex >= 0) {
      this.nomeExercicio = dadosTemp[nomeIndex].valor;
      dadosTemp.splice(nomeIndex, 1);
    }

    this.instrucoesMarkdown = instrucoesTemp.map(i => `* ${i}`).join('\n');
    this.dadosMarkdown = dadosTemp
      .map(d => `* **${d.label}**: ${d.valor}`)
      .join('\n');
  }

  alternarStatusExercicio(): void {
    this.estaExecutando = !this.estaExecutando;

    if (this.estaExecutando) {
      this.tempoInicio = new Date();
      this.tempoFim = null;
      console.log('Início do exercício:', this.tempoInicio.toLocaleTimeString());
    } else {
      this.tempoFim = new Date();
      const duracao = this.calcularDuracao();
      console.log('Fim do exercício:', this.tempoFim.toLocaleTimeString());
      console.log(`Duração total: ${duracao} segundos`);
    }
  }

  calcularDuracao(): number {
    if (this.tempoInicio && this.tempoFim) {
      return Math.floor((this.tempoFim.getTime() - this.tempoInicio.getTime()) / 1000);
    }
    return 0;
  }

  get instrucoesTexto(): string {
    return this.instrucoesMarkdown;
  }

  get dadosExercicioValor(): string {
    return this.dadosMarkdown;
  }
}
