import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class CalendarioPontuacaoService {
  private baseUrl = `${environment.djangoApiUrl}/pontuacoes`;

  constructor(private http: HttpClient) {}

  getPontuacoesMensais(ano: number, mes: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<{ data: string; emoji: string; porcentagem: number }[]>(
      `${this.baseUrl}/mensal/?ano=${ano}&mes=${mes}`,
      { headers }
    );
  }
}