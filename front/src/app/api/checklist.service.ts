import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Checklist } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private baseUrl = 'http://localhost:8000/checklist'; // ajuste se necessário

  constructor(private http: HttpClient) {}

  criarChecklist(checklist: Checklist): Observable<any> {
    return this.http.post(`${this.baseUrl}/create/`, checklist);
  }
}
