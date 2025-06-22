import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { historicoConsultas } from '../models/user';

@Injectable({ providedIn: 'root' })
export class HistoricoConsultasService {
  private apiUrl = 'http://localhost:8000/imc/registrosConsultas/';
  private apiDeleteUrl = 'http://localhost:8000/imc/';

  constructor(private http: HttpClient) {}

  obterHistorico(): Observable<historicoConsultas[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<historicoConsultas[]>(this.apiUrl, { headers });
  }

  deletarConsulta(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiDeleteUrl}${id}/`, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
