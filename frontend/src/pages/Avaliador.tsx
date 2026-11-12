import React, { useState } from 'react';
import { Check, ChevronRight, Scale, Search } from 'lucide-react';
import { Chaveamento } from '../components/Chaveamento';
import { Cabecalho, Painel, Situacao, Trilho, Vazio, iniciais, useNumeroAnimado } from '../components/ui';
import { CHAVEAMENTO } from '../data/mockDatabase';
import { Link, navegar } from '../lib/router';
import { useLoja } from '../lib/store';

const AvisoEmpate: React.FC = () => {
  const { empate } = useLoja();
  if (empate.resolvido) return null;
  return (
    <div className="alerta">
      <div className="alerta__texto">
        <Scale size={20} aria-hidden />
        <div>
          <strong>Um empate espera o seu voto</strong>
          <span>
            {empate.equipeA} e {empate.equipeB} empataram em {empate.categoria}.
          </span>
        </div>
      </div>
      <Link para="/painel/desempate" className="btn btn--perigo btn--p">
        Votar agora
      </Link>
    </div>
  );
};

/* --- Fila ---------------------------------------------------------------------------- */

const Fila: React.FC = () => {
  const { equipes } = useLoja();
  const [busca, setBusca] = useState('');
  const termo = busca.trim().toLowerCase();
  const visiveis = equipes
    .filter(
      (e) =>
        !termo ||
        e.nome.toLowerCase().includes(termo) ||
        e.modalidadePrincipal.toLowerCase().includes(termo) ||
        e.escolaNome.toLowerCase().includes(termo)
    )
    .sort((a, b) => Number(a.avaliada) - Number(b.avaliada) || a.horarioPrincipal.localeCompare(b.horarioPrincipal));
  const semNota = equipes.filter((e) => !e.avaliada).length;

  const abrir = (id: string) => navegar(`/painel/avaliar/${id}`);

  return (
    <>
      <Cabecalho
        titulo="Fila de avaliação"
        descricao={
          semNota
            ? `${semNota} ${semNota === 1 ? 'equipe espera' : 'equipes esperam'} a sua nota. As próximas aparecem primeiro.`
            : 'Todas as equipes da sua banca já têm nota.'
        }
      />

      <AvisoEmpate />

      <div className="numeros" style={{ '--colunas': 3 } as React.CSSProperties}>
        <div className="numero" data-leitura="">
          <span className="numero__rotulo">Sem nota</span>
          <span className="numero__valor t-num">{semNota}</span>
        </div>
        <div className="numero" data-leitura="">
          <span className="numero__rotulo">Avaliadas</span>
          <span className="numero__valor t-num">
            {equipes.length - semNota}
            <small> de {equipes.length}</small>
          </span>
          <Trilho valor={equipes.length - semNota} total={equipes.length} rotulo="Equipes avaliadas" fino />
        </div>
        <div className="numero" data-leitura="">
          <span className="numero__rotulo">Banca</span>
          <span className="numero__valor t-num">
            3<small> avaliadores</small>
          </span>
        </div>
      </div>

      <Painel
        colado
        titulo="Equipes"
        acoes={
          <label className="campo" style={{ flex: '1 1 16rem', maxWidth: '22rem' }}>
            <span className="campo__rotulo">Buscar por equipe, escola ou modalidade</span>
            <span className="entrada-com-icone">
              <Search size={18} aria-hidden />
              <input className="entrada" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} />
            </span>
          </label>
        }
      >
        {visiveis.length === 0 ? (
          <Vazio icone={Search} titulo="Nenhuma equipe encontrada">
            Confira a grafia ou busque pelo nome da escola.
          </Vazio>
        ) : (
          <div className="tabela-caixa tabela-caixa--larga">
            <table role="table" className="tabela">
              <thead role="rowgroup">
                <tr role="row">
                  <th role="columnheader">Horário</th>
                  <th role="columnheader">Equipe</th>
                  <th role="columnheader">Modalidade</th>
                  <th role="columnheader">Local</th>
                  <th role="columnheader">Situação</th>
                  <th role="columnheader">
                    <span className="sr-only">Ação</span>
                  </th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {visiveis.map((e) => (
                  <tr role="row" key={e.id}>
                    <td role="cell" data-rotulo="Horário" className="t-num" style={{ fontSize: '1.0625rem' }}>
                      {e.horarioPrincipal}
                    </td>
                    <td role="cell" data-principal>
                      <strong>{e.nome}</strong>
                      <span className="tabela__sub">{e.escolaNome}</span>
                    </td>
                    <td role="cell" data-rotulo="Modalidade">{e.modalidadePrincipal}</td>
                    <td role="cell" data-rotulo="Local">{e.local}</td>
                    <td role="cell" data-rotulo="Situação">
                      {e.avaliada ? (
                        <Situacao tom="ok">{e.notaTotal?.toLocaleString('pt-BR')} pontos</Situacao>
                      ) : (
                        <Situacao tom="espera">Sem nota</Situacao>
                      )}
                    </td>
                    <td role="cell" data-acoes>
                      <button
                        type="button"
                        className={`btn btn--p ${e.avaliada ? 'btn--quieto' : 'btn--primario'}`}
                        onClick={() => abrir(e.id)}
                      >
                        {e.avaliada ? 'Rever nota' : 'Avaliar'}
                        <ChevronRight size={16} aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Painel>
    </>
  );
};

/* --- Avaliar ---------------------------------------------------------------------------- */

const CRITERIOS = [
  { id: 'engenharia', rotulo: 'Engenharia', ajuda: 'Estrutura mecânica, robustez e acabamento do robô.' },
  { id: 'programacao', rotulo: 'Programação', ajuda: 'Lógica do código e uso dos sensores.' },
  { id: 'desempenho', rotulo: 'Desempenho', ajuda: 'O que o robô fez na mesa ou arena durante os rounds.' },
  { id: 'equipe', rotulo: 'Trabalho em equipe', ajuda: 'Colaboração e clareza ao explicar o projeto para a banca.' },
] as const;

type IdCriterio = (typeof CRITERIOS)[number]['id'];

const NOTAS_INICIAIS: Record<IdCriterio, number> = { engenharia: 5, programacao: 5, desempenho: 5, equipe: 5 };

/** A equipe pode vir no endereço (/painel/avaliar/<id>), quando o avaliador parte da fila. */
const Avaliar: React.FC<{ parametro?: string }> = ({ parametro }) => {
  const { equipes, registrarAvaliacao } = useLoja();
  const [equipeId, setEquipeId] = useState(
    () => equipes.find((e) => e.id === parametro)?.id ?? equipes.find((e) => !e.avaliada)?.id ?? equipes[0].id
  );
  const [notas, setNotas] = useState(NOTAS_INICIAIS);
  const [obs, setObs] = useState('');

  const equipe = equipes.find((e) => e.id === equipeId) ?? equipes[0];
  const soma = CRITERIOS.reduce((total, c) => total + notas[c.id], 0);
  const final = Number(((soma / 40) * 100).toFixed(1));
  const mostrado = useNumeroAnimado(final, 350);

  const aoEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    registrarAvaliacao(equipe.id, final);
    navegar('/painel/fila');
  };

  return (
    <>
      <Cabecalho
        titulo="Avaliar equipe"
        descricao="Dê uma nota de 0 a 10 em cada critério. A nota final, de 0 a 100, é calculada sozinha."
      />

      <form className="grade-lateral" onSubmit={aoEnviar}>
        <Painel>
          <div className="form">
            <label className="campo">
              <span className="campo__rotulo">Equipe</span>
              <select className="entrada" value={equipe.id} onChange={(e) => setEquipeId(e.target.value)}>
                {equipes.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome} ({e.modalidadePrincipal}){e.avaliada ? ', já avaliada' : ''}
                  </option>
                ))}
              </select>
              <span className="campo__ajuda">
                {equipe.escolaNome}. {equipe.local}, {equipe.horarioPrincipal}.
              </span>
            </label>

            <div>
              {CRITERIOS.map((c) => (
                <div className="criterio" key={c.id}>
                  <div className="criterio__topo">
                    <label htmlFor={`criterio-${c.id}`}>{c.rotulo}</label>
                    <output className="t-num" htmlFor={`criterio-${c.id}`}>
                      {notas[c.id].toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                    </output>
                  </div>
                  <p className="criterio__ajuda">{c.ajuda}</p>
                  <input
                    id={`criterio-${c.id}`}
                    className="deslizante"
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={notas[c.id]}
                    onChange={(e) => setNotas((n) => ({ ...n, [c.id]: Number(e.target.value) }))}
                    style={{ '--pct': `${notas[c.id] * 10}%` } as React.CSSProperties}
                  />
                  <div className="criterio__escala" aria-hidden>
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              ))}
            </div>

            <label className="campo">
              <span className="campo__rotulo">Observações para a banca (opcional)</span>
              <textarea className="entrada" rows={3} value={obs} onChange={(e) => setObs(e.target.value)} />
            </label>
          </div>
        </Painel>

        <aside className="nota">
          <div>
            <span className="nota__rotulo">Nota final de {equipe.nome}</span>
            <div className="nota__valor t-num">
              {mostrado.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              <small>de 100</small>
            </div>
          </div>

          <div className="nota__partes">
            {CRITERIOS.map((c) => (
              <div className="nota__parte" key={c.id}>
                <div>
                  <span>{c.rotulo}</span>
                  <span className="t-num">{notas[c.id].toLocaleString('pt-BR', { minimumFractionDigits: 1 })}</span>
                </div>
                <Trilho valor={notas[c.id]} total={10} rotulo={c.rotulo} />
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn--na-marca btn--bloco">
            <Check size={18} aria-hidden />
            Publicar nota
          </button>
        </aside>
      </form>
    </>
  );
};

/* --- Desempate ----------------------------------------------------------------------------- */

const Desempate: React.FC = () => {
  const { empate, votarDesempate } = useLoja();
  const votosDe = (equipe: string) => empate.votosJuizes.filter((v) => v.votoEquipe === equipe).length;

  const lado = (equipe: string, escola: string) => {
    const votos = votosDe(equipe);
    const venceu = empate.resolvido && empate.vencedorDesempate === equipe;
    return (
      <div
        className="duelo__lado"
        data-venceu={venceu || undefined}
        data-perdeu={(empate.resolvido && !venceu) || undefined}
      >
        {venceu && <Situacao tom="ok">Venceu o desempate</Situacao>}
        <h3>{equipe}</h3>
        <p className="t-small t-muted">{escola}</p>
        <div className="duelo__votos" role="img" aria-label={`${votos} de 3 votos`}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="duelo__voto" data-dado={i < votos || undefined} />
          ))}
        </div>
        <span className="t-small">
          <strong className="t-num">{votos}</strong> {votos === 1 ? 'voto' : 'votos'}
        </span>
        {!empate.resolvido && (
          <button type="button" className="btn btn--primario" onClick={() => votarDesempate(equipe)}>
            Votar em {equipe}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <Cabecalho
        titulo="Desempate"
        descricao={`${empate.categoria}, ${empate.local}. Cada avaliador dá um voto; com três votos não há novo empate.`}
      />

      <Painel
        titulo={empate.resolvido ? 'Desempate concluído' : 'As duas equipes terminaram com a mesma nota'}
        descricao={
          empate.resolvido
            ? `${empate.vencedorDesempate} segue na disputa.`
            : 'Dois avaliadores já votaram, um para cada lado. O seu voto decide.'
        }
      >
        <div className="duelo">
          {lado(empate.equipeA, empate.escolaA)}
          <div className="duelo__meio">
            <span className="t-num">{empate.pontuacaoEmpatada.toLocaleString('pt-BR')}</span>
            <span>pontos cada</span>
          </div>
          {lado(empate.equipeB, empate.escolaB)}
        </div>
      </Painel>

      <Painel titulo="Votos da banca">
        <ul className="lista-linhas">
          {empate.votosJuizes.map((v) => (
            <li key={v.avaliadorNome} className="jurado" data-voce={v.voce || undefined}>
              <span className="avatar" aria-hidden>
                {iniciais(v.avaliadorNome)}
              </span>
              <div className="lista-linhas__texto">
                <strong>{v.avaliadorNome}</strong>
                <span>{v.instituicao}</span>
              </div>
              {v.votoEquipe ? (
                <Situacao tom="ok">{v.votoEquipe}</Situacao>
              ) : (
                <Situacao tom="alerta" icone={Scale}>
                  Falta votar
                </Situacao>
              )}
            </li>
          ))}
        </ul>
      </Painel>
    </>
  );
};

/* --- Chaveamento ------------------------------------------------------------------------------ */

const Chaves: React.FC = () => (
  <>
    <Cabecalho titulo="Chaveamento" descricao={`${CHAVEAMENTO.modalidade}, ${CHAVEAMENTO.local}.`} />
    <AvisoEmpate />
    <Painel>
      <Chaveamento />
    </Painel>
  </>
);

export const PaginasAvaliador: Record<string, React.FC<{ parametro?: string }>> = {
  fila: Fila,
  avaliar: Avaliar,
  desempate: Desempate,
  chaveamento: Chaves,
};
