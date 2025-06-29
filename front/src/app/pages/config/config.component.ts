import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { SettingsService } from '../../api/settings.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent {
  constructor(public settingsService: SettingsService) {}

  toggleNotifications(): void {
    const confirma = window.confirm('Tem certeza que deseja alterar o estado das notificações?');
    if (!confirma) {
      return;
    }
    
    const atual = this.settingsService.notificationsEnabled;
    this.settingsService.setNotificationsEnabled(!atual);
  }
}
