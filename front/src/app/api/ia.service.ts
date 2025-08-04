import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class IaService {
  private apiUrl = `${environment.djangoApiUrl}/chat-ia/`;  // URL da sua API

  constructor(private http: HttpClient) {}

  enviarPergunta(pergunta: string, sessaoId: string): Observable<{ resposta: string }> {
    return this.http.post<{ resposta: string }>(this.apiUrl, {
      pergunta,
      sessao_id: sessaoId
    });
  }
}
