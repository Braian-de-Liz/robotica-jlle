import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Minus, X, XCircle, type LucideIcon } from 'lucide-react';
import { semMovimento } from '../lib/movimento';
import { Notificacao, useLoja } from '../lib/store';
import { StatusDeclaracao } from '../types/cjr';

/* --- Situação ---------------------------------------------------------------- */

type Tom = 'ok' | 'espera' | 'alerta' | 'neutro';

const ICONE_DO_TOM: Record<Tom, LucideIcon> = {
  ok: CheckCircle2,
  espera: Clock,
  alerta: XCircle,
  neutro: Minus,
};

export const Situacao: React.FC<{ tom: Tom; icone?: LucideIcon; children: React.ReactNode }> = ({
  tom,
  icone,
  children,
}) => {
  const Icone = icone ?? ICONE_DO_TOM[tom];
  return (
    <span className={`situacao situacao--${tom}`}>
      <Icone size={16} aria-hidden />
      {children}
    </span>
  );
};

const DECLARACAO: Record<StatusDeclaracao, { tom: Tom; texto: string }> = {
  aceito: { tom: 'ok', texto: 'Aceita' },
  aguardando: { tom: 'espera', texto: 'Em análise' },
  recusado: { tom: 'alerta', texto: 'Recusada' },
};

export const SituacaoDeclaracao: React.FC<{ status: StatusDeclaracao }> = ({ status }) => (
  <Situacao tom={DECLARACAO[status].tom}>{DECLARACAO[status].texto}</Situacao>
);

/* --- Cabeçalho de página ------------------------------------------------------ */

export const Cabecalho: React.FC<{
  titulo: string;
  descricao?: React.ReactNode;
  acoes?: React.ReactNode;
}> = ({ titulo, descricao, acoes }) => (
  <header className="cab">
    <div className="cab__titulos">
      <h1 className="t-h1">{titulo}</h1>
      {descricao && <p className="cab__desc">{descricao}</p>}
    </div>
    {acoes && <div className="cab__acoes">{acoes}</div>}
  </header>
);

/* --- Painel ------------------------------------------------------------------- */

export const Painel: React.FC<{
  titulo?: string;
  descricao?: React.ReactNode;
  acoes?: React.ReactNode;
  colado?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ titulo, descricao, acoes, colado, className = '', children }) => (
  <section className={`painel ${colado ? 'painel--colado' : ''} ${className}`}>
    {(titulo || acoes) && (
      <div className="painel__topo">
        <div className="painel__titulos">
          {titulo && <h2 className="t-h2">{titulo}</h2>}
          {descricao && <p className="painel__desc">{descricao}</p>}
        </div>
        {acoes}
      </div>
    )}
    <div className="painel__corpo">{children}</div>
  </section>
);

/* --- Campo de formulário ------------------------------------------------------- */

export const Campo: React.FC<{
  rotulo: string;
  ajuda?: string;
  erro?: string | null;
  children: React.ReactNode;
}> = ({ rotulo, ajuda, erro, children }) => (
  <label className="campo">
    <span className="campo__rotulo">{rotulo}</span>
    {children}
    {erro ? (
      <span className="campo__erro" role="alert">
        <AlertCircle size={15} aria-hidden />
        {erro}
      </span>
    ) : (
      ajuda && <span className="campo__ajuda">{ajuda}</span>
    )}
  </label>
);

/* --- Seletor segmentado --------------------------------------------------------- */

interface OpcaoSeg<T extends string> {
  valor: T;
  rotulo: string;
  numero?: number;
}

export function Segmentado<T extends string>({
  opcoes,
  valor,
  aoMudar,
  rotulo,
}: {
  opcoes: OpcaoSeg<T>[];
  valor: T;
  aoMudar: (valor: T) => void;
  rotulo: string;
}) {
  const indice = Math.max(
    0,
    opcoes.findIndex((o) => o.valor === valor)
  );
  return (
    <div
      className="seg"
      role="group"
      aria-label={rotulo}
      style={{ '--n': opcoes.length, '--i': indice } as React.CSSProperties}
    >
      <span className="seg__indicador" aria-hidden />
      {opcoes.map((o) => (
        <button
          key={o.valor}
          type="button"
          className="seg__opcao"
          aria-pressed={o.valor === valor}
          onClick={() => aoMudar(o.valor)}
        >
          {o.rotulo}
          {o.numero !== undefined && <span className="seg__num">{o.numero}</span>}
        </button>
      ))}
    </div>
  );
}

/* --- Trilho de progresso --------------------------------------------------------- */

export const Trilho: React.FC<{ valor: number; total: number; rotulo: string; fino?: boolean }> = ({
  valor,
  total,
  rotulo,
  fino,
}) => {
  const pct = total > 0 ? Math.min(100, Math.round((valor / total) * 100)) : 0;
  return (
    <div
      className={`trilho ${fino ? 'trilho--fino' : ''}`}
      role="progressbar"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={Math.min(valor, total)}
    >
      <div className="trilho__valor" style={{ '--pct': `${pct}%` } as React.CSSProperties} />
    </div>
  );
};

/* --- Caixa de marcação ------------------------------------------------------------ */

export const Marcar: React.FC<{
  marcado: boolean;
  aoMudar: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ marcado, aoMudar, children, className = '' }) => (
  <label className={`marcar ${className}`}>
    <input type="checkbox" checked={marcado} onChange={aoMudar} />
    <span className="marcar__caixa" aria-hidden>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    {children}
  </label>
);

/* --- Diálogo ------------------------------------------------------------------------ */

export const Dialogo: React.FC<{
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
}> = ({ aberto, aoFechar, titulo, descricao, children }) => {
  const ref = useRef<HTMLDialogElement>(null);
  const [fechando, setFechando] = useState(false);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;

    if (aberto && !dialogo.open) {
      setFechando(false);
      dialogo.showModal();
      return;
    }

    if (!aberto && dialogo.open) {
      setFechando(true);
      const fim = window.setTimeout(() => {
        dialogo.close();
        setFechando(false);
      }, 240);
      return () => window.clearTimeout(fim);
    }
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      className="dialogo"
      data-fechando={fechando || undefined}
      aria-labelledby="dialogo-titulo"
      onCancel={(e) => {
        e.preventDefault();
        aoFechar();
      }}
      onClick={(e) => {
        if (e.target === ref.current) aoFechar();
      }}
    >
      {(aberto || fechando) && (
        <>
          <div className="dialogo__topo">
            <div>
              <h2 className="t-h2" id="dialogo-titulo">
                {titulo}
              </h2>
              {descricao && <p className="dialogo__desc">{descricao}</p>}
            </div>
            <button type="button" className="dialogo__fechar" onClick={aoFechar} aria-label="Fechar">
              <X size={20} aria-hidden />
            </button>
          </div>
          <div className="dialogo__corpo">{children}</div>
        </>
      )}
    </dialog>
  );
};

/* --- Notificações --------------------------------------------------------------------- */

const TEMPO_DO_AVISO = 6500;

/* Cada aviso conta o próprio tempo e pausa enquanto a pessoa está lendo
   (mouse em cima ou foco no botão de fechar). */
const Aviso: React.FC<{ aviso: Notificacao; aoDispensar: () => void }> = ({ aviso, aoDispensar }) => {
  const [pausado, setPausado] = useState(false);
  const restante = useRef(TEMPO_DO_AVISO);
  const dispensar = useRef(aoDispensar);
  dispensar.current = aoDispensar;

  useEffect(() => {
    if (pausado || aviso.saindo) return;
    const inicio = Date.now();
    /* Ao retomar depois de uma pausa, sobra pelo menos 1,5 s para terminar de ler. */
    const fim = window.setTimeout(() => dispensar.current(), Math.max(1500, restante.current));
    return () => {
      window.clearTimeout(fim);
      restante.current -= Date.now() - inicio;
    };
  }, [pausado, aviso.saindo]);

  return (
    <div
      className={`aviso ${aviso.tom === 'erro' ? 'aviso--erro' : ''}`}
      data-saindo={aviso.saindo || undefined}
      data-pausado={pausado || undefined}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      {aviso.tom === 'erro' ? <AlertCircle size={18} aria-hidden /> : <CheckCircle2 size={18} aria-hidden />}
      <span>{aviso.texto}</span>
      <button type="button" className="aviso__fechar" onClick={aoDispensar} aria-label="Fechar aviso">
        <X size={16} aria-hidden />
      </button>
    </div>
  );
};

export const Notificacoes: React.FC<{ comAbas?: boolean }> = ({ comAbas }) => {
  const { notificacoes, dispensar } = useLoja();
  return (
    <div className={`avisos ${comAbas ? 'avisos--com-abas' : ''}`} role="status" aria-live="polite">
      {notificacoes.map((n) => (
        <Aviso key={n.id} aviso={n} aoDispensar={() => dispensar(n.id)} />
      ))}
    </div>
  );
};

/* --- Estado vazio ------------------------------------------------------------------------ */

export const Vazio: React.FC<{ icone: LucideIcon; titulo: string; children?: React.ReactNode }> = ({
  icone: Icone,
  titulo,
  children,
}) => (
  <div className="vazio">
    <Icone size={28} aria-hidden />
    <strong>{titulo}</strong>
    {children && <p className="t-small">{children}</p>}
  </div>
);

/* --- Número que desliza até o novo valor -------------------------------------------------- */

export const useNumeroAnimado = (alvo: number, duracao = 500) => {
  const [valor, setValor] = useState(alvo);
  const anterior = useRef(alvo);

  useEffect(() => {
    const de = anterior.current;
    if (semMovimento() || de === alvo) {
      anterior.current = alvo;
      setValor(alvo);
      return;
    }
    let quadro = 0;
    const inicio = performance.now();
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / duracao);
      const suave = 1 - Math.pow(1 - t, 4);
      const atual = de + (alvo - de) * suave;
      anterior.current = atual;
      setValor(atual);
      if (t < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [alvo, duracao]);

  return valor;
};

export const iniciais = (nome: string) =>
  nome
    .replace(/^(Prof\.|Profa\.|Eng\.|Dra\.|Dr\.|E\.M\.)\s+/i, '')
    .split(/\s+/)
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
