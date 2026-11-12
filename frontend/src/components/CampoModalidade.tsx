import React from 'react';
import { ModalidadeOficial } from '../types/cjr';

/* Vista de cima do campo de cada modalidade, nas proporções reais:
   mesa de 2357 × 1143 mm, arena circular de 160 cm, arena hexagonal de 1660 mm. */

const TRACO = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const FINO = { ...TRACO, strokeWidth: 1.25, opacity: 0.55 } as const;

const desenhos: Record<ModalidadeOficial['campo'], React.ReactNode> = {
  mesa: (
    <>
      <rect x="10" y="24" width="124" height="60" rx="3" {...TRACO} />
      <rect x="16" y="30" width="112" height="48" rx="1" {...FINO} />
      <rect x="20" y="34" width="20" height="16" {...FINO} />
      <circle cx="104" cy="62" r="8" {...FINO} />
      <path d="M52 70h28" {...FINO} />
      <rect x="64" y="44" width="16" height="12" rx="3" fill="currentColor" stroke="none" />
    </>
  ),
  'mesa-linha': (
    <>
      <rect x="10" y="24" width="124" height="60" rx="3" {...TRACO} />
      <path
        d="M22 70V46q0-10 10-10h14q10 0 10 10v14q0 10 10 10h10q10 0 10-10V46q0-10 10-10h16q10 0 10 10v24"
        {...TRACO}
        strokeWidth={3.5}
      />
      <rect x="15" y="62" width="14" height="12" rx="3" fill="currentColor" stroke="none" />
    </>
  ),
  sumo: (
    <>
      <circle cx="72" cy="54" r="38" {...TRACO} />
      <circle cx="72" cy="54" r="31" {...FINO} />
      <path d="M62 44v20M82 44v20" {...TRACO} />
      <rect x="44" y="48" width="12" height="12" rx="3" fill="currentColor" stroke="none" />
      <rect x="88" y="48" width="12" height="12" rx="3" {...TRACO} />
    </>
  ),
  hexagono: (
    <>
      <path d="M53 21h38l19 33-19 33H53L34 54z" {...TRACO} />
      <path d="M57 28h30l15 26-15 26H57L42 54z" {...FINO} />
      <circle cx="62" cy="54" r="7" {...TRACO} />
      <circle cx="84" cy="54" r="7" fill="currentColor" stroke="none" />
    </>
  ),
  folha: (
    <>
      <rect x="34" y="18" width="76" height="72" rx="3" {...TRACO} />
      <path d="M46 70c6-22 14-24 18-10s10 8 14-8 12-18 20-6" {...TRACO} strokeWidth={3} />
      <rect x="91" y="40" width="13" height="12" rx="3" fill="currentColor" stroke="none" />
    </>
  ),
  estande: (
    <>
      <path d="M26 26h92v20" {...TRACO} />
      <path d="M26 26v56h92V46" {...FINO} />
      <rect x="44" y="54" width="56" height="18" rx="3" {...TRACO} />
      <circle cx="58" cy="63" r="3.5" fill="currentColor" stroke="none" />
      <path d="M68 63h22" {...FINO} />
    </>
  ),
};

export const CampoModalidade: React.FC<{ campo: ModalidadeOficial['campo'] }> = ({ campo }) => (
  <svg className="campo-modalidade" viewBox="0 0 144 108" aria-hidden>
    {desenhos[campo]}
  </svg>
);
