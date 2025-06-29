import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-saude',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-saude.component.html',
  styleUrls: ['./score-saude.component.scss']
})
export class ScoreSaudeComponent implements OnChanges {
  @Input() imc: number = 0;
  score: number = 0;
  scoreDescription: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imc']) {
      this.score = this.calcularScore(this.imc);
      this.scoreDescription = this.getScoreDescription();
    }
  }

  calcularScore(imc: number): number {
    if (imc < 18.5) return 4;
    if (imc < 25) return 10;
    if (imc < 30) return 6;
    if (imc < 35) return 4;
    if (imc < 40) return 2;
    return 1;
  }

  getColor(): string {
    if (this.score >= 8) return '#2196f3'; // verde
    if (this.score >= 6) return '#4caf50'; // amarelo
    if (this.score >= 4) return '#ffc400'; // laranja
    return '#b61827'; // vermelho
  }

  // Nova função para calcular o preenchimento do círculo SVG
  getStrokeDashArray(): string {
    const percent = this.score / 10;
    // (percent * 100) é a parte preenchida, 100 é o total
    return `${percent * 100}, 100`;
  }

  private getScoreDescription(): string {
    if (this.score >= 8) return 'Excelente';
    if (this.score >= 6) return 'Bom';
    if (this.score >= 4) return 'Regular';
    return 'Baixo';
  }
}