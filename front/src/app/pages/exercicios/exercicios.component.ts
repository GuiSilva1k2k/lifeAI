import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExemplosExercicioComponent } from './exemplos-exercicio/exemplos-exercicio.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-exercicios',
  standalone: true,
  imports: [CommonModule, ExemplosExercicioComponent, SidebarComponent],
  templateUrl: './exercicios.component.html',
  styleUrls: ['./exercicios.component.scss'],
})
export class ExerciciosComponent {}
