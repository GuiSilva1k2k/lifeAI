import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Atividade {
  id: number;
  descricao: string;
  done: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AtividadePontuacaoService {
  private baseUrl = 'http://localhost:8000/checklists';

  constructor(private http: HttpClient) {}

  listarAtividades(idChecklist: number | null): Observable<Atividade[]> {
    return this.http.get<Atividade[]>(`${this.baseUrl}/${idChecklist}/atividades/`);
  }
}