import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ChatbotComponent {
  messages: { from: 'bot' | 'user', text: string; loading?: boolean; timestamp?: Date }[] = [];
  step = 0;
  inputText = '';
  answers: any = {};

  ngOnInit() {
    this.sendBotMessage('Olá! Qual o seu nome?');
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

    switch (this.step) {
      case 0:
        this.answers.nome = input;
        this.sendBotMessage(`Prazer, ${input}! Qual sua idade?`);
        break;
      case 1:
        this.answers.idade = input;
        this.sendBotMessage('Qual seu sexo?');
        break;
      case 2:
        this.answers.sexo = input;
        this.sendBotMessage('Qual seu objetivo?');
        break;
      case 3:
        this.answers.objetivo = input;
        this.sendBotMessage('Obrigado! Estamos processando suas informações...');
        this.sendToBackend();
        break;
    }

    this.inputText = '';
    this.step++;
  }

  handleOption(option: string) {
    this.inputText = option;
    this.handleUserInput();
  }

  getOptions() {
    if (this.step === 2) {
      return ['Masculino', 'Feminino', 'Outro'];
    }
    return [];
  }

  sendToBackend() {
    console.log('Dados coletados:', this.answers);
  }
}
