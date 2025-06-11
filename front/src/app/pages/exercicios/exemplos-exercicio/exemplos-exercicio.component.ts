import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Exemplo {
  numero: number;
  titulo: string;
  instrucoes: string;
  dados: string;
  link: string;
  gif: string;
}

@Component({
  selector: 'app-exemplos-exercicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exemplos-exercicio.component.html',
  styleUrls: ['./exemplos-exercicio.component.scss'],
})
export class ExemplosExercicioComponent {
  previewAtivo = false;
  previewTop = 100;
  previewLeft = 500;
  exemploSelecionado: Exemplo | null = null;
  esconderPreviewTimeout: any = null;

  exemplos: Exemplo[] = [
    {
      numero: 1,
      titulo: 'Elevação de Panturrilha',
      instrucoes: 'Fique em pé e levante os calcanhares, apoiando-se apenas na ponta dos pés. Mantenha por 2 segundos e desça lentamente. Faça 3 séries de 15 repetições.',
      dados: 'Fortalece a panturrilha, melhora a circulação e o equilíbrio. Pode ser feito até enquanto escova os dentes.',
      link: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
      gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Calf-Raise.gif',
    },
    {
      numero: 2,
      titulo: 'Agachamento',
      instrucoes: 'Fique em pé, afaste os pés na largura dos ombros e agache lentamente.',
      dados: 'Fortalece pernas e glúteos, melhora o equilíbrio e a mobilidade.',
      link: 'https://www.youtube.com/watch?v=aclHkVaku9U',
      gif: 'https://www.hipertrofia.org/blog/wp-content/uploads/2023/07/bodyweight-squat.gif',
    },
    {
      numero: 3,
      titulo: 'Prancha Abdominal',
      instrucoes: 'Mantenha o corpo reto apoiado nos cotovelos e dedos dos pés.',
      dados: 'Trabalha o core, melhora postura e estabilidade.',
      link: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
      gif: 'https://www.mundoboaforma.com.br/wp-content/uploads/2020/12/prancha-com-elevacao-das-pernas-prancha-aranha.gif',
    },
    {
      numero: 4,
      titulo: 'Polichinelos',
      instrucoes: 'Abra e feche braços e pernas em movimento sincronizado.',
      dados: 'Exercício aeróbico que melhora o condicionamento físico.',
      link: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
      gif: 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/jumping-jacks.gif',
    },
    {
      numero: 5,
      titulo: 'Flexão de Braço',
      instrucoes: 'Deitado com o corpo reto, flexione os braços até encostar o peito no chão.',
      dados: 'Fortalece peito, ombros e tríceps.',
      link: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
      gif: 'https://www.mundoboaforma.com.br/wp-content/uploads/2021/04/flexao-de-bracos.gif',
    },
    {
      numero: 6,
      titulo: 'Bicicleta no Ar (abdominal)',
      instrucoes: 'Deite de costas e simule o movimento de pedalar com as pernas.',
      dados: 'Trabalha abdominais e coordenação.',
      link: 'https://www.youtube.com/watch?v=9FGilxCbdz8',
      gif: 'https://www.hipertrofia.org/blog/wp-content/uploads/2024/08/abdominal-bicicleta.gif',
    },
    {
      numero: 7,
      titulo: 'Elevação de Pernas',
      instrucoes: 'Deite-se, levante as pernas retas e depois abaixe sem encostar no chão.',
      dados: 'Fortalece a região abdominal inferior.',
      link: 'https://www.youtube.com/watch?v=l4kQd9eWclE',
      gif: 'https://www.mundoboaforma.com.br/wp-content/uploads/2021/03/abdominal-no-chao-com-elevacao-de-pernas-esticadas.gif',
    },
    {
      numero: 8,
      titulo: 'Afundo (Passada)',
      instrucoes: 'Dê um passo à frente e agache até o joelho de trás quase tocar o chão. Volte e repita com a outra perna.',
      dados: 'Trabalha glúteos, quadríceps e equilíbrio.',
      link: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
      gif: 'https://www.hipertrofia.org/blog/wp-content/uploads/2021/12/lunge-with-twist.gif',
    },
    {
      numero: 9,
      titulo: 'Ponte Glútea',
      instrucoes: 'Deite de costas com os joelhos dobrados e eleve o quadril até formar uma linha reta dos ombros aos joelhos.',
      dados: 'Fortalece glúteos, lombar e isquiotibiais.',
      link: 'https://www.youtube.com/watch?v=8bbE64NuDTU',
      gif: 'https://www.mundoboaforma.com.br/wp-content/uploads/2020/11/ponte-para-gluteos-1.gif',
    },
    {
      numero: 10,
      titulo: 'Abdominal Oblíquo',
      instrucoes: 'Deite com as mãos atrás da cabeça e leve o cotovelo em direção ao joelho oposto.',
      dados: 'Trabalha a lateral do abdômen (oblíquos).',
      link: 'https://www.youtube.com/watch?v=rIDpHOVDe-Q',
      gif: 'https://www.mundoboaforma.com.br/wp-content/uploads/2021/09/abdominal-obliquo-lateral-no-solo.gif',
    }
  ];

  mostrarPreview(exemplo: Exemplo, event: MouseEvent): void {
    clearTimeout(this.esconderPreviewTimeout);

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    this.exemploSelecionado = exemplo;
    this.previewTop = rect.top + window.scrollY - 180;
    this.previewLeft = rect.left + window.scrollX + rect.width / 2 - 150;

    this.previewAtivo = true;
  }

  esconderPreviewComDelay(): void {
    clearTimeout(this.esconderPreviewTimeout);
    this.esconderPreviewTimeout = setTimeout(() => {
      this.previewAtivo = false;
      this.exemploSelecionado = null;
    }, 200);
  }

  cancelarEsconderPreview(): void {
    clearTimeout(this.esconderPreviewTimeout);
  }
}
