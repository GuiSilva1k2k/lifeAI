import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { historicoConsultas } from '../../../../models/user';
import { HistoricoConsultasService } from '../../../../api/historicoImc.service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-historico-registros',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './historico-registros.component.html',
  styleUrl: './historico-registros.component.scss'
})
export class HistoricoRegistrosComponent implements OnInit {
  displayedColumns: string[] = ['data_consulta', 'peso', 'altura', 'imc_res', 'classificacao'];
  dataSource: historicoConsultas[] = [];

  constructor(private historicoConsultasService: HistoricoConsultasService) {}

  ngOnInit(): void {
    this.historicoConsultasService.obterHistorico().subscribe({
      next: (dados) => this.dataSource = dados,
      error: (err) => console.error('Erro ao carregar registros IMC', err)
    });
  }
}
