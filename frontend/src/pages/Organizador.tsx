import React, { useState } from 'react';
import { Check, Plus, Scale, ShieldCheck } from 'lucide-react';
import { MapaJoinville, ROTULO_TIPO, glifoDoTipo } from '../components/MapaJoinville';
import { Cabecalho, Campo, Dialogo, Marcar, Painel, Segmentado, Situacao, Trilho } from '../components/ui';
import { EVENTO, INITIAL_PINS_MAPA } from '../data/mockDatabase';
import { Link } from '../lib/router';
import { useLoja } from '../lib/store';
import { ItemVistoria, JanelaHorario, MetaFornecimento, TipoPinMapa } from '../types/cjr';

const entregue = (meta: MetaFornecimento) => meta.entregas.reduce((soma, e) => soma + e.quantidade, 0);

/* --- Resumo ---------------------------------------------------------------------------- */

const Resumo: React.FC = () => {
  const { metas, vistoria, horarios, participantes, equipes, empate, publicoPresente } = useLoja();
  const conferidos = vistoria.filter((v) => v.conferido).length;
  const pendentesVistoria = vistoria.filter((v) => !v.conferido);
  const declaracoesAbertas = participantes.filter((p) => p.statusDeclaracao !== 'aceito').length;
  const semNota = equipes.filter((e) => !e.avaliada).length;
  const metasAbertas = metas.filter((m) => entregue(m) < m.metaTotal);

  return (
    <>
      <Cabecalho
        titulo="Resumo do evento"
        descricao={`${EVENTO.edicao}º CJR no ${EVENTO.sede}: o que está pronto e o que ainda pede atenção.`}
      />

      <div className="numeros">
        <div className="numero" data-leitura="">
          <span className="numero__rotulo">Escolas</span>
          <span className="numero__valor t-num">{EVENTO.escolas}</span>
          <span className="numero__nota">
            {EVENTO.equipes} equipes, mais de {EVENTO.estudantesMinimo} estudantes
          </span>
        </div>
        <div className="numero" data-leitura="">
          <span className="numero__rotulo">Público na portaria</span>
          <span className="numero__valor t-num">{publicoPresente}</span>
          <span className="numero__nota">pessoas registradas hoje</span>
        </div>
        <div className="numero" data-leitura="">
          <span className="numero__rotulo">Vistoria do local</span>
          <span className="numero__valor t-num">
            {conferidos}
            <small> de {vistoria.length}</small>
          </span>
          <Trilho valor={conferidos} total={vistoria.length} rotulo="Itens de vistoria conferidos" fino />
        </div>
        <div className="numero" data-leitura="">
          <span className="numero__rotulo">Metas de fornecimento</span>
          <span className="numero__valor t-num">
            {metas.length - metasAbertas.length}
            <small> de {metas.length}</small>
          </span>
          <Trilho
            valor={metas.length - metasAbertas.length}
            total={metas.length}
            rotulo="Metas de fornecimento atingidas"
            fino
          />
        </div>
      </div>

      <div className="grade-2">
        <Painel titulo="Pede atenção" descricao="Pendências que ainda podem atrasar o dia.">
          <ul className="lista-linhas lista-linhas--acoes">
            {pendentesVistoria.map((item) => (
              <li key={item.id}>
                <div className="lista-linhas__texto">
                  <strong>{item.titulo}</strong>
                  <span>
                    Vistoria, {item.setor}. Responsável: {item.responsavel}
                  </span>
                </div>
                <Link para="/painel/vistoria" className="btn btn--quieto btn--p">
                  Conferir
                </Link>
              </li>
            ))}
            {metasAbertas.map((meta) => (
              <li key={meta.id}>
                <div className="lista-linhas__texto">
                  <strong>
                    Faltam {meta.metaTotal - entregue(meta)} {meta.unidade}: {meta.item.toLowerCase()}
                  </strong>
                  <span>
                    Fornecimento, {entregue(meta)} de {meta.metaTotal} entregues
                  </span>
                </div>
                <Link para="/painel/fornecimento" className="btn btn--quieto btn--p">
                  Ver entregas
                </Link>
              </li>
            ))}
            {!empate.resolvido && (
              <li>
                <div className="lista-linhas__texto">
                  <strong>Empate em {empate.categoria}</strong>
                  <span>
                    {empate.equipeA} e {empate.equipeB} aguardam o voto de um avaliador
                  </span>
                </div>
                <Situacao tom="alerta" icone={Scale}>
                  Com a banca
                </Situacao>
              </li>
            )}
            <li>
              <div className="lista-linhas__texto">
                <strong>
                  {declaracoesAbertas} {declaracoesAbertas === 1 ? 'declaração' : 'declarações'} sem aceite
                </strong>
                <span>Alunos que ainda não podem entrar. A decisão é das escolas.</span>
              </div>
              <Situacao tom="espera">Com as escolas</Situacao>
            </li>
            <li>
              <div className="lista-linhas__texto">
                <strong>
                  {semNota} {semNota === 1 ? 'equipe' : 'equipes'} sem nota
                </strong>
                <span>Avaliações que a banca ainda vai publicar.</span>
              </div>
              <Situacao tom="espera">Com a banca</Situacao>
            </li>
          </ul>
        </Painel>

        <Painel
          titulo="Programação de hoje"
          acoes={
            <Link para="/painel/horarios" className="btn btn--quieto btn--p">
              Abrir grade
            </Link>
          }
        >
          <LinhaDoTempo janelas={horarios} compacta />
        </Painel>
      </div>
    </>
  );
};

const LinhaDoTempo: React.FC<{ janelas: JanelaHorario[]; compacta?: boolean }> = ({ janelas, compacta }) => (
  <ol className="agenda">
    {janelas.map((j) => (
      <li key={j.id} className="agenda__item agenda__item--oficial">
        <time className="agenda__hora t-num">
          {j.inicio}
          <small>até {j.fim}</small>
        </time>
        <div>
          <p className="agenda__titulo">{j.titulo}</p>
          <p className="agenda__detalhe">{compacta ? j.ala : `${j.detalhe}. ${j.ala}`}</p>
          {!compacta && j.equipes.length > 0 && (
            <div className="agenda__etiquetas">
              {j.equipes.map((nome) => (
                <span key={nome} className="etiqueta">
                  {nome}
                </span>
              ))}
            </div>
          )}
        </div>
      </li>
    ))}
  </ol>
);

/* --- Mapa --------------------------------------------------------------------------------- */

const Mapa: React.FC = () => {
  const [filtro, setFiltro] = useState<'todos' | TipoPinMapa>('todos');
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const pins = INITIAL_PINS_MAPA.filter((p) => filtro === 'todos' || p.tipo === filtro);

  return (
    <>
      <Cabecalho
        titulo="Mapa"
        descricao="Onde ficam os locais sediadores, as escolas com Laboratório Maker e os parceiros. Toque em um lugar para vê-lo no mapa."
      />

      <Segmentado
        rotulo="Filtrar lugares"
        valor={filtro}
        aoMudar={(valor) => {
          setFiltro(valor);
          setSelecionado(null);
        }}
        opcoes={[
          { valor: 'todos', rotulo: 'Todos' },
          { valor: 'escola', rotulo: 'Escolas' },
          { valor: 'sediador', rotulo: 'Sediadores' },
          { valor: 'fornecedor', rotulo: 'Parceiros' },
        ]}
      />

      <div className="mapa-pagina">
        <div className="mapa-moldura">
          <MapaJoinville pins={pins} selecionado={selecionado} aoSelecionar={setSelecionado} />
        </div>

        <ul className="mapa-lista">
          {pins.map((pin) => (
            <li key={pin.id}>
              <button
                type="button"
                className="mapa-lista__item"
                aria-pressed={pin.id === selecionado}
                onClick={() => setSelecionado(pin.id)}
              >
                <span
                  role="img"
                  aria-label={ROTULO_TIPO[pin.tipo]}
                  dangerouslySetInnerHTML={{ __html: glifoDoTipo(pin.tipo, 22) }}
                />
                <span>
                  <strong>{pin.nome}</strong>
                  <span>{pin.papel}</span>
                  <span>{pin.endereco}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

/* --- Fornecimento ---------------------------------------------------------------------------- */

const Fornecimento: React.FC = () => {
  const { metas, registrarEntrega } = useLoja();
  const [metaAberta, setMetaAberta] = useState<MetaFornecimento | null>(null);
  const [fornecedor, setFornecedor] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  const abrir = (meta: MetaFornecimento) => {
    setMetaAberta(meta);
    setFornecedor('');
    setQuantidade('');
    setErro(null);
  };

  const aoEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metaAberta) return;
    const qtd = Number.parseInt(quantidade, 10);
    if (!fornecedor.trim()) return setErro('Informe quem fez a entrega.');
    if (!Number.isFinite(qtd) || qtd <= 0) return setErro('Informe uma quantidade maior que zero.');
    registrarEntrega(metaAberta.id, fornecedor.trim(), qtd);
    setMetaAberta(null);
  };

  return (
    <>
      <Cabecalho
        titulo="Fornecimento"
        descricao="O que precisa chegar para o evento acontecer, e quanto cada fornecedor já entregou."
      />

      <Painel>
        {metas.map((meta) => {
          const total = entregue(meta);
          const falta = Math.max(0, meta.metaTotal - total);
          return (
            <article className="meta" key={meta.id}>
              <div className="meta__topo">
                <div>
                  <h2 className="t-h3">{meta.item}</h2>
                  <p className="meta__detalhe">{meta.detalhe}</p>
                </div>
                <span className="meta__conta t-num">
                  {total}
                  <small>
                    {' '}
                    de {meta.metaTotal} {meta.unidade}
                  </small>
                </span>
              </div>
              <Trilho valor={total} total={meta.metaTotal} rotulo={`${meta.item}: entregue`} />
              <div className="meta__rodape">
                <div className="meta__entregas">
                  {meta.entregas.map((e, i) => (
                    <span className="etiqueta" key={`${e.fornecedorNome}-${i}`}>
                      {e.fornecedorNome}
                      <strong className="t-num">{e.quantidade}</strong>
                    </span>
                  ))}
                </div>
                {falta > 0 ? (
                  <button type="button" className="btn btn--secundario btn--p" onClick={() => abrir(meta)}>
                    <Plus size={16} aria-hidden />
                    Registrar entrega
                  </button>
                ) : (
                  <Situacao tom="ok">Meta atingida</Situacao>
                )}
              </div>
            </article>
          );
        })}
      </Painel>

      <Dialogo
        aberto={Boolean(metaAberta)}
        aoFechar={() => setMetaAberta(null)}
        titulo="Registrar entrega"
        descricao={
          metaAberta
            ? `${metaAberta.item}: faltam ${Math.max(0, metaAberta.metaTotal - entregue(metaAberta))} ${metaAberta.unidade}.`
            : undefined
        }
      >
        <form className="form" onSubmit={aoEnviar} noValidate>
          <Campo rotulo="Fornecedor ou parceiro">
            <input
              className="entrada"
              value={fornecedor}
              onChange={(e) => {
                setFornecedor(e.target.value);
                setErro(null);
              }}
              autoFocus
            />
          </Campo>
          <Campo rotulo={`Quantidade entregue${metaAberta ? ` (${metaAberta.unidade})` : ''}`} erro={erro}>
            <input
              className="entrada"
              type="number"
              inputMode="numeric"
              min={1}
              value={quantidade}
              onChange={(e) => {
                setQuantidade(e.target.value);
                setErro(null);
              }}
            />
          </Campo>
          <div className="dialogo__acoes">
            <button type="button" className="btn btn--secundario" onClick={() => setMetaAberta(null)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primario">
              Registrar entrega
            </button>
          </div>
        </form>
      </Dialogo>
    </>
  );
};

/* --- Vistoria ---------------------------------------------------------------------------------- */

const ListaVistoria: React.FC<{ titulo: string; descricao: string; itens: ItemVistoria[] }> = ({
  titulo,
  descricao,
  itens,
}) => {
  const { alternarVistoria } = useLoja();
  const feitos = itens.filter((i) => i.conferido).length;
  return (
    <Painel
      titulo={titulo}
      descricao={descricao}
      acoes={
        feitos === itens.length ? (
          <Situacao tom="ok">Tudo conferido</Situacao>
        ) : (
          <Situacao tom="alerta" icone={ShieldCheck}>
            {itens.length - feitos} {itens.length - feitos === 1 ? 'pendente' : 'pendentes'}
          </Situacao>
        )
      }
    >
      <div style={{ marginBottom: '1.25rem' }}>
        <Trilho valor={feitos} total={itens.length} rotulo={`${titulo}: itens conferidos`} />
      </div>
      <ul>
        {itens.map((item) => (
          <li key={item.id} className="vistoria__item">
            <Marcar marcado={item.conferido} aoMudar={() => alternarVistoria(item.id)}>
              <span className="vistoria__texto">
                <strong>{item.titulo}</strong>
                <span>
                  {item.setor}. Responsável: {item.responsavel}
                </span>
              </span>
            </Marcar>
          </li>
        ))}
      </ul>
    </Painel>
  );
};

const Vistoria: React.FC = () => {
  const { vistoria } = useLoja();
  return (
    <>
      <Cabecalho
        titulo="Vistoria do local"
        descricao="Marque cada item depois de conferir pessoalmente no Expocentro."
      />
      <div className="grade-2">
        <ListaVistoria
          titulo="Acessibilidade"
          descricao="Rampas, circulação, Libras e sanitários."
          itens={vistoria.filter((v) => v.tipo === 'acessibilidade')}
        />
        <ListaVistoria
          titulo="Segurança"
          descricao="Mesas e arenas, bombeiros e controle de entrada."
          itens={vistoria.filter((v) => v.tipo === 'seguranca')}
        />
      </div>
    </>
  );
};

/* --- Grade de horários --------------------------------------------------------------------------- */

const ALAS = ['Ala 01', 'Ala 02', 'Ala 03', 'Arena Central'];
const DISPUTAS = [
  'Robótica LEGO',
  'Robótica Micro:bit',
  'Seguidor de Linha',
  'Robótica Sumô',
  'Estoura Balão',
  'ArtBot',
  'Projeto de Tecnologia Educacional',
];

const Horarios: React.FC = () => {
  const { horarios, publicarHorario } = useLoja();
  const [aberto, setAberto] = useState(false);
  const [modalidade, setModalidade] = useState(DISPUTAS[0]);
  const [ala, setAla] = useState(ALAS[0]);
  const [inicio, setInicio] = useState('16:00');
  const [fim, setFim] = useState('16:30');
  const [erro, setErro] = useState<string | null>(null);

  const aoEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inicio || !fim || fim <= inicio) return setErro('O término precisa ser depois do início.');
    if (inicio < '09:00' || fim > '18:00') return setErro('O evento acontece das 09:00 às 18:00.');
    const conflito = publicarHorario({
      titulo: modalidade,
      detalhe: 'Rounds oficiais de 3 minutos',
      ala,
      inicio,
      fim,
      equipes: [],
    });
    if (conflito) {
      return setErro(`A ${ala} já está ocupada das ${conflito.inicio} às ${conflito.fim} (${conflito.titulo}).`);
    }
    setAberto(false);
  };

  return (
    <>
      <Cabecalho
        titulo="Grade de horários"
        descricao="As janelas do dia, na ordem em que acontecem. Duas janelas não podem ocupar a mesma ala ao mesmo tempo."
        acoes={
          <button
            type="button"
            className="btn btn--primario"
            onClick={() => {
              setErro(null);
              setAberto(true);
            }}
          >
            <Plus size={18} aria-hidden />
            Publicar janela
          </button>
        }
      />

      <Painel>
        <LinhaDoTempo janelas={horarios} />
      </Painel>

      <Dialogo
        aberto={aberto}
        aoFechar={() => setAberto(false)}
        titulo="Publicar janela"
        descricao="O sistema confere se a ala está livre antes de publicar."
      >
        <form className="form" onSubmit={aoEnviar} noValidate>
          <Campo rotulo="Modalidade">
            <select className="entrada" value={modalidade} onChange={(e) => setModalidade(e.target.value)}>
              {DISPUTAS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Campo>
          <Campo rotulo="Local">
            <select
              className="entrada"
              value={ala}
              onChange={(e) => {
                setAla(e.target.value);
                setErro(null);
              }}
            >
              {ALAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </Campo>
          <div className="form__linha">
            <Campo rotulo="Início">
              <input
                className="entrada"
                type="time"
                min="09:00"
                max="18:00"
                value={inicio}
                onChange={(e) => {
                  setInicio(e.target.value);
                  setErro(null);
                }}
              />
            </Campo>
            <Campo rotulo="Término">
              <input
                className="entrada"
                type="time"
                min="09:00"
                max="18:00"
                value={fim}
                onChange={(e) => {
                  setFim(e.target.value);
                  setErro(null);
                }}
              />
            </Campo>
          </div>
          {erro && (
            <p className="campo__erro" role="alert">
              {erro}
            </p>
          )}
          <div className="dialogo__acoes">
            <button type="button" className="btn btn--secundario" onClick={() => setAberto(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primario">
              <Check size={18} aria-hidden />
              Publicar janela
            </button>
          </div>
        </form>
      </Dialogo>
    </>
  );
};

export const PaginasOrganizador: Record<string, React.FC> = {
  resumo: Resumo,
  mapa: Mapa,
  fornecimento: Fornecimento,
  vistoria: Vistoria,
  horarios: Horarios,
};
