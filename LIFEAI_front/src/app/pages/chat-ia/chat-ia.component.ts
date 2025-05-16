import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-chat-ia',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
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
export class ChatIaComponent {
  messages: { from: 'bot' | 'user', text: string; loading?: boolean; timestamp?: Date }[] = [];
  inputText = '';
  hasReplied = false;
  selectedTopic: string | null = null;

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

  ngOnInit() {
    // Mensagem inicial está fixa no HTML
  }

  sendBotMessage(text: string, delay = 500) {
    const loadingMsg = { from: 'bot', text: '', loading: true } as any;
    this.messages.push(loadingMsg);

    setTimeout(() => {
      loadingMsg.loading = false;
      loadingMsg.text = text;
      loadingMsg.timestamp = new Date();
    }, delay);
  }

  sendUserMessage(text: string) {
    this.messages.push({ from: 'user', text, timestamp: new Date() });
  }

  handleUserInput() {
    const input = this.inputText.trim();
    if (!input) return;

    this.sendUserMessage(input);
    this.inputText = '';

    if (!this.hasReplied) {
      this.hasReplied = true;
      this.selectedTopic = input;
      this.sendBotMessage(`Entendido! Vamos falar sobre ${input.toLowerCase()}.`);
    } else {
      // Aqui você pode integrar com sua IA
      this.callAIResponse(input);
    }
  }

  handleOptionClick(optionTitle: string) {
    if (this.hasReplied) return;

    this.sendUserMessage(optionTitle);
    this.hasReplied = true;
    this.selectedTopic = optionTitle;
    this.sendBotMessage(`Perfeito! Vamos falar sobre ${optionTitle.toLowerCase()}.`);
  }

  handleInputSubmit() {
    this.handleUserInput();
  }

  /**
   * Este método é onde você poderá integrar sua IA futuramente.
   * Pode fazer uma chamada HTTP para uma API externa.
   */
  callAIResponse(userInput: string) {
    // Exemplo simulado (futuro: substitua com HTTP request)
    this.sendBotMessage(`(IA responderia aqui com base em "${userInput}" no contexto de "${this.selectedTopic}")`, 800);

    // Exemplo futuro:
    // this.http.post('/api/ia', { input: userInput, topic: this.selectedTopic })
    //   .subscribe(response => this.sendBotMessage(response.text));
  }
}
