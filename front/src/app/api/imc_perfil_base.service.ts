// src/app/services/imc.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImcBaseService {
  private apiUrl = 'http://localhost:8000/imc_base_perfil/';

  constructor(private http: HttpClient) {}

  enviarImcBase(data: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, data, { headers });
  }
  
}
