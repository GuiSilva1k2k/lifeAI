import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-desempenho',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './desemp.component.html',
  styleUrls: ['./desemp.component.scss']
})
export class DesempComponent {}
