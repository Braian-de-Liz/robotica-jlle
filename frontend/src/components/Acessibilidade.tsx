import React, { useState } from 'react';
import {
  Accessibility,
  Contrast,
  Hand,
  CirclePause,
  Minus,
  Pause,
  Play,
  Plus,
  SkipBack,
  SkipForward,
  Type,
  Volume2,
  X,
} from 'lucide-react';
import { TAMANHOS_TEXTO, useLoja } from '../lib/store';
import { useVoz, voz } from '../lib/voz';
import { Dialogo } from './ui';

declare global {
  interface Window {
    /** Exposto pelo script oficial do VLibras (vlibras.gov.br). */
    VLibrasWidget?: { open?: () => void };
  }
}

/* --- Painel com os recursos de acessibilidade ----------------------------------- */

const PainelAcessibilidade: React.FC<{ aberto: boolean; aoFechar: () => void }> = ({ aberto, aoFechar }) => {
  const {
    altoContraste,
    alternarContraste,
    tamanhoTexto,
    mudarTamanhoTexto,
    reduzirMovimento,
    alternarMovimento,
    avisar,
  } = useLoja();
  const { suportado, status } = useVoz();

  const ouvir = () => {
    aoFechar();
    const comecou = voz.iniciar(document.getElementById('conteudo'));
    if (!comecou) avisar('Não há texto para ler nesta página.', 'erro');
  };

  const abrirLibras = () => {
    aoFechar();
    if (window.VLibrasWidget?.open) window.VLibrasWidget.open();
    else avisar('O VLibras não carregou. Confira a conexão com a internet e recarregue a página.', 'erro');
  };

  return (
    <Dialogo
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Acessibilidade"
      descricao="As preferências ficam salvas neste aparelho."
    >
      <ul className="acesso">
        <li className="acesso__item">
          <span className="acesso__icone" aria-hidden>
            <Volume2 size={20} />
          </span>
          <div className="acesso__texto">
            <strong>Ouvir esta página</strong>
            <span>
              {suportado
                ? 'O navegador lê o conteúdo em voz alta e destaca o trecho lido.'
                : 'Este navegador não oferece leitura em voz alta.'}
            </span>
          </div>
          {status === 'parado' ? (
            <button type="button" className="btn btn--primario btn--p" onClick={ouvir} disabled={!suportado}>
              Ouvir
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--secundario btn--p"
              onClick={() => {
                voz.parar();
                aoFechar();
              }}
            >
              Parar
            </button>
          )}
        </li>

        <li className="acesso__item">
          <span className="acesso__icone" aria-hidden>
            <Hand size={20} />
          </span>
          <div className="acesso__texto">
            <strong>Libras</strong>
            <span>O VLibras, do governo federal, traduz os textos para a Língua Brasileira de Sinais.</span>
          </div>
          <button type="button" className="btn btn--primario btn--p" onClick={abrirLibras}>
            Abrir
          </button>
        </li>

        <li className="acesso__item">
          <span className="acesso__icone" aria-hidden>
            <Type size={20} />
          </span>
          <div className="acesso__texto">
            <strong>Tamanho do texto</strong>
            <span>Aumenta as letras de todo o sistema.</span>
          </div>
          <div className="acesso__passos" role="group" aria-label="Tamanho do texto">
            <button
              type="button"
              onClick={() => mudarTamanhoTexto(-1)}
              disabled={tamanhoTexto === TAMANHOS_TEXTO[0]}
              aria-label="Diminuir o texto"
            >
              <Minus size={18} aria-hidden />
            </button>
            <output className="t-num" aria-live="polite">
              {tamanhoTexto}%
            </output>
            <button
              type="button"
              onClick={() => mudarTamanhoTexto(1)}
              disabled={tamanhoTexto === TAMANHOS_TEXTO[TAMANHOS_TEXTO.length - 1]}
              aria-label="Aumentar o texto"
            >
              <Plus size={18} aria-hidden />
            </button>
          </div>
        </li>

        <li className="acesso__item">
          <span className="acesso__icone" aria-hidden>
            <Contrast size={20} />
          </span>
          <div className="acesso__texto">
            <strong id="rotulo-contraste">Alto contraste</strong>
            <span>Fundo escuro com letras claras.</span>
          </div>
          <button
            type="button"
            className="chave"
            role="switch"
            aria-checked={altoContraste}
            aria-labelledby="rotulo-contraste"
            onClick={alternarContraste}
          />
        </li>

        <li className="acesso__item">
          <span className="acesso__icone" aria-hidden>
            <CirclePause size={20} />
          </span>
          <div className="acesso__texto">
            <strong id="rotulo-movimento">Reduzir animações</strong>
            <span>Para as animações e transições das telas.</span>
          </div>
          <button
            type="button"
            className="chave"
            role="switch"
            aria-checked={reduzirMovimento}
            aria-labelledby="rotulo-movimento"
            onClick={alternarMovimento}
          />
        </li>
      </ul>
    </Dialogo>
  );
};

/** Botão que abre o painel. `variante` segue o lugar onde ele aparece. */
export const BotaoAcessibilidade: React.FC<{ variante: 'icone' | 'lado' | 'flutuante' }> = ({ variante }) => {
  const [aberto, setAberto] = useState(false);
  const classes = {
    icone: 'pub-topo__icone',
    lado: 'lado__acao',
    flutuante: 'pub-topo__icone entrar__acesso',
  }[variante];

  return (
    <>
      <button
        type="button"
        className={classes}
        onClick={() => setAberto(true)}
        aria-haspopup="dialog"
        aria-label={variante === 'lado' ? undefined : 'Acessibilidade'}
        title={variante === 'lado' ? undefined : 'Acessibilidade'}
      >
        <Accessibility size={variante === 'lado' ? 18 : 22} aria-hidden />
        {variante === 'lado' && 'Acessibilidade'}
      </button>
      <PainelAcessibilidade aberto={aberto} aoFechar={() => setAberto(false)} />
    </>
  );
};

/* --- Barra do leitor em voz alta ---------------------------------------------------- */

const rotuloVelocidade = (v: number) => `${v.toLocaleString('pt-BR')}×`;

export const BarraDeVoz: React.FC = () => {
  const { status, velocidade, trecho, total } = useVoz();
  if (status === 'parado') return null;
  const lendo = status === 'lendo';

  return (
    <div className="voz" role="region" aria-label="Leitura em voz alta" data-pausado={!lendo || undefined}>
      <span className="voz__ondas" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="voz__texto">
        <strong>{lendo ? 'Lendo a página' : 'Leitura pausada'}</strong>
        <span>
          Trecho {trecho} de {total}
        </span>
      </span>

      <button type="button" onClick={() => voz.pular(-1)} aria-label="Voltar um trecho" disabled={trecho <= 1}>
        <SkipBack size={18} aria-hidden />
      </button>
      <button
        type="button"
        className="voz__principal"
        onClick={() => (lendo ? voz.pausar() : voz.continuar())}
        aria-label={lendo ? 'Pausar a leitura' : 'Continuar a leitura'}
      >
        {lendo ? <Pause size={20} aria-hidden /> : <Play size={20} aria-hidden />}
      </button>
      <button type="button" onClick={() => voz.pular(1)} aria-label="Avançar um trecho" disabled={trecho >= total}>
        <SkipForward size={18} aria-hidden />
      </button>
      <button
        type="button"
        className="voz__velocidade t-num"
        onClick={() => voz.mudarVelocidade()}
        aria-label={`Velocidade ${rotuloVelocidade(velocidade)}. Toque para mudar.`}
      >
        {rotuloVelocidade(velocidade)}
      </button>
      <button type="button" onClick={() => voz.parar()} aria-label="Parar a leitura">
        <X size={20} aria-hidden />
      </button>
    </div>
  );
};
