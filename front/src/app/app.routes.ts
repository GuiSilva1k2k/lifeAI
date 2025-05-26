import { Routes } from '@angular/router';
import { AuthGuard } from './api/auth.guard';

import { HomeComponent } from './pages/home/home.component';
import { ChatIaComponent } from './pages/chat-ia/chat-ia.component';
import { ConfigComponent } from './pages/config/config.component';
import { ExerciciosComponent } from './pages/exercicios/exercicios.component';
import { IndexComponent } from './pages/index/index.component';
import { RotinaComponent } from './pages/rotina/rotina.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { GraficoComponent } from './pages/home/grafico/grafico.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { ResumoComponent } from './pages/home/resumo/resumo.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },  // página pública
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'chat-ia', component: ChatIaComponent, canActivate: [AuthGuard] },
  { path: 'config', component: ConfigComponent, canActivate: [AuthGuard] },
  { path: 'exercicios', component: ExerciciosComponent, canActivate: [AuthGuard] },
  { path: 'grafico', component: GraficoComponent, canActivate: [AuthGuard] },
  { path: 'resumo', component: ResumoComponent, canActivate: [AuthGuard] },
  { path: 'chatbot', component: ChatbotComponent, canActivate: [AuthGuard] },
  { path: 'side', component: SidebarComponent, canActivate: [AuthGuard] },
  { path: 'rotina', component: RotinaComponent, canActivate: [AuthGuard] },
];

