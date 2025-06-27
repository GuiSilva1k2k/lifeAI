  import { Component, OnInit } from '@angular/core';
  import { BaseChartDirective } from 'ng2-charts';
  import { ChartType, ChartConfiguration } from 'chart.js';
  import { CommonModule } from '@angular/common';
  import { GraficoImcComponent } from '../calculo-imc/grafico-imc/grafico-imc.component';
  import { GraficoPontuacaoService } from '../../../api/grafico_pontuacao.service';
  import { Pontuacao } from '../../../models/user';

  @Component({
    selector: 'app-grafico',
    standalone: true,
    imports: [CommonModule, BaseChartDirective, GraficoImcComponent ],
    templateUrl: './grafico.component.html',
    styleUrl: './grafico.component.scss'
  })
  export class GraficoComponent implements OnInit {
    currentView: 'Desempenho Checklist' | 'imc' = 'Desempenho Checklist';

    chartLabels: string[] = [];
    chartValues: number[] = [];

    constructor(private graficoService: GraficoPontuacaoService) {}

    ngOnInit(): void {
      this.carregarPontuacoes();
    }

    carregarPontuacoes(): void {
      this.graficoService.obterPontuacoes().subscribe({
        next: (pontuacoes: Pontuacao[]) => {
          this.chartLabels = pontuacoes.map(p => `Checklist ${p.checklist_id}`);
          this.chartValues = pontuacoes.map(p => p.porcentagem);
        },
        error: (err) => {
          console.error('Erro ao buscar pontuações:', err);
        }
      });
    }

    get chartType(): ChartType {
      return 'bar'; 
    }

    get chartTitle(): string {
      return this.currentView === 'Desempenho Checklist'
        ? 'Desempenho Checklists'
        : 'Gráfico de IMC'; 
    }

    get chartOptions(): ChartConfiguration['options'] {
      return {
        responsive: true,
        maintainAspectRatio: false,
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
            borderWidth: 1
          }
        },
        scales: {
          x: {
            offset: true,
            ticks: { color: '#ccc' },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: '#ccc',
              callback: this.currentView === 'Desempenho Checklist'
                ? (value: number | string) => value + '%'
                : undefined
            },
            grid: { color: '#2a3b4d' }
          }
        }
      };
    }

    get chartData() {
      if (this.currentView === 'Desempenho Checklist') {
        return {
          labels: this.chartLabels,
          datasets: [
            {
              label: 'Porcentagem Concluída',
              data: this.chartValues,
              backgroundColor: '#00c853',
              fill: false,
              borderRadius: 6,
              maxBarThickness: 80,
              barPercentage: 0.7,
              categoryPercentage: 0.8
            }
          ]
        };
      } else {
        return {
          labels: [],
          datasets: [
            {
              label: '',
              data: [],
              backgroundColor: '#00c8c8',
              borderRadius: 6
            }
          ]
        };
      }
    }

    switchView(view: 'Desempenho Checklist' | 'imc') {
      this.currentView = view;
    }
  }
