import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Checklist } from '../models/user';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private baseUrl = `${environment.djangoApiUrl}/checklist`; // ajuste se necessário

  constructor(private http: HttpClient) {}

  criarChecklist(checklist: Checklist): Observable<any> {
    return this.http.post(`${this.baseUrl}/create/`, checklist);
  }
}
