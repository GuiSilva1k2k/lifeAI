import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AtividadePontuacaoService {

  constructor(private http: HttpClient) {}
  
  atualizarAtividades(checklistId: number, atividades: any[]) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put(
      `http://localhost:8000/checklists/${checklistId}/atualizar-atividades/`,
      { atividades },
      { headers }
    );
  }

  gerarPontuacao(checklistId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`http://localhost:8000/checklists/${checklistId}/pontuacao/`, {}, { headers });
  }
}