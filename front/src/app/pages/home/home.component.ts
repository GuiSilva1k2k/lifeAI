import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { GraficoComponent } from "./grafico/grafico.component";
import { ResumoComponent } from "./resumo/resumo.component";
import { CalculoImcComponent } from './calculo-imc/calculo-imc.component';
import { HistoricoRegistrosComponent } from './calculo-imc/historico-registros/historico-registros.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    SidebarComponent,
    GraficoComponent,
    ResumoComponent,
    CalculoImcComponent,
    HistoricoRegistrosComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
