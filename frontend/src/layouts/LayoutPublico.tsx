import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BarraDeVoz, BotaoAcessibilidade } from '../components/Acessibilidade';
import { Marca } from '../components/Marca';
import { Notificacoes } from '../components/ui';
import { EVENTO } from '../data/mockDatabase';
import { Link } from '../lib/router';
import { useLoja } from '../lib/store';

const LINKS = [
  { para: '/', rotulo: 'Início' },
  { para: '/campeonato', rotulo: 'O campeonato' },
  { para: '/edital', rotulo: 'Edital' },
  { para: '/contato', rotulo: 'Contato' },
];

const estaAtivo = (caminho: string, para: string) => (para === '/' ? caminho === '/' : caminho.startsWith(para));

export const LayoutPublico: React.FC<{ caminho: string; children: React.ReactNode }> = ({ caminho, children }) => {
  const { perfil } = useLoja();
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => setMenuAberto(false), [caminho]);

  return (
    <>
      <a className="pular-conteudo" href="#conteudo" onClick={(e) => {
        e.preventDefault();
        document.getElementById('conteudo')?.focus();
      }}>
        Pular para o conteúdo
      </a>

      <header className="pub-topo" data-aberto={menuAberto || undefined}>
        <div className="pub-topo__dentro">
          <Link para="/" className="pub-topo__marca" aria-label="CJR Joinville, página inicial">
            <Marca />
          </Link>

          <nav className="pub-nav" aria-label="Principal">
            {LINKS.map((l) => (
              <Link key={l.para} para={l.para} atual={estaAtivo(caminho, l.para)}>
                {l.rotulo}
              </Link>
            ))}
          </nav>

          <div className="pub-topo__acoes">
            <BotaoAcessibilidade variante="icone" />
            <Link para={perfil ? '/painel' : '/entrar'} className="btn btn--primario btn--p">
              {perfil ? 'Meu painel' : 'Entrar'}
            </Link>
            <button
              type="button"
              className="pub-topo__icone pub-topo__menu"
              onClick={() => setMenuAberto((v) => !v)}
              aria-expanded={menuAberto}
              aria-controls="menu-publico"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            >
              {menuAberto ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
            </button>
          </div>
        </div>

        <div className="pub-menu" id="menu-publico" {...({ inert: menuAberto ? undefined : '' } as object)}>
          <nav aria-label="Principal (celular)">
            {LINKS.map((l) => (
              <Link key={l.para} para={l.para} atual={estaAtivo(caminho, l.para)}>
                {l.rotulo}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1} key={caminho}>
        {children}
      </main>

      <footer className="pub-rodape">
        <div className="pub-rodape__dentro">
          <div className="pub-rodape__marca">
            <Marca selo legenda={`${EVENTO.edicao}ª edição, ${EVENTO.ano}`} />
            <p>
              Realizado pela Secretaria de Educação de Joinville, dentro do programa Somos Digitais.
            </p>
          </div>

          <nav className="pub-rodape__links" aria-label="Rodapé">
            <Link para="/campeonato">O campeonato</Link>
            <Link para="/edital">Edital</Link>
            <Link para="/contato">Contato</Link>
            <Link para="/contato/ouvidoria">Ouvidoria</Link>
            <Link para="/entrar">Entrar no sistema</Link>
          </nav>

          <address className="pub-rodape__endereco">
            <strong>Secretaria de Educação</strong>
            Rua Itajaí, 390, Centro
            <br />
            Joinville/SC, 89201-090
          </address>
        </div>
        <p className="pub-rodape__fim">
          Prefeitura de Joinville. Processo SEI nº {EVENTO.processoSei}. Versão de demonstração: escolas, equipes e
          pessoas citadas são fictícias.
        </p>
      </footer>

      <BarraDeVoz />
      <Notificacoes />
    </>
  );
};
