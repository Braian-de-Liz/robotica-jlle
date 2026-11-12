import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { CHAVEAMENTO } from '../data/mockDatabase';
import { FaseChaveamento, PartidaChaveamento } from '../types/cjr';
import { Segmentado } from './ui';

const FASES: { valor: FaseChaveamento; rotulo: string; titulo: string }[] = [
  { valor: 'quartas', rotulo: 'Quartas', titulo: 'Quartas de final' },
  { valor: 'semifinal', rotulo: 'Semifinais', titulo: 'Semifinais' },
  { valor: 'final', rotulo: 'Final', titulo: 'Final' },
];

const Equipe: React.FC<{
  nome: string;
  pontos: number | null;
  venceu: boolean;
  perdeu: boolean;
  minha: boolean;
}> = ({ nome, pontos, venceu, perdeu, minha }) => (
  <div
    className="partida__equipe"
    data-venceu={venceu || undefined}
    data-perdeu={perdeu || undefined}
    data-minha={minha || undefined}
  >
    <span className="partida__nome">
      {nome}
      {minha && <span className="partida__sua">sua equipe</span>}
      {venceu && <span className="sr-only"> (venceu)</span>}
    </span>
    <span className="partida__pontos t-num">{pontos ?? <span aria-label="a disputar">–</span>}</span>
  </div>
);

const Partida: React.FC<{ partida: PartidaChaveamento; minhaEquipe?: string }> = ({ partida, minhaEquipe }) => {
  const decidida = Boolean(partida.vencedor);
  return (
    <article className="partida" data-leitura="" data-final={partida.fase === 'final' || undefined}>
      <header className="partida__topo">
        <span>
          {partida.fase === 'final' && <Trophy size={14} aria-hidden />}
          {partida.codigo}
        </span>
        <span>
          <time className="t-num">{partida.horario}</time>, {partida.local}
        </span>
      </header>
      {[
        { nome: partida.equipeA, pontos: partida.pontosA },
        { nome: partida.equipeB, pontos: partida.pontosB },
      ].map((e) => (
        <Equipe
          key={e.nome}
          nome={e.nome}
          pontos={e.pontos}
          venceu={decidida && partida.vencedor === e.nome}
          perdeu={decidida && partida.vencedor !== e.nome}
          minha={e.nome === minhaEquipe}
        />
      ))}
    </article>
  );
};

export const Chaveamento: React.FC<{ minhaEquipe?: string }> = ({ minhaEquipe }) => {
  const [fase, setFase] = useState<FaseChaveamento>('quartas');

  return (
    <div className="chaves" data-fase={fase}>
      <div className="chaves__seletor">
        <Segmentado
          rotulo="Fase do chaveamento"
          opcoes={FASES.map((f) => ({ valor: f.valor, rotulo: f.rotulo }))}
          valor={fase}
          aoMudar={setFase}
        />
      </div>

      <div className="chaves__grade">
        {FASES.map((f) => {
          const partidas = CHAVEAMENTO.partidas.filter((p) => p.fase === f.valor);
          return (
            <section key={f.valor} className="chaves__coluna" data-fase={f.valor}>
              <h2 className="chaves__titulo">{f.titulo}</h2>
              <div className="chaves__partidas">
                {partidas.map((p) => (
                  <Partida key={p.id} partida={p} minhaEquipe={minhaEquipe} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
