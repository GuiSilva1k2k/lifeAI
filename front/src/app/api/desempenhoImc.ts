import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
export interface ImcRegistro {
  data_consulta: string;
  imc_res: number;
}

@Injectable({ providedIn: 'root' })
export class DesempenhoImc {
  private readonly API_URL = `${environment.djangoApiUrl}/imc/historico/`;

  constructor(private http: HttpClient) {}

  obterHistorico(): Observable<ImcRegistro[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    return this.http.get<ImcRegistro[]>(this.API_URL, { headers });
  }
}
