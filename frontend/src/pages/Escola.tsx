import React, { useState } from 'react';
import { Check, FileText, Plus, Trash2, Undo2, Users, X } from 'lucide-react';
import {
  Cabecalho,
  Campo,
  Dialogo,
  Painel,
  Segmentado,
  SituacaoDeclaracao,
  Trilho,
  Vazio,
  iniciais,
} from '../components/ui';
import { ESCOLA_LOGADA, MODALIDADES } from '../data/mockDatabase';
import { Link } from '../lib/router';
import { useLoja } from '../lib/store';
import { ParticipanteInscrito, StatusDeclaracao } from '../types/cjr';

/* Botões de decisão: só aparecem as ações que mudam alguma coisa. */
const Decisao: React.FC<{ aluno: ParticipanteInscrito }> = ({ aluno }) => {
  const { decidirDeclaracao } = useLoja();
  if (aluno.statusDeclaracao === 'aguardando') {
    return (
      <div className="decisao">
        <button type="button" className="btn btn--primario btn--p" onClick={() => decidirDeclaracao(aluno.id, 'aceito')}>
          <Check size={16} aria-hidden />
          Aceitar
        </button>
        <button
          type="button"
          className="btn btn--perigo-quieto btn--p"
          onClick={() => decidirDeclaracao(aluno.id, 'recusado')}
        >
          <X size={16} aria-hidden />
          Recusar
        </button>
      </div>
    );
  }
  return (
    <button type="button" className="btn btn--quieto btn--p" onClick={() => decidirDeclaracao(aluno.id, 'aguardando')}>
      <Undo2 size={16} aria-hidden />
      Rever decisão
    </button>
  );
};

/* --- Resumo ------------------------------------------------------------------------ */

const Resumo: React.FC = () => {
  const { alunosDaEscola, equipesDaEscola, mentores, voluntarios } = useLoja();
  const aceitas = alunosDaEscola.filter((p) => p.statusDeclaracao === 'aceito').length;
  const paraAnalisar = alunosDaEscola.filter((p) => p.statusDeclaracao === 'aguardando');

  return (
    <>
      <Cabecalho
        titulo={ESCOLA_LOGADA}
        descricao="A situação da sua delegação no campeonato."
        acoes={
          <Link para="/painel/equipes" className="btn btn--primario">
            <Plus size={18} aria-hidden />
            Inscrever equipe
          </Link>
        }
      />

      <div className="numeros">
        <div className="numero" data-leitura="">
          <span className="numero__rotulo">Equipes inscritas</span>
          <span className="numero__valor t-num">{equipesDaEscola.length}</span>
          <span className="numero__nota">
            {equipesDaEscola.reduce((soma, e) => soma + e.alunosCount, 0)} alunos no total
          </span>
        </div>
        <div className="numero" data-leitura="">
          <span className="numero__rotulo">Declarações aceitas</span>
          <span className="numero__valor t-num">
            {aceitas}
            <small> de {alunosDaEscola.length}</small>
          </span>
          <Trilho valor={aceitas} total={alunosDaEscola.length} rotulo="Declarações aceitas" fino />
        </div>
        <div className="numero" data-leitura="">
          <span className="numero__rotulo">Mentores</span>
          <span className="numero__valor t-num">{mentores.length}</span>
          <span className="numero__nota">professores orientadores</span>
        </div>
        <div className="numero" data-leitura="">
          <span className="numero__rotulo">Voluntários</span>
          <span className="numero__valor t-num">{voluntarios.length}</span>
          <span className="numero__nota">indicados para o dia</span>
        </div>
      </div>

      <div className="grade-2">
        <Painel
          titulo="Declarações para analisar"
          descricao="Ao aceitar, o ingresso do aluno é liberado na hora."
          acoes={
            <Link para="/painel/declaracoes" className="btn btn--quieto btn--p">
              Ver todas
            </Link>
          }
        >
          {paraAnalisar.length === 0 ? (
            <Vazio icone={Check} titulo="Nada para analisar">
              Todas as declarações enviadas já têm uma decisão.
            </Vazio>
          ) : (
            <ul className="lista-linhas lista-linhas--acoes">
              {paraAnalisar.map((p) => (
                <li key={p.id}>
                  <span className="avatar" aria-hidden>
                    {iniciais(p.nome)}
                  </span>
                  <div className="lista-linhas__texto">
                    <strong>{p.nome}</strong>
                    <span>
                      {p.equipeNome}, enviada em {p.dataEnvioDeclaracao}
                    </span>
                  </div>
                  <Decisao aluno={p} />
                </li>
              ))}
            </ul>
          )}
        </Painel>

        <Painel
          titulo="Equipes da escola"
          acoes={
            <Link para="/painel/equipes" className="btn btn--quieto btn--p">
              Gerenciar
            </Link>
          }
        >
          <ul className="lista-linhas">
            {equipesDaEscola.map((e) => (
              <li key={e.id}>
                <span className="avatar" aria-hidden>
                  <Users size={18} />
                </span>
                <div className="lista-linhas__texto">
                  <strong>{e.nome}</strong>
                  <span>
                    {e.modalidadePrincipal}
                    {e.modalidadeSecundaria ? ` e ${e.modalidadeSecundaria}` : ''}
                  </span>
                </div>
                <span className="etiqueta t-num">{e.horarioPrincipal}</span>
              </li>
            ))}
          </ul>
        </Painel>
      </div>
    </>
  );
};

/* --- Declarações ---------------------------------------------------------------------- */

type Filtro = 'todos' | StatusDeclaracao;

const Declaracoes: React.FC = () => {
  const { alunosDaEscola, avisar } = useLoja();
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const conta = (s: StatusDeclaracao) => alunosDaEscola.filter((p) => p.statusDeclaracao === s).length;
  const visiveis = alunosDaEscola.filter((p) => filtro === 'todos' || p.statusDeclaracao === filtro);

  return (
    <>
      <Cabecalho
        titulo="Declarações"
        descricao="Confira o arquivo enviado por cada aluno. Aceitar libera o ingresso; recusar pede um novo envio."
      />

      <Segmentado
        rotulo="Filtrar por situação"
        valor={filtro}
        aoMudar={setFiltro}
        opcoes={[
          { valor: 'todos', rotulo: 'Todas', numero: alunosDaEscola.length },
          { valor: 'aguardando', rotulo: 'Em análise', numero: conta('aguardando') },
          { valor: 'aceito', rotulo: 'Aceitas', numero: conta('aceito') },
          { valor: 'recusado', rotulo: 'Recusadas', numero: conta('recusado') },
        ]}
      />

      <Painel colado>
        {visiveis.length === 0 ? (
          <Vazio icone={FileText} titulo="Nenhuma declaração nesta situação" />
        ) : (
          <div className="tabela-caixa tabela-caixa--larga">
            <table role="table" className="tabela">
              <thead role="rowgroup">
                <tr role="row">
                  <th role="columnheader">Aluno</th>
                  <th role="columnheader">Responsável</th>
                  <th role="columnheader">Arquivo</th>
                  <th role="columnheader">Situação</th>
                  <th role="columnheader">
                    <span className="sr-only">Decisão</span>
                  </th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {visiveis.map((p) => (
                  <tr role="row" key={p.id}>
                    <td role="cell" data-principal>
                      <strong>{p.nome}</strong>
                      <span className="tabela__sub">{p.equipeNome}</span>
                    </td>
                    <td role="cell" data-rotulo="Responsável">
                      <span>
                        {p.responsavelLegal}
                        <span className="tabela__sub">{p.telefoneResponsavel}</span>
                      </span>
                    </td>
                    <td role="cell" data-rotulo="Arquivo">
                      <button
                        type="button"
                        className="btn btn--secundario btn--p"
                        title={p.arquivoDeclaracao}
                        onClick={() => avisar(`Pré-visualização de ${p.arquivoDeclaracao} indisponível na demonstração.`, 'erro')}
                      >
                        <FileText size={16} aria-hidden />
                        Abrir arquivo
                      </button>
                    </td>
                    <td role="cell" data-rotulo="Situação">
                      <SituacaoDeclaracao status={p.statusDeclaracao} />
                    </td>
                    <td role="cell" data-acoes>
                      <Decisao aluno={p} />
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

/* --- Equipes ----------------------------------------------------------------------------- */

const Equipes: React.FC = () => {
  const { equipesDaEscola, inscreverEquipe } = useLoja();
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [modalidade, setModalidade] = useState(MODALIDADES[0].nome);
  const [alunos, setAlunos] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [novaId, setNovaId] = useState<string | null>(null);

  const nomes = alunos
    .split(/[,\n]/)
    .map((n) => n.trim())
    .filter(Boolean);

  const fechar = () => {
    setAberto(false);
    setErro(null);
  };

  const aoEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return setErro('Dê um nome para a equipe.');
    if (nomes.length < 2) return setErro('Informe pelo menos dois alunos, separados por vírgula.');
    inscreverEquipe({ nome: nome.trim(), modalidade, alunos: nomes.length });
    setNovaId(nome.trim());
    setNome('');
    setAlunos('');
    fechar();
  };

  return (
    <>
      <Cabecalho
        titulo="Equipes"
        descricao="As equipes que representam a escola. A organização define a ala e o horário depois da inscrição."
        acoes={
          <button type="button" className="btn btn--primario" onClick={() => setAberto(true)}>
            <Plus size={18} aria-hidden />
            Inscrever equipe
          </button>
        }
      />

      <Painel colado>
        <div className="tabela-caixa">
          <table role="table" className="tabela">
            <thead role="rowgroup">
              <tr role="row">
                <th role="columnheader">Equipe</th>
                <th role="columnheader">Modalidade</th>
                <th role="columnheader">Mentor</th>
                <th role="columnheader">Local</th>
                <th role="columnheader" data-num>Primeiro round</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {equipesDaEscola.map((e) => (
                <tr role="row" key={e.id} className={e.nome === novaId ? 'linha-nova' : undefined}>
                  <td role="cell" data-principal>
                    <strong>{e.nome}</strong>
                    <span className="tabela__sub">{e.alunosCount} alunos</span>
                  </td>
                  <td role="cell" data-rotulo="Modalidade">
                    <span>
                      {e.modalidadePrincipal}
                      {e.modalidadeSecundaria && <span className="tabela__sub">e {e.modalidadeSecundaria}</span>}
                    </span>
                  </td>
                  <td role="cell" data-rotulo="Mentor">{e.mentorNome}</td>
                  <td role="cell" data-rotulo="Local">{e.local}</td>
                  <td role="cell" data-rotulo="Primeiro round" data-num className="t-num">
                    {e.horarioPrincipal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Painel>

      <Dialogo
        aberto={aberto}
        aoFechar={fechar}
        titulo="Inscrever equipe"
        descricao="Depois da inscrição, cada aluno envia a declaração dos responsáveis pelo próprio painel."
      >
        <form className="form" onSubmit={aoEnviar} noValidate>
          <Campo rotulo="Nome da equipe">
            <input
              className="entrada"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                setErro(null);
              }}
              autoFocus
            />
          </Campo>
          <Campo rotulo="Modalidade">
            <select className="entrada" value={modalidade} onChange={(e) => setModalidade(e.target.value)}>
              {MODALIDADES.map((m) => (
                <option key={m.id}>{m.nome}</option>
              ))}
            </select>
          </Campo>
          <Campo
            rotulo="Alunos"
            ajuda={nomes.length ? `${nomes.length} ${nomes.length === 1 ? 'aluno' : 'alunos'}` : 'Separe os nomes por vírgula.'}
            erro={erro}
          >
            <textarea
              className="entrada"
              rows={3}
              value={alunos}
              onChange={(e) => {
                setAlunos(e.target.value);
                setErro(null);
              }}
            />
          </Campo>
          <div className="dialogo__acoes">
            <button type="button" className="btn btn--secundario" onClick={fechar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primario">
              Inscrever equipe
            </button>
          </div>
        </form>
      </Dialogo>
    </>
  );
};

/* --- Mentores e voluntários ---------------------------------------------------------------- */

const AREAS_MENTOR = ['Robótica LEGO', 'Robótica Micro:bit', 'Seguidor de Linha', 'Sumô e Estoura Balão', 'ArtBot e Projetos'];
const SETORES = ['Portaria e credenciamento', 'Apoio de arena, Ala 01', 'Apoio de arena, Ala 02', 'Apoio de arena, Ala 03'];

const Apoio: React.FC = () => {
  const { mentores, adicionarMentor, removerMentor, voluntarios, adicionarVoluntario, removerVoluntario } = useLoja();
  const [mentor, setMentor] = useState('');
  const [area, setArea] = useState(AREAS_MENTOR[0]);
  const [voluntario, setVoluntario] = useState('');
  const [telefone, setTelefone] = useState('');
  const [setor, setSetor] = useState(SETORES[0]);

  return (
    <>
      <Cabecalho
        titulo="Mentores e voluntários"
        descricao="Quem acompanha as equipes e quem ajuda a organização no dia do evento."
      />

      <div className="grade-2">
        <Painel titulo="Mentores" descricao="Professores que orientam as equipes.">
          <form
            className="add-linha"
            onSubmit={(e) => {
              e.preventDefault();
              if (!mentor.trim()) return;
              adicionarMentor(mentor.trim(), area);
              setMentor('');
            }}
          >
            <Campo rotulo="Nome do professor">
              <input className="entrada" value={mentor} onChange={(e) => setMentor(e.target.value)} />
            </Campo>
            <Campo rotulo="Área">
              <select className="entrada" value={area} onChange={(e) => setArea(e.target.value)}>
                {AREAS_MENTOR.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </Campo>
            <button type="submit" className="btn btn--primario" disabled={!mentor.trim()}>
              Adicionar
            </button>
          </form>

          <ul className="lista-linhas">
            {mentores.map((m) => (
              <li key={m.id}>
                <span className="avatar" aria-hidden>
                  {iniciais(m.nome)}
                </span>
                <div className="lista-linhas__texto">
                  <strong>{m.nome}</strong>
                  <span>{m.area}</span>
                </div>
                <button type="button" className="remover" onClick={() => removerMentor(m.id)} aria-label={`Remover ${m.nome}`}>
                  <Trash2 size={18} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </Painel>

        <Painel titulo="Voluntários" descricao="Pessoas indicadas pela escola para a portaria e as alas.">
          <form
            className="add-linha add-linha--quatro"
            onSubmit={(e) => {
              e.preventDefault();
              if (!voluntario.trim() || !telefone.trim()) return;
              adicionarVoluntario(voluntario.trim(), setor, telefone.trim());
              setVoluntario('');
              setTelefone('');
            }}
          >
            <Campo rotulo="Nome completo">
              <input className="entrada" value={voluntario} onChange={(e) => setVoluntario(e.target.value)} />
            </Campo>
            <Campo rotulo="Telefone">
              <input
                className="entrada"
                type="tel"
                inputMode="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </Campo>
            <Campo rotulo="Onde vai ajudar">
              <select className="entrada" value={setor} onChange={(e) => setSetor(e.target.value)}>
                {SETORES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Campo>
            <button type="submit" className="btn btn--primario" disabled={!voluntario.trim() || !telefone.trim()}>
              Adicionar
            </button>
          </form>

          <ul className="lista-linhas">
            {voluntarios.map((v) => (
              <li key={v.id}>
                <span className="avatar" aria-hidden>
                  {iniciais(v.nome)}
                </span>
                <div className="lista-linhas__texto">
                  <strong>{v.nome}</strong>
                  <span>
                    {v.alocacao}. {v.telefone}
                  </span>
                </div>
                <button
                  type="button"
                  className="remover"
                  onClick={() => removerVoluntario(v.id)}
                  aria-label={`Remover ${v.nome}`}
                >
                  <Trash2 size={18} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </Painel>
      </div>
    </>
  );
};

export const PaginasEscola: Record<string, React.FC> = {
  resumo: Resumo,
  declaracoes: Declaracoes,
  equipes: Equipes,
  apoio: Apoio,
};
