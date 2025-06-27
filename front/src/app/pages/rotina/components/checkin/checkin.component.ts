import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AtividadePontuacaoService } from '../../../../api/atividade_pontuacao.service';

export interface Atividade {
  id: number;
  descricao: string;
  done: boolean;
}

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatCheckboxModule, FormsModule],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.scss'
})

export class CheckinComponent implements OnChanges{
  @Input() data!: Date;
  atividades: Atividade[] = [];

  @Output() atividadesChange = new EventEmitter<Atividade[]>();

  idChecklist: number = 0;

  constructor(private http: HttpClient, private atividadeService: AtividadePontuacaoService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.carregarChecklistEAtividadesPorData(this.data);
    }
  }
  private apiUrl = 'http://localhost:8000/checklists';
  
  
  carregarChecklistEAtividadesPorData(data: Date) {
    const dataFormatada = data.toISOString().split('T')[0];
    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `${this.apiUrl}/atividades-por-data/?data=${dataFormatada}`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (res) => {
        if (res && res.id) {
          this.idChecklist = res.id;
          this.atividades = res.atividades;
        } else {
          console.warn('Nenhum checklist encontrado para esta data.');
          this.idChecklist = 0;
          this.atividades = [];
        }
      },
      error: (err) => {
        if (err.status === 404) {
          console.warn('Checklist não encontrado para a data fornecida.');
        } else if (err.status === 401) {
          console.error('Não autorizado. Verifique seu token.');
        } else {
          console.error('Erro inesperado:', err);
        }
        this.idChecklist = 0;
        this.atividades = [];
      }
    });
  }
  toggleDone(atividade: Atividade) {
    atividade.done = !atividade.done;
  }

  atualizarAtividades() {
    if (!this.idChecklist) {
      console.warn('Nenhum checklist selecionado.');
      return;
    }

    this.atividadeService.atualizarAtividades(this.idChecklist, this.atividades).subscribe({
      next: () => {
        console.log('Atividades atualizadas. Gerando pontuação...');
        this.gerarPontuacaoChecklist();
      },
      error: (err) => {
        console.error('Erro ao atualizar atividades:', err);
        alert('Erro ao atualizar atividades.');
      }
    });
  }

  gerarPontuacaoChecklist() {
    if (!this.idChecklist) {
      console.warn('Nenhum checklist selecionado.');
      return;
    }
    this.atividadeService.gerarPontuacao(this.idChecklist).subscribe({
      next: (res) => {
        console.log('Pontuação salva com sucesso:', res);
      },
      error: (err) => {
        console.error('Erro ao gerar pontuação:', err);
        alert('Erro ao gerar pontuação');
      }
    });
  }
  
  SalvarPontuarChecklist() {
    this.atualizarAtividades()
  }
}
