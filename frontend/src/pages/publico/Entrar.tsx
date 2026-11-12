import React, { useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff, LogIn } from 'lucide-react';
import { BarraDeVoz, BotaoAcessibilidade } from '../../components/Acessibilidade';
import { Marca } from '../../components/Marca';
import { Campo, Notificacoes } from '../../components/ui';
import { EVENTO } from '../../data/mockDatabase';
import { ORDEM_PERFIS, PERFIS, perfilPorEmail } from '../../lib/perfis';
import { Link, navegar } from '../../lib/router';
import { useLoja } from '../../lib/store';
import { PerfilAcesso } from '../../types/cjr';

const SENHA_DEMO = 'robotica2026';

export const Entrar: React.FC = () => {
  const { entrar, avisar } = useLoja();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const usarConta = (id: PerfilAcesso) => {
    setEmail(PERFIS[id].email);
    setSenha(SENHA_DEMO);
    setErro(null);
  };

  const aoEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    const perfil = perfilPorEmail(email);
    if (!perfil) {
      setErro('Não há conta com este e-mail. Escolha uma das contas de demonstração abaixo.');
      return;
    }
    if (!senha) {
      setErro('Digite a senha para entrar.');
      return;
    }
    entrar(perfil);
    navegar('/painel');
    avisar(`Você entrou como ${PERFIS[perfil].usuarioNome}.`);
  };

  const selecionado = perfilPorEmail(email);

  return (
    <div className="entrar">
      <BotaoAcessibilidade variante="flutuante" />
      <div className="entrar__marca">
        <Link para="/" className="entrar__voltar">
          <ArrowLeft size={18} aria-hidden />
          Voltar ao site
        </Link>

        <div className="entrar__texto">
          <Marca selo legenda={`${EVENTO.edicao}ª edição, ${EVENTO.ano}`} />
          <h1 className="t-display">Sistema do campeonato</h1>
          <p>Equipes, declarações, ingressos, notas e a organização do dia em um só lugar.</p>
        </div>

        <svg className="entrar__pista" viewBox="0 0 600 200" aria-hidden>
          <path
            pathLength={1}
            d="M-20 150H110q30 0 30-30V80q0-30 30-30h100q30 0 30 30v40q0 30 30 30h100q30 0 30-30V80q0-30 30-30h130"
          />
        </svg>
      </div>

      <main className="entrar__form" id="conteudo" tabIndex={-1}>
        <form className="form" onSubmit={aoEnviar} noValidate>
          <h2 className="t-h1">Entrar</h2>

          <Campo rotulo="E-mail">
            <input
              className="entrada"
              type="email"
              name="email"
              autoComplete="username"
              inputMode="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErro(null);
              }}
              aria-invalid={Boolean(erro) || undefined}
              required
            />
          </Campo>

          <Campo rotulo="Senha" erro={erro}>
            <span className="entrar__senha">
              <input
                className="entrada"
                type={verSenha ? 'text' : 'password'}
                name="senha"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  setErro(null);
                }}
                required
              />
              <button
                type="button"
                onClick={() => setVerSenha((v) => !v)}
                aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
                aria-pressed={verSenha}
              >
                {verSenha ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
              </button>
            </span>
          </Campo>

          <button type="submit" className="btn btn--primario btn--bloco">
            <LogIn size={18} aria-hidden />
            Entrar
          </button>
        </form>

        <section className="contas" aria-labelledby="titulo-contas">
          <div>
            <h2 className="contas__titulo" id="titulo-contas">
              Contas de demonstração
            </h2>
            <p className="t-small t-muted">Toque em uma conta para preencher o acesso e conhecer o painel dela. Todas as escolas, equipes e pessoas são fictícias.</p>
          </div>
          <div className="contas__lista">
            {ORDEM_PERFIS.map((id) => {
              const p = PERFIS[id];
              return (
                <button
                  key={id}
                  type="button"
                  className="conta"
                  aria-pressed={selecionado === id}
                  onClick={() => usarConta(id)}
                >
                  <span className="avatar" aria-hidden>
                    {p.sigla}
                  </span>
                  <span>
                    <strong>{p.area}</strong>
                    <span>{p.oQueFaz}</span>
                  </span>
                  <Check size={20} aria-hidden />
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <BarraDeVoz />
      <Notificacoes />
    </div>
  );
};
