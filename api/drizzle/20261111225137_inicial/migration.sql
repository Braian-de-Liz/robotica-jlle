CREATE TYPE "cargo_nome" AS ENUM('organizador', 'avaliador', 'escola', 'participante', 'voluntario');--> statement-breakpoint
CREATE TYPE "edicao_status" AS ENUM('planejamento', 'inscricoes', 'em_andamento', 'encerrado');--> statement-breakpoint
CREATE TYPE "escola_status" AS ENUM('ativa', 'pendente');--> statement-breakpoint
CREATE TYPE "fase_chaveamento" AS ENUM('oitavas', 'quartas', 'semi', 'final');--> statement-breakpoint
CREATE TYPE "status_declaracao" AS ENUM('aguardando', 'aceito', 'recusado');--> statement-breakpoint
CREATE TYPE "tipo_categoria_checklist" AS ENUM('acessibilidade', 'seguranca', 'infraestrutura');--> statement-breakpoint
CREATE TYPE "tipo_parceiro" AS ENUM('fornecedor', 'patrocinador', 'doador');--> statement-breakpoint
CREATE TYPE "tipo_post" AS ENUM('noticia', 'edital', 'resultado');--> statement-breakpoint
CREATE TABLE "avaliacao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"torneio_disputa_id" uuid NOT NULL,
	"equipe_id" uuid NOT NULL,
	"avaliador_id" uuid NOT NULL,
	"nota_criterios" double precision NOT NULL,
	"ponto_desempate" integer,
	"observacoes" text,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cargo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"nome" "cargo_nome" NOT NULL UNIQUE,
	"nivel_acesso" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checklist_operacional" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"edicao_id" uuid NOT NULL,
	"tipo_categoria" "tipo_categoria_checklist" NOT NULL,
	"item_descricao" text NOT NULL,
	"concluido" boolean DEFAULT false NOT NULL,
	"responsavel_id" uuid
);
--> statement-breakpoint
CREATE TABLE "contribuicao_fornecedor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"meta_recurso_id" uuid NOT NULL,
	"fornecedor_id" uuid NOT NULL,
	"quantidade_entregue" integer NOT NULL,
	"status_entrega" text DEFAULT 'pendente' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "convidado_acesso" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"edicao_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"telefone" text,
	"voluntario_portaria_id" uuid NOT NULL,
	"entrada_em" timestamp
);
--> statement-breakpoint
CREATE TABLE "edicao_evento" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"ano" integer NOT NULL UNIQUE,
	"tema" text,
	"status" "edicao_status" DEFAULT 'planejamento'::"edicao_status" NOT NULL,
	"data_inicio" date NOT NULL,
	"data_fim" date NOT NULL,
	"edital_url" text,
	"local_sediador_id" uuid
);
--> statement-breakpoint
CREATE TABLE "endereco" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"logradouro" text NOT NULL,
	"numero" text NOT NULL,
	"bairro" text NOT NULL,
	"cep" varchar(9) NOT NULL,
	"latitude" double precision,
	"longitude" double precision
);
--> statement-breakpoint
CREATE TABLE "equipe" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"nome" text NOT NULL,
	"escola_id" uuid NOT NULL,
	"edicao_id" uuid NOT NULL,
	"mentor_id" uuid,
	"ala_localizacao" text,
	"status_inscricao" text DEFAULT 'pendente' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "escola" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"nome" text NOT NULL,
	"cnpj" varchar(18) NOT NULL UNIQUE,
	"inscricao_municipal" text,
	"telefone" text,
	"email" text,
	"status" "escola_status" DEFAULT 'pendente'::"escola_status" NOT NULL,
	"usuario_gestor_id" uuid NOT NULL,
	"endereco_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fornecedor_parceiro" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"nome" text NOT NULL,
	"tipo" "tipo_parceiro" NOT NULL,
	"cnpj" varchar(18),
	"telefone" text,
	"endereco_id" uuid
);
--> statement-breakpoint
CREATE TABLE "membro_equipe" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"equipe_id" uuid NOT NULL,
	"participante_id" uuid NOT NULL,
	"qr_code_token" text NOT NULL UNIQUE,
	"declaracao_pdf_url" text,
	"status_declaracao" "status_declaracao" DEFAULT 'aguardando'::"status_declaracao" NOT NULL,
	"presenca_confirmada" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_recurso" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"edicao_id" uuid NOT NULL,
	"categoria" text NOT NULL,
	"meta_total" integer NOT NULL,
	"quantidade_atual" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modalidade" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"nome" text NOT NULL,
	"descricao" text
);
--> statement-breakpoint
CREATE TABLE "post_blog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"edicao_id" uuid NOT NULL,
	"titulo" text NOT NULL,
	"resumo" text,
	"imagem_url" text,
	"tipo_post" "tipo_post" NOT NULL,
	"publicado" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "torneio_disputa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"edicao_id" uuid NOT NULL,
	"modalidade_id" uuid NOT NULL,
	"equipe_a_id" uuid NOT NULL,
	"equipe_b_id" uuid NOT NULL,
	"fase_chaveamento" "fase_chaveamento" NOT NULL,
	"ala_local" text,
	"horario_previsto" timestamp,
	"vencedor_equipe_id" uuid
);
--> statement-breakpoint
CREATE TABLE "usuario" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"nome" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"senha_hash" text NOT NULL,
	"cpf_cnpj" varchar(18) NOT NULL UNIQUE,
	"telefone" text,
	"responsavel_legal" text,
	"cargo_id" uuid NOT NULL,
	"endereco_id" uuid
);
--> statement-breakpoint
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_torneio_disputa_id_torneio_disputa_id_fkey" FOREIGN KEY ("torneio_disputa_id") REFERENCES "torneio_disputa"("id");--> statement-breakpoint
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_equipe_id_equipe_id_fkey" FOREIGN KEY ("equipe_id") REFERENCES "equipe"("id");--> statement-breakpoint
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_avaliador_id_usuario_id_fkey" FOREIGN KEY ("avaliador_id") REFERENCES "usuario"("id");--> statement-breakpoint
ALTER TABLE "checklist_operacional" ADD CONSTRAINT "checklist_operacional_edicao_id_edicao_evento_id_fkey" FOREIGN KEY ("edicao_id") REFERENCES "edicao_evento"("id");--> statement-breakpoint
ALTER TABLE "checklist_operacional" ADD CONSTRAINT "checklist_operacional_responsavel_id_usuario_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "usuario"("id");--> statement-breakpoint
ALTER TABLE "contribuicao_fornecedor" ADD CONSTRAINT "contribuicao_fornecedor_meta_recurso_id_meta_recurso_id_fkey" FOREIGN KEY ("meta_recurso_id") REFERENCES "meta_recurso"("id");--> statement-breakpoint
ALTER TABLE "contribuicao_fornecedor" ADD CONSTRAINT "contribuicao_fornecedor_lnoUC4wWBejA_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "fornecedor_parceiro"("id");--> statement-breakpoint
ALTER TABLE "convidado_acesso" ADD CONSTRAINT "convidado_acesso_edicao_id_edicao_evento_id_fkey" FOREIGN KEY ("edicao_id") REFERENCES "edicao_evento"("id");--> statement-breakpoint
ALTER TABLE "convidado_acesso" ADD CONSTRAINT "convidado_acesso_voluntario_portaria_id_usuario_id_fkey" FOREIGN KEY ("voluntario_portaria_id") REFERENCES "usuario"("id");--> statement-breakpoint
ALTER TABLE "edicao_evento" ADD CONSTRAINT "edicao_evento_local_sediador_id_endereco_id_fkey" FOREIGN KEY ("local_sediador_id") REFERENCES "endereco"("id");--> statement-breakpoint
ALTER TABLE "equipe" ADD CONSTRAINT "equipe_escola_id_escola_id_fkey" FOREIGN KEY ("escola_id") REFERENCES "escola"("id");--> statement-breakpoint
ALTER TABLE "equipe" ADD CONSTRAINT "equipe_edicao_id_edicao_evento_id_fkey" FOREIGN KEY ("edicao_id") REFERENCES "edicao_evento"("id");--> statement-breakpoint
ALTER TABLE "equipe" ADD CONSTRAINT "equipe_mentor_id_usuario_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "usuario"("id");--> statement-breakpoint
ALTER TABLE "escola" ADD CONSTRAINT "escola_usuario_gestor_id_usuario_id_fkey" FOREIGN KEY ("usuario_gestor_id") REFERENCES "usuario"("id");--> statement-breakpoint
ALTER TABLE "escola" ADD CONSTRAINT "escola_endereco_id_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "endereco"("id");--> statement-breakpoint
ALTER TABLE "fornecedor_parceiro" ADD CONSTRAINT "fornecedor_parceiro_endereco_id_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "endereco"("id");--> statement-breakpoint
ALTER TABLE "membro_equipe" ADD CONSTRAINT "membro_equipe_equipe_id_equipe_id_fkey" FOREIGN KEY ("equipe_id") REFERENCES "equipe"("id");--> statement-breakpoint
ALTER TABLE "membro_equipe" ADD CONSTRAINT "membro_equipe_participante_id_usuario_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "usuario"("id");--> statement-breakpoint
ALTER TABLE "meta_recurso" ADD CONSTRAINT "meta_recurso_edicao_id_edicao_evento_id_fkey" FOREIGN KEY ("edicao_id") REFERENCES "edicao_evento"("id");--> statement-breakpoint
ALTER TABLE "post_blog" ADD CONSTRAINT "post_blog_edicao_id_edicao_evento_id_fkey" FOREIGN KEY ("edicao_id") REFERENCES "edicao_evento"("id");--> statement-breakpoint
ALTER TABLE "torneio_disputa" ADD CONSTRAINT "torneio_disputa_edicao_id_edicao_evento_id_fkey" FOREIGN KEY ("edicao_id") REFERENCES "edicao_evento"("id");--> statement-breakpoint
ALTER TABLE "torneio_disputa" ADD CONSTRAINT "torneio_disputa_modalidade_id_modalidade_id_fkey" FOREIGN KEY ("modalidade_id") REFERENCES "modalidade"("id");--> statement-breakpoint
ALTER TABLE "torneio_disputa" ADD CONSTRAINT "torneio_disputa_equipe_a_id_equipe_id_fkey" FOREIGN KEY ("equipe_a_id") REFERENCES "equipe"("id");--> statement-breakpoint
ALTER TABLE "torneio_disputa" ADD CONSTRAINT "torneio_disputa_equipe_b_id_equipe_id_fkey" FOREIGN KEY ("equipe_b_id") REFERENCES "equipe"("id");--> statement-breakpoint
ALTER TABLE "torneio_disputa" ADD CONSTRAINT "torneio_disputa_vencedor_equipe_id_equipe_id_fkey" FOREIGN KEY ("vencedor_equipe_id") REFERENCES "equipe"("id");--> statement-breakpoint
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_cargo_id_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "cargo"("id");--> statement-breakpoint
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_endereco_id_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "endereco"("id");