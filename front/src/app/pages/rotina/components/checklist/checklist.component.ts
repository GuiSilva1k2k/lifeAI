import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImcBaseService } from '../../../../api/imc_perfil_base.service';
import { IaService } from '../../../../api/ia.service';
import { v4 as uuidv4 } from 'uuid';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

interface Tarefa {
  nome: string;
  feito: boolean;
}

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
})
export class ChecklistComponent implements OnInit {
  tarefas: Tarefa[] = [];
  sessaoId: string = '';
  pessoa: any = null;

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
}
