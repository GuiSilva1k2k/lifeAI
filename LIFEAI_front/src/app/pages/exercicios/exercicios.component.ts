import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-exercicios',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './exercicios.component.html',
  styleUrls: ['./exercicios.component.scss']
})
export class ExerciciosComponent {}
