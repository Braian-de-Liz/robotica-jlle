import React, { useState } from 'react';
import { Check, Handshake, MessageCircle, Scale, Send } from 'lucide-react';
import { Campo } from '../../components/ui';
import { Link } from '../../lib/router';

type Canal = 'fale' | 'ouvidoria' | 'parceria';

const CANAIS: Record<
  Canal,
  { para: string; titulo: string; resumo: string; icone: typeof Send; enviar: string; enviado: string; retorno: string }
> = {
  fale: {
    para: '/contato',
    titulo: 'Fale conosco',
    resumo: 'Dúvidas sobre visitação, escolas participantes e programação.',
    icone: MessageCircle,
    enviar: 'Enviar mensagem',
    enviado: 'Mensagem enviada',
    retorno: 'A comissão do campeonato responde pelo contato que você informou.',
  },
  ouvidoria: {
    para: '/contato/ouvidoria',
    titulo: 'Ouvidoria',
    resumo: 'Recursos sobre resultados, segurança ou acessibilidade do evento.',
    icone: Scale,
    enviar: 'Registrar manifestação',
    enviado: 'Manifestação registrada',
    retorno: 'A ouvidoria analisa o relato e responde pelo contato que você informou.',
  },
  parceria: {
    para: '/contato/parceria',
    titulo: 'Parceria',
    resumo: 'Apoio com alimentação, equipamentos ou premiação.',
    icone: Handshake,
    enviar: 'Enviar proposta',
    enviado: 'Proposta enviada',
    retorno: 'A organização do campeonato entra em contato para combinar os detalhes.',
  },
};

const canalDoCaminho = (caminho: string): Canal =>
  caminho.endsWith('/ouvidoria') ? 'ouvidoria' : caminho.endsWith('/parceria') ? 'parceria' : 'fale';

export const Contato: React.FC<{ caminho: string }> = ({ caminho }) => {
  const canal = canalDoCaminho(caminho);
  const info = CANAIS[canal];
  const [enviados, setEnviados] = useState<Partial<Record<Canal, boolean>>>({});
  const enviado = Boolean(enviados[canal]);

  const aoEnviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviados((atual) => ({ ...atual, [canal]: true }));
  };

  return (
    <>
      <div className="pagina-topo">
        <div className="pagina-topo__dentro">
          <h1 className="t-display">Contato</h1>
          <p className="t-lead">Escolha o canal de acordo com o assunto. Cada um chega a uma equipe diferente.</p>
        </div>
      </div>

      <section className="secao">
        <div className="secao__dentro contato">
          <div>
            <nav className="canais" aria-label="Canais de contato">
              {(Object.keys(CANAIS) as Canal[]).map((id) => {
                const c = CANAIS[id];
                const Icone = c.icone;
                return (
                  <Link key={id} para={c.para} className="canal" atual={id === canal}>
                    <span className="canal__icone">
                      <Icone size={20} aria-hidden />
                    </span>
                    <span>
                      <strong>{c.titulo}</strong>
                      <span>{c.resumo}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <address className="contato__onde">
              <strong>Secretaria de Educação de Joinville</strong>
              Rua Itajaí, 390, Centro
              <br />
              Joinville/SC, 89201-090
            </address>
          </div>

          <div className="contato__form" key={canal}>
            {enviado ? (
              <div className="enviado" role="status">
                <span className="enviado__selo">
                  <Check size={28} aria-hidden />
                </span>
                <h2 className="t-h1">{info.enviado}</h2>
                <p>{info.retorno}</p>
                <button
                  type="button"
                  className="btn btn--secundario"
                  onClick={() => setEnviados((atual) => ({ ...atual, [canal]: false }))}
                >
                  Enviar outra
                </button>
              </div>
            ) : (
              <form className="form" onSubmit={aoEnviar}>
                <h2 className="t-h1">{info.titulo}</h2>

                {canal === 'fale' && (
                  <>
                    <div className="form__linha">
                      <Campo rotulo="Seu nome">
                        <input className="entrada" name="nome" autoComplete="name" required />
                      </Campo>
                      <Campo rotulo="E-mail ou telefone">
                        <input className="entrada" name="contato" required />
                      </Campo>
                    </div>
                    <Campo rotulo="Mensagem">
                      <textarea className="entrada" name="mensagem" rows={5} required />
                    </Campo>
                  </>
                )}

                {canal === 'ouvidoria' && (
                  <>
                    <div className="form__linha">
                      <Campo rotulo="Assunto">
                        <select className="entrada" name="assunto" defaultValue="Recurso sobre resultado ou regra">
                          <option>Recurso sobre resultado ou regra</option>
                          <option>Acessibilidade ou segurança do local</option>
                          <option>Outro relato</option>
                        </select>
                      </Campo>
                      <Campo rotulo="Ala ou modalidade (opcional)" ajuda="Se o relato for sobre um lugar ou disputa específica.">
                        <input className="entrada" name="local" placeholder="Ala 01, Robótica LEGO" />
                      </Campo>
                    </div>
                    <Campo rotulo="E-mail ou telefone para resposta">
                      <input className="entrada" name="contato" required />
                    </Campo>
                    <Campo rotulo="O que aconteceu">
                      <textarea className="entrada" name="relato" rows={5} required />
                    </Campo>
                  </>
                )}

                {canal === 'parceria' && (
                  <>
                    <div className="form__linha">
                      <Campo rotulo="Empresa ou instituição">
                        <input className="entrada" name="empresa" autoComplete="organization" required />
                      </Campo>
                      <Campo rotulo="Como quer apoiar">
                        <select className="entrada" name="frente" defaultValue="Kits de alimentação">
                          <option>Kits de alimentação</option>
                          <option>Equipamentos e kits de robótica</option>
                          <option>Premiação, troféus e medalhas</option>
                        </select>
                      </Campo>
                    </div>
                    <Campo rotulo="Pessoa de contato, com e-mail ou telefone">
                      <input className="entrada" name="contato" required />
                    </Campo>
                    <Campo rotulo="O que pode oferecer" ajuda="Por exemplo: 100 kits de lanche para o almoço.">
                      <textarea className="entrada" name="oferta" rows={4} required />
                    </Campo>
                  </>
                )}

                <div>
                  <button type="submit" className="btn btn--primario">
                    <Send size={18} aria-hidden />
                    {info.enviar}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
