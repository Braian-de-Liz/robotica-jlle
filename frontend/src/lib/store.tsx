import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ESCOLA_LOGADA,
  INITIAL_CONVIDADOS,
  INITIAL_EMPATE,
  INITIAL_EQUIPES,
  INITIAL_HORARIOS,
  INITIAL_MENTORES,
  INITIAL_METAS,
  INITIAL_PARTICIPANTES,
  INITIAL_VISTORIA,
  INITIAL_VOLUNTARIOS,
  PUBLICO_BASE,
} from '../data/mockDatabase';
import {
  ConvidadoPortaria,
  EmpateCategoria,
  EquipeEscola,
  ItemVistoria,
  JanelaHorario,
  MentorEscola,
  MetaFornecimento,
  ParticipanteInscrito,
  PerfilAcesso,
  StatusDeclaracao,
  VoluntarioEscola,
} from '../types/cjr';
import { PERFIS } from './perfis';

export interface Notificacao {
  id: number;
  texto: string;
  tom: 'ok' | 'erro';
  saindo?: boolean;
}

const CHAVE_SESSAO = 'cjr.sessao';
const CHAVE_CONTRASTE = 'cjr.contraste';
const CHAVE_TEXTO = 'cjr.texto';
const CHAVE_MOVIMENTO = 'cjr.movimento';

/** Tamanhos de texto oferecidos no painel de acessibilidade (em % do padrão). */
export const TAMANHOS_TEXTO = [100, 110, 120, 130];

const lerSessao = (): PerfilAcesso | null => {
  try {
    const valor = sessionStorage.getItem(CHAVE_SESSAO);
    return valor && valor in PERFIS ? (valor as PerfilAcesso) : null;
  } catch {
    return null;
  }
};

const horaAgora = () => {
  const agora = new Date();
  return `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
};

const emMinutos = (hora: string) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

/** "Alas 01, 02 e 03" ocupa também a "Ala 02". */
const mesmoLocal = (ocupado: string, pedido: string) => {
  if (ocupado === pedido) return true;
  const numero = pedido.match(/^Ala (\d+)$/)?.[1];
  return Boolean(numero && ocupado.startsWith('Alas') && ocupado.includes(numero));
};

interface Loja {
  perfil: PerfilAcesso | null;
  entrar: (perfil: PerfilAcesso) => void;
  sair: () => void;

  altoContraste: boolean;
  alternarContraste: () => void;
  tamanhoTexto: number;
  mudarTamanhoTexto: (passo: 1 | -1) => void;
  reduzirMovimento: boolean;
  alternarMovimento: () => void;

  notificacoes: Notificacao[];
  avisar: (texto: string, tom?: Notificacao['tom']) => void;
  dispensar: (id: number) => void;

  participantes: ParticipanteInscrito[];
  alunoAtual: ParticipanteInscrito;
  trocarAluno: (id: string) => void;
  decidirDeclaracao: (id: string, status: StatusDeclaracao) => void;
  enviarDeclaracao: (arquivo: string) => void;
  registrarEntrada: (id: string) => void;

  equipes: EquipeEscola[];
  equipesDaEscola: EquipeEscola[];
  alunosDaEscola: ParticipanteInscrito[];
  inscreverEquipe: (dados: { nome: string; modalidade: string; alunos: number }) => void;
  registrarAvaliacao: (equipeId: string, nota: number) => void;

  mentores: MentorEscola[];
  adicionarMentor: (nome: string, area: string) => void;
  removerMentor: (id: string) => void;
  voluntarios: VoluntarioEscola[];
  adicionarVoluntario: (nome: string, alocacao: string, telefone: string) => void;
  removerVoluntario: (id: string) => void;

  empate: EmpateCategoria;
  votarDesempate: (equipe: string) => void;

  metas: MetaFornecimento[];
  registrarEntrega: (metaId: string, fornecedor: string, quantidade: number) => void;

  vistoria: ItemVistoria[];
  alternarVistoria: (id: string) => void;

  horarios: JanelaHorario[];
  /** Devolve a janela em conflito, ou null quando a publicação deu certo. */
  publicarHorario: (janela: Omit<JanelaHorario, 'id'>) => JanelaHorario | null;

  convidados: ConvidadoPortaria[];
  registrarConvidado: (nome: string, telefone: string) => void;
  publicoPresente: number;
}

const Contexto = createContext<Loja | null>(null);

export const useLoja = () => {
  const loja = useContext(Contexto);
  if (!loja) throw new Error('useLoja precisa estar dentro de <LojaProvider>');
  return loja;
};

export const LojaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [perfil, setPerfil] = useState<PerfilAcesso | null>(lerSessao);
  const [altoContraste, setAltoContraste] = useState(() => {
    try {
      return localStorage.getItem(CHAVE_CONTRASTE) === 'alto';
    } catch {
      return false;
    }
  });
  const [tamanhoTexto, setTamanhoTexto] = useState(() => {
    try {
      const salvo = Number(localStorage.getItem(CHAVE_TEXTO));
      return TAMANHOS_TEXTO.includes(salvo) ? salvo : 100;
    } catch {
      return 100;
    }
  });
  const [reduzirMovimento, setReduzirMovimento] = useState(() => {
    try {
      return localStorage.getItem(CHAVE_MOVIMENTO) === 'reduzido';
    } catch {
      return false;
    }
  });
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const proximoId = useRef(1);

  const [participantes, setParticipantes] = useState(INITIAL_PARTICIPANTES);
  const [alunoId, setAlunoId] = useState('part-1');
  const [equipes, setEquipes] = useState(INITIAL_EQUIPES);
  const [mentores, setMentores] = useState(INITIAL_MENTORES);
  const [voluntarios, setVoluntarios] = useState(INITIAL_VOLUNTARIOS);
  const [empate, setEmpate] = useState(INITIAL_EMPATE);
  const [metas, setMetas] = useState(INITIAL_METAS);
  const [vistoria, setVistoria] = useState(INITIAL_VISTORIA);
  const [horarios, setHorarios] = useState(INITIAL_HORARIOS);
  const [convidados, setConvidados] = useState(INITIAL_CONVIDADOS);

  useEffect(() => {
    document.documentElement.dataset.contraste = altoContraste ? 'alto' : 'padrao';
    try {
      localStorage.setItem(CHAVE_CONTRASTE, altoContraste ? 'alto' : 'padrao');
    } catch {
      /* armazenamento indisponível: a preferência vale só para esta visita */
    }
  }, [altoContraste]);

  /* O layout inteiro usa rem, então mudar o tamanho da raiz amplia tudo por igual. */
  useEffect(() => {
    document.documentElement.style.fontSize = tamanhoTexto === 100 ? '' : `${tamanhoTexto}%`;
    try {
      localStorage.setItem(CHAVE_TEXTO, String(tamanhoTexto));
    } catch {
      /* armazenamento indisponível: a preferência vale só para esta visita */
    }
  }, [tamanhoTexto]);

  useEffect(() => {
    document.documentElement.dataset.movimento = reduzirMovimento ? 'reduzido' : 'padrao';
    try {
      localStorage.setItem(CHAVE_MOVIMENTO, reduzirMovimento ? 'reduzido' : 'padrao');
    } catch {
      /* armazenamento indisponível: a preferência vale só para esta visita */
    }
  }, [reduzirMovimento]);

  const dispensar = useCallback((id: number) => {
    setNotificacoes((lista) => lista.map((a) => (a.id === id ? { ...a, saindo: true } : a)));
    window.setTimeout(() => setNotificacoes((lista) => lista.filter((a) => a.id !== id)), 260);
  }, []);

  const avisar = useCallback(
    (texto: string, tom: Notificacao['tom'] = 'ok') => {
      const id = proximoId.current++;
      /* O tempo de exibição é controlado por quem desenha o aviso, que pausa
         a contagem enquanto a pessoa está lendo (mouse em cima ou foco). */
      setNotificacoes((lista) => [...lista.slice(-2), { id, texto, tom }]);
    },
    []
  );

  const entrar = useCallback((novo: PerfilAcesso) => {
    setPerfil(novo);
    try {
      sessionStorage.setItem(CHAVE_SESSAO, novo);
    } catch {
      /* sem sessionStorage a sessão dura até recarregar a página */
    }
  }, []);

  const sair = useCallback(() => {
    setPerfil(null);
    try {
      sessionStorage.removeItem(CHAVE_SESSAO);
    } catch {
      /* nada a limpar */
    }
  }, []);

  const loja = useMemo<Loja>(() => {
    const alunoAtual = participantes.find((p) => p.id === alunoId) ?? participantes[0];

    return {
      perfil,
      entrar,
      sair,
      altoContraste,
      alternarContraste: () => setAltoContraste((v) => !v),
      reduzirMovimento,
      alternarMovimento: () => setReduzirMovimento((v) => !v),
      tamanhoTexto,
      mudarTamanhoTexto: (passo) =>
        setTamanhoTexto((atual) => {
          const i = TAMANHOS_TEXTO.indexOf(atual) + passo;
          return TAMANHOS_TEXTO[Math.min(Math.max(i, 0), TAMANHOS_TEXTO.length - 1)];
        }),
      notificacoes,
      avisar,
      dispensar,

      participantes,
      alunoAtual,
      trocarAluno: setAlunoId,

      decidirDeclaracao: (id, status) => {
        const alvo = participantes.find((p) => p.id === id);
        setParticipantes((lista) => lista.map((p) => (p.id === id ? { ...p, statusDeclaracao: status } : p)));
        if (!alvo) return;
        if (status === 'aceito') avisar(`Declaração de ${alvo.nome} aceita. O ingresso foi liberado.`);
        if (status === 'recusado') avisar(`Declaração de ${alvo.nome} recusada. O aluno precisa reenviar.`);
        if (status === 'aguardando') avisar(`Declaração de ${alvo.nome} voltou para análise.`);
      },

      enviarDeclaracao: (arquivo) => {
        setParticipantes((lista) =>
          lista.map((p) =>
            p.id === alunoAtual.id
              ? { ...p, arquivoDeclaracao: arquivo, dataEnvioDeclaracao: `hoje às ${horaAgora()}`, statusDeclaracao: 'aguardando' }
              : p
          )
        );
        avisar('Declaração enviada. A escola vai analisar o arquivo.');
      },

      registrarEntrada: (id) => {
        const alvo = participantes.find((p) => p.id === id);
        setParticipantes((lista) =>
          lista.map((p) => (p.id === id ? { ...p, presencaConfirmada: true, horarioEntrada: horaAgora() } : p))
        );
        if (alvo) avisar(`Entrada de ${alvo.nome} registrada.`);
      },

      equipes,
      equipesDaEscola: equipes.filter((e) => e.escolaNome === ESCOLA_LOGADA),
      alunosDaEscola: participantes.filter((p) => p.escolaNome === ESCOLA_LOGADA),

      inscreverEquipe: ({ nome, modalidade, alunos }) => {
        const nova: EquipeEscola = {
          id: `eq-${Date.now()}`,
          nome,
          escolaNome: ESCOLA_LOGADA,
          modalidadePrincipal: modalidade,
          mentorNome: mentores[0]?.nome ?? 'A definir',
          local: 'A definir pela organização',
          horarioPrincipal: 'A definir',
          alunosCount: alunos,
          avaliada: false,
        };
        setEquipes((lista) => [nova, ...lista]);
        avisar(`Equipe ${nome} inscrita em ${modalidade}.`);
      },

      registrarAvaliacao: (equipeId, nota) => {
        const alvo = equipes.find((e) => e.id === equipeId);
        setEquipes((lista) => lista.map((e) => (e.id === equipeId ? { ...e, avaliada: true, notaTotal: nota } : e)));
        if (alvo) avisar(`Nota publicada para ${alvo.nome}: ${nota.toLocaleString('pt-BR')} pontos.`);
      },

      mentores,
      adicionarMentor: (nome, area) => {
        setMentores((lista) => [...lista, { id: `m-${Date.now()}`, nome, area }]);
        avisar(`${nome} adicionado como mentor.`);
      },
      removerMentor: (id) => setMentores((lista) => lista.filter((m) => m.id !== id)),

      voluntarios,
      adicionarVoluntario: (nome, alocacao, telefone) => {
        setVoluntarios((lista) => [...lista, { id: `v-${Date.now()}`, nome, alocacao, telefone }]);
        avisar(`${nome} adicionado como voluntário.`);
      },
      removerVoluntario: (id) => setVoluntarios((lista) => lista.filter((v) => v.id !== id)),

      empate,
      votarDesempate: (equipe) => {
        setEmpate((atual) => ({
          ...atual,
          votosJuizes: atual.votosJuizes.map((v) => (v.voce ? { ...v, votoEquipe: equipe } : v)),
          resolvido: true,
          vencedorDesempate: equipe,
        }));
        avisar(`Voto registrado. ${equipe} venceu o desempate por 2 a 1.`);
      },

      metas,
      registrarEntrega: (metaId, fornecedor, quantidade) => {
        const meta = metas.find((m) => m.id === metaId);
        setMetas((lista) =>
          lista.map((m) =>
            m.id === metaId ? { ...m, entregas: [...m.entregas, { fornecedorNome: fornecedor, quantidade }] } : m
          )
        );
        if (meta) avisar(`Entrega registrada: ${quantidade} ${meta.unidade} de ${fornecedor}.`);
      },

      vistoria,
      alternarVistoria: (id) =>
        setVistoria((lista) => lista.map((item) => (item.id === id ? { ...item, conferido: !item.conferido } : item))),

      horarios,
      publicarHorario: (janela) => {
        const inicio = emMinutos(janela.inicio);
        const fim = emMinutos(janela.fim);
        const conflito = horarios.find(
          (h) => mesmoLocal(h.ala, janela.ala) && inicio < emMinutos(h.fim) && fim > emMinutos(h.inicio)
        );
        if (conflito) return conflito;
        setHorarios((lista) =>
          [...lista, { ...janela, id: `hor-${Date.now()}` }].sort((a, b) => emMinutos(a.inicio) - emMinutos(b.inicio))
        );
        avisar(`Janela das ${janela.inicio} publicada na ${janela.ala}.`);
        return null;
      },

      convidados,
      registrarConvidado: (nome, telefone) => {
        const novo: ConvidadoPortaria = {
          id: `conv-${Date.now()}`,
          nome,
          telefone,
          horarioEntrada: horaAgora(),
          atendente: 'Beatriz Helena',
        };
        setConvidados((lista) => [novo, ...lista]);
        avisar(`Entrada de ${nome} registrada.`);
      },
      publicoPresente: PUBLICO_BASE + convidados.length + participantes.filter((p) => p.presencaConfirmada).length,
    };
  }, [
    perfil,
    entrar,
    sair,
    altoContraste,
    tamanhoTexto,
    reduzirMovimento,
    notificacoes,
    avisar,
    dispensar,
    participantes,
    alunoId,
    equipes,
    mentores,
    voluntarios,
    empate,
    metas,
    vistoria,
    horarios,
    convidados,
  ]);

  return <Contexto.Provider value={loja}>{children}</Contexto.Provider>;
};
