import {
  PinMapa,
  PostBlog,
  Aviso,
  ParticipanteInscrito,
  EquipeEscola,
  MentorEscola,
  VoluntarioEscola,
  PartidaChaveamento,
  EmpateCategoria,
  MetaFornecimento,
  ItemVistoria,
  ConvidadoPortaria,
  JanelaHorario,
  EdicaoCampeonato,
  ModalidadeOficial,
} from '../types/cjr';

/* ---------------------------------------------------------------------------
   Dados de demonstração. Enquanto a API não estiver ligada ao frontend,
   todas as telas leem e alteram estes registros em memória.

   Regra do regulamento do hackathon (seção 9) e do briefing do Desafio 01:
   só dados fictícios ou anonimizados. Escolas, equipes, pessoas, telefones,
   documentos e fornecedores abaixo são inventados. Nomes reais de escolas,
   menores e servidores só podem entrar com autorização institucional.

   Fatos institucionais usados (fonte: regulamento e briefing, 10/11/2026):
   6ª edição em 2026, 69 equipes, 35 escolas, mais de 250 estudantes.
   Mesas, arenas, quantidades por categoria e divisão do dia vêm do ETP
   SEI nº 0020793169/2024 (public/edital_cjr.pdf).
   --------------------------------------------------------------------------- */

export const EVENTO = {
  edicao: 6,
  ano: 2026,
  nome: 'Campeonato Joinvilense de Robótica',
  tema: 'Planeta em alerta: soluções para desastres naturais e ambientais',
  sede: 'Expocentro Edmundo Doubrawa',
  enderecoSede: 'Av. José Vieira, 315, América, Joinville/SC',
  horario: 'das 9h às 18h',
  processoSei: '24.0.032221-4',
  editalSei: '0020793169/2024',
  equipes: 69,
  escolas: 35,
  /** O regulamento informa "mais de 250 estudantes"; o número exato não foi divulgado. */
  estudantesMinimo: 250,
  mesasEArenas: 16,
};

/** Caminho do modelo da declaração dos responsáveis (PDF em /public). Enquanto for null,
    o painel do participante avisa que o modelo ainda não foi publicado. */
export const MODELO_DECLARACAO_URL: string | null = null;

/** Escola usada pelo perfil de demonstração "Escola". */
export const ESCOLA_LOGADA = 'E.M. Araucária';

/** Visitantes já contabilizados na portaria antes dos registros desta sessão. */
export const PUBLICO_BASE = 408;

export const MODALIDADES: ModalidadeOficial[] = [
  {
    id: 'lego',
    nome: 'Robótica LEGO',
    campo: 'mesa',
    medida: '2357 × 1143 mm',
    descricao: 'O robô cumpre missões sobre o tapete oficial, em mesas feitas sob medida.',
    formato: 'Até 15 equipes, 4 mesas',
  },
  {
    id: 'microbit',
    nome: 'Robótica Micro:bit',
    campo: 'mesa',
    medida: '2357 × 1143 mm',
    descricao: 'Mesmas mesas da LEGO, com robôs programados em placas Micro:bit.',
    formato: 'Até 15 equipes, 4 mesas',
  },
  {
    id: 'linha',
    nome: 'Seguidor de Linha',
    campo: 'mesa-linha',
    medida: '2357 × 1143 mm',
    descricao: 'Percurso autônomo: vence quem completa a pista com mais velocidade e precisão.',
    formato: 'Até 15 equipes, 4 mesas',
  },
  {
    id: 'sumo',
    nome: 'Robótica Sumô',
    campo: 'sumo',
    medida: 'Ø 160 cm',
    descricao: 'Dois robôs na arena circular. Ganha quem empurra o adversário para fora.',
    formato: 'Até 10 equipes, 2 arenas',
  },
  {
    id: 'balao',
    nome: 'Estoura Balão',
    campo: 'hexagono',
    medida: '1660 mm',
    descricao: 'Disputa direta em arena hexagonal: o robô precisa estourar o balão do oponente.',
    formato: 'Até 10 equipes, 2 arenas',
  },
  {
    id: 'artbot',
    nome: 'ArtBot',
    campo: 'folha',
    medida: 'Espaço criativo',
    descricao: 'Robôs que desenham. A banca avalia a criatividade e a construção.',
    formato: 'Apresentação para a banca',
  },
  {
    id: 'projeto',
    nome: 'Projeto de Tecnologia Educacional',
    campo: 'estande',
    medida: 'Estande',
    descricao: 'Protótipos que respondem ao tema do ano, apresentados e defendidos pela equipe.',
    formato: 'Apresentação para a banca',
  },
];

export const EDICOES: EdicaoCampeonato[] = [
  { ano: 2021, numero: 1, equipes: 7, tema: 'Implantação dos clubes de robótica', sede: 'Rede municipal' },
  { ano: 2022, numero: 2, equipes: 21, tema: 'Implantação dos clubes de robótica', sede: 'Rede municipal' },
  { ano: 2023, numero: 3, equipes: 42, tema: 'Implantação dos clubes de robótica', sede: 'Rede municipal' },
  { ano: 2024, numero: 4, equipes: 91, escolas: 37, tema: 'Uso consciente de telas', sede: 'Campus Park' },
  { ano: 2025, numero: 5, equipes: 72, escolas: 30, tema: 'Casa do futuro', sede: 'Expocentro Edmundo Doubrawa' },
  {
    ano: 2026,
    numero: 6,
    equipes: 69,
    escolas: 35,
    tema: 'Planeta em alerta',
    sede: 'Expocentro Edmundo Doubrawa',
  },
];

/** Divisão das 9 horas do dia de competição, conforme o edital. */
export const CARGA_DO_DIA = [
  { rotulo: 'Treinos e ajustes', minutos: 240 },
  { rotulo: 'Rounds oficiais', minutos: 150 },
  { rotulo: 'Almoço', minutos: 90 },
  { rotulo: 'Abertura e premiação', minutos: 60 },
];

/** Programação resumida exibida no site público. */
export const PROGRAMACAO_PUBLICA = [
  { hora: '09:00', titulo: 'Abertura', local: 'Arena Central' },
  { hora: '09:30', titulo: 'Treinos e ajustes', local: 'Alas 01, 02 e 03' },
  { hora: '12:00', titulo: 'Almoço', local: 'Refeitório' },
  { hora: '13:30', titulo: 'Rounds de LEGO e Micro:bit', local: 'Ala 01' },
  { hora: '14:45', titulo: 'Rounds de Linha, Sumô e Balão', local: 'Ala 02' },
  { hora: '16:30', titulo: 'Grande final e premiação', local: 'Arena Central' },
];

export const INITIAL_POSTS_BLOG: PostBlog[] = [
  {
    id: 'post-1',
    titulo: 'CJR 2026 reúne 69 equipes de 35 escolas em sete modalidades',
    resumo:
      'Mais de 250 estudantes do Ensino Fundamental e da EJA participam da 6ª edição, com 12 mesas oficiais de robótica e arenas exclusivas para Sumô e Estoura Balão.',
    categoria: 'Estrutura',
    data: '11 nov 2026',
    autor: 'Secretaria de Educação',
    imagemUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=70',
  },
  {
    id: 'post-2',
    titulo: 'Como serão as disputas: três rounds oficiais de 3 minutos e três treinos de 10',
    resumo:
      'A programação das 9h às 18h reserva 2h30 para rounds oficiais sem sobreposição entre categorias, 4h de treinos e ajustes, 1h30 de almoço e 1h de cerimônias.',
    categoria: 'Regulamento',
    data: '10 nov 2026',
    autor: 'Comissão técnica do CJR',
    imagemUrl: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=900&q=70',
  },
  {
    id: 'post-3',
    titulo: 'Depois do campeonato, as mesas vão para os Laboratórios Maker de 12 escolas',
    resumo:
      'Fora do período de competição, o mobiliário oficial fica nas escolas municipais para uso contínuo nos clubes de robótica e nas aulas do ensino regular.',
    categoria: 'Legado',
    data: '8 nov 2026',
    autor: 'Programa Somos Digitais',
    imagemUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=70',
  },
];

export const INITIAL_AVISOS: Aviso[] = [
  {
    id: 'aviso-1',
    assunto: 'Portaria',
    texto: 'Ingressos digitais liberados para alunos com a declaração dos responsáveis aceita pela escola.',
    quando: 'há 15 min',
  },
  {
    id: 'aviso-2',
    assunto: 'Rounds oficiais',
    texto: 'Cada equipe faz três treinos de 10 minutos e três rounds oficiais de 3 minutos nas Alas 01 e 02.',
    quando: 'há 30 min',
  },
  {
    id: 'aviso-3',
    assunto: 'Edital',
    texto: 'Medidas das arenas de Sumô (160 cm) e Estoura Balão (hexagonal, 1660 mm) foram homologadas.',
    quando: 'há 1 hora',
  },
];

export const INITIAL_PARTICIPANTES: ParticipanteInscrito[] = [
  {
    id: 'part-1',
    nome: 'Lucas Gabriel Ferreira',
    idade: 13,
    cpf: '114.892.309-12',
    responsavelLegal: 'Ana Paula Ferreira (mãe)',
    telefoneResponsavel: '(47) 99912-4410',
    escolaNome: 'E.M. Araucária',
    equipeId: 'eq-1',
    equipeNome: 'JoinvilleBot Alpha',
    modalidades: [
      {
        nome: 'Robótica LEGO',
        ala: 'Ala 01',
        local: 'Mesa 02',
        sessoes: [
          { hora: '09:15', rotulo: 'Treino', duracao: '10 min' },
          { hora: '10:30', rotulo: 'Round oficial 1', duracao: '3 min' },
        ],
      },
      {
        nome: 'Seguidor de Linha',
        ala: 'Ala 02',
        local: 'Mesa 09',
        sessoes: [{ hora: '14:00', rotulo: 'Round oficial', duracao: '3 min' }],
      },
    ],
    qrCodeToken: 'CJR-2026-ALUNO-8841',
    arquivoDeclaracao: 'declaracao_assinada_lucas_gabriel.pdf',
    dataEnvioDeclaracao: '10/11/2026 às 16:42',
    statusDeclaracao: 'aceito',
    presencaConfirmada: true,
    horarioEntrada: '08:14',
  },
  {
    id: 'part-2',
    nome: 'Mariana Costa',
    idade: 12,
    cpf: '128.441.909-05',
    responsavelLegal: 'Roberto Carlos Costa (pai)',
    telefoneResponsavel: '(47) 98831-1029',
    escolaNome: 'E.M. Araucária',
    equipeId: 'eq-1',
    equipeNome: 'JoinvilleBot Alpha',
    modalidades: [
      {
        nome: 'Robótica LEGO',
        ala: 'Ala 01',
        local: 'Mesa 02',
        sessoes: [
          { hora: '09:15', rotulo: 'Treino', duracao: '10 min' },
          { hora: '10:30', rotulo: 'Round oficial 1', duracao: '3 min' },
        ],
      },
    ],
    qrCodeToken: 'CJR-2026-ALUNO-8842',
    arquivoDeclaracao: 'termo_pais_mariana_costa.pdf',
    dataEnvioDeclaracao: '11/11/2026 às 07:50',
    statusDeclaracao: 'aguardando',
    presencaConfirmada: false,
  },
  {
    id: 'part-3',
    nome: 'Pedro Henrique Souza',
    idade: 14,
    cpf: '139.502.119-80',
    responsavelLegal: 'Cláudia Souza (mãe)',
    telefoneResponsavel: '(47) 99104-8821',
    escolaNome: 'E.M. Araucária',
    equipeId: 'eq-2',
    equipeNome: 'Araucária Micro:Makers',
    modalidades: [
      {
        nome: 'Robótica Micro:bit',
        ala: 'Ala 01',
        local: 'Mesa 06',
        sessoes: [{ hora: '11:00', rotulo: 'Round oficial', duracao: '3 min' }],
      },
    ],
    qrCodeToken: 'CJR-2026-ALUNO-8843',
    arquivoDeclaracao: 'declaracao_pedro_sem_assinatura.pdf',
    dataEnvioDeclaracao: '09/11/2026 às 19:15',
    statusDeclaracao: 'recusado',
    presencaConfirmada: false,
  },
  {
    id: 'part-4',
    nome: 'Sofia Helena Lima',
    idade: 13,
    cpf: '142.778.319-44',
    responsavelLegal: 'Marcos Lima (pai)',
    telefoneResponsavel: '(47) 99711-2030',
    escolaNome: 'E.M. Mata Atlântica',
    equipeId: 'eq-3',
    equipeNome: 'EcoBot Joinville',
    modalidades: [
      {
        nome: 'Robótica Sumô',
        ala: 'Ala 02',
        local: 'Arena de Sumô 01',
        sessoes: [{ hora: '15:00', rotulo: 'Disputa direta', duracao: '3 min' }],
      },
    ],
    qrCodeToken: 'CJR-2026-ALUNO-9012',
    arquivoDeclaracao: 'declaracao_sofia_lima_assinada.pdf',
    dataEnvioDeclaracao: '10/11/2026 às 14:20',
    statusDeclaracao: 'aceito',
    presencaConfirmada: false,
  },
];

export const INITIAL_EQUIPES: EquipeEscola[] = [
  {
    id: 'eq-1',
    nome: 'JoinvilleBot Alpha',
    escolaNome: 'E.M. Araucária',
    modalidadePrincipal: 'Robótica LEGO',
    modalidadeSecundaria: 'Seguidor de Linha',
    mentorNome: 'Prof. Marcos Vinícius Silva',
    local: 'Alas 01 e 02',
    horarioPrincipal: '10:30',
    alunosCount: 4,
    avaliada: true,
    notaTotal: 92.5,
  },
  {
    id: 'eq-2',
    nome: 'Araucária Micro:Makers',
    escolaNome: 'E.M. Araucária',
    modalidadePrincipal: 'Robótica Micro:bit',
    mentorNome: 'Profa. Juliana K. Althoff',
    local: 'Ala 01, Mesa 06',
    horarioPrincipal: '11:00',
    alunosCount: 4,
    avaliada: false,
  },
  {
    id: 'eq-5',
    nome: 'ArtMakers Júnior',
    escolaNome: 'E.M. Monte Claro',
    modalidadePrincipal: 'ArtBot',
    mentorNome: 'Prof. Leonardo Krüger',
    local: 'Ala 03, Espaço criativo',
    horarioPrincipal: '11:30',
    alunosCount: 3,
    avaliada: false,
  },
  {
    id: 'eq-6',
    nome: 'TechSul E.M.',
    escolaNome: 'E.M. Beira-Rio',
    modalidadePrincipal: 'Seguidor de Linha',
    mentorNome: 'Prof. Gustavo Lindner',
    local: 'Ala 02, Mesa 10',
    horarioPrincipal: '14:00',
    alunosCount: 4,
    avaliada: true,
    notaTotal: 92.5,
  },
  {
    id: 'eq-3',
    nome: 'EcoBot Joinville',
    escolaNome: 'E.M. Mata Atlântica',
    modalidadePrincipal: 'Robótica Sumô',
    mentorNome: 'Prof. Ricardo Steuernagel',
    local: 'Ala 02, Arena de Sumô 01',
    horarioPrincipal: '15:00',
    alunosCount: 4,
    avaliada: false,
  },
  {
    id: 'eq-4',
    nome: 'Guardiões do Rio Cachoeira',
    escolaNome: 'E.M. Vale Verde',
    modalidadePrincipal: 'Estoura Balão',
    mentorNome: 'Profa. Patrícia Moser',
    local: 'Ala 02, Arena hexagonal 01',
    horarioPrincipal: '15:30',
    alunosCount: 4,
    avaliada: false,
  },
];

export const INITIAL_MENTORES: MentorEscola[] = [
  { id: 'm-1', nome: 'Prof. Marcos Vinícius Silva', area: 'Robótica LEGO e Seguidor de Linha' },
  { id: 'm-2', nome: 'Profa. Juliana K. Althoff', area: 'Robótica Micro:bit' },
];

export const INITIAL_VOLUNTARIOS: VoluntarioEscola[] = [
  { id: 'v-1', nome: 'Beatriz Helena Souza', alocacao: 'Portaria e credenciamento', telefone: '(47) 99941-2088' },
  { id: 'v-2', nome: 'Carlos Eduardo Nunes', alocacao: 'Apoio de arena, Ala 01', telefone: '(47) 99812-3390' },
];

export const CHAVEAMENTO = {
  modalidade: 'Robótica LEGO',
  local: 'Ala 01',
  partidas: [
    {
      id: 'match-q1',
      fase: 'quartas',
      codigo: 'Quartas 1',
      horario: '11:00',
      local: 'Mesa 01',
      equipeA: 'JoinvilleBot Alpha',
      pontosA: 240,
      equipeB: 'CyberNorte E.M.',
      pontosB: 195,
      vencedor: 'JoinvilleBot Alpha',
    },
    {
      id: 'match-q2',
      fase: 'quartas',
      codigo: 'Quartas 2',
      horario: '11:20',
      local: 'Mesa 02',
      equipeA: 'Mecatrônica Mata Atlântica',
      pontosA: 220,
      equipeB: 'RoboSul EJA',
      pontosB: 185,
      vencedor: 'Mecatrônica Mata Atlântica',
    },
    {
      id: 'match-q3',
      fase: 'quartas',
      codigo: 'Quartas 3',
      horario: '11:40',
      local: 'Mesa 03',
      equipeA: 'EcoBot Joinville',
      pontosA: 210,
      equipeB: 'InovaPirabeiraba',
      pontosB: 190,
      vencedor: 'EcoBot Joinville',
    },
    {
      id: 'match-q4',
      fase: 'quartas',
      codigo: 'Quartas 4',
      horario: '12:00',
      local: 'Mesa 04',
      equipeA: 'TechSul E.M.',
      pontosA: 230,
      equipeB: 'Aventureiros LEGO',
      pontosB: 205,
      vencedor: 'TechSul E.M.',
    },
    {
      id: 'match-s1',
      fase: 'semifinal',
      codigo: 'Semifinal A',
      horario: '14:45',
      local: 'Mesa principal',
      equipeA: 'JoinvilleBot Alpha',
      pontosA: null,
      equipeB: 'Mecatrônica Mata Atlântica',
      pontosB: null,
    },
    {
      id: 'match-s2',
      fase: 'semifinal',
      codigo: 'Semifinal B',
      horario: '15:15',
      local: 'Mesa principal',
      equipeA: 'EcoBot Joinville',
      pontosA: null,
      equipeB: 'TechSul E.M.',
      pontosB: null,
    },
    {
      id: 'match-f1',
      fase: 'final',
      codigo: 'Grande final',
      horario: '16:30',
      local: 'Arena Central',
      equipeA: 'Vencedor da semifinal A',
      pontosA: null,
      equipeB: 'Vencedor da semifinal B',
      pontosB: null,
    },
  ] as PartidaChaveamento[],
};

export const INITIAL_EMPATE: EmpateCategoria = {
  id: 'tie-1',
  categoria: 'Seguidor de Linha',
  local: 'Ala 02, Mesa 09',
  equipeA: 'JoinvilleBot Alpha',
  escolaA: 'E.M. Araucária',
  equipeB: 'TechSul E.M.',
  escolaB: 'E.M. Beira-Rio',
  pontuacaoEmpatada: 92.5,
  votosJuizes: [
    { avaliadorNome: 'Dra. Helena Schulz', instituicao: 'Avaliadora convidada', votoEquipe: 'JoinvilleBot Alpha' },
    { avaliadorNome: 'Eng. Rafael Zimmermann', instituicao: 'Você', voce: true, votoEquipe: null },
    { avaliadorNome: 'Prof. Leandro Bauer', instituicao: 'Avaliador convidado', votoEquipe: 'TechSul E.M.' },
  ],
  resolvido: false,
};

export const INITIAL_METAS: MetaFornecimento[] = [
  {
    id: 'meta-1',
    item: 'Kits de alimentação',
    detalhe: 'Lanches para o intervalo de almoço (1h30)',
    metaTotal: 200,
    unidade: 'kits',
    entregas: [
      { fornecedorNome: 'Padaria & Catering Joinville', quantidade: 100 },
      { fornecedorNome: 'Sucos & Bebidas Sul', quantidade: 50 },
    ],
  },
  {
    id: 'meta-2',
    item: 'Mesas de robótica',
    detalhe: 'Item 43504, 2357 × 1143 mm (LEGO, Micro:bit e Linha)',
    metaTotal: 12,
    unidade: 'mesas',
    entregas: [{ fornecedorNome: 'CIAD, registro de preços da SED', quantidade: 12 }],
  },
  {
    id: 'meta-3',
    item: 'Arenas de Sumô e Estoura Balão',
    detalhe: 'Itens 43505 e 43506: 2 circulares de 160 cm e 2 hexagonais de 1660 mm',
    metaTotal: 4,
    unidade: 'arenas',
    entregas: [{ fornecedorNome: 'Marcenaria homologada (CIAD)', quantidade: 4 }],
  },
  {
    id: 'meta-4',
    item: 'Medalhas e troféus',
    detalhe: 'Cerimônia de premiação',
    metaTotal: 120,
    unidade: 'unidades',
    entregas: [{ fornecedorNome: 'Troféus & Medalhas Norte', quantidade: 120 }],
  },
];

export const INITIAL_VISTORIA: ItemVistoria[] = [
  {
    id: 'chk-1',
    tipo: 'acessibilidade',
    titulo: 'Rampas de acesso com inclinação regulamentar nas três alas',
    setor: 'Alas 01 a 03',
    responsavel: 'Eng. Marina (SED)',
    conferido: true,
  },
  {
    id: 'chk-2',
    tipo: 'acessibilidade',
    titulo: 'Intérprete de Libras posicionado nas cerimônias de abertura e premiação',
    setor: 'Arena Central',
    responsavel: 'Coordenação de inclusão',
    conferido: true,
  },
  {
    id: 'chk-3',
    tipo: 'acessibilidade',
    titulo: 'Mesas de competição com altura acessível e rodízios travados',
    setor: 'Alas 01 e 02',
    responsavel: 'Comissão técnica',
    conferido: true,
  },
  {
    id: 'chk-4',
    tipo: 'acessibilidade',
    titulo: 'Sanitários adaptados desobstruídos e sinalizados no pavilhão',
    setor: 'Expocentro',
    responsavel: 'Equipe de infraestrutura',
    conferido: false,
  },
  {
    id: 'chk-5',
    tipo: 'seguranca',
    titulo: 'Vistoria das 12 mesas e 4 arenas: sem cantos vivos, lascas ou descolamento',
    setor: 'Alas 01 e 02',
    responsavel: 'Comissão CAF / SED',
    conferido: true,
  },
  {
    id: 'chk-6',
    tipo: 'seguranca',
    titulo: 'Trava acionada nos quatro rodízios de todas as mesas de competição',
    setor: 'Alas 01 e 02',
    responsavel: 'Árbitros de arena',
    conferido: true,
  },
  {
    id: 'chk-7',
    tipo: 'seguranca',
    titulo: 'Alvará dos bombeiros, ambulância de plantão e isolamento elétrico das bancadas de treino',
    setor: 'Todo o evento',
    responsavel: 'Defesa Civil / SED',
    conferido: false,
  },
  {
    id: 'chk-8',
    tipo: 'seguranca',
    titulo: 'Portaria ativa, com leitura de ingresso dos menores e registro nominal de convidados',
    setor: 'Portaria principal',
    responsavel: 'Coordenação de voluntários',
    conferido: true,
  },
];

export const INITIAL_PINS_MAPA: PinMapa[] = [
  {
    id: 'pin-sed-1',
    nome: 'Expocentro Edmundo Doubrawa',
    tipo: 'sediador',
    papel: 'Sede da competição',
    detalhe: '12 mesas de robótica, 2 arenas de Sumô e 2 arenas de Estoura Balão.',
    endereco: 'Av. José Vieira, 315, América',
    lat: -26.3044,
    lng: -48.8487,
  },
  {
    id: 'pin-sed-2',
    nome: 'Secretaria de Educação de Joinville',
    tipo: 'sediador',
    papel: 'Coordenação geral',
    detalhe: 'Gestão do campeonato. Processo SEI 24.0.032221-4.',
    endereco: 'Rua Itajaí, 390, Centro',
    lat: -26.3012,
    lng: -48.8435,
  },
  {
    id: 'pin-esc-1',
    nome: 'E.M. Araucária',
    tipo: 'escola',
    papel: 'Escola com Laboratório Maker',
    detalhe: '3 equipes inscritas. Recebe uma mesa oficial depois do evento.',
    endereco: 'Bairro Saguaçu',
    lat: -26.2752,
    lng: -48.8215,
  },
  {
    id: 'pin-esc-2',
    nome: 'E.M. Mata Atlântica',
    tipo: 'escola',
    papel: 'Escola com Laboratório Maker',
    detalhe: '3 equipes inscritas, com destaque em Seguidor de Linha e Sumô.',
    endereco: 'Bairro Bucarein',
    lat: -26.3188,
    lng: -48.8312,
  },
  {
    id: 'pin-esc-3',
    nome: 'E.M. Vale Verde',
    tipo: 'escola',
    papel: 'Escola com Laboratório Maker',
    detalhe: '2 equipes inscritas, em Estoura Balão e LEGO.',
    endereco: 'Distrito de Pirabeiraba',
    lat: -26.254,
    lng: -48.902,
  },
  {
    id: 'pin-esc-4',
    nome: 'E.M. Beira-Rio',
    tipo: 'escola',
    papel: 'Escola com Laboratório Maker',
    detalhe: '2 equipes inscritas, em Micro:bit e Seguidor de Linha.',
    endereco: 'Bairro Glória',
    lat: -26.2915,
    lng: -48.864,
  },
  {
    id: 'pin-forn-1',
    nome: 'CIAD',
    tipo: 'fornecedor',
    papel: 'Logística de mesas e arenas',
    detalhe: 'Centro Integrado de Armazenamento e Distribuição. Entregas das 8h às 11h e das 14h às 17h.',
    endereco: 'Zona Industrial Norte',
    lat: -26.269,
    lng: -48.859,
  },
  {
    id: 'pin-forn-2',
    nome: 'Padaria & Catering Joinville',
    tipo: 'fornecedor',
    papel: 'Alimentação',
    detalhe: 'Entregou 100 dos 200 kits de lanche previstos.',
    endereco: 'Rua Quinze de Novembro, 1420, Centro',
    lat: -26.298,
    lng: -48.841,
  },
  {
    id: 'pin-forn-3',
    nome: 'Troféus & Medalhas Norte',
    tipo: 'fornecedor',
    papel: 'Premiação',
    detalhe: 'Entregou as 120 medalhas e troféus previstos para a cerimônia.',
    endereco: 'Zona Industrial Norte',
    lat: -26.2635,
    lng: -48.852,
  },
];

export const INITIAL_CONVIDADOS: ConvidadoPortaria[] = [
  { id: 'conv-4', nome: 'João Batista Krüger', telefone: '(47) 99652-1190', horarioEntrada: '08:52', atendente: 'Carlos Eduardo' },
  { id: 'conv-3', nome: 'Fernanda Oliveira Ramos', telefone: '(47) 99104-8821', horarioEntrada: '08:39', atendente: 'Beatriz Helena' },
  { id: 'conv-2', nome: 'Roberto Carlos Costa', telefone: '(47) 98831-1029', horarioEntrada: '08:25', atendente: 'Beatriz Helena' },
  { id: 'conv-1', nome: 'Ana Paula Ferreira', telefone: '(47) 99912-4410', horarioEntrada: '08:14', atendente: 'Beatriz Helena' },
];

export const INITIAL_HORARIOS: JanelaHorario[] = [
  {
    id: 'hor-1',
    titulo: 'Abertura e credenciamento',
    detalhe: 'Cerimônia oficial com todas as escolas',
    ala: 'Arena Central',
    inicio: '09:00',
    fim: '09:30',
    equipes: ['Todas as 35 escolas'],
  },
  {
    id: 'hor-2',
    titulo: 'Treinos e ajustes técnicos',
    detalhe: 'Três treinos de 10 minutos por equipe',
    ala: 'Alas 01, 02 e 03',
    inicio: '09:30',
    fim: '12:00',
    equipes: ['12 mesas', '2 arenas de Sumô', '2 arenas de Estoura Balão'],
  },
  {
    id: 'hor-3',
    titulo: 'Almoço',
    detalhe: 'Distribuição dos kits de alimentação',
    ala: 'Refeitório',
    inicio: '12:00',
    fim: '13:30',
    equipes: [],
  },
  {
    id: 'hor-4',
    titulo: 'Robótica LEGO e Micro:bit',
    detalhe: 'Três rounds oficiais de 3 minutos',
    ala: 'Ala 01',
    inicio: '13:30',
    fim: '14:45',
    equipes: ['JoinvilleBot Alpha', 'Araucária Micro:Makers', 'Mecatrônica Mata Atlântica'],
  },
  {
    id: 'hor-5',
    titulo: 'Seguidor de Linha, Sumô e Estoura Balão',
    detalhe: 'Três rounds oficiais de 3 minutos, até duas equipes por arena',
    ala: 'Ala 02',
    inicio: '14:45',
    fim: '16:00',
    equipes: ['JoinvilleBot Alpha', 'TechSul E.M.', 'EcoBot Joinville', 'Guardiões do Rio Cachoeira'],
  },
];
