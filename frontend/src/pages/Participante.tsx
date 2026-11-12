import React, { useState } from 'react';
import { Download, FileText, Lock, MapPin, Ticket, Upload, Users } from 'lucide-react';
import { Chaveamento } from '../components/Chaveamento';
import { QrCode } from '../components/QrCode';
import { Cabecalho, Painel, SituacaoDeclaracao } from '../components/ui';
import { CHAVEAMENTO, EVENTO, MODELO_DECLARACAO_URL } from '../data/mockDatabase';
import { Link } from '../lib/router';
import { useLoja } from '../lib/store';

/** Seletor só para a demonstração: troca o aluno "logado" para ver os três estados da declaração. */
const TrocarAluno: React.FC = () => {
  const { participantes, alunoAtual, trocarAluno } = useLoja();
  return (
    <label className="cab__demo">
      Aluno (demonstração)
      <select className="entrada" value={alunoAtual.id} onChange={(e) => trocarAluno(e.target.value)}>
        {participantes.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
        ))}
      </select>
    </label>
  );
};

/* --- Minha agenda -------------------------------------------------------------- */

const Agenda: React.FC = () => {
  const { alunoAtual } = useLoja();
  const sessoes = alunoAtual.modalidades
    .flatMap((m) => m.sessoes.map((s) => ({ ...s, modalidade: m.nome, ala: m.ala, local: m.local })))
    .sort((a, b) => a.hora.localeCompare(b.hora));
  const liberado = alunoAtual.statusDeclaracao === 'aceito';

  return (
    <>
      <Cabecalho
        titulo={`Olá, ${alunoAtual.nome.split(' ')[0]}`}
        descricao={`Estes são os seus horários no ${EVENTO.sede}. Chegue à ala 15 minutos antes de cada um.`}
        acoes={<TrocarAluno />}
      />

      {!liberado && (
        <div className="alerta">
          <div className="alerta__texto">
            <Lock size={20} aria-hidden />
            <div>
              <strong>
                {alunoAtual.statusDeclaracao === 'recusado'
                  ? 'A escola recusou a sua declaração'
                  : 'Sua declaração está em análise'}
              </strong>
              <span>
                {alunoAtual.statusDeclaracao === 'recusado'
                  ? 'Envie uma nova foto ou PDF da declaração assinada para liberar o ingresso.'
                  : 'O ingresso é liberado assim que a escola aceitar o arquivo.'}
              </span>
            </div>
          </div>
          <Link para="/painel/declaracao" className="btn btn--secundario btn--p">
            Ver declaração
          </Link>
        </div>
      )}

      <div className="grade-lateral">
        <Painel titulo="Seus horários" descricao={`${sessoes.length} compromissos no dia da competição`}>
          <ol className="agenda">
            {sessoes.map((s) => (
              <li
                key={`${s.hora}-${s.modalidade}`}
                className={`agenda__item ${s.rotulo.startsWith('Treino') ? '' : 'agenda__item--oficial'}`}
              >
                <time className="agenda__hora t-num">
                  {s.hora}
                  <small>{s.duracao}</small>
                </time>
                <div>
                  <p className="agenda__titulo">{s.rotulo}</p>
                  <p className="agenda__detalhe">{s.modalidade}</p>
                  <div className="agenda__etiquetas">
                    <span className="etiqueta">
                      <MapPin size={13} aria-hidden />
                      {s.ala}, {s.local}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Painel>

        <Painel titulo="Sua equipe">
          <ul className="lista-linhas">
            <li>
              <span className="avatar" aria-hidden>
                <Users size={18} />
              </span>
              <div className="lista-linhas__texto">
                <strong>{alunoAtual.equipeNome}</strong>
                <span>{alunoAtual.escolaNome}</span>
              </div>
            </li>
            <li>
              <span className="avatar" aria-hidden>
                <FileText size={18} />
              </span>
              <div className="lista-linhas__texto">
                <strong>Declaração dos responsáveis</strong>
                <SituacaoDeclaracao status={alunoAtual.statusDeclaracao} />
              </div>
            </li>
            <li>
              <span className="avatar" aria-hidden>
                <Ticket size={18} />
              </span>
              <div className="lista-linhas__texto">
                <strong>Ingresso</strong>
                <span>{liberado ? 'Liberado para a portaria' : 'Aguardando a declaração'}</span>
              </div>
              {liberado && (
                <Link para="/painel/ingresso" className="btn btn--quieto btn--p">
                  Abrir
                </Link>
              )}
            </li>
          </ul>
        </Painel>
      </div>
    </>
  );
};

/* --- Declaração ------------------------------------------------------------------ */

const Declaracao: React.FC = () => {
  const { alunoAtual, enviarDeclaracao, avisar } = useLoja();
  const [sobre, setSobre] = useState(false);
  const status = alunoAtual.statusDeclaracao;

  const receber = (arquivo?: File) => {
    if (!arquivo) return;
    if (!/\.(pdf|jpe?g|png)$/i.test(arquivo.name)) {
      avisar('Envie um arquivo PDF, JPG ou PNG.', 'erro');
      return;
    }
    enviarDeclaracao(arquivo.name);
  };

  const passos: { titulo: string; texto: string; estado: 'feito' | 'atual' | 'futuro' | 'problema' }[] = [
    { titulo: 'Baixar o modelo', texto: 'Imprima para o responsável assinar.', estado: 'feito' },
    {
      titulo: 'Enviar a declaração assinada',
      texto: status === 'recusado' ? 'O arquivo enviado foi recusado.' : 'Foto ou PDF, com a assinatura legível.',
      estado: status === 'recusado' ? 'problema' : 'feito',
    },
    {
      titulo: 'A escola confere',
      texto: status === 'aceito' ? 'Declaração aceita. Ingresso liberado.' : 'Depois disso o ingresso é liberado.',
      estado: status === 'aceito' ? 'feito' : status === 'aguardando' ? 'atual' : 'futuro',
    },
  ];

  return (
    <>
      <Cabecalho
        titulo="Declaração dos responsáveis"
        descricao="Menores de idade só entram no evento com a declaração assinada por um responsável e aceita pela escola."
        acoes={<TrocarAluno />}
      />

      <Painel>
        <ol className="passos">
          {passos.map((p, i) => (
            <li key={p.titulo} className="passo" data-estado={p.estado}>
              <span className="passo__num t-num" aria-hidden>
                {i + 1}
              </span>
              <div className="passo__texto">
                <strong>{p.titulo}</strong>
                <span>{p.texto}</span>
              </div>
            </li>
          ))}
        </ol>
      </Painel>

      <div className="grade-2">
        <Painel
          titulo="Arquivo enviado"
          descricao={`Responsável cadastrado: ${alunoAtual.responsavelLegal}`}
          acoes={<SituacaoDeclaracao status={status} />}
        >
          <div className="arquivo">
            <div className="arquivo__nome">
              <FileText size={22} aria-hidden />
              <div>
                <strong>{alunoAtual.arquivoDeclaracao}</strong>
                <span>Enviado em {alunoAtual.dataEnvioDeclaracao}</span>
              </div>
            </div>
          </div>

          {status === 'recusado' && (
            <div className="alerta" style={{ marginTop: '1rem' }}>
              <div className="alerta__texto">
                <Lock size={20} aria-hidden />
                <div>
                  <strong>A escola não aceitou este arquivo</strong>
                  <span>Confira se a assinatura do responsável aparece e envie de novo.</span>
                </div>
              </div>
            </div>
          )}
        </Painel>

        <Painel
          titulo={status === 'aceito' ? 'Precisa trocar o arquivo?' : 'Enviar a declaração'}
          descricao={
            status === 'aceito'
              ? 'Um novo envio volta para a análise da escola.'
              : 'A escola recebe o arquivo na hora.'
          }
        >
          <label
            className="envio"
            data-sobre={sobre || undefined}
            onDragOver={(e) => {
              e.preventDefault();
              setSobre(true);
            }}
            onDragLeave={() => setSobre(false)}
            onDrop={(e) => {
              e.preventDefault();
              setSobre(false);
              receber(e.dataTransfer.files?.[0]);
            }}
          >
            <Upload size={28} aria-hidden />
            <strong>Escolher arquivo ou tirar foto</strong>
            <span>PDF, JPG ou PNG. No computador, também dá para arrastar o arquivo até aqui.</span>
            <input
              type="file"
              className="sr-only"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                receber(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </label>
          {MODELO_DECLARACAO_URL ? (
            <a href={MODELO_DECLARACAO_URL} download className="btn btn--quieto btn--p btn--quebra" style={{ marginTop: '0.75rem' }}>
              <Download size={16} aria-hidden />
              Baixar o modelo da declaração
            </a>
          ) : (
            <button
              type="button"
              className="btn btn--quieto btn--p btn--quebra"
              style={{ marginTop: '0.75rem' }}
              onClick={() => avisar('O modelo da declaração ainda não foi publicado pela organização.', 'erro')}
            >
              <Download size={16} aria-hidden />
              Baixar o modelo da declaração
            </button>
          )}
        </Painel>
      </div>
    </>
  );
};

/* --- Ingresso ---------------------------------------------------------------------- */

const Ingresso: React.FC = () => {
  const { alunoAtual } = useLoja();
  const liberado = alunoAtual.statusDeclaracao === 'aceito';
  const alas = [...new Set(alunoAtual.modalidades.map((m) => m.ala))].join(' e ');

  return (
    <>
      <Cabecalho
        titulo="Ingresso"
        descricao="Mostre este código na portaria. Ele é pessoal e vale para o dia inteiro."
        acoes={<TrocarAluno />}
      />

      <div className="ingresso" key={alunoAtual.id}>
        <div className="ingresso__topo">
          <div>
            <strong>
              CJR {EVENTO.ano}
            </strong>
            <span>{EVENTO.sede}</span>
          </div>
          <img src="/logo-cjr-256.png" alt="" />
        </div>

        <div className="ingresso__qr" data-bloqueado={!liberado || undefined}>
          <QrCode
            valor={liberado ? alunoAtual.qrCodeToken : 'CJR-INGRESSO-BLOQUEADO'}
            rotulo={liberado ? `QR Code do ingresso de ${alunoAtual.nome}` : 'Ingresso bloqueado'}
          />
          {!liberado && (
            <div className="ingresso__trava">
              <Lock size={32} aria-hidden />
              <strong>Ingresso bloqueado</strong>
              <span>
                {alunoAtual.statusDeclaracao === 'recusado'
                  ? 'A declaração foi recusada. Envie uma nova para liberar.'
                  : 'Será liberado quando a escola aceitar a sua declaração.'}
              </span>
              <Link para="/painel/declaracao" className="btn btn--primario btn--p">
                Ver declaração
              </Link>
            </div>
          )}
        </div>
        {liberado && <span className="ingresso__codigo t-code">{alunoAtual.qrCodeToken}</span>}

        <div className="ingresso__picote" aria-hidden />

        <dl className="ingresso__dados">
          <div className="largo">
            <dt>Participante</dt>
            <dd>{alunoAtual.nome}</dd>
          </div>
          <div>
            <dt>Equipe</dt>
            <dd>{alunoAtual.equipeNome}</dd>
          </div>
          <div>
            <dt>Acesso</dt>
            <dd>{alas}</dd>
          </div>
          <div className="largo">
            <dt>Escola</dt>
            <dd>{alunoAtual.escolaNome}</dd>
          </div>
        </dl>
      </div>
    </>
  );
};

/* --- Chaveamento ---------------------------------------------------------------------- */

const ChavesDoAluno: React.FC = () => {
  const { alunoAtual } = useLoja();
  return (
    <>
      <Cabecalho
        titulo="Chaveamento"
        descricao={`${CHAVEAMENTO.modalidade}, ${CHAVEAMENTO.local}. A sua equipe aparece destacada.`}
        acoes={<TrocarAluno />}
      />
      <Painel>
        <Chaveamento minhaEquipe={alunoAtual.equipeNome} />
      </Painel>
    </>
  );
};

export const PaginasParticipante: Record<string, React.FC> = {
  agenda: Agenda,
  declaracao: Declaracao,
  ingresso: Ingresso,
  chaveamento: ChavesDoAluno,
};
