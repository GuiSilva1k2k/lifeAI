import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { ChecklistComponent } from './components/checklist/checklist.component';
import { DicasComponent } from './components/dicas/dicas.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rotina',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    CalendarioComponent,
    ChecklistComponent,
    DicasComponent
  ],
  templateUrl: './rotina.component.html',
  styleUrls: ['./rotina.component.scss']
})
export class RotinaComponent {}
