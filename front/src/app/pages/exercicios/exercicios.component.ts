import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ImcBaseService } from '../../api/imc_perfil_base.service';
import { IaService } from '../../api/ia.service';
import { v4 as uuidv4 } from 'uuid';


interface Exercicio {
  nome: string;
  gif: string;
}

@Component({
  selector: 'app-exercicios',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './exercicios.component.html',
  styleUrls: ['./exercicios.component.scss']
})
export class ExerciciosComponent implements OnInit {

  constructor(private ImcBaseService: ImcBaseService, private IaService: IaService) {}

  imc_base: any[] = [];
  exercicios: Exercicio[] = [];
  currentIndex: number = 0;
  
  instrucao_exerc: string[] = [];
  dados_exerc: string[] = [];

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
        this.gerarPlanoComIA(); // chama após os dados carregarem
      },
      error: (err) => console.error('Erro ao buscar IMC:', err)
    });
  }

  previousGif(): void {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  nextGif(): void {
    if (this.currentIndex < this.exercicios.length - 1) this.currentIndex++;
  }

  get currentGif(): string {
    return this.exercicios[this.currentIndex]?.gif ?? '';
  }

  get currentNome(): string {
    return this.exercicios[this.currentIndex]?.nome ?? '';
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
  
  respostaIA: string = '';
  sessaoId: string = uuidv4();

  gerarPlanoComIA(): void {
    if (this.imc_base.length === 0 || this.exercicios.length === 0) {
      console.warn('Dados insuficientes para gerar prompt');
      return;
    }

    const nomesExercicios = this.exercicios.map(e => e.nome).join(', ');
    const imcTextos = this.imc_base.map((i) =>
      `Pessoa IMC = ${i.imc_res}, Objetivo = ${i.objetivo}`
    ).join('\n');

    const prompt = `Baseado nos dados abaixo, gere um plano de treino personalizado:\n\n${imcTextos}\n\n
    Exercícios disponíveis: ${nomesExercicios}\n\n
    Crie uma sugestão inteligente de treino que a pessoa suporte baseada em seu imc e objetivo.`;

    this.IaService.enviarPergunta(prompt, this.sessaoId).subscribe({
      next: (res) => {
        this.respostaIA = res.resposta;
        console.log('Resposta da IA:', this.respostaIA);
      },
      error: (err) => console.error('Erro ao enviar pergunta para IA:', err)
    });
  }
}
