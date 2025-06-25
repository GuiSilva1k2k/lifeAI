import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { historicoConsultas } from '../../../../models/user';
import { HistoricoConsultasService } from '../../../../api/historicoImc.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-historico-registros',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './historico-registros.component.html',
  styleUrls: ['./historico-registros.component.scss']
})
export class HistoricoRegistrosComponent implements OnInit {
  displayedColumns: string[] = ['data_consulta', 'peso', 'altura', 'imc_res', 'classificacao', 'acoes'];
  dataSource: historicoConsultas[] = [];

  constructor(private historicoConsultasService: HistoricoConsultasService) {}

  ngOnInit(): void {
    this.carregarHistorico();
  }

  carregarHistorico() {
    this.historicoConsultasService.obterHistorico().subscribe({
      next: (dados) => {
        this.dataSource = dados;
      },
      error: (err) => {
        console.error('Erro ao carregar registros IMC', err);
        alert('Erro ao carregar registros.');
      }
    });
  }

  deletar(el: historicoConsultas) {
    console.log('Tentando deletar registro com id:', el.id);
    if (!el.id) {
      alert('ID do registro não definido!');
      return;
    }
    if (confirm('Deseja realmente excluir este registro?')) {
      this.historicoConsultasService.deletarConsulta(el.id).subscribe({
        next: () => {
          this.dataSource = this.dataSource.filter(item => item.id !== el.id);
        },
        error: (err) => {
          console.error('Erro ao excluir', err);
          alert('Erro ao excluir registro.');
        }
      });
    }
  }
}
