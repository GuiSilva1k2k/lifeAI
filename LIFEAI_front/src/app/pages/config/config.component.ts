import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent {
  // Estados de expansão de seções
  privacyEnabled = true;
  backupEnabled = false;
  notificationsEnabled = false;
  checkinEnabled = false;

  // Estado do modo escuro
  darkModeEnabled = false;

  // Alternadores de seção
  togglePrivacy(): void {
    this.privacyEnabled = !this.privacyEnabled;
  }

  toggleBackup(): void {
    this.backupEnabled = !this.backupEnabled;
  }

  toggleNotifications(): void {
    this.notificationsEnabled = !this.notificationsEnabled;
  }

  toggleCheckin(): void {
    this.checkinEnabled = !this.checkinEnabled;
  }

  toggleDarkMode(): void {
    this.darkModeEnabled = !this.darkModeEnabled;

    // Exemplo de aplicação de tema
    if (this.darkModeEnabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  exportarPrint(): void {
    window.print();
  }
}
