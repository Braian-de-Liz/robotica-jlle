import {
  CalendarClock,
  ClipboardList,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  ListChecks,
  Map as MapIcon,
  Network,
  PackageCheck,
  Scale,
  ScanLine,
  ShieldCheck,
  Ticket,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { PerfilAcesso } from '../types/cjr';

export interface PerfilInfo {
  id: PerfilAcesso;
  area: string;
  oQueFaz: string;
  usuarioNome: string;
  cargo: string;
  sigla: string;
  email: string;
}

export const PERFIS: Record<PerfilAcesso, PerfilInfo> = {
  participante: {
    id: 'participante',
    area: 'Participante',
    oQueFaz: 'Agenda, declaração dos responsáveis e ingresso',
    usuarioNome: 'Lucas Gabriel Ferreira',
    cargo: 'Competidor, 9º ano',
    sigla: 'LG',
    email: 'lucas.ferreira@exemplo.org',
  },
  escola: {
    id: 'escola',
    area: 'Escola',
    oQueFaz: 'Equipes, declarações, mentores e voluntários',
    usuarioNome: 'E.M. Araucária',
    cargo: 'Direção escolar',
    sigla: 'AR',
    email: 'escola.araucaria@exemplo.org',
  },
  avaliador: {
    id: 'avaliador',
    area: 'Avaliador',
    oQueFaz: 'Notas das equipes e votos de desempate',
    usuarioNome: 'Eng. Rafael Zimmermann',
    cargo: 'Avaliador da banca',
    sigla: 'RZ',
    email: 'rafael.avaliador@exemplo.org',
  },
  organizador: {
    id: 'organizador',
    area: 'Organização',
    oQueFaz: 'Fornecimento, vistoria, mapa e grade de horários',
    usuarioNome: 'Coordenação SED',
    cargo: 'Organização do evento',
    sigla: 'SD',
    email: 'organizacao@exemplo.org',
  },
  voluntario: {
    id: 'voluntario',
    area: 'Portaria',
    oQueFaz: 'Leitura de ingressos e entrada de convidados',
    usuarioNome: 'Beatriz Helena Souza',
    cargo: 'Voluntária na portaria',
    sigla: 'BH',
    email: 'beatriz.portaria@exemplo.org',
  },
};

export const ORDEM_PERFIS: PerfilAcesso[] = ['participante', 'escola', 'avaliador', 'organizador', 'voluntario'];

export interface ItemNav {
  id: string;
  rotulo: string;
  curto?: string;
  icone: LucideIcon;
}

export const NAVEGACAO: Record<PerfilAcesso, ItemNav[]> = {
  participante: [
    { id: 'agenda', rotulo: 'Minha agenda', curto: 'Agenda', icone: CalendarClock },
    { id: 'declaracao', rotulo: 'Declaração', icone: FileText },
    { id: 'ingresso', rotulo: 'Ingresso', icone: Ticket },
    { id: 'chaveamento', rotulo: 'Chaveamento', curto: 'Chaves', icone: Network },
  ],
  escola: [
    { id: 'resumo', rotulo: 'Resumo', icone: LayoutDashboard },
    { id: 'declaracoes', rotulo: 'Declarações', icone: FileText },
    { id: 'equipes', rotulo: 'Equipes', icone: Users },
    { id: 'apoio', rotulo: 'Mentores e voluntários', curto: 'Apoio', icone: HeartHandshake },
  ],
  avaliador: [
    { id: 'fila', rotulo: 'Fila de avaliação', curto: 'Fila', icone: ListChecks },
    { id: 'avaliar', rotulo: 'Avaliar equipe', curto: 'Avaliar', icone: ClipboardList },
    { id: 'desempate', rotulo: 'Desempate', icone: Scale },
    { id: 'chaveamento', rotulo: 'Chaveamento', curto: 'Chaves', icone: Network },
  ],
  organizador: [
    { id: 'resumo', rotulo: 'Resumo do evento', curto: 'Resumo', icone: LayoutDashboard },
    { id: 'mapa', rotulo: 'Mapa', icone: MapIcon },
    { id: 'fornecimento', rotulo: 'Fornecimento', curto: 'Entregas', icone: PackageCheck },
    { id: 'vistoria', rotulo: 'Vistoria do local', curto: 'Vistoria', icone: ShieldCheck },
    { id: 'horarios', rotulo: 'Grade de horários', curto: 'Horários', icone: CalendarClock },
  ],
  voluntario: [
    { id: 'leitor', rotulo: 'Leitor de ingresso', curto: 'Leitor', icone: ScanLine },
    { id: 'convidados', rotulo: 'Convidados', icone: UserPlus },
  ],
};

export const perfilPorEmail = (email: string): PerfilAcesso | null => {
  const alvo = email.trim().toLowerCase();
  return ORDEM_PERFIS.find((id) => PERFIS[id].email === alvo) ?? null;
};
