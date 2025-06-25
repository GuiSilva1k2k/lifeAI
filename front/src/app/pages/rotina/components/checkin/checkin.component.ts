import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
  @Output() salvar = new EventEmitter<void>();
  @Output() gerarPontuacao = new EventEmitter<void>();

  idChecklist: number | null = null;

  constructor(private http: HttpClient, private atividadeService: AtividadePontuacaoService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.carregarChecklistPorData(this.data);
    }
  }
  private apiUrl = 'http://localhost:8000/checklists';

  carregarChecklistPorData(data: Date) {
    const dataFormatada = data.toISOString().split('T')[0];
    this.http.get<any>(`${this.apiUrl}/?data=${dataFormatada}`).subscribe({
      next: (res) => {
        this.idChecklist = res.id;

        this.atividadeService.listarAtividades(this.idChecklist).subscribe({
          next: (atividades) => {
            this.atividades = atividades;
          },
          error: (err) => {
            console.error('Erro ao buscar atividades:', err);
            this.atividades = [];
          }
        });
      },
      error: (err) => {
        console.error('Checklist não encontrado:', err);
        this.idChecklist = null;
        this.atividades = [];
      }
    });
}

  toggleDone(atividade: Atividade) {
    atividade.done = !atividade.done;
  }

  excluir(atividade: Atividade) {
    this.atividades = this.atividades.filter(a => a.id !== atividade.id);
    this.atividadesChange.emit(this.atividades);
  }

  salvarChecklist() {
    this.salvar.emit();
  }

  gerarPontuacaoChecklist() {
    this.gerarPontuacao.emit();
  }
}
