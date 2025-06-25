import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { trigger, transition, style, animate } from '@angular/animations';

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
export class CalendarioComponent {
  selectedDate: Date | null = null;

  @Output() dataSelecionada = new EventEmitter<Date>();

  emitirData() {
    if (this.selectedDate) {
      console.log('Data emitida:', this.selectedDate); // ← deve aparecer no console
      this.dataSelecionada.emit(this.selectedDate);
    }
  }
}
