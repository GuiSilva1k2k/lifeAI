import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ImcRegistro {
  data_consulta: string;
  imc_res: number;
}

@Injectable({ providedIn: 'root' })
export class DesempenhoImc {
  private readonly API_URL = 'http://localhost:8000/imc/historico/';

  constructor(private http: HttpClient) {}

  obterHistorico(): Observable<ImcRegistro[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    return this.http.get<ImcRegistro[]>(this.API_URL, { headers });
  }
}
