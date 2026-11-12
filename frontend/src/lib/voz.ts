import { useSyncExternalStore } from 'react';
import { semMovimento } from './movimento';

/* Leitura da página em voz alta com a Web Speech API do próprio navegador
   (sem serviço externo nem chave). O conteúdo é dividido em trechos, cada um
   ligado ao elemento de origem, que fica destacado enquanto é lido. */

export interface EstadoVoz {
  suportado: boolean;
  status: 'parado' | 'lendo' | 'pausado';
  velocidade: number;
  trecho: number;
  total: number;
}

interface Trecho {
  el: Element;
  texto: string;
}

const VELOCIDADES = [1, 1.25, 1.5, 0.8];
const LIMITE = 220;

const suportado = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

let estado: EstadoVoz = { suportado, status: 'parado', velocidade: 1, trecho: 0, total: 0 };
let fila: Trecho[] = [];
let indice = 0;
let sessao = 0;
let destacado: Element | null = null;
/* Guardar a fala atual evita que o Chrome a descarte antes de disparar "onend". */
let falaAtual: SpeechSynthesisUtterance | null = null;

const ouvintes = new Set<() => void>();
const publicar = (parcial: Partial<EstadoVoz>) => {
  estado = { ...estado, ...parcial };
  ouvintes.forEach((avisar) => avisar());
};

const UNIDADE =
  '[data-leitura], tr, li, p, h1, h2, h3, h4, dl > div, label, address, figcaption, legend';
const IGNORAR =
  '[aria-hidden="true"], svg, select, option, script, style, thead, [hidden], .leaflet-container, .voz, [data-nao-ler]';

const blocoMaisProximo = (el: Element, raiz: Element): Element => {
  let atual: Element | null = el;
  while (atual && atual !== raiz) {
    const display = getComputedStyle(atual).display;
    if (!display.startsWith('inline') && display !== 'contents') return atual;
    atual = atual.parentElement;
  }
  return raiz;
};

const terminaComPontuacao = (texto: string) => /[.!?:;,…]$/.test(texto);

/** Percorre o conteúdo visível e devolve os trechos na ordem de leitura. */
export const extrairTrechos = (raiz: HTMLElement): Trecho[] => {
  const caminhante = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
    acceptNode(no) {
      const pai = no.parentElement;
      if (!pai || !no.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      if (pai.closest(IGNORAR)) return NodeFilter.FILTER_REJECT;
      if (pai.getClientRects().length === 0) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const unidades = new Map<Element, { texto: string; bloco: Element | null; celula: Element | null }>();

  for (let no = caminhante.nextNode(); no; no = caminhante.nextNode()) {
    const pai = no.parentElement as Element;
    const texto = (no.nodeValue ?? '').replace(/\s+/g, ' ').trim();
    const candidata = pai.closest(UNIDADE);
    const unidade = candidata && raiz.contains(candidata) ? candidata : blocoMaisProximo(pai, raiz);
    const bloco = blocoMaisProximo(pai, raiz);
    const celula = pai.closest('td');

    const atual = unidades.get(unidade) ?? { texto: '', bloco: null, celula: null };
    let pedaco = texto;

    /* No celular os rótulos das colunas são desenhados por CSS; aqui eles voltam para a fala. */
    if (celula && celula !== atual.celula) {
      const rotulo = (celula as HTMLElement).dataset.rotulo;
      if (rotulo) pedaco = `${rotulo}: ${pedaco}`;
    }

    if (!atual.texto) atual.texto = pedaco;
    else if (bloco === atual.bloco || terminaComPontuacao(atual.texto)) atual.texto += ` ${pedaco}`;
    else atual.texto += `. ${pedaco}`;

    atual.bloco = bloco;
    atual.celula = celula;
    unidades.set(unidade, atual);
  }

  /* Falas longas são cortadas por alguns navegadores: divide em frases. */
  const trechos: Trecho[] = [];
  unidades.forEach(({ texto }, el) => {
    if (texto.length <= LIMITE) {
      trechos.push({ el, texto });
      return;
    }
    let acumulado = '';
    for (const frase of texto.split(/(?<=[.!?;:])\s+/)) {
      if (acumulado && (acumulado + ' ' + frase).length > LIMITE) {
        trechos.push({ el, texto: acumulado });
        acumulado = frase;
      } else {
        acumulado = acumulado ? `${acumulado} ${frase}` : frase;
      }
    }
    if (acumulado) trechos.push({ el, texto: acumulado });
  });
  return trechos;
};

const destacar = (el: Element | null) => {
  if (destacado === el) return;
  destacado?.removeAttribute('data-lendo');
  destacado = el;
  if (!el) return;
  el.setAttribute('data-lendo', '');
  const caixa = el.getBoundingClientRect();
  const foraDaTela = caixa.top < 96 || caixa.bottom > window.innerHeight - 160;
  if (foraDaTela) {
    el.scrollIntoView({ block: 'center', behavior: semMovimento() ? 'auto' : 'smooth' });
  }
};

const vozEmPortugues = () => {
  const vozes = window.speechSynthesis.getVoices();
  return vozes.find((v) => /^pt[-_]BR/i.test(v.lang)) ?? vozes.find((v) => /^pt/i.test(v.lang)) ?? null;
};

const falarAtual = () => {
  if (indice >= fila.length) {
    voz.parar();
    return;
  }
  const minhaSessao = sessao;
  const trecho = fila[indice];
  destacar(trecho.el);
  publicar({ trecho: indice + 1 });

  const fala = new SpeechSynthesisUtterance(trecho.texto);
  const escolhida = vozEmPortugues();
  if (escolhida) fala.voice = escolhida;
  fala.lang = 'pt-BR';
  fala.rate = estado.velocidade;
  const avancar = () => {
    if (minhaSessao !== sessao) return;
    indice += 1;
    falarAtual();
  };
  fala.onend = avancar;
  fala.onerror = (evento) => {
    if (evento.error === 'canceled' || evento.error === 'interrupted') return;
    avancar();
  };
  falaAtual = fala;
  window.speechSynthesis.speak(fala);
};

export const voz = {
  /** Começa a ler o conteúdo de `raiz`. Precisa ser chamado a partir de um clique. */
  iniciar(raiz: HTMLElement | null) {
    if (!suportado || !raiz) return false;
    window.speechSynthesis.cancel();
    sessao += 1;
    fila = extrairTrechos(raiz);
    indice = 0;
    if (fila.length === 0) return false;
    publicar({ status: 'lendo', trecho: 1, total: fila.length });
    falarAtual();
    return true;
  },

  pausar() {
    if (estado.status !== 'lendo') return;
    window.speechSynthesis.pause();
    publicar({ status: 'pausado' });
  },

  continuar() {
    if (estado.status !== 'pausado') return;
    window.speechSynthesis.resume();
    publicar({ status: 'lendo' });
  },

  parar() {
    if (!suportado) return;
    sessao += 1;
    window.speechSynthesis.cancel();
    falaAtual = null;
    fila = [];
    destacar(null);
    if (estado.status !== 'parado') publicar({ status: 'parado', trecho: 0, total: 0 });
  },

  /** Pula para outro trecho (usado pelos botões de voltar e avançar). */
  pular(passos: number) {
    if (estado.status === 'parado') return;
    sessao += 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    indice = Math.min(Math.max(indice + passos, 0), fila.length - 1);
    publicar({ status: 'lendo' });
    falarAtual();
  },

  /** Alterna a velocidade; vale a partir do trecho atual, que recomeça. */
  mudarVelocidade() {
    const proxima = VELOCIDADES[(VELOCIDADES.indexOf(estado.velocidade) + 1) % VELOCIDADES.length];
    publicar({ velocidade: proxima });
    if (estado.status === 'lendo') voz.pular(0);
  },
};

const assinar = (aoMudar: () => void) => {
  ouvintes.add(aoMudar);
  return () => ouvintes.delete(aoMudar);
};

export const useVoz = () => useSyncExternalStore(assinar, () => estado);

/* Ao sair ou recarregar, o navegador continuaria falando sozinho. */
if (suportado) window.addEventListener('pagehide', () => window.speechSynthesis.cancel());
