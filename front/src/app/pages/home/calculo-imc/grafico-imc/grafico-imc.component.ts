import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { DesempenhoImc, ImcRegistro } from '../../../../api/desempenhoImc';

@Component({
  selector: 'app-grafico-imc',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './grafico-imc.component.html',
  styleUrl: './grafico-imc.component.scss'
})
export class GraficoImcComponent {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  get chartType(): ChartType {
    return 'line'; 
  }

  constructor(private desempenhoImc: DesempenhoImc) {}

  ngOnInit(): void {
    this.desempenhoImc.obterHistorico().subscribe((dados: ImcRegistro[]) => {
      dados.sort((a, b) => new Date(a.data_consulta).getTime() - new Date(b.data_consulta).getTime());
      this.chartData.labels = dados.map(d =>
        new Date(d.data_consulta).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      );
      this.chartData.datasets[0].data = dados.map(d => d.imc_res);

      this.chart?.update();
    });
  }

  public chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'IMC',
        backgroundColor: '#00c8c8',
        borderColor: '#007a7a',
        fill: false,
        tension: 0.3,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  get chartOptions(): ChartConfiguration['options'] {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#ccc',
            font: { size: 14 }
          }
        },
        tooltip: {
          backgroundColor: '#1f2d3d',
          titleColor: '#00c8c8',
          bodyColor: '#ffffff',
          borderColor: '#00c8c8',
        }
      },
      scales: {
        x: {
          ticks: { color: '#ccc' },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#2a3b4d' }
        }
      }
    };
  }
}