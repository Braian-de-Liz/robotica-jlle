export type StatusDeclaracao = 'aguardando' | 'aceito' | 'recusado';

export type TipoPinMapa = 'sediador' | 'escola' | 'fornecedor';

export interface PinMapa {
  id: string;
  nome: string;
  tipo: TipoPinMapa;
  subtitulo: string;
  detalhe: string;
  endereco: string;
  lat: number;
  lng: number;
}

export interface PostBlog {
  id: string;
  titulo: string;
  resumo: string;
  categoria: string;
  data: string;
  autor: string;
  imagemUrl: string;
}

export interface CardNoticia {
  id: string;
  tag: string;
  titulo: string;
  horario: string;
  corDestaque: 'blue' | 'purple' | 'red';
}

export interface ParticipanteInscrito {
  id: string;
  nome: string;
  idade: number;
  cpf: string;
  responsavelLegal: string;
  telefoneResponsavel: string;
  escolaNome: string;
  equipeId: string;
  equipeNome: string;
  modalidades: {
    nome: string;
    horario: string;
    ala: string;
    mesaPista: string;
  }[];
  qrCodeToken: string;
  arquivoDeclaracao: string;
  dataEnvioDeclaracao: string;
  statusDeclaracao: StatusDeclaracao;
  presencaConfirmada: boolean;
  horarioEntrada?: string;
}

export interface EquipeEscola {
  id: string;
  nome: string;
  escolaNome: string;
  modalidadePrincipal: string;
  modalidadeSecundaria?: string;
  mentorNome: string;
  mentorMatricula: string;
  voluntarioNome: string;
  alaAlocada: string;
  horarioPrincipal: string;
  alunosCount: number;
  avaliada: boolean;
  notaTotal?: number;
}

export interface PartidaChaveamento {
  id: string;
  modalidade: string;
  fase: 'quartas' | 'semifinal' | 'final';
  codigo: string;
  horario: string;
  ala: string;
  equipeA: string;
  pontosA: number | null;
  equipeB: string;
  pontosB: number | null;
  vencedor?: string;
  destaqueParticipante?: boolean;
}

export interface EmpateCategoria {
  id: string;
  categoria: string;
  ala: string;
  equipeA: string;
  escolaA: string;
  equipeB: string;
  escolaB: string;
  pontuacaoEmpatada: number;
  votosJuizes: {
    avaliadorNome: string;
    votoEquipe: string | null;
  }[];
  resolvido: boolean;
  vencedorDesempate?: string;
}

export interface MetaFornecedorKPI {
  id: string;
  itemRecurso: string;
  metaTotal: number;
  unidade: string;
  entregas: {
    fornecedorNome: string;
    quantidade: number;
  }[];
}

export interface ItemChecklistLocal {
  id: string;
  tipo: 'acessibilidade' | 'seguranca';
  titulo: string;
  setorAla: string;
  responsavel: string;
  conferido: boolean;
}

export interface ConvidadoPortaria {
  id: string;
  nome: string;
  telefone: string;
  horarioEntrada: string;
  voluntarioResponsavel: string;
}

export interface HorarioTorneioGrade {
  id: string;
  modalidade: string;
  fase: string;
  ala: string;
  horarioInicio: string;
  horarioFim: string;
  equipesEnvolvidas: string[];
}
