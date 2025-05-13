import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-chat-ia',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './chat-ia.component.html',
  styleUrls: ['./chat-ia.component.scss']
})
export class ChatIaComponent {}
