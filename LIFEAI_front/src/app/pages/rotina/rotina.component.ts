import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-rotina',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './rotina.component.html',
  styleUrls: ['./rotina.component.scss']
})
export class RotinaComponent {}
