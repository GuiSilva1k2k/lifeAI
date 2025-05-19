import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule],
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
})
export class ChecklistComponent {
  tarefas = [
    { nome: 'Beber água', feito: false },
    { nome: 'Exercício físico', feito: false },
    { nome: 'Ler por 30 minutos', feito: false },
    { nome: 'Meditar', feito: false },
    { nome: 'Revisar metas do dia', feito: false },
    { nome: 'Planejar o dia seguinte', feito: false },
    { nome: 'Evitar redes sociais', feito: false },
    { nome: 'Dormir 8 horas', feito: false },
  ];

  gruposTarefas = [
    this.tarefas.slice(0, 4),
    this.tarefas.slice(4),
  ];
}

