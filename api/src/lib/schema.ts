import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  date,
  time,
} from 'drizzle-orm/pg-core';

// 1. Cargos (Perfis de Acesso RBAC)
export const cargos = pgTable('cargos', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 60 }).notNull().unique(),
  descricao: text('descricao'),
});

// 2. Endereços Georreferenciados (Pins do Mapa React-Leaflet)
export const enderecos = pgTable('enderecos', {
  id: serial('id').primaryKey(),
  logradouro: varchar('logradouro', { length: 160 }).notNull(),
  numero: varchar('numero', { length: 20 }),
  bairro: varchar('bairro', { length: 100 }).notNull(),
  cidade: varchar('cidade', { length: 100 }).notNull().default('Joinville'),
  uf: varchar('uf', { length: 2 }).notNull().default('SC'),
  cep: varchar('cep', { length: 15 }),
  latitude: numeric('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: numeric('longitude', { precision: 10, scale: 7 }).notNull(),
  tipoPin: varchar('tipo_pin', { length: 30 }).notNull(), // ESCOLA | SEDIADOR | FORNECEDOR
});

// 3. Usuários Unificados
export const usuarios = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 150 }).notNull(),
  email: varchar('email', { length: 150 }).notNull().unique(),
  senhaHash: varchar('senha_hash', { length: 255 }).notNull(),
  telefone: varchar('telefone', { length: 30 }),
  cpfCnpj: varchar('cpf_cnpj', { length: 25 }).unique(),
  responsavelLegal: varchar('responsavel_legal', { length: 150 }),
  menorIdade: boolean('menor_idade').notNull().default(false),
  cargoId: integer('cargo_id')
    .notNull()
    .references(() => cargos.id),
  enderecoId: integer('endereco_id').references(() => enderecos.id),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
});

// 4. Escolas Municipais Participantes
export const escolas = pgTable('escolas', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 180 }).notNull(),
  inepCnpj: varchar('inep_cnpj', { length: 30 }).notNull().unique(),
  telefone: varchar('telefone', { length: 30 }),
  email: varchar('email', { length: 150 }).notNull(),
  statusInscricao: varchar('status_inscricao', { length: 30 })
    .notNull()
    .default('DEFERIDA'),
  possuiMesaCjr: boolean('possui_mesa_cjr').notNull().default(false),
  enderecoId: integer('endereco_id').references(() => enderecos.id),
});

// 5. Torneios e Modalidades (ETP SEI Nº 0020793169/2024 - SED.URC)
export const torneiosModalidades = pgTable('torneios_modalidades', {
  id: serial('id').primaryKey(),
  edicaoAno: integer('edicao_ano').notNull().default(2026),
  nomeModalidade: varchar('nome_modalidade', { length: 100 }).notNull(),
  codigoItemEtp: varchar('codigo_item_etp', { length: 20 }), // 43504 | 43505 | 43506
  alaPadrao: varchar('ala_padrao', { length: 80 }).notNull(),
  vagasEquipes: integer('vagas_equipes').notNull().default(15),
});

// 6. Equipes Competidoras
export const equipes = pgTable('equipes', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 120 }).notNull(),
  escolaId: integer('escola_id')
    .notNull()
    .references(() => escolas.id),
  mentorUsuarioId: integer('mentor_usuario_id').references(() => usuarios.id),
  modalidadePrincipal: varchar('modalidade_principal', { length: 80 }).notNull(),
  alaAlocada: varchar('ala_alocada', { length: 80 }).notNull(),
  statusValidacao: varchar('status_validacao', { length: 30 })
    .notNull()
    .default('VALIDADA'),
});

// 7. Participantes e Declarações Assinadas pelos Pais + QR Code
export const participantesDeclaracoes = pgTable('participantes_declaracoes', {
  id: serial('id').primaryKey(),
  alunoUsuarioId: integer('aluno_usuario_id')
    .notNull()
    .references(() => usuarios.id),
  equipeId: integer('equipe_id')
    .notNull()
    .references(() => equipes.id),
  arquivoDeclaracaoUrl: text('arquivo_declaracao_url'),
  statusDeclaracao: varchar('status_declaracao', { length: 25 })
    .notNull()
    .default('AGUARDANDO'), // AGUARDANDO | ACEITO | RECUSADO
  qrCodeToken: varchar('qr_code_token', { length: 120 }).notNull().unique(),
  checkinPortariaEm: timestamp('checkin_portaria_em'),
});

// 8. Horários das Disputas e Chaveamento (Sem Conflito entre Modalidades)
export const horariosChaveamento = pgTable('horarios_chaveamento', {
  id: serial('id').primaryKey(),
  torneioId: integer('torneio_id')
    .notNull()
    .references(() => torneiosModalidades.id),
  fase: varchar('fase', { length: 60 }).notNull(),
  alaMesa: varchar('ala_mesa', { length: 80 }).notNull(),
  dataDisputa: date('data_disputa').notNull(),
  horarioInicio: time('horario_inicio').notNull(),
  horarioFim: time('horario_fim').notNull(),
  equipeAId: integer('equipe_a_id')
    .notNull()
    .references(() => equipes.id),
  equipeBId: integer('equipe_b_id').references(() => equipes.id),
  placarA: numeric('placar_a', { precision: 6, scale: 2 }),
  placarB: numeric('placar_b', { precision: 6, scale: 2 }),
});

// 9. Avaliações e Desempate por Banca Ímpar
export const avaliacoes = pgTable('avaliacoes', {
  id: serial('id').primaryKey(),
  equipeId: integer('equipe_id')
    .notNull()
    .references(() => equipes.id),
  avaliadorUsuarioId: integer('avaliador_usuario_id')
    .notNull()
    .references(() => usuarios.id),
  categoria: varchar('categoria', { length: 80 }).notNull(),
  notaDesempenhoTecnico: numeric('nota_desempenho_tecnico', { precision: 5, scale: 2 }).notNull(),
  notaInovacaoDesign: numeric('nota_inovacao_design', { precision: 5, scale: 2 }).notNull(),
  notaTrabalhoEquipe: numeric('nota_trabalho_equipe', { precision: 5, scale: 2 }).notNull(),
  observacoes: text('observacoes'),
  pontoDesempateBancaImpar: integer('ponto_desempate_banca_impar').default(0),
  avaliadoEm: timestamp('avaliado_em').notNull().defaultNow(),
});

// 10. Fornecedores e Cotas de Suprimentos (KPI ex: 150/200)
export const cotasSuprimentos = pgTable('cotas_suprimentos', {
  id: serial('id').primaryKey(),
  categoriaItem: varchar('categoria_item', { length: 120 }).notNull(),
  metaTotal: integer('meta_total').notNull(),
  quantidadeAtual: integer('quantidade_atual').notNull().default(0),
  unidade: varchar('unidade', { length: 40 }).notNull(),
});

// 11. Checklist de Acessibilidade e Segurança do Local
export const checklistInspecaoLocal = pgTable('checklist_inspecao_local', {
  id: serial('id').primaryKey(),
  categoria: varchar('categoria', { length: 30 }).notNull(), // ACESSIBILIDADE | SEGURANCA
  itemTitulo: varchar('item_titulo', { length: 180 }).notNull(),
  localReferencia: varchar('local_referencia', { length: 120 }).notNull(),
  conferido: boolean('conferido').notNull().default(false),
  responsavelConferencia: varchar('responsavel_conferencia', { length: 120 }),
});

// 12. Convidados e Visitantes na Portaria (Portal do Voluntário)
export const portariaConvidados = pgTable('portaria_convidados', {
  id: serial('id').primaryKey(),
  nomeCompleto: varchar('nome_completo', { length: 150 }).notNull(),
  telefone: varchar('telefone', { length: 30 }).notNull(),
  voluntarioUsuarioId: integer('voluntario_usuario_id').references(() => usuarios.id),
  entradaRegistradaEm: timestamp('entrada_registrada_em').notNull().defaultNow(),
});
