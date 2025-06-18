import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calculo-imc',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      altura: [null, [Validators.required, Validators.min(0.1)]],
      peso: [null, [Validators.required, Validators.min(0.1)]],
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

  consultaImcBase(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:8000/imc_base_dashboard/', { headers });
  }

  calcularIMC(): void {
    if (this.form.valid) {
      const { peso, altura } = this.form.value;

      const payload = {
        peso,
        altura,
        idade: this.idade,
        sexo: this.sexo
      };

      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post<any>('http://localhost:8000/imc/', payload, { headers }).subscribe({
        next: (resposta) => {
          this.resultado = resposta.imc_valor;
          this.classificacao = resposta.classificacao;
          console.log('IMC salvo com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao salvar/calcular IMC:', err);
        }
      });

      this.form.reset();
    }
  }
}
