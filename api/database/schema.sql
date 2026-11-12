-- =============================================================================
-- SISTEMA CJR — CAMPEONATO JOINVILENSE DE ROBÓTICA
-- Prefeitura de Joinville • Secretaria de Educação
-- Banco de Dados Relacional: PostgreSQL 16+
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Cargos (RBAC)
CREATE TABLE cargos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE, -- 'avaliador', 'organizador', 'participante', 'voluntario', 'escola'
    nivel_acesso INT NOT NULL
);

-- 2. Tabela de Endereços (Suporte a Geolocalização React-Leaflet)
CREATE TABLE enderecos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    logradouro VARCHAR(160) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL DEFAULT 'Joinville',
    uf CHAR(2) NOT NULL DEFAULT 'SC',
    cep VARCHAR(15) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL
);

-- 3. Tabela de Usuários
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(30),
    responsavel VARCHAR(150), -- Obrigatório caso participante menor de idade
    cpf_cnpj VARCHAR(20) NOT NULL UNIQUE,
    cargo_id INT NOT NULL REFERENCES cargos(id),
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    endereco_id UUID REFERENCES enderecos(id) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Escolas da Rede Municipal
CREATE TABLE escolas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(180) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    cnpj_inscricao VARCHAR(30) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'ativa', -- 'ativa', 'pendente', 'inativa'
    email VARCHAR(150) NOT NULL,
    usuario_gestor_id UUID REFERENCES usuarios(id),
    endereco_id UUID REFERENCES enderecos(id),
    vagas_equipes INT NOT NULL DEFAULT 4
);

-- 5. Tabela de Edições do Evento (Continuidade e Rastreabilidade Histórica)
CREATE TABLE edicoes_evento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ano INT NOT NULL UNIQUE,
    edicao_numero INT NOT NULL,
    tema VARCHAR(220) NOT NULL,
    status VARCHAR(40) NOT NULL, -- 'planejamento', 'inscricoes_abertas', 'em_andamento', 'concluido'
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    edital_url TEXT,
    local_sediador_nome VARCHAR(180) NOT NULL,
    endereco_sediador_id UUID REFERENCES enderecos(id)
);

-- 6. Tabela de Equipes Participantes
CREATE TABLE equipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(120) NOT NULL,
    escola_id UUID NOT NULL REFERENCES escolas(id) ON DELETE CASCADE,
    edicao_id UUID NOT NULL REFERENCES edicoes_evento(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES usuarios(id),
    voluntario_escola_nome VARCHAR(150),
    ala_localizacao VARCHAR(60) NOT NULL, -- Ex: 'Ala 01', 'Ala 02', 'Ala 03'
    status_inscricao VARCHAR(30) NOT NULL DEFAULT 'confirmada'
);

-- 7. Tabela de Membros da Equipe & Declaração Assinada pelos Pais + QR Code
CREATE TABLE membros_equipe (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipe_id UUID NOT NULL REFERENCES equipes(id) ON DELETE CASCADE,
    participante_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    qr_code_token VARCHAR(80) NOT NULL UNIQUE,
    declaracao_assinada_url TEXT,
    status_declaracao VARCHAR(30) NOT NULL DEFAULT 'aguardando', -- 'aguardando', 'aceito', 'recusado'
    presenca_confirmada BOOLEAN NOT NULL DEFAULT FALSE,
    horario_entrada TIMESTAMP WITH TIME ZONE
);

-- 8. Tabela de Modalidades de Competição
CREATE TABLE modalidades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(120) NOT NULL UNIQUE,
    categoria VARCHAR(80) NOT NULL,
    descricao TEXT NOT NULL
);

-- 9. Tabela de Torneios, Horários e Chaveamento (Prevenção de Conflitos Multi-Modalidade)
CREATE TABLE torneios_disputa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    edicao_id UUID NOT NULL REFERENCES edicoes_evento(id),
    modalidade_id UUID NOT NULL REFERENCES modalidades(id),
    fase_chaveamento VARCHAR(40) NOT NULL, -- 'oitavas', 'quartas', 'semifinal', 'final'
    equipe_a_id UUID NOT NULL REFERENCES equipes(id),
    equipe_b_id UUID REFERENCES equipes(id),
    pontos_equipe_a NUMERIC(6, 2) DEFAULT 0,
    pontos_equipe_b NUMERIC(6, 2) DEFAULT 0,
    ala_local VARCHAR(60) NOT NULL, -- Ex: 'Ala 01', 'Ala 02'
    horario_disputa TIME NOT NULL,
    vencedor_equipe_id UUID REFERENCES equipes(id)
);

-- 10. Tabela de Avaliações e Pontos de Desempate (Banca Ímpar)
CREATE TABLE avaliacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    torneio_disputa_id UUID REFERENCES torneios_disputa(id),
    equipe_id UUID NOT NULL REFERENCES equipes(id),
    modalidade_id UUID NOT NULL REFERENCES modalidades(id),
    avaliador_id UUID NOT NULL REFERENCES usuarios(id),
    criterio_engenharia NUMERIC(4, 2) NOT NULL,
    criterio_programacao NUMERIC(4, 2) NOT NULL,
    criterio_desempenho NUMERIC(4, 2) NOT NULL,
    criterio_equipe_pitch NUMERIC(4, 2) NOT NULL,
    nota_final NUMERIC(6, 2) NOT NULL,
    ponto_desempate INT DEFAULT 0, -- 0 ou 1 (Soma de número ímpar de avaliadores desempata)
    observacoes TEXT,
    avaliado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Tabela de Fornecedores, Parceiros e Doadores
CREATE TABLE fornecedores_parceiros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(160) NOT NULL,
    tipo VARCHAR(40) NOT NULL, -- 'fornecedor', 'patrocinador', 'doador', 'sediador'
    cnpj VARCHAR(25),
    telefone VARCHAR(30),
    endereco_id UUID REFERENCES enderecos(id)
);

-- 12. Tabela de Metas de Recursos e KPIs do Organizador (Ex: 150/200 Alimentos)
CREATE TABLE metas_recurso (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    edicao_id UUID NOT NULL REFERENCES edicoes_evento(id),
    categoria_recurso VARCHAR(100) NOT NULL, -- Ex: 'Alimentação / Kits Lanche'
    quantidade_meta INT NOT NULL,            -- Ex: 200
    quantidade_atual INT NOT NULL DEFAULT 0, -- Ex: 150
    unidade VARCHAR(30) NOT NULL DEFAULT 'unidades'
);

-- 13. Tabela de Contribuições por Fornecedor
CREATE TABLE contribuicoes_fornecedor (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meta_recurso_id UUID NOT NULL REFERENCES metas_recurso(id) ON DELETE CASCADE,
    fornecedor_id UUID NOT NULL REFERENCES fornecedores_parceiros(id),
    quantidade_entregue INT NOT NULL, -- Ex: Fornecedor X entregou 100
    confirmado BOOLEAN NOT NULL DEFAULT TRUE
);

-- 14. Tabela de Checklists Operacionais (Acessibilidade do Local e Segurança do Local)
CREATE TABLE checklists_operacionais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    edicao_id UUID NOT NULL REFERENCES edicoes_evento(id),
    tipo_conferencia VARCHAR(40) NOT NULL, -- 'acessibilidade', 'seguranca'
    item_descricao VARCHAR(220) NOT NULL,
    ala_referencia VARCHAR(60),
    concluido BOOLEAN NOT NULL DEFAULT FALSE,
    responsavel_vistoria VARCHAR(120)
);

-- 15. Tabela de Convidados Contabilizados na Entrada pelo Voluntário
CREATE TABLE convidados_acesso (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    edicao_id UUID NOT NULL REFERENCES edicoes_evento(id),
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    voluntario_id UUID REFERENCES usuarios(id),
    registrado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Tabela de Posts do Blog Público & Cards de Notícias
CREATE TABLE posts_blog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    edicao_id UUID NOT NULL REFERENCES edicoes_evento(id),
    titulo VARCHAR(200) NOT NULL,
    resumo TEXT NOT NULL,
    conteudo TEXT,
    imagem_url TEXT NOT NULL,
    categoria VARCHAR(60) NOT NULL,
    destaque_card_canto BOOLEAN NOT NULL DEFAULT FALSE,
    publicado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
