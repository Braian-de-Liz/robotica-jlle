/* Animações são reduzidas quando o sistema operacional pede (prefers-reduced-motion)
   ou quando a pessoa liga "Reduzir animações" no painel de acessibilidade. */
export const semMovimento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  document.documentElement.dataset.movimento === 'reduzido';
