import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { IaService } from '../../api/ia.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-chat-ia',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent, MarkdownModule],
  templateUrl: './chat-ia.component.html',
  styleUrls: ['./chat-ia.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ChatIaComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('inputField') inputField!: ElementRef;

  messages: { from: 'bot' | 'user', text: string; loading?: boolean; timestamp?: Date }[] = [];
  inputText = '';
  hasReplied = false;
  selectedTopic: string | null = null;
  sessaoId = uuidv4(); // Gera um ID único por sessão de chat

  options = [
    {
      title: 'Saúde Física',
      subtitle: 'Dicas e orientações para manter seu corpo ativo e saudável.'
    },
    {
      title: 'Saúde Mental',
      subtitle: 'Cuide da sua mente com técnicas de bem-estar emocional.'
    },
    {
      title: 'Alimentação',
      subtitle: 'Melhore sua dieta com hábitos alimentares saudáveis.'
    },
    {
      title: 'Exercícios',
      subtitle: 'Treinos e movimentação para o dia a dia.'
    },
    {
      title: 'Prevenção de Doenças',
      subtitle: 'Evite problemas futuros com práticas preventivas.'
    }
  ];

  constructor(private iaService: IaService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Erro ao rolar para o final:', err);
    }
  }

  private focusAndSelectInput(): void {
    setTimeout(() => {
      if (this.inputField) {
        const inputEl = this.inputField.nativeElement as HTMLInputElement;
        inputEl.focus();
        inputEl.select();
      }
    }, 50);
  }

  sendBotMessage(text: string, delay = 500) {
    const loadingMsg = { from: 'bot', text: '', loading: true } as any;
    this.messages.push(loadingMsg);

    setTimeout(() => {
      loadingMsg.loading = false;
      loadingMsg.text = text;
      loadingMsg.timestamp = new Date();
      this.scrollToBottom();
      this.focusAndSelectInput();
    }, delay);
  }

  sendUserMessage(text: string) {
    this.messages.push({ from: 'user', text, timestamp: new Date() });
    this.scrollToBottom();
  }

  handleUserInput() {
    const input = this.inputText.trim();
    if (!input) return;

    this.sendUserMessage(input);
    this.inputText = '';

    if (!this.hasReplied) {
      this.hasReplied = true;
      this.selectedTopic = input;
    }

    this.callAIResponse(input);
    this.focusAndSelectInput();
  }

  handleOptionClick(optionTitle: string) {
    if (this.hasReplied) return;

    this.sendUserMessage(optionTitle);
    this.hasReplied = true;
    this.selectedTopic = optionTitle;
    this.callAIResponse(optionTitle);
    this.focusAndSelectInput();
  }

  handleInputSubmit() {
    this.handleUserInput();
  }

  callAIResponse(userInput: string) {
    const loadingMsg = { from: 'bot', text: '', loading: true } as any;
    this.messages.push(loadingMsg);
    this.scrollToBottom();

    this.iaService.enviarPergunta(userInput, this.sessaoId).subscribe({
      next: (res) => {
        loadingMsg.loading = false;
        loadingMsg.text = res.resposta;
        loadingMsg.timestamp = new Date();
        this.scrollToBottom();
        this.focusAndSelectInput();
      },
      error: (err) => {
        loadingMsg.loading = false;
        loadingMsg.text = 'Erro ao consultar IA.';
        loadingMsg.timestamp = new Date();
        console.error(err);
      }
    });
  }
}
