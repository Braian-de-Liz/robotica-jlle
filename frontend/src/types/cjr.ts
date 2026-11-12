export type StatusDeclaracao = 'aguardando' | 'aceito' | 'recusado';

export type PerfilAcesso = 'participante' | 'escola' | 'avaliador' | 'organizador' | 'voluntario';

export type TipoPinMapa = 'sediador' | 'escola' | 'fornecedor';

export interface PinMapa {
  id: string;
  nome: string;
  tipo: TipoPinMapa;
  papel: string;
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

export interface Aviso {
  id: string;
  assunto: string;
  texto: string;
  quando: string;
}

export interface SessaoDisputa {
  hora: string;
  rotulo: string;
  duracao: string;
}

export interface ModalidadeInscrita {
  nome: string;
  ala: string;
  local: string;
  sessoes: SessaoDisputa[];
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
  modalidades: ModalidadeInscrita[];
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
  local: string;
  horarioPrincipal: string;
  alunosCount: number;
  avaliada: boolean;
  notaTotal?: number;
}

export interface MentorEscola {
  id: string;
  nome: string;
  area: string;
}

export interface VoluntarioEscola {
  id: string;
  nome: string;
  alocacao: string;
  telefone: string;
}

export type FaseChaveamento = 'quartas' | 'semifinal' | 'final';

export interface PartidaChaveamento {
  id: string;
  fase: FaseChaveamento;
  codigo: string;
  horario: string;
  local: string;
  equipeA: string;
  pontosA: number | null;
  equipeB: string;
  pontosB: number | null;
  vencedor?: string;
}

export interface EmpateCategoria {
  id: string;
  categoria: string;
  local: string;
  equipeA: string;
  escolaA: string;
  equipeB: string;
  escolaB: string;
  pontuacaoEmpatada: number;
  votosJuizes: {
    avaliadorNome: string;
    instituicao: string;
    voce?: boolean;
    votoEquipe: string | null;
  }[];
  resolvido: boolean;
  vencedorDesempate?: string;
}

export interface MetaFornecimento {
  id: string;
  item: string;
  detalhe: string;
  metaTotal: number;
  unidade: string;
  entregas: {
    fornecedorNome: string;
    quantidade: number;
  }[];
}

export interface ItemVistoria {
  id: string;
  tipo: 'acessibilidade' | 'seguranca';
  titulo: string;
  setor: string;
  responsavel: string;
  conferido: boolean;
}

export interface ConvidadoPortaria {
  id: string;
  nome: string;
  telefone: string;
  horarioEntrada: string;
  atendente: string;
}

export interface JanelaHorario {
  id: string;
  titulo: string;
  detalhe: string;
  ala: string;
  inicio: string;
  fim: string;
  equipes: string[];
}

export interface EdicaoCampeonato {
  ano: number;
  numero: number;
  equipes: number;
  escolas?: number;
  tema: string;
  sede: string;
}

export interface ModalidadeOficial {
  id: string;
  nome: string;
  campo: 'mesa' | 'mesa-linha' | 'sumo' | 'hexagono' | 'folha' | 'estande';
  medida: string;
  descricao: string;
  formato: string;
}
