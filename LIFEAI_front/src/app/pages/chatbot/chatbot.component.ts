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
    this.sendBotMessage(this.getRandomMessage([
      'Oi! Que bom te ver por aqui 😊 Qual é o seu nome?',
      'Olá! Vamos começar? Me conta seu nome!',
      'E aí! 😄 Qual é o seu nome pra gente se conhecer melhor?'
    ]));
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
        this.sendBotMessage(this.getRandomMessage([
          `Prazer em te conhecer, ${input}! 😊 Quantos anos você tem?`,
          `Legal, ${input}! Agora me diz sua idade.`,
          `${input}, show! Me fala sua idade agora.`
        ]));
        break;

      case 1:
        this.answers.idade = input;
        this.sendBotMessage(this.getRandomMessage([
          'Beleza! E quanto você está pesando hoje? (em kg)',
          'Legal, e qual é o seu peso atual?',
          'Certo! Pode me dizer seu peso, por favor?'
        ]));
        break;

      case 2:
        this.answers.peso = input;
        this.sendBotMessage(this.getRandomMessage([
          'Show! Agora me fala sua altura (em centímetros)?',
          'Anotado! Qual é sua altura?',
          'Valeu! Me diz sua altura agora (cm).'
        ]));
        break;

      case 3:
        this.answers.altura = input;
        this.sendBotMessage(this.getRandomMessage([
          'Entendi! E qual é o seu sexo?',
          'Quase lá! Me diz seu sexo agora.',
          'Ok! Pode me informar seu sexo?'
        ]));
        break;

      case 4:
        this.answers.sexo = input;
        this.sendBotMessage(this.getRandomMessage([
          'E por fim... qual é o seu principal objetivo? 💪',
          'Última pergunta! Qual seu objetivo com a saúde/atividade física?',
          'Muito bem! Qual é o seu foco agora? (ex: perder peso, ganhar massa, manter saúde)'
        ]));
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

        this.sendBotMessage(this.getRandomMessage([
          `Seu IMC é ${this.answers.imc}. 👍 Obrigado pelas informações, ${this.answers.nome}! Estamos analisando tudo pra te ajudar.`,
          `Prontinho! Calculamos seu IMC: ${this.answers.imc}. Agora é com a gente 😄`,
          `IMC registrado: ${this.answers.imc}. Vamos usar isso pra personalizar sua experiência. Obrigado, ${this.answers.nome}!`
        ]));

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
      return ['Perder peso', 'Ganhar massa', 'Manter saúde'];
    } else if (this.step === 3) {
      return ['Masculino', 'Feminino', 'Outro'];
    }
    return [];
  }

  sendToBackend() {
    console.log('Dados coletados:', this.answers);
    this.chatService.setRespostas(this.answers);
  }

  private getRandomMessage(options: string[]): string {
    const index = Math.floor(Math.random() * options.length);
    return options[index];
  }
}
