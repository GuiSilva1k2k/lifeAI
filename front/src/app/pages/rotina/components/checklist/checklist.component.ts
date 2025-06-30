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

import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { ChecklistService } from '../../../../api/checklist.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface atividade {
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
    MatIconModule,
    MatSnackBarModule

  ],
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
})
export class ChecklistComponent implements OnInit {
  atividades: atividade[] = [];
  sessaoId: string = '';
  pessoa: any = null;

  novaTarefa: string = '';
  dataChecklist: Date = new Date();

  constructor(
    private imcBaseService: ImcBaseService,
    private iaService: IaService,
    private checklistService: ChecklistService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.sessaoId = uuidv4();

    const salvas = localStorage.getItem('checklistTarefas');
    if (salvas) {
      this.atividades = JSON.parse(salvas);
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

    this.atividades.push({ nome, feito: false });
    this.novaTarefa = '';
    // localStorage.setItem('checklistTarefas', JSON.stringify(this.atividade));
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
          this.atividades = Array.isArray(respostaJson) ? respostaJson.slice(0, 8) : [];
          // localStorage.setItem('checklistTarefas', JSON.stringify(this.atividade));
        } catch (e) {
          console.error('Erro ao converter resposta da IA em JSON:', e, res.resposta);
        }
      },
      error: err => console.error('Erro ao gerar checklist da IA:', err),
    });
  }

  editarTarefa(index: number): void {
    const tarefa = this.atividades[index];

    if (tarefa.editando) {
      tarefa.editando = false;
      // localStorage.setItem('checklistTarefas', JSON.stringify(this.atividade));
    } else {
      tarefa.editando = true;
    }
  }

  removerTarefa(index: number): void {
    this.atividades.splice(index, 1);
    // localStorage.setItem('checklistTarefas', JSON.stringify(this.atividade));
  }
  
  salvarChecklist(): void {
    if (this.atividades.length === 0) {
      this.snackBar.open('Adicione ao menos uma tarefa antes de salvar o checklist!', '', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-erro']
      });
      return;
    }
    const data = this.dataChecklist.toISOString().split('T')[0];

    const novoChecklist = {
      data: data,
      atividades: this.atividades.map(tarefa => ({
        descricao: tarefa.nome,
        done: tarefa.feito
      }))
    };

    this.checklistService.criarChecklist(novoChecklist).subscribe({
      next: () => {
        console.log('Checklist criado com sucesso!');
        localStorage.removeItem('checklistTarefas');

        this.atividades = [];
        this.novaTarefa = '';
        this.dataChecklist = new Date();
        this.snackBar.open('Checklist criado com sucesso!', '', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-sucesso']
        });
      },
      error: err => {
        console.error('Erro ao criar checklist', err);

        this.snackBar.open('Erro ao criar o checklist!', '', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-erro']
        });
      }
    });
  }
  
}
