import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { Router } from '@angular/router';
import { ChatService } from '../../api/chat.service';

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
export class ChatbotComponent implements AfterViewInit {
  @ViewChild('inputField') inputField!: ElementRef;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('anchor') anchor!: ElementRef;

  messages: { from: 'bot' | 'user', text: string; loading?: boolean; timestamp?: Date }[] = [];
  step = 0;
  inputText = '';
  private answers: any = {};

  constructor(private router: Router, private chatService: ChatService) {}

  ngOnInit() {
    this.sendBotMessage('Olá! Qual o seu nome?');
  }

  ngAfterViewInit() {
    this.focusInput();
  }

  private focusInput() {
    setTimeout(() => {
      if (this.inputField) {
        this.inputField.nativeElement.focus();
        this.inputField.nativeElement.select();
      }
    }, 0);
  }

  private scrollToBottom(): void {
  setTimeout(() => {
    this.anchor?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }, 100);
  }

  sendBotMessage(text: string, delay = 500) {
    const loadingMsg = { from: 'bot', text: '', loading: true } as any;
    this.messages.push(loadingMsg);
    this.scrollToBottom();

    setTimeout(() => {
      loadingMsg.loading = false;
      loadingMsg.text = text;
      loadingMsg.timestamp = new Date();
      this.scrollToBottom();
      this.focusInput();
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

    switch (this.step) {
      case 0:
        this.answers.nome = input;
        this.sendBotMessage(`Prazer, ${input}! Qual sua idade?`);
        break;
      case 1:
        this.answers.idade = input;
        this.sendBotMessage('Qual seu peso? (kg)');
        break;
      case 2:
        this.answers.peso = input;
        this.sendBotMessage('Qual sua altura? (cm)');
        break;
      case 3:
        this.answers.altura = input;
        this.sendBotMessage('Qual seu sexo?');
        break;
      case 4:
        this.answers.sexo = input;
        this.sendBotMessage('Qual seu objetivo?');
        break;
      case 5:
        this.answers.objetivo = input;

        const alturaM = parseFloat(this.answers.altura) / 100;
        const peso = parseFloat(this.answers.peso);

        if (!isNaN(alturaM) && !isNaN(peso) && alturaM > 0) {
          const imc = peso / (alturaM * alturaM);
          this.answers.imc = imc.toFixed(2);
        } else {
          this.answers.imc = 'Não calculado';
        }

        this.sendBotMessage(`Seu IMC é ${this.answers.imc}. Obrigado! Estamos processando suas informações...`);
        this.sendToBackend();
        setTimeout(() => this.router.navigate(['home']), 100);
        break;
    }

    this.inputText = '';
    this.step++;
    this.focusInput();
  }

  handleOption(option: string) {
    this.inputText = option;
    this.handleUserInput();
  }

  getOptions() {
    if (this.step === 4) {
      return ['Masculino', 'Feminino', 'Outro'];
    }
    return [];
  }

  sendToBackend() {
    console.log('Dados coletados:', this.answers);
    this.chatService.setRespostas(this.answers);
  }
}
