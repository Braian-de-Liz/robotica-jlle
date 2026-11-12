import React, { useState } from 'react';
import { Check, QrCode as IconeQr, ShieldAlert, ShieldCheck, UserPlus } from 'lucide-react';
import { Cabecalho, Campo, Painel, Situacao, Vazio } from '../components/ui';
import { useLoja } from '../lib/store';

const Presentes: React.FC = () => {
  const { publicoPresente } = useLoja();
  return (
    <span className="etiqueta" style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}>
      <strong className="t-num">{publicoPresente}</strong> pessoas no evento
    </span>
  );
};

/* --- Leitor de ingresso ------------------------------------------------------------- */

const Leitor: React.FC = () => {
  const { participantes, registrarEntrada, avisar } = useLoja();
  const [lidoId, setLidoId] = useState<string | null>(null);
  const [codigo, setCodigo] = useState('');
  const lido = participantes.find((p) => p.id === lidoId) ?? null;
  const liberado = lido?.statusDeclaracao === 'aceito';

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    const alvo = participantes.find((p) => p.qrCodeToken.toLowerCase() === codigo.trim().toLowerCase());
    if (!alvo) {
      avisar('Código não encontrado. Confira os números com o participante.', 'erro');
      return;
    }
    setLidoId(alvo.id);
    setCodigo('');
  };

  return (
    <>
      <Cabecalho
        titulo="Leitor de ingresso"
        descricao="Aponte para o QR Code do participante. O sistema diz se a entrada está liberada e para onde ele vai."
        acoes={<Presentes />}
      />

      <div className="grade-2">
        <div className="leitor">
          <div className="leitor__visor" aria-hidden>
            <IconeQr size={72} strokeWidth={1.25} />
            <span className="leitor__feixe" />
          </div>
          <p>Câmera indisponível na demonstração. Simule a leitura de um ingresso ou digite o código.</p>

          <div className="leitor__simular">
            {participantes.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`btn btn--p ${p.id === lidoId ? 'btn--na-marca' : 'btn--na-marca-vazado'}`}
                onClick={() => setLidoId(p.id)}
              >
                {p.nome.split(' ')[0]}
              </button>
            ))}
          </div>

          <form className="leitor__manual" onSubmit={buscar}>
            <label className="campo">
              <span className="campo__rotulo">Código do ingresso</span>
              <input
                className="entrada t-code"
                placeholder="CJR-2026-ALUNO-0000"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                autoCapitalize="characters"
              />
            </label>
            <button type="submit" className="btn btn--na-marca" disabled={!codigo.trim()}>
              Buscar
            </button>
          </form>
        </div>

        {lido ? (
          <article className="veredito" data-retido={!liberado || undefined} key={lido.id} aria-live="polite">
            <div className="veredito__faixa">
              {liberado ? <ShieldCheck size={32} aria-hidden /> : <ShieldAlert size={32} aria-hidden />}
              <div>
                <strong>{liberado ? 'Entrada liberada' : 'Entrada retida'}</strong>
                <span>
                  {liberado
                    ? 'Declaração dos responsáveis aceita pela escola.'
                    : lido.statusDeclaracao === 'recusado'
                      ? 'A escola recusou a declaração dos responsáveis.'
                      : 'A escola ainda não analisou a declaração.'}
                </span>
              </div>
            </div>

            <div>
              <h2>{lido.nome}</h2>
              <p className="t-muted">
                {lido.equipeNome}, {lido.escolaNome}
              </p>
              <p className="t-code t-small t-muted" style={{ marginTop: '0.25rem' }}>
                {lido.qrCodeToken}
              </p>
            </div>

            {liberado ? (
              <>
                <div>
                  <h3 className="t-h3" style={{ marginBottom: '0.625rem' }}>
                    Para onde encaminhar
                  </h3>
                  <ul className="veredito__rumo">
                    {lido.modalidades.flatMap((m) =>
                      m.sessoes.map((s) => (
                        <li key={`${m.nome}-${s.hora}`}>
                          <time className="t-num">{s.hora}</time>
                          <div>
                            <strong>
                              {m.ala}, {m.local}
                            </strong>
                            <span>
                              {s.rotulo} de {m.nome}
                            </span>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {lido.presencaConfirmada ? (
                  <Situacao tom="ok">Entrada registrada às {lido.horarioEntrada}</Situacao>
                ) : (
                  <button type="button" className="btn btn--primario btn--bloco" onClick={() => registrarEntrada(lido.id)}>
                    <Check size={18} aria-hidden />
                    Registrar entrada
                  </button>
                )}
              </>
            ) : (
              <p>
                Não libere a entrada. Oriente o participante a procurar o professor mentor da equipe ou a coordenação
                da escola. Responsável cadastrado: <strong>{lido.responsavelLegal}</strong>, {lido.telefoneResponsavel}.
              </p>
            )}
          </article>
        ) : (
          <Painel>
            <Vazio icone={IconeQr} titulo="Nenhum ingresso lido">
              O resultado da leitura aparece aqui.
            </Vazio>
          </Painel>
        )}
      </div>
    </>
  );
};

/* --- Convidados ------------------------------------------------------------------------ */

const Convidados: React.FC = () => {
  const { convidados, registrarConvidado } = useLoja();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [novoId, setNovoId] = useState<string | null>(null);

  const aoEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim()) {
      setErro('Preencha o nome e o telefone do convidado.');
      return;
    }
    registrarConvidado(nome.trim(), telefone.trim());
    setNovoId(nome.trim());
    setNome('');
    setTelefone('');
    setErro(null);
  };

  return (
    <>
      <Cabecalho
        titulo="Convidados"
        descricao="Familiares e visitantes entram com nome e telefone. O registro leva alguns segundos."
        acoes={<Presentes />}
      />

      <Painel titulo="Registrar entrada">
        <form className="rapido" onSubmit={aoEnviar} noValidate>
          <Campo rotulo="Nome completo" erro={erro}>
            <input
              className="entrada"
              autoComplete="off"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                setErro(null);
              }}
            />
          </Campo>
          <Campo rotulo="Telefone">
            <input
              className="entrada"
              type="tel"
              inputMode="tel"
              autoComplete="off"
              placeholder="(47) 99999-0000"
              value={telefone}
              onChange={(e) => {
                setTelefone(e.target.value);
                setErro(null);
              }}
            />
          </Campo>
          <button type="submit" className="btn btn--primario">
            <UserPlus size={18} aria-hidden />
            Registrar entrada
          </button>
        </form>
      </Painel>

      <Painel colado titulo="Entradas de hoje" descricao={`${convidados.length} convidados registrados nesta portaria`}>
        <div className="tabela-caixa">
          <table role="table" className="tabela">
            <thead role="rowgroup">
              <tr role="row">
                <th role="columnheader">Convidado</th>
                <th role="columnheader">Telefone</th>
                <th role="columnheader">Atendente</th>
                <th role="columnheader" data-num>Entrada</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {convidados.map((c) => (
                <tr role="row" key={c.id} className={c.nome === novoId ? 'linha-nova' : undefined}>
                  <td role="cell" data-principal>
                    <strong>{c.nome}</strong>
                  </td>
                  <td role="cell" data-rotulo="Telefone">{c.telefone}</td>
                  <td role="cell" data-rotulo="Atendente">{c.atendente}</td>
                  <td role="cell" data-rotulo="Entrada" data-num className="t-num">
                    {c.horarioEntrada}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Painel>
    </>
  );
};

export const PaginasPortaria: Record<string, React.FC> = {
  leitor: Leitor,
  convidados: Convidados,
};
