import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImcBaseService } from '../../../../api/imc_perfil_base.service';
import { IaService } from '../../../../api/ia.service';
import { v4 as uuidv4 } from 'uuid';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // para usar o datepicker com datas nativas
import { MatIconModule } from '@angular/material/icon';

interface Tarefa {
  nome: string;
  feito: boolean;
  editando?: boolean; // novo campo opcional
}


@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
})
export class ChecklistComponent implements OnInit {
  tarefas: Tarefa[] = [];
  sessaoId: string = '';
  pessoa: any = null;

  novaTarefa: string = '';
  dataChecklist: Date = new Date();

  constructor(
    private imcBaseService: ImcBaseService,
    private iaService: IaService
  ) {}

  ngOnInit(): void {
    this.sessaoId = uuidv4();

    const salvas = localStorage.getItem('checklistTarefas');
    if (salvas) {
      this.tarefas = JSON.parse(salvas);
      return;
    }

    this.imcBaseService.getImcBase().subscribe({
      next: data => {
        if (data.length > 0 && data[0].imc_res && data[0].objetivo) {
          this.pessoa = data[0];
        }
      },
      error: err => console.error('Erro ao buscar IMC:', err),
    });
  }

  adicionarTarefa(): void {
    const nome = this.novaTarefa.trim();
    if (!nome) return;

    this.tarefas.push({ nome, feito: false });
    this.novaTarefa = '';
    localStorage.setItem('checklistTarefas', JSON.stringify(this.tarefas));
  }

  gerarChecklist(): void {
    if (!this.pessoa) return;

    const prompt = `
Você é um especialista em saúde e bem-estar.

Com base nos seguintes dados:
IMC: ${this.pessoa.imc_res}
Objetivo: ${this.pessoa.objetivo}

Gere exatamente 8 tarefas práticas em formato JSON para ajudar essa pessoa a atingir seu objetivo. Cada tarefa deve ser uma frase curta e direta.

Formato de saída (sem nenhuma explicação, apenas o JSON):
[
  { "nome": "Beber 2 litros de água por dia", "feito": false },
  { "nome": "Fazer 30 minutos de caminhada", "feito": false }
]
`.trim();

    this.iaService.enviarPergunta(prompt, this.sessaoId).subscribe({
      next: res => {
        try {
          const respostaJson = JSON.parse(res.resposta);
          this.tarefas = Array.isArray(respostaJson) ? respostaJson.slice(0, 8) : [];
          localStorage.setItem('checklistTarefas', JSON.stringify(this.tarefas));
        } catch (e) {
          console.error('Erro ao converter resposta da IA em JSON:', e, res.resposta);
        }
      },
      error: err => console.error('Erro ao gerar checklist da IA:', err),
    });
  }

  editarTarefa(index: number): void {
    const tarefa = this.tarefas[index];

    if (tarefa.editando) {
      // Se já está editando, finaliza a edição
      tarefa.editando = false;
      localStorage.setItem('checklistTarefas', JSON.stringify(this.tarefas));
    } else {
      // Ativa modo de edição
      tarefa.editando = true;
    }
  }

  removerTarefa(index: number): void {
    this.tarefas.splice(index, 1);
    localStorage.setItem('checklistTarefas', JSON.stringify(this.tarefas));
  }
  
  salvarChecklist(): void {
    localStorage.setItem('checklistTarefas', JSON.stringify(this.tarefas));
    console.log('Checklist salvo com sucesso!');
  }

}
