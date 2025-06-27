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

    
    getBarColor(valor: number): string {
      if (valor <= 25) return '#ef5350';
      if (valor <= 50) return '#ff9800';
      if (valor <= 75) return '#8bc34a';
      return '#388e3c';
    }

    constructor(private graficoService: GraficoPontuacaoService) {}

    ngOnInit(): void {
      this.carregarPontuacoes();
    }

    carregarPontuacoes(): void {
      this.graficoService.obterPontuacoes().subscribe({
        next: (pontuacoes: Pontuacao[]) => {
          pontuacoes.sort((a, b) => new Date(a.data_checklist).getTime() - new Date(b.data_checklist).getTime());
          this.chartLabels = pontuacoes.map(p => {
            const [ano, mes, dia] = p.data_checklist.split('-');
            return `${dia}-${mes}-${ano}`;
          });

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
        const backgroundColors = this.chartValues.map(p => this.getBarColor(p));

        return {
          labels: this.chartLabels,
          datasets: [
            {
              label: 'Porcentagem Concluída',
              data: this.chartValues,
              backgroundColor: backgroundColors,
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
