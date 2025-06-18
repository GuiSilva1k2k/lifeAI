import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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
export class CalculoImcComponent {
  form: FormGroup;
  resultado: number | null = null;
  classificacao: string = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      idade: [null, [Validators.required, Validators.min(1)]],
      altura: [null, [Validators.required, Validators.min(0.1)]],
      peso: [null, [Validators.required, Validators.min(0.1)]],
    });
  }

  calcularIMC(): void {
    if (this.form.valid) {
      const { peso, altura } = this.form.value;
      this.resultado = peso / (altura * altura);
      this.classificacao = this.getClassificacao(this.resultado);
    }
  }

  getClassificacao(imc: number): string {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 24.9) return 'Peso normal';
    if (imc < 29.9) return 'Sobrepeso';
    return 'Obesidade';
  }
}
