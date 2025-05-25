import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../api/chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumo',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './resumo.component.html',
  styleUrl: './resumo.component.scss'
})
export class ResumoComponent implements OnInit{
  respostas: any;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.respostas$.subscribe(res => {
      this.respostas = res;
    });
  }
}
