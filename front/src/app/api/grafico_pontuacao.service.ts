import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pontuacao } from '../models/user';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GraficoPontuacaoService {
  private baseUrl = `${environment.djangoApiUrl}/pontuacoes/`;

  constructor(private http: HttpClient) {}

  obterPontuacoes(): Observable<Pontuacao[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<Pontuacao[]>(this.baseUrl, { headers });
  }
}