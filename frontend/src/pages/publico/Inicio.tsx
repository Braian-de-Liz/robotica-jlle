import React from 'react';
import { FileText, LogIn } from 'lucide-react';
import { PistaProgramacao } from '../../components/PistaProgramacao';
import { EVENTO, INITIAL_AVISOS, INITIAL_POSTS_BLOG, PROGRAMACAO_PUBLICA } from '../../data/mockDatabase';
import { Link } from '../../lib/router';
import { useLoja } from '../../lib/store';

export const Inicio: React.FC = () => {
  const { perfil } = useLoja();
  const [destaque, ...outras] = INITIAL_POSTS_BLOG;

  return (
    <>
      <section className="hero">
        <div className="hero__dentro">
          <h1 className="hero__titulo t-display">
            {EVENTO.edicao}º Campeonato Joinvilense de Robótica
          </h1>

          <div className="hero__apoio">
            <p className="hero__texto">
              Estudantes da rede municipal colocam seus robôs à prova em sete modalidades, no {EVENTO.sede},{' '}
              {EVENTO.horario}. O tema de {EVENTO.ano} é <strong>“{EVENTO.tema}”</strong>.
            </p>
            <div className="hero__acoes">
              <Link para="/edital" className="btn btn--na-marca">
                <FileText size={18} aria-hidden />
                Ler o edital
              </Link>
              <Link para={perfil ? '/painel' : '/entrar'} className="btn btn--na-marca-vazado">
                <LogIn size={18} aria-hidden />
                {perfil ? 'Abrir meu painel' : 'Entrar no sistema'}
              </Link>
            </div>
          </div>

          <div className="hero__programa">
            <h2>O dia da competição</h2>
            <PistaProgramacao paradas={PROGRAMACAO_PUBLICA} />
          </div>
        </div>
      </section>

      <section className="secao secao--fundo">
        <div className="secao__dentro">
          <h2 className="sr-only">O campeonato em números</h2>
          <dl className="fatos">
            <div className="fato">
              <dd className="t-num">{EVENTO.equipes}</dd>
              <dt>equipes inscritas</dt>
            </div>
            <div className="fato">
              <dd className="t-num">{EVENTO.escolas}</dd>
              <dt>escolas municipais</dt>
            </div>
            <div className="fato">
              <dd className="t-num">{EVENTO.estudantesMinimo}+</dd>
              <dt>estudantes</dt>
            </div>
            <div className="fato">
              <dd className="t-num">7</dd>
              <dt>modalidades</dt>
            </div>
          </dl>
        </div>
      </section>

      <section className="secao">
        <div className="secao__dentro novidades">
          <div>
            <div className="secao__topo">
              <h2 className="secao__titulo">Notícias</h2>
            </div>
            <div className="noticias">
              {[destaque, ...outras].map((post, i) => (
                <article key={post.id} className={`noticia ${i === 0 ? 'noticia--destaque' : ''}`}>
                  <div className="noticia__imagem">
                    <img src={post.imagemUrl} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
                  </div>
                  <div>
                    <p className="noticia__meta">
                      <strong>{post.categoria}</strong>
                      <span>
                        {post.data}, {post.autor}
                      </span>
                    </p>
                    <h3>{post.titulo}</h3>
                    <p>{post.resumo}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="novidades__avisos" aria-labelledby="titulo-avisos">
            <div className="secao__topo">
              <h2 className="secao__titulo" id="titulo-avisos">
                Avisos
              </h2>
            </div>
            <ul className="avisos-lista">
              {INITIAL_AVISOS.map((aviso) => (
                <li key={aviso.id}>
                  <div className="avisos-lista__topo">
                    <strong>{aviso.assunto}</strong>
                    <time>{aviso.quando}</time>
                  </div>
                  <p>{aviso.texto}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="secao">
        <div className="secao__dentro chamadas">
          <h2 className="sr-only">Participe</h2>
          <div className="chamada chamada--marca">
            <h3>Escolas, avaliadores e participantes</h3>
            <p>
              Inscrição de equipes, declarações dos responsáveis, ingressos e notas ficam no sistema do campeonato.
            </p>
            <Link para={perfil ? '/painel' : '/entrar'} className="btn btn--na-marca">
              {perfil ? 'Abrir meu painel' : 'Entrar no sistema'}
            </Link>
          </div>
          <div className="chamada">
            <h3>Sua empresa pode apoiar</h3>
            <p>Kits de alimentação, equipamentos e premiação ajudam a levar mais estudantes para a competição.</p>
            <Link para="/contato/parceria" className="btn btn--secundario">
              Propor uma parceria
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
