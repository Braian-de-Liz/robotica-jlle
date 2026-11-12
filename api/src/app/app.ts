import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { db } from '../lib/conn.js';
import {
  escolas,
  equipes,
  participantesDeclaracoes,
  avaliacoes,
  cotasSuprimentos,
  checklistInspecaoLocal,
  portariaConvidados,
  enderecos,
} from '../lib/schema.js';
import { eq } from 'drizzle-orm';

export function buildApp() {
  const app = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

  // Healthcheck & Status do ETP SEI Nº 0020793169/2024
  app.get('/api/health', async () => {
    return {
      status: 'ok',
      sistema: '6º Campeonato Joinvilense de Robótica (CJR 2026)',
      referenciaOficial: 'ETP SEI Nº 0020793169/2024 - SED.URC (Prefeitura de Joinville)',
      infraestruturaHomologada: {
        mesasRobotica43504: 12,
        arenasSumo43505: 2,
        arenasEstouraBalao43506: 2,
      },
    };
  });

  // Listar Pins Georreferenciados para o React-Leaflet
  app.get('/api/mapa/pins', async () => {
    const pins = await db.select().from(enderecos);
    return { pins };
  });

  // Listar Escolas e Equipes
  app.get('/api/escolas', async () => {
    const listaEscolas = await db.select().from(escolas);
    const listaEquipes = await db.select().from(equipes);
    return { escolas: listaEscolas, equipes: listaEquipes };
  });

  // Deferir / Indeferir Declaração Assinada pelos Pais (Portal da Escola)
  app.patch(
    '/api/declaracoes/:id/status',
    {
      schema: {
        params: Type.Object({ id: Type.Number() }),
        body: Type.Object({
          statusDeclaracao: Type.Union([
            Type.Literal('AGUARDANDO'),
            Type.Literal('ACEITO'),
            Type.Literal('RECUSADO'),
          ]),
        }),
      },
    },
    async (request) => {
      const { id } = request.params;
      const { statusDeclaracao } = request.body;
      const [atualizado] = await db
        .update(participantesDeclaracoes)
        .set({ statusDeclaracao })
        .where(eq(participantesDeclaracoes.id, id))
        .returning();
      return { declaracao: atualizado };
    }
  );

  // Registrar Avaliação ou Ponto de Desempate por Banca Ímpar (Portal do Avaliador)
  app.post(
    '/api/avaliacoes',
    {
      schema: {
        body: Type.Object({
          equipeId: Type.Number(),
          avaliadorUsuarioId: Type.Number(),
          categoria: Type.String(),
          notaDesempenhoTecnico: Type.String(),
          notaInovacaoDesign: Type.String(),
          notaTrabalhoEquipe: Type.String(),
          observacoes: Type.Optional(Type.String()),
          pontoDesempateBancaImpar: Type.Optional(Type.Number()),
        }),
      },
    },
    async (request) => {
      const [novaAvaliacao] = await db
        .insert(avaliacoes)
        .values(request.body)
        .returning();
      return { avaliacao: novaAvaliacao };
    }
  );

  // Listar Suprimentos & Checklist de Acessibilidade/Segurança (Portal do Organizador)
  app.get('/api/organizador/operacoes', async () => {
    const suprimentos = await db.select().from(cotasSuprimentos);
    const checklist = await db.select().from(checklistInspecaoLocal);
    return { suprimentos, checklist };
  });

  // Registrar Convidado na Portaria (Portal do Voluntário)
  app.post(
    '/api/portaria/convidados',
    {
      schema: {
        body: Type.Object({
          nomeCompleto: Type.String(),
          telefone: Type.String(),
          voluntarioUsuarioId: Type.Optional(Type.Number()),
        }),
      },
    },
    async (request) => {
      const [novoConvidado] = await db
        .insert(portariaConvidados)
        .values(request.body)
        .returning();
      return { convidado: novoConvidado };
    }
  );

  return app;
}
