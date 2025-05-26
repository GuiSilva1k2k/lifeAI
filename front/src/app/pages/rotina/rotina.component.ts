import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { ChecklistComponent } from './components/checklist/checklist.component';
import { DicasComponent } from './components/dicas/dicas.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-rotina',
  standalone: true,
  imports: [
    SidebarComponent,
    CalendarioComponent,
    ChecklistComponent,
    DicasComponent,
  ],
  templateUrl: './rotina.component.html',
  styleUrls: ['./rotina.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RotinaComponent {}
