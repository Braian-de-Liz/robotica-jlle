import React from 'react';

/** Logo do CJR com o nome. `selo` coloca o logo num fundo branco, para uso sobre o azul. */
export const Marca: React.FC<{ selo?: boolean; legenda?: string }> = ({
  selo,
  legenda = 'Campeonato de Robótica',
}) => (
  <span className={`marca ${selo ? 'marca--selo' : ''}`}>
    <span className="marca__logo">
      <img src="/logo-cjr-256.png" alt="" width={40} height={40} />
    </span>
    <span className="marca__texto">
      <strong>CJR Joinville</strong>
      <span>{legenda}</span>
    </span>
  </span>
);
