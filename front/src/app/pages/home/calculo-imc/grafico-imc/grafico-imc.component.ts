import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-grafico-imc',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './grafico-imc.component.html',
  styleUrl: './grafico-imc.component.scss'
})
export class GraficoImcComponent {
  get chartType(): ChartType {
    return 'bar'; 
  }

  public chartData: ChartConfiguration['data'] = {
    labels: ['Janeiro', 'Fevereiro', 'Março'],
    datasets: [
      {
        data: [65, 59, 80],
        label: 'Vendas',
        backgroundColor: '#00c8c8'
      }
    ]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true
  };
}
