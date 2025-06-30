import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calculo-imc',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './calculo-imc.component.html',
  styleUrls: ['./calculo-imc.component.scss']
})
export class CalculoImcComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  resultado: number | null = null;
  registros: any[] = [];
  classificacao: string = '';
  idade: number = 0;
  sexo: string = '';
  maxDate: Date = new Date();
  dataChecklist: Date = new Date();

  constructor(private fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      altura: [null, [Validators.required, Validators.min(0.1)]],
      peso: [null, [Validators.required, Validators.min(0.1)]],
      data_consulta: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.consultaImcBase().subscribe({
      next: (dados) => {
        this.registros = dados;
        if (this.registros.length > 0) {
          const usuario = this.registros[0];
          this.idade = usuario.idade;
          this.sexo = usuario.sexo;
        }
      },
      error: (err) => console.error('Erro ao consultar IMC base:', err)
    });
  }

  getLocalDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  consultaImcBase(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:8000/imc_base_dashboard/', { headers });
  }

  calcularIMC(): void {
    if (this.form.valid) {
      const { peso, altura } = this.form.value;
      let data_consulta = this.form.value.data_consulta;
      if (data_consulta instanceof Date) {
        data_consulta = data_consulta.toISOString().split('T')[0];
      }
      const payload = { peso, altura, data_consulta, idade: this.idade, sexo: this.sexo };

      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post<any>('http://localhost:8000/imc/', payload, { headers }).subscribe({
        next: (resposta) => {
          this.resultado = resposta.imc_res;
          this.classificacao = resposta.classificacao;
          this.form.reset({ data_consulta: new Date() }); // reseta form com data atual

          this.snackBar.open('IMC registrado com sucesso!', '', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-sucesso']
          });
        },
        error: (err) => {
          console.error('Erro ao salvar/calcular IMC:', err);
          this.snackBar.open('Erro ao calcular o IMC.', '', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-erro']
          });
        }
      });
    }
  }
}
