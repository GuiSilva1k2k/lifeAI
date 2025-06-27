import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CalendarioPontuacaoService } from '../../../../api/calendarioDesempenho.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CalendarioComponent implements OnInit {
  selectedDate: Date | null = null;
  ultimoMes: number = new Date().getMonth();
  ultimoAno: number = new Date().getFullYear();

  emojiParaClasse(emoji: string): string {
    switch (emoji) {
      case '🔥': return 'fogo';
      case '🧊': return 'gelo';
      case '😐': return 'neutro';
      default: return '';
    }
  }

  @Output() dataSelecionada = new EventEmitter<Date>();

  mapaEmojis: { [dataISO: string]: string } = {};

  constructor(private calendarioPontuacaoService: CalendarioPontuacaoService) {}

  ngOnInit(): void {
    const hoje = new Date();
    this.carregarDesempenhosMes(hoje.getFullYear(), hoje.getMonth() + 1);
  }

  emitirData() {
    if (this.selectedDate) {
      const ano = this.selectedDate.getFullYear();
      const mes = this.selectedDate.getMonth();

      if (ano !== this.ultimoAno || mes !== this.ultimoMes) {
        this.ultimoAno = ano;
        this.ultimoMes = mes;
        this.carregarDesempenhosMes(ano, mes + 1);
      }

      this.dataSelecionada.emit(this.selectedDate);
    }
  }

  carregarDesempenhosMes(ano: number, mes: number) {
    this.calendarioPontuacaoService.getPontuacoesMensais(ano, mes).subscribe((dados) => {
      console.log('Pontuações recebidas:', dados);
      this.mapaEmojis = {};
      for (const d of dados) {
        this.mapaEmojis[d.data] = this.emojiParaClasse(d.emoji);
      }
    });
  }

  dateClass = (date: Date): string => {
    const iso = date.toISOString().split('T')[0];
    return this.mapaEmojis[iso] || '';
  };

  onMonthChange(date: Date) {
    this.carregarDesempenhosMes(date.getFullYear(), date.getMonth() + 1);
  }
}
