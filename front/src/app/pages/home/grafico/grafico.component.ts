import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grafico',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './grafico.component.html',
  styleUrl: './grafico.component.scss'
})
export class GraficoComponent {
  currentView: 'atividades' | 'desempenho' = 'atividades';

  get chartType(): ChartType {
    return 'bar'; 
  }

  get chartTitle(): string {
    return this.currentView === 'atividades'
      ? 'Atividades Realizadas'
      : 'Desempenho Semanal (Dias com Exercício)';
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
          borderWidth: 1,
        }
      },
      scales: {
        x: {
          ticks: { color: '#ccc' },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          max: this.currentView === 'desempenho' ? 7 : undefined,
          ticks: {
            color: '#ccc',
            stepSize: this.currentView === 'desempenho' ? 1 : undefined,
            callback: this.currentView === 'atividades'
              ? (value) => value + '%'
              : undefined
          },
          grid: { color: '#2a3b4d' }
        }
      }
    };
  }

  get chartData() {
    if (this.currentView === 'atividades') {
      return {
        labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5'],
        datasets: [
          {
            label: 'Aeróbico',
            data: [20, 35, 40, 25, 30],
            backgroundColor: '#e74c3c',
            borderRadius: 6
          },
          {
            label: 'Yoga',
            data: [30, 50, 45, 40, 35],
            backgroundColor: '#1abc9c',
            borderRadius: 6
          },
          {
            label: 'Meditação',
            data: [10, 20, 15, 30, 25],
            backgroundColor: '#f39c12',
            borderRadius: 6
          }
        ]
      };
    } else {
      return {
        labels: ['1ª Semana', '2ª Semana', '3ª Semana', '4ª Semana'],
        datasets: [
          {
            label: 'Dias com Exercício por Semana',
            data: [3, 5, 4, 2],
            backgroundColor: '#00c8c8',
            borderRadius: 6
          }
        ]
      };
    }
  }

  switchView(view: 'atividades' | 'desempenho') {
    this.currentView = view;
  }
}
