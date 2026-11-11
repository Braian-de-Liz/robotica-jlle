import {
  boolean,
  date,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Enums (valores descritos no DER)                                    */
/* ------------------------------------------------------------------ */

export const cargoNomeEnum = pgEnum("cargo_nome", [
  "organizador",
  "avaliador",
  "escola",
  "participante",
  "voluntario",
]);

export const escolaStatusEnum = pgEnum("escola_status", ["ativa", "pendente"]);

export const edicaoStatusEnum = pgEnum("edicao_status", [
  "planejamento",
  "inscricoes",
  "em_andamento",
  "encerrado",
]);

export const statusDeclaracaoEnum = pgEnum("status_declaracao", [
  "aguardando",
  "aceito",
  "recusado",
]);

export const faseChaveamentoEnum = pgEnum("fase_chaveamento", [
  "oitavas",
  "quartas",
  "semi",
  "final",
]);

export const tipoPostEnum = pgEnum("tipo_post", ["noticia", "edital", "resultado"]);

export const tipoCategoriaChecklistEnum = pgEnum("tipo_categoria_checklist", [
  "acessibilidade",
  "seguranca",
  "infraestrutura",
]);

export const tipoParceiroEnum = pgEnum("tipo_parceiro", [
  "fornecedor",
  "patrocinador",
  "doador",
]);

/* ------------------------------------------------------------------ */
/* Cadastros base                                                      */
/* ------------------------------------------------------------------ */

export const cargo = pgTable("cargo", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: cargoNomeEnum("nome").notNull().unique(),
  nivelAcesso: integer("nivel_acesso").notNull(),
});

export const endereco = pgTable("endereco", {
  id: uuid("id").primaryKey().defaultRandom(),
  logradouro: text("logradouro").notNull(),
  numero: text("numero").notNull(),
  bairro: text("bairro").notNull(),
  cep: varchar("cep", { length: 9 }).notNull(),
  // Pin no mapa (React-Leaflet)
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

export const modalidade = pgTable("modalidade", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Ex.: Lego | Seguidor Linha | ArtBot | Microbit | Estoura Balao
  nome: text("nome").notNull(),
  descricao: text("descricao"),
});

/* ------------------------------------------------------------------ */
/* Usuários e escolas                                                  */
/* ------------------------------------------------------------------ */

export const usuario = pgTable("usuario", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(),
  cpfCnpj: varchar("cpf_cnpj", { length: 18 }).notNull().unique(),
  telefone: text("telefone"),
  // Obrigatório se menor de idade
  responsavelLegal: text("responsavel_legal"),
  cargoId: uuid("cargo_id")
    .notNull()
    .references(() => cargo.id),
  // Nullable
  enderecoId: uuid("endereco_id").references(() => endereco.id),
});

export const escola = pgTable("escola", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  cnpj: varchar("cnpj", { length: 18 }).notNull().unique(),
  inscricaoMunicipal: text("inscricao_municipal"),
  telefone: text("telefone"),
  email: text("email"),
  status: escolaStatusEnum("status").notNull().default("pendente"),
  usuarioGestorId: uuid("usuario_gestor_id")
    .notNull()
    .references(() => usuario.id),
  enderecoId: uuid("endereco_id")
    .notNull()
    .references(() => endereco.id),
});

/* ------------------------------------------------------------------ */
/* Edição do evento                                                    */
/* ------------------------------------------------------------------ */

export const edicaoEvento = pgTable("edicao_evento", {
  id: uuid("id").primaryKey().defaultRandom(),
  ano: integer("ano").notNull().unique(),
  tema: text("tema"),
  status: edicaoStatusEnum("status").notNull().default("planejamento"),
  dataInicio: date("data_inicio").notNull(),
  dataFim: date("data_fim").notNull(),
  editalUrl: text("edital_url"),
  // sedia_evento
  localSediadorId: uuid("local_sediador_id").references(() => endereco.id),
});

export const postBlog = pgTable("post_blog", {
  id: uuid("id").primaryKey().defaultRandom(),
  edicaoId: uuid("edicao_id")
    .notNull()
    .references(() => edicaoEvento.id),
  titulo: text("titulo").notNull(),
  resumo: text("resumo"),
  imagemUrl: text("imagem_url"),
  tipoPost: tipoPostEnum("tipo_post").notNull(),
  publicado: boolean("publicado").notNull().default(false),
});

export const checklistOperacional = pgTable("checklist_operacional", {
  id: uuid("id").primaryKey().defaultRandom(),
  edicaoId: uuid("edicao_id")
    .notNull()
    .references(() => edicaoEvento.id),
  tipoCategoria: tipoCategoriaChecklistEnum("tipo_categoria").notNull(),
  itemDescricao: text("item_descricao").notNull(),
  concluido: boolean("concluido").notNull().default(false),
  responsavelId: uuid("responsavel_id").references(() => usuario.id),
});

export const convidadoAcesso = pgTable("convidado_acesso", {
  id: uuid("id").primaryKey().defaultRandom(),
  edicaoId: uuid("edicao_id")
    .notNull()
    .references(() => edicaoEvento.id),
  nome: text("nome").notNull(),
  telefone: text("telefone"),
  voluntarioPortariaId: uuid("voluntario_portaria_id")
    .notNull()
    .references(() => usuario.id),
  entradaEm: timestamp("entrada_em"),
});

/* ------------------------------------------------------------------ */
/* Equipes                                                             */
/* ------------------------------------------------------------------ */

export const equipe = pgTable("equipe", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  escolaId: uuid("escola_id")
    .notNull()
    .references(() => escola.id),
  edicaoId: uuid("edicao_id")
    .notNull()
    .references(() => edicaoEvento.id),
  mentorId: uuid("mentor_id").references(() => usuario.id),
  // Ex.: Ala 01, Ala 02
  alaLocalizacao: text("ala_localizacao"),
  statusInscricao: text("status_inscricao").notNull().default("pendente"),
});

export const membroEquipe = pgTable("membro_equipe", {
  id: uuid("id").primaryKey().defaultRandom(),
  equipeId: uuid("equipe_id")
    .notNull()
    .references(() => equipe.id),
  participanteId: uuid("participante_id")
    .notNull()
    .references(() => usuario.id),
  // Ingresso QR Code
  qrCodeToken: text("qr_code_token").notNull().unique(),
  declaracaoPdfUrl: text("declaracao_pdf_url"),
  statusDeclaracao: statusDeclaracaoEnum("status_declaracao")
    .notNull()
    .default("aguardando"),
  presencaConfirmada: boolean("presenca_confirmada").notNull().default(false),
});

/* ------------------------------------------------------------------ */
/* Torneio e avaliação                                                 */
/* ------------------------------------------------------------------ */

export const torneioDisputa = pgTable("torneio_disputa", {
  id: uuid("id").primaryKey().defaultRandom(),
  edicaoId: uuid("edicao_id")
    .notNull()
    .references(() => edicaoEvento.id),
  modalidadeId: uuid("modalidade_id")
    .notNull()
    .references(() => modalidade.id),
  equipeAId: uuid("equipe_a_id")
    .notNull()
    .references(() => equipe.id),
  equipeBId: uuid("equipe_b_id")
    .notNull()
    .references(() => equipe.id),
  faseChaveamento: faseChaveamentoEnum("fase_chaveamento").notNull(),
  // Ex.: Ala 01
  alaLocal: text("ala_local"),
  horarioPrevisto: timestamp("horario_previsto"),
  vencedorEquipeId: uuid("vencedor_equipe_id").references(() => equipe.id),
});

export const avaliacao = pgTable("avaliacao", {
  id: uuid("id").primaryKey().defaultRandom(),
  torneioDisputaId: uuid("torneio_disputa_id")
    .notNull()
    .references(() => torneioDisputa.id),
  equipeId: uuid("equipe_id")
    .notNull()
    .references(() => equipe.id),
  avaliadorId: uuid("avaliador_id")
    .notNull()
    .references(() => usuario.id),
  notaCriterios: doublePrecision("nota_criterios").notNull(),
  // Soma ímpar de avaliadores
  pontoDesempate: integer("ponto_desempate"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Fornecedores e recursos                                             */
/* ------------------------------------------------------------------ */

export const fornecedorParceiro = pgTable("fornecedor_parceiro", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  tipo: tipoParceiroEnum("tipo").notNull(),
  cnpj: varchar("cnpj", { length: 18 }),
  telefone: text("telefone"),
  enderecoId: uuid("endereco_id").references(() => endereco.id),
});

export const metaRecurso = pgTable("meta_recurso", {
  id: uuid("id").primaryKey().defaultRandom(),
  edicaoId: uuid("edicao_id")
    .notNull()
    .references(() => edicaoEvento.id),
  // Ex.: Alimentacao, Kits, Brindes
  categoria: text("categoria").notNull(),
  // Ex.: 200
  metaTotal: integer("meta_total").notNull(),
  // Ex.: 150
  quantidadeAtual: integer("quantidade_atual").notNull().default(0),
});

export const contribuicaoFornecedor = pgTable("contribuicao_fornecedor", {
  id: uuid("id").primaryKey().defaultRandom(),
  metaRecursoId: uuid("meta_recurso_id")
    .notNull()
    .references(() => metaRecurso.id),
  fornecedorId: uuid("fornecedor_id")
    .notNull()
    .references(() => fornecedorParceiro.id),
  // Ex.: 100
  quantidadeEntregue: integer("quantidade_entregue").notNull(),
  statusEntrega: text("status_entrega").notNull().default("pendente"),
});
