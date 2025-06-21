import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { historicoConsultas } from '../models/user';

@Injectable({ providedIn: 'root' })
export class HistoricoConsultasService {
  private apiUrl = 'http://localhost:8000/imc/registrosConsultas/';

  constructor(private http: HttpClient) {}

  obterHistorico(): Observable<historicoConsultas[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
    return this.http.get<historicoConsultas[]>(this.apiUrl, { headers });
  }
}