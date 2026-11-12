import React, { useEffect, useRef, useState } from 'react';
import { Globe, LogOut, X } from 'lucide-react';
import { BarraDeVoz, BotaoAcessibilidade } from '../components/Acessibilidade';
import { Marca } from '../components/Marca';
import { Notificacoes } from '../components/ui';
import { NAVEGACAO, PERFIS } from '../lib/perfis';
import { Link, navegar } from '../lib/router';
import { useLoja } from '../lib/store';
import { PerfilAcesso } from '../types/cjr';

interface Selo {
  texto: string;
  alerta?: boolean;
  leitura: string;
}

/** Contadores ao lado dos itens do menu: só aparecem quando há algo a fazer. */
const useSelos = (perfil: PerfilAcesso): Record<string, Selo | undefined> => {
  const { alunoAtual, alunosDaEscola, equipes, empate, vistoria } = useLoja();

  if (perfil === 'participante') {
    return {
      declaracao:
        alunoAtual.statusDeclaracao === 'recusado'
          ? { texto: '!', alerta: true, leitura: 'declaração recusada' }
          : undefined,
    };
  }
  if (perfil === 'escola') {
    const pendentes = alunosDaEscola.filter((p) => p.statusDeclaracao === 'aguardando').length;
    return { declaracoes: pendentes ? { texto: String(pendentes), leitura: `${pendentes} para analisar` } : undefined };
  }
  if (perfil === 'avaliador') {
    const fila = equipes.filter((e) => !e.avaliada).length;
    return {
      fila: fila ? { texto: String(fila), leitura: `${fila} equipes sem nota` } : undefined,
      desempate: empate.resolvido ? undefined : { texto: '1', alerta: true, leitura: '1 empate aguardando seu voto' },
    };
  }
  if (perfil === 'organizador') {
    const pendentes = vistoria.filter((v) => !v.conferido).length;
    return { vistoria: pendentes ? { texto: String(pendentes), alerta: true, leitura: `${pendentes} itens pendentes` } : undefined };
  }
  return {};
};

export const LayoutPainel: React.FC<{ perfil: PerfilAcesso; aba: string; children: React.ReactNode }> = ({
  perfil,
  aba,
  children,
}) => {
  const { sair, avisar } = useLoja();
  const [gaveta, setGaveta] = useState(false);
  const botaoConta = useRef<HTMLButtonElement>(null);
  const botaoFechar = useRef<HTMLButtonElement>(null);
  const jaAbriu = useRef(false);
  const selos = useSelos(perfil);
  const info = PERFIS[perfil];
  const itens = NAVEGACAO[perfil];
  const indice = Math.max(
    0,
    itens.findIndex((i) => i.id === aba)
  );

  useEffect(() => setGaveta(false), [aba]);

  /* Título da aba do navegador: diz em que tela a pessoa está */
  useEffect(() => {
    document.title = `${itens[indice].rotulo} | ${info.area} | CJR Joinville`;
  }, [itens, indice, info.area]);

  /* Teclado: ao abrir a gaveta o foco entra nela; ao fechar, volta para o botão que a abriu */
  useEffect(() => {
    if (gaveta) {
      jaAbriu.current = true;
      botaoFechar.current?.focus();
    } else if (jaAbriu.current) {
      botaoConta.current?.focus();
    }
  }, [gaveta]);

  useEffect(() => {
    if (!gaveta) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && setGaveta(false);
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [gaveta]);

  const encerrar = () => {
    sair();
    navegar('/entrar');
    avisar('Você saiu do sistema.');
  };

  const variaveis = { '--n': itens.length, '--i': indice } as React.CSSProperties;

  return (
    <div className="painel-app">
      <a className="pular-conteudo" href="#conteudo" onClick={(e) => {
        e.preventDefault();
        document.getElementById('conteudo')?.focus();
      }}>
        Pular para o conteúdo
      </a>

      {/* Barra do celular: abre a gaveta com o menu completo e a conta */}
      <header className="barra">
        <Link para="/painel" className="barra__marca" aria-label="Início do painel">
          <Marca selo legenda={info.area} />
        </Link>
        <button
          ref={botaoConta}
          type="button"
          className="barra__conta"
          onClick={() => setGaveta(true)}
          aria-expanded={gaveta}
          aria-controls="menu-lateral"
          aria-label="Abrir menu e conta"
        >
          {info.sigla}
        </button>
      </header>

      <div className="lado-fundo" data-aberta={gaveta || undefined} onClick={() => setGaveta(false)} />

      <aside className="lado" id="menu-lateral" data-aberta={gaveta || undefined}>
        <div className="lado__topo">
          <Link para="/painel" className="lado__marca" aria-label="Início do painel">
            <Marca selo legenda={info.area} />
          </Link>
          <button
            ref={botaoFechar}
            type="button"
            className="lado__fechar"
            onClick={() => setGaveta(false)}
            aria-label="Fechar menu"
          >
            <X size={22} aria-hidden />
          </button>
        </div>

        <nav className="lado__nav" aria-label={`Painel: ${info.area}`} style={variaveis}>
          <span className="lado__indicador" aria-hidden />
          {itens.map((item) => {
            const selo = selos[item.id];
            const Icone = item.icone;
            return (
              <Link key={item.id} para={`/painel/${item.id}`} className="lado__item" atual={item.id === aba}>
                <Icone size={20} aria-hidden />
                <span>{item.rotulo}</span>
                {selo && (
                  <span className={`contador ${selo.alerta ? 'contador--alerta' : ''}`}>
                    <span aria-hidden>{selo.texto}</span>
                    <span className="sr-only">{selo.leitura}</span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="lado__rodape">
          <Link para="/" className="lado__acao">
            <Globe size={18} aria-hidden />
            Ver site público
          </Link>
          <BotaoAcessibilidade variante="lado" />

          <div className="lado__conta">
            <span className="lado__avatar" aria-hidden>
              {info.sigla}
            </span>
            <div className="lado__quem">
              <strong>{info.usuarioNome}</strong>
              <span>{info.cargo}</span>
            </div>
            <button type="button" className="lado__sair" onClick={encerrar} aria-label="Sair" title="Sair">
              <LogOut size={18} aria-hidden />
            </button>
          </div>
        </div>
      </aside>

      <main className="conteudo" id="conteudo" tabIndex={-1}>
        <div className="conteudo__dentro pagina" key={`${perfil}/${aba}`}>
          {children}
        </div>
      </main>

      {/* Abas inferiores: navegação com o polegar no celular */}
      <nav className="abas" aria-label="Seções do painel" style={variaveis}>
        <span className="abas__indicador" aria-hidden />
        {itens.map((item) => {
          const selo = selos[item.id];
          const Icone = item.icone;
          return (
            <Link key={item.id} para={`/painel/${item.id}`} className="abas__item" atual={item.id === aba}>
              <span className="abas__icone">
                <Icone size={22} aria-hidden />
                {selo && <span className={`abas__ponto ${selo.alerta ? 'abas__ponto--alerta' : ''}`} aria-hidden />}
              </span>
              <span>{item.curto ?? item.rotulo}</span>
            </Link>
          );
        })}
      </nav>

      <BarraDeVoz />
      <Notificacoes comAbas />
    </div>
  );
};
