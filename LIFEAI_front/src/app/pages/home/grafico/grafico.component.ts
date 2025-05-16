import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grafico',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
  ],
  templateUrl: './grafico.component.html',
  styleUrl: './grafico.component.scss'
})
export class GraficoComponent {
  chartType: ChartType = 'line';

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  chartData = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
    datasets: [
      { label: '2025', data: [30, 50, 70, 10, 90,], backgroundColor: 'red' }
    ]
  };
}
