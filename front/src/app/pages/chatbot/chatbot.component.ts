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
import { ImcBaseService } from '../../api/imc_perfil_base.service';

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

  constructor(private router: Router, private chatService: ChatService, private ImcBaseService: ImcBaseService) {}

  ngOnInit() {
    this.sendBotMessage('Oi! Que bom te ver por aqui 😊 Qual é o seu nome?');
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
        this.sendBotMessage(`Prazer em te conhecer, ${input}! Quantos anos você tem?`);
        break;
      case 1:
        this.answers.idade = input;
        this.sendBotMessage('Legal! E quanto você está pesando atualmente (em kg)?');
        break;
      case 2:
        this.answers.peso = input;
        this.sendBotMessage('Beleza. Agora me diz sua altura (em centímetros)?');
        break;
      case 3:
        this.answers.altura = input;
        this.sendBotMessage('Certo! E qual é o seu sexo?');
        break;
      case 4:
        this.answers.sexo = input;
        this.sendBotMessage('Estamos quase lá! Qual é o seu principal objetivo? (ex: perder peso, ganhar massa, manter saúde)');
        break;
      case 5:
        this.answers.objetivo = input;

        const alturaM = parseFloat(this.answers.altura) / 100;
        const peso = parseFloat(this.answers.peso);
        let imc_res = 0.0;
        let classificacao = '';

        if (!isNaN(alturaM) && !isNaN(peso) && alturaM > 0) {
          imc_res = peso / (alturaM * alturaM);
          const imcFormatado = imc_res.toFixed(2);
          this.answers.imc_res = imcFormatado;

          if (imc_res < 18.5) {
            classificacao = 'Abaixo do peso';
          } else if (imc_res < 25) {
            classificacao = 'Peso normal';
          } else if (imc_res < 30) {
            classificacao = 'Sobrepeso';
          } else {
            classificacao = 'Obesidade';
          }

          this.answers.classificacao = classificacao;

        } else {
          this.answers.imc_res = 'Não calculado';
          this.answers.imc_classificacao = 'Classificação indisponível';
        }

        this.sendBotMessage(`Seu IMC é ${this.answers.imc}. Obrigado pelas informações, ${this.answers.nome}! Estamos analisando tudo para te ajudar da melhor forma possível...`);
        this.sendToBackend();
        this.ImcPerfilBase();
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

  ImcPerfilBase() {
    // Aqui você pode já ter os dados populados conforme o chatbot avança
    this.ImcBaseService.enviarImcBase(this.answers).subscribe({
      next: (res) => {
        console.log('Dados enviados com sucesso!', res);
      },
      error: (err) => {
        console.error('Erro ao enviar dados:', err);
      }
    });
  }
}
