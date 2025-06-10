import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exemplos-exercicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exemplos-exercicio.component.html',
  styleUrls: ['./exemplos-exercicio.component.scss'],
})
export class ExemplosExercicioComponent {
  previewAtivo = false;
  previewTop = 0;
  previewLeft = 0;
  exemploSelecionado = 1;

  mostrarPreview(numero: number, event: MouseEvent) {
    this.exemploSelecionado = numero;
    this.previewAtivo = true;
    this.previewTop = event.clientY + 10;
    this.previewLeft = event.clientX + 10;
  }

  esconderPreview() {
    this.previewAtivo = false;
  }
}
