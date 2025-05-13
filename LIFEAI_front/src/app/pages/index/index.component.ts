import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  formType: 'login' | 'register' = 'login';

  showForm(type: 'login' | 'register') {
    this.formType = type;
  }
}