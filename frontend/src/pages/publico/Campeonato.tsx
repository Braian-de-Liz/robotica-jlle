import React from 'react';
import { CampoModalidade } from '../../components/CampoModalidade';
import { CARGA_DO_DIA, EDICOES, EVENTO, MODALIDADES } from '../../data/mockDatabase';

const duracao = (minutos: number) => {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
};

export const Campeonato: React.FC = () => {
  const maior = Math.max(...EDICOES.map((e) => e.equipes));
  const comDetalhe = [...EDICOES].filter((e) => e.escolas).reverse();

  return (
    <>
      <div className="pagina-topo">
        <div className="pagina-topo__dentro">
          <h1 className="t-display">O campeonato</h1>
          <p className="t-lead">
            Desde 2021 o CJR reúne os clubes de robótica das escolas municipais de Joinville. Em {EVENTO.ano} são{' '}
            {EVENTO.equipes} equipes de {EVENTO.escolas} escolas, no {EVENTO.sede}.
          </p>
        </div>
      </div>

      <section className="secao">
        <div className="secao__dentro">
          <div className="secao__topo">
            <div>
              <h2 className="secao__titulo">Sete modalidades, cada uma no seu campo</h2>
              <p className="secao__intro">
                Os desenhos mostram os campos vistos de cima, nas proporções das mesas e arenas oficiais.
              </p>
            </div>
          </div>

          <ul className="modalidades">
            {MODALIDADES.map((m) => (
              <li key={m.id} className="modalidade">
                <div className="modalidade__campo">
                  <CampoModalidade campo={m.campo} />
                  <span className="modalidade__medida t-code">{m.medida}</span>
                </div>
                <h3>{m.nome}</h3>
                <p>{m.descricao}</p>
                <span className="modalidade__formato">{m.formato}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="secao secao--fundo">
        <div className="secao__dentro">
          <div className="secao__topo">
            <div>
              <h2 className="secao__titulo">Como as 9 horas do dia são divididas</h2>
              <p className="secao__intro">
                A competição vai das 9h às 18h. Os rounds oficiais de uma categoria nunca acontecem ao mesmo tempo
                que os de outra.
              </p>
            </div>
          </div>

          <div className="carga">
            <div className="carga__barra" aria-hidden>
              {CARGA_DO_DIA.map((parte) => (
                <div
                  key={parte.rotulo}
                  className="carga__parte t-num"
                  style={{ '--min': parte.minutos } as React.CSSProperties}
                >
                  {duracao(parte.minutos)}
                </div>
              ))}
            </div>
            <ul className="carga__legenda">
              {CARGA_DO_DIA.map((parte) => (
                <li key={parte.rotulo}>
                  <i aria-hidden />
                  <strong>{parte.rotulo}</strong>
                  <span>{duracao(parte.minutos)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="regras">
            <div className="regra">
              <strong>Três treinos de 10 minutos</strong>
              <p>Cada equipe tem três janelas para testar e ajustar o robô antes de competir.</p>
            </div>
            <div className="regra">
              <strong>Três rounds oficiais de 3 minutos</strong>
              <p>É nos rounds que a pontuação vale. Nas arenas, entram no máximo duas equipes por vez.</p>
            </div>
            <div className="regra">
              <strong>Banca sempre ímpar</strong>
              <p>Se duas equipes empatam, cada avaliador dá um voto. Com três votos, não há novo empate.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="secao__dentro">
          <div className="secao__topo">
            <div>
              <h2 className="secao__titulo">Seis edições</h2>
              <p className="secao__intro">
                Equipes inscritas por ano. Os três primeiros anos acompanharam a implantação dos clubes de robótica
                nas escolas.
              </p>
            </div>
          </div>

          <div className="edicoes">
            <div
              className="edicoes__grafico"
              style={{ '--n': EDICOES.length } as React.CSSProperties}
              role="img"
              aria-label={`Equipes por edição: ${EDICOES.map((e) => `${e.ano}, ${e.equipes}`).join('; ')}.`}
            >
              {EDICOES.map((e, i) => (
                <div
                  key={e.ano}
                  className="edicoes__coluna"
                  data-atual={e.ano === EVENTO.ano || undefined}
                  style={{ '--altura': Math.round((e.equipes / maior) * 86), '--i': i } as React.CSSProperties}
                >
                  <span className="edicoes__valor t-num">{e.equipes}</span>
                  <span className="edicoes__barra" />
                  <span className="edicoes__ano">{e.ano}</span>
                </div>
              ))}
            </div>

            <div className="tabela-caixa">
              <table role="table" className="tabela tabela--compacta">
                <thead role="rowgroup">
                  <tr role="row">
                    <th role="columnheader">Edição</th>
                    <th role="columnheader">Tema</th>
                    <th role="columnheader">Sede</th>
                    <th role="columnheader" data-num>Equipes</th>
                    <th role="columnheader" data-num>Escolas</th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {comDetalhe.map((e) => (
                    <tr role="row" key={e.ano}>
                      <td role="cell" data-principal>
                        <strong>
                          {e.numero}ª edição, {e.ano}
                        </strong>
                      </td>
                      <td role="cell" data-rotulo="Tema">{e.tema}</td>
                      <td role="cell" data-rotulo="Sede">{e.sede}</td>
                      <td role="cell" data-rotulo="Equipes" data-num className="t-num">
                        {e.equipes}
                      </td>
                      <td role="cell" data-rotulo="Escolas" data-num className="t-num">
                        {e.escolas}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
