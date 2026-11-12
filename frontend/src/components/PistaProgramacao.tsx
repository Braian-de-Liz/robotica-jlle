import React, { useEffect, useState } from 'react';
import { useLoja } from '../lib/store';

/* A programação do dia desenhada como uma pista de seguidor de linha:
   a linha é traçada ao carregar a página e um robô passa a percorrê-la.
   No celular a mesma lista vira uma linha do tempo vertical. */

interface Parada {
  hora: string;
  titulo: string;
  local: string;
}

const LARGURA = 1200;
const ALTURA = 220;
const TOPO = 30;
const BASE = 190;
const RAIO = 30;

const montarCaminho = (paradas: number) => {
  const passo = LARGURA / paradas;
  let d = `M -600 ${BASE}`;
  for (let i = 1; i < paradas; i++) {
    const x = passo * i;
    const sobe = i % 2 === 1;
    const de = sobe ? BASE : TOPO;
    const para = sobe ? TOPO : BASE;
    const curva = sobe ? -RAIO : RAIO;
    d += ` H ${x - RAIO} Q ${x} ${de} ${x} ${de + curva} V ${para - curva} Q ${x} ${para} ${x + RAIO} ${para}`;
  }
  return `${d} H ${LARGURA + 600}`;
};

export const PistaProgramacao: React.FC<{ paradas: Parada[] }> = ({ paradas }) => {
  const { reduzirMovimento } = useLoja();
  const [sistemaPedeMenos, setSistemaPedeMenos] = useState(true);

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    const atualizar = () => setSistemaPedeMenos(consulta.matches);
    atualizar();
    consulta.addEventListener('change', atualizar);
    return () => consulta.removeEventListener('change', atualizar);
  }, []);

  const comMovimento = !sistemaPedeMenos && !reduzirMovimento;

  const n = paradas.length;
  const passo = LARGURA / n;
  const caminho = montarCaminho(n);

  return (
    <div className="pista" style={{ '--n': n } as React.CSSProperties}>
      <svg className="pista__svg" viewBox={`0 0 ${LARGURA} ${ALTURA}`} aria-hidden>
        <path id="pista-caminho" className="pista__linha" d={caminho} pathLength={1} />
        {paradas.map((p, i) => (
          <circle
            key={p.hora}
            className="pista__marco"
            cx={passo * i + passo / 2}
            cy={i % 2 === 0 ? BASE : TOPO}
            r={8}
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}
        {comMovimento ? (
          <g>
            {/* begin negativo: o robô já entra em cena logo depois de a linha ser traçada */}
            <animateMotion dur="34s" begin="-4s" repeatCount="indefinite" rotate="auto">
              <mpath href="#pista-caminho" />
            </animateMotion>
            <Robo />
          </g>
        ) : (
          <g transform={`translate(${passo / 2 + 34} ${BASE})`}>
            <Robo />
          </g>
        )}
      </svg>

      <ol className="pista__paradas">
        {paradas.map((p, i) => (
          <li
            key={p.hora}
            className={`pista__parada ${i % 2 === 0 ? 'pista__parada--base' : 'pista__parada--topo'}`}
            style={{ '--i': i } as React.CSSProperties}
          >
            <time className="t-num">{p.hora}</time>
            <strong>{p.titulo}</strong>
            <span>{p.local}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

const Robo: React.FC = () => (
  <g className="pista__robo" transform="scale(1.25)">
    <rect x="-9" y="-16" width="16" height="5" rx="2.5" />
    <rect x="-9" y="11" width="16" height="5" rx="2.5" />
    <rect className="pista__robo-corpo" x="-15" y="-12" width="30" height="24" rx="7" />
    <circle className="pista__robo-sensor" cx="8" cy="0" r="3.5" />
  </g>
);
