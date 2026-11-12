import React, { useEffect, useSyncExternalStore } from 'react';

/* Roteador mínimo baseado em hash (#/caminho). Mantém voltar/avançar do
   navegador e links diretos funcionando sem adicionar dependências. */

const lerCaminho = () => {
  const bruto = window.location.hash.replace(/^#/, '');
  if (!bruto || bruto === '/') return '/';
  return bruto.startsWith('/') ? bruto.replace(/\/+$/, '') : `/${bruto}`;
};

const assinar = (aoMudar: () => void) => {
  window.addEventListener('hashchange', aoMudar);
  return () => window.removeEventListener('hashchange', aoMudar);
};

export const navegar = (caminho: string, opcoes: { substituir?: boolean } = {}) => {
  const destino = `#${caminho}`;
  if (opcoes.substituir) {
    window.history.replaceState(null, '', destino);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = caminho;
  }
};

export const useCaminho = () => {
  const caminho = useSyncExternalStore(assinar, lerCaminho);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [caminho]);

  return caminho;
};

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  para: string;
  atual?: boolean;
}

export const Link: React.FC<LinkProps> = ({ para, atual, children, ...resto }) => (
  <a href={`#${para}`} aria-current={atual ? 'page' : undefined} {...resto}>
    {children}
  </a>
);
