import React, { useEffect, useRef } from 'react';
import { LayoutPainel } from './layouts/LayoutPainel';
import { LayoutPublico } from './layouts/LayoutPublico';
import { NAVEGACAO } from './lib/perfis';
import { navegar, useCaminho } from './lib/router';
import { LojaProvider, useLoja } from './lib/store';
import { voz } from './lib/voz';
import { PaginasAvaliador } from './pages/Avaliador';
import { PaginasEscola } from './pages/Escola';
import { PaginasOrganizador } from './pages/Organizador';
import { PaginasParticipante } from './pages/Participante';
import { PaginasPortaria } from './pages/Portaria';
import { Campeonato } from './pages/publico/Campeonato';
import { Contato } from './pages/publico/Contato';
import { Edital } from './pages/publico/Edital';
import { Entrar } from './pages/publico/Entrar';
import { Inicio } from './pages/publico/Inicio';
import { PerfilAcesso } from './types/cjr';

const PAGINAS_DO_PAINEL: Record<PerfilAcesso, Record<string, React.FC<{ parametro?: string }>>> = {
  participante: PaginasParticipante,
  escola: PaginasEscola,
  avaliador: PaginasAvaliador,
  organizador: PaginasOrganizador,
  voluntario: PaginasPortaria,
};

const Redirecionar: React.FC<{ para: string }> = ({ para }) => {
  useEffect(() => navegar(para, { substituir: true }), [para]);
  return null;
};

const TITULOS_PUBLICOS: Record<string, string> = {
  '': 'CJR Joinville, Campeonato Joinvilense de Robótica',
  campeonato: 'O campeonato | CJR Joinville',
  edital: 'Edital | CJR Joinville',
  contato: 'Contato | CJR Joinville',
  entrar: 'Entrar | CJR Joinville',
};

const Rotas: React.FC = () => {
  const caminho = useCaminho();
  const { perfil } = useLoja();
  const [secao, aba, parametro] = caminho.split('/').filter(Boolean);
  const primeiraTela = useRef(true);

  useEffect(() => {
    /* A leitura em voz alta pertence à tela anterior */
    voz.parar();

    if (secao !== 'painel') document.title = TITULOS_PUBLICOS[secao ?? ''] ?? TITULOS_PUBLICOS[''];

    /* Leitores de tela e teclado: ao trocar de tela, o foco vai para o conteúdo novo */
    if (primeiraTela.current) {
      primeiraTela.current = false;
      return;
    }
    const foco = window.setTimeout(() => document.getElementById('conteudo')?.focus({ preventScroll: true }), 0);
    return () => window.clearTimeout(foco);
  }, [caminho, secao]);

  if (secao === 'painel') {
    if (!perfil) return <Redirecionar para="/entrar" />;
    const paginas = PAGINAS_DO_PAINEL[perfil];
    const Pagina = aba ? paginas[aba] : undefined;
    if (!Pagina) return <Redirecionar para={`/painel/${NAVEGACAO[perfil][0].id}`} />;
    return (
      <LayoutPainel perfil={perfil} aba={aba}>
        <Pagina parametro={parametro} />
      </LayoutPainel>
    );
  }

  if (secao === 'entrar') {
    return perfil ? <Redirecionar para="/painel" /> : <Entrar />;
  }

  const publica =
    secao === undefined ? (
      <Inicio />
    ) : secao === 'campeonato' ? (
      <Campeonato />
    ) : secao === 'edital' ? (
      <Edital />
    ) : secao === 'contato' ? (
      <Contato caminho={caminho} />
    ) : null;

  if (!publica) return <Redirecionar para="/" />;

  return <LayoutPublico caminho={caminho}>{publica}</LayoutPublico>;
};

export const App: React.FC = () => (
  <LojaProvider>
    <Rotas />
  </LojaProvider>
);
