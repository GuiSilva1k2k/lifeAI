import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private respostasSubject = new BehaviorSubject<any>({});
  respostas$ = this.respostasSubject.asObservable();

  setRespostas(respostas: any) {
    this.respostasSubject.next(respostas);
  }

  limpar() {
  this.respostasSubject.next(null);
  }
}
