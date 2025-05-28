import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';

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
  exercicios: Exercicio[] = [];
  currentIndex: number = 0;
  /* 
    criar duas listas:
    instrucao_exerc[] = [];
    dados_exerc[] = [];
  */

  ngOnInit(): void {
    this.exercicios = [
      { nome: 'Agachamento com barra', gif: 'https://media1.tenor.com/m/pdMmsiutWkcAAAAC/gym.gif' },
      { nome: 'Supino reto', gif: 'https://www.mundoboaforma.com.br/wp-content/uploads/2020/12/supino-reto.gif' },
      { nome: 'Levantamento terra', gif: 'https://www.hipertrofia.org/blog/wp-content/uploads/2023/03/barbell-sumo-deadlift.gif' },
      { nome: 'Remada curvada', gif: 'https://www.hipertrofia.org/blog/wp-content/uploads/2023/11/dumbbell-bent-over-row.gif' },
      { nome: 'Flexão de braço', gif: 'https://www.mundoboaforma.com.br/wp-content/uploads/2021/04/flexao-de-bracos.gif' }
    ];
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
}
