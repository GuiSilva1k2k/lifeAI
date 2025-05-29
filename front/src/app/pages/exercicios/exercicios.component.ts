import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ImcBaseService } from '../../api/imc_perfil_base.service';
import { IaService } from '../../api/ia.service';
import { v4 as uuidv4 } from 'uuid';
import { MarkdownModule } from 'ngx-markdown';

interface Exercicio {
  nome: string;
  gif: string;
}

@Component({
  selector: 'app-exercicios',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, MarkdownModule],
  templateUrl: './exercicios.component.html',
  styleUrls: ['./exercicios.component.scss']
})
export class ExerciciosComponent implements OnInit {

  constructor(
    private ImcBaseService: ImcBaseService,
    private IaService: IaService
  ) {}

  imc_base: any[] = [];
  exercicios: Exercicio[] = [];
  currentIndex: number = 0;

  respostaIA: string = '';
  sessaoId: string = uuidv4();

  instrucoes: string[] = [];
  dadosExercicio: { label: string; valor: string }[] = [];

  exercicioRecomendado: string = '';

  ngOnInit(): void {
    this.exercicios = [
      { nome: 'Agachamento com barra', gif: 'https://media1.tenor.com/m/pdMmsiutWkcAAAAC/gym.gif' },
      { nome: 'Supino reto', gif: 'https://www.mundoboaforma.com.br/wp-content/uploads/2020/12/supino-reto.gif' },
      { nome: 'Levantamento terra', gif: 'https://www.hipertrofia.org/blog/wp-content/uploads/2023/03/barbell-sumo-deadlift.gif' },
      { nome: 'Remada curvada', gif: 'https://www.hipertrofia.org/blog/wp-content/uploads/2023/11/dumbbell-bent-over-row.gif' },
      { nome: 'Flexão de braço', gif: 'https://www.mundoboaforma.com.br/wp-content/uploads/2021/04/flexao-de-bracos.gif' }
    ];

    this.ImcBaseService.getImcBase().subscribe({
      next: (data) => {
        this.imc_base = data;
        this.gerarPlanoComIA();
      },
      error: (err) => console.error('Erro ao buscar IMC:', err)
    });
  }

  get currentGif(): string {
    return this.exercicios[this.currentIndex]?.gif ?? '';
  }

  get currentNome(): string {
    return this.exercicios[this.currentIndex]?.nome ?? '';
  }

  get botaoDesabilitado(): boolean {
    return this.currentNome === this.exercicioRecomendado;
  }

  previousGif(): void {
    if (this.currentIndex > 0 && !this.botaoDesabilitado) {
      this.currentIndex--;
      this.gerarInstrucoesEDados();
    }
  }

  nextGif(): void {
    if (this.currentIndex < this.exercicios.length - 1 && !this.botaoDesabilitado) {
      this.currentIndex++;
      this.gerarInstrucoesEDados();
    }
  }

  iniciarExercicio(): void {
    console.log(`Iniciando: ${this.currentNome}`);
  }

  finalizarExercicio(): void {
    console.log(`Finalizado: ${this.currentNome}`);
  }

  abrirTutorial(): void {
    console.log(`Abrindo tutorial para: ${this.currentNome}`);
  }

  gerarPlanoComIA(): void {
    if (this.imc_base.length === 0 || this.exercicios.length === 0) {
      return;
    }

    const nomesExercicios = this.exercicios.map(e => `"${e.nome}"`).join(', ');

    const promptPorPessoa = this.imc_base.map((pessoa, index) => {
      const exercicio = this.exercicios[index % this.exercicios.length];
      return `IMC: ${pessoa.imc_res}, Objetivo: ${pessoa.objetivo}, Ex: ${exercicio.nome}`;
    }).join('\n');

    const prompt = `Você deve recomendar exercícios APENAS da seguinte lista: ${nomesExercicios}.

Para cada pessoa listada abaixo, indique um exercício apropriado com base no IMC e objetivo, selecionando apenas um da lista. Resuma cada sugestão com:

- Objetivo
- Exercício recomendado (exatamente como na lista)
- Frequência semanal
- Duração (tempo ou repetições)
- Calorias estimadas (por sessão, ex: 250 kcal)
- Instruções simples

Dados:
${promptPorPessoa}`;

    this.IaService.enviarPergunta(prompt, this.sessaoId).subscribe({
      next: (res) => {
        this.respostaIA = res.resposta;
        this.identificarExercicioRecomendado();
        this.gerarInstrucoesEDados();
      },
      error: (err) => console.error('Erro ao enviar pergunta para IA:', err)
    });
  }

  identificarExercicioRecomendado(): void {
    this.exercicioRecomendado = '';
    for (let ex of this.exercicios) {
      if (this.respostaIA.toLowerCase().includes(ex.nome.toLowerCase())) {
        this.exercicioRecomendado = ex.nome;
        break;
      }
    }
    if (!this.exercicioRecomendado) {
      console.warn('Nenhum exercício recomendado identificado na resposta da IA.');
    }
  }

  gerarInstrucoesEDados(): void {
    this.instrucoes = [];
    this.dadosExercicio = [];

    const texto = this.respostaIA ?? '';
    const linhas = texto.split('\n').map(l => l.trim()).filter(Boolean);

    const dadosTemp: { label: string; valor: string }[] = [];
    const instrucoesTemp: string[] = [];

    let capturandoInstrucoes = false;

    for (let linha of linhas) {
      const l = linha.toLowerCase();

      if (l.startsWith('instruções simples:')) {
        capturandoInstrucoes = true;
        const instrucaoInicial = linha.split(':')[1]?.trim();
        if (instrucaoInicial) instrucoesTemp.push(instrucaoInicial);
        continue;
      }

      if (capturandoInstrucoes) {
        if (l.startsWith('objetivo:') || l.startsWith('exercício recomendado:') || l.startsWith('frequência') || l.startsWith('duração:') || l.startsWith('calorias')) {
          capturandoInstrucoes = false;
        } else {
          instrucoesTemp.push(linha);
          continue;
        }
      }

      const match = linha.match(/^([\wÀ-ÿ\s]+):\s*(.+)$/i);
      if (match) {
        const label = match[1].trim();
        const valor = match[2].trim();
        dadosTemp.push({ label, valor });
      }
    }

    this.dadosExercicio = dadosTemp;
    this.instrucoes = instrucoesTemp;

    if (this.instrucoes.length === 0) {
      this.instrucoes.push(`Lembre-se de executar bem o exercício ${this.currentNome}.`);
    }
  }
}