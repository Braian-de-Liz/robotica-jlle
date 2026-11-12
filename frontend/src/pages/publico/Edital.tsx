import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { EVENTO } from '../../data/mockDatabase';
import { Link } from '../../lib/router';

export const Edital: React.FC = () => (
  <>
    <div className="pagina-topo">
      <div className="pagina-topo__dentro">
        <h1 className="t-display">Edital {EVENTO.ano}</h1>
        <p className="t-lead">
          O estudo técnico da Secretaria de Educação que define a estrutura do campeonato: categorias, mesas,
          arenas e a divisão do dia de competição.
        </p>
      </div>
    </div>

    <section className="secao">
      <div className="secao__dentro">
        <div className="documento">
          <div className="documento__folha" aria-hidden>
            <i />
            <i />
            <i />
            <strong>PDF</strong>
          </div>
          <div>
            <h2>Estudo Técnico Preliminar do {EVENTO.nome}</h2>
            <p>Documento SEI nº {EVENTO.editalSei}. PDF com 19 páginas, 255 KB.</p>
            <div className="documento__acoes">
              <a href="/edital_cjr.pdf" download className="btn btn--na-marca">
                <Download size={18} aria-hidden />
                Baixar o edital
              </a>
              <a href="/edital_cjr.pdf" target="_blank" rel="noopener noreferrer" className="btn btn--na-marca-vazado">
                <ExternalLink size={18} aria-hidden />
                Abrir no navegador
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="secao secao--fundo">
      <div className="secao__dentro">
        <div className="secao__topo">
          <div>
            <h2 className="secao__titulo">Da autorização ao ingresso</h2>
            <p className="secao__intro">
              Todo participante menor de idade precisa da declaração assinada por um responsável. O caminho é este:
            </p>
          </div>
        </div>
        <ol className="caminho">
          <li>
            <strong>A escola inscreve a equipe</strong>
            <span>E indica o professor mentor e os alunos.</span>
          </li>
          <li>
            <strong>O aluno baixa a declaração</strong>
            <span>O modelo fica no painel do participante.</span>
          </li>
          <li>
            <strong>O responsável assina</strong>
            <span>A assinatura precisa ficar legível no arquivo.</span>
          </li>
          <li>
            <strong>O aluno envia a foto ou o PDF</strong>
            <span>A escola confere e aceita ou pede o reenvio.</span>
          </li>
          <li>
            <strong>O ingresso é liberado</strong>
            <span>Um QR Code pessoal, lido na portaria.</span>
          </li>
        </ol>
      </div>
    </section>

    <section className="secao">
      <div className="secao__dentro">
        <div className="secao__topo">
          <h2 className="secao__titulo">O essencial</h2>
        </div>
        <div className="regras" style={{ marginTop: 0 }}>
          <div className="regra">
            <strong>Inscrição feita pela escola</strong>
            <p>
              Cada unidade escolar inscreve suas equipes, designa o professor mentor e valida a autorização dos
              responsáveis.
            </p>
          </div>
          <div className="regra">
            <strong>Cronograma sem sobreposição</strong>
            <p>
              Das 9h às 18h, cada equipe faz três treinos de 10 minutos e três rounds oficiais de 3 minutos, sem
              choque de horário entre categorias.
            </p>
          </div>
          <div className="regra">
            <strong>Desempate por voto da banca</strong>
            <p>
              As bancas têm sempre número ímpar de avaliadores. Em caso de empate, a soma dos votos define a equipe
              vencedora.
            </p>
          </div>
        </div>
        <p style={{ marginTop: '2rem' }}>
          Ficou com dúvida sobre alguma regra?{' '}
          <Link para="/contato" className="link">
            Fale com a comissão
          </Link>
          .
        </p>
      </div>
    </section>
  </>
);
