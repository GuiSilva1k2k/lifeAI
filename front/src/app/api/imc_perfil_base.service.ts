import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { imcBase } from '../models/user';
import { environment } from '../../environments/environment.prod';


interface ImcBase {
  imc_res: number;
  objetivo: string;
}

interface Exercicio {
  nome: string;
  gif: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImcBaseService {
  private apiUrlPost = `${environment.djangoApiUrl}/imc_base_perfil/`;
  private apiUrlGet = `${environment.djangoApiUrl}/imc_rec/`;
  
  constructor(private http: HttpClient) {}

  enviarImcBase(data: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrlPost, data, { headers });
  }
  
  getImcBase(): Observable<imcBase[]> {
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
    return this.http.get<imcBase[]>(this.apiUrlGet, { headers });
  }
}
