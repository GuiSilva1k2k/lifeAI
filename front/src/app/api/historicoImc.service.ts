import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { historicoConsultas } from '../models/user';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class HistoricoConsultasService {
  private apiUrl = `${environment.djangoApiUrl}/imc/registrosConsultas/`;
  private apiDeleteUrl = `${environment.djangoApiUrl}/imc/`;

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
