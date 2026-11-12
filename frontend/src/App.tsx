import React, { useState } from 'react';
import {
  Globe,
  UserCheck,
  School,
  Award,
  ShieldCheck,
  QrCode,
  FileText,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  AlertTriangle,
  Users,
  PackageCheck,
  Calendar,
  Volume2,
  Contrast,
  Accessibility,
  Send,
  PlusCircle,
  ScanLine,
  Trophy,
  Layers,
  CheckSquare,
  ChevronRight,
  LogIn,
  LogOut,
  Lock,
  KeyRound,
  LayoutDashboard,
  Sparkles,
  ArrowUpRight,
  UserPlus,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import {
  INITIAL_POSTS_BLOG,
  INITIAL_CARDS_NOTICIA,
  INITIAL_PARTICIPANTES,
  INITIAL_EQUIPES,
  INITIAL_CHAVEAMENTO,
  INITIAL_EMPATE,
  INITIAL_METAS_FORNECEDORES,
  INITIAL_CHECKLISTS,
  INITIAL_PINS_MAPA,
  INITIAL_CONVIDADOS,
  INITIAL_HORARIOS_TORNEIO,
} from './data/mockDatabase';
import {
  StatusDeclaracao,
  TipoPinMapa,
  ParticipanteInscrito,
  EquipeEscola,
  MetaFornecedorKPI,
  ItemChecklistLocal,
  ConvidadoPortaria,
  HorarioTorneioGrade,
} from './types/cjr';
import { OrganizerLeafletMap } from './components/OrganizerLeafletMap';

type PerfilAcesso =
  | 'participante'
  | 'escola'
  | 'avaliador'
  | 'organizador'
  | 'voluntario';

type AbaPublica = 'home' | 'sobre' | 'edital' | 'contato';
type AbaParticipante = 'equipes' | 'declaracao' | 'qrcode' | 'chaveamento';
type AbaEscola = 'visao' | 'declaracoes' | 'equipes' | 'apoio';
type AbaAvaliador = 'fila' | 'avaliar' | 'desempate' | 'chaveamento';
type AbaOrganizador = 'visao' | 'mapa' | 'fornecedores' | 'inspecao' | 'horarios';
type AbaVoluntario = 'scanner' | 'convidados';

interface PerfilCredenciadoInfo {
  id: PerfilAcesso;
  tituloArea: string;
  sigla: string;
  usuarioNome: string;
  cargoLabel: string;
  emailDemo: string;
  escopoPermissao: string;
}

const PERFIS_CREDENCIADOS: Record<PerfilAcesso, PerfilCredenciadoInfo> = {
  participante: {
    id: 'participante',
    tituloArea: 'Painel do Participante',
    sigla: 'LG',
    usuarioNome: 'Lucas Gabriel Martins',
    cargoLabel: 'Competidor • 9º Ano',
    emailDemo: 'lucas.martins@aluno.joinville.sc.gov.br',
    escopoPermissao:
      'Equipes & Horários, Declaração dos Pais, Ingresso QR Code e Chaveamento + Portal Público.',
  },
  escola: {
    id: 'escola',
    tituloArea: 'Painel da Escola',
    sigla: 'WF',
    usuarioNome: 'E.M. Pref. Wittich Freitag',
    cargoLabel: 'Direção Escolar • INEP 42089123',
    emailDemo: 'direcao.wittich@edu.joinville.sc.gov.br',
    escopoPermissao:
      'Visão Geral, Deferimento de Declarações, Inscrição de Equipes, Mentores e Voluntários + Portal Público.',
  },
  avaliador: {
    id: 'avaliador',
    tituloArea: 'Painel do Avaliador',
    sigla: 'RZ',
    usuarioNome: 'Eng. Rafael Zimmermann',
    cargoLabel: 'Avaliador Oficial • Juiz #02',
    emailDemo: 'rafael.avaliador@cjr.joinville.sc.gov.br',
    escopoPermissao:
      'Fila de Avaliação, Ficha Técnica de Notas, Desempate por Banca Ímpar e Chaveamento + Portal Público.',
  },
  organizador: {
    id: 'organizador',
    tituloArea: 'Painel do Organizador',
    sigla: 'SD',
    usuarioNome: 'Coordenação SED • URC',
    cargoLabel: 'Administração Central',
    emailDemo: 'organizacao.robotica@joinville.sc.gov.br',
    escopoPermissao:
      'Dashboard Executivo, Mapa React-Leaflet, Fornecedores (KPIs), Acessibilidade/Segurança e Horários + Portal Público.',
  },
  voluntario: {
    id: 'voluntario',
    tituloArea: 'Painel da Portaria',
    sigla: 'BH',
    usuarioNome: 'Beatriz Helena Souza',
    cargoLabel: 'Voluntária • Portaria Central',
    emailDemo: 'beatriz.portaria@voluntario.joinville.sc.gov.br',
    escopoPermissao:
      'Leitor Óptico de QR Code dos Participantes e Credenciamento Rápido de Convidados + Portal Público.',
  },
};

export const App: React.FC = () => {
  // Controle de Sessão e Modo de Visualização ('publico' vs 'painel')
  const [perfilAutenticado, setPerfilAutenticado] = useState<PerfilAcesso | null>(null);
  const [modoVisualizacao, setModoVisualizacao] = useState<'publico' | 'painel'>('publico');

  // Modal de Login (Emulador RBAC)
  const [modalLoginAberto, setModalLoginAberto] = useState(false);
  const [perfilSelecionadoModal, setPerfilSelecionadoModal] = useState<PerfilAcesso>('participante');
  const [loginEmailInput, setLoginEmailInput] = useState(PERFIS_CREDENCIADOS.participante.emailDemo);
  const [loginSenhaInput, setLoginSenhaInput] = useState('••••••••••••');

  // Navegação Separada de Cada Perfil (Substitui a Navbar ao Logar)
  const [abaPublica, setAbaPublica] = useState<AbaPublica>('home');
  const [canalContato, setCanalContato] = useState<'fale' | 'ouvidoria' | 'parceiro'>('fale');

  const [abaParticipante, setAbaParticipante] = useState<AbaParticipante>('equipes');
  const [abaEscola, setAbaEscola] = useState<AbaEscola>('visao');
  const [abaAvaliador, setAbaAvaliador] = useState<AbaAvaliador>('fila');
  const [abaOrganizador, setAbaOrganizador] = useState<AbaOrganizador>('visao');
  const [abaVoluntario, setAbaVoluntario] = useState<AbaVoluntario>('scanner');

  // Acessibilidade e Feedbacks
  const [altoContraste, setAltoContraste] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Estados de Dados Reativos (Conectados entre todas as áreas)
  const [participantes, setParticipantes] = useState<ParticipanteInscrito[]>(INITIAL_PARTICIPANTES);
  const [alunoLogadoId, setAlunoLogadoId] = useState<string>('part-1');
  const [filtroDeclaracaoEscola, setFiltroDeclaracaoEscola] = useState<'todos' | StatusDeclaracao>('todos');

  const [equipes, setEquipes] = useState<EquipeEscola[]>(INITIAL_EQUIPES);
  const [mentoresEscola, setMentoresEscola] = useState([
    { id: 'm-1', nome: 'Prof. Marcos Vinícius Silva', area: 'Robótica LEGO & Micro:bit', turno: 'Integral' },
    { id: 'm-2', nome: 'Profa. Camila Dietrich', area: 'Seguidor de Linha & ArtBot', turno: 'Contraturno' },
  ]);
  const [voluntariosEscola, setVoluntariosEscola] = useState([
    { id: 'v-1', nome: 'Beatriz Helena Souza', alocacao: 'Portaria Principal', telefone: '(47) 99941-2088' },
    { id: 'v-2', nome: 'Carlos Eduardo Nunes', alocacao: 'Apoio de Arena • Ala 01', telefone: '(47) 99812-3390' },
  ]);

  const [empateAtivo, setEmpateAtivo] = useState(INITIAL_EMPATE);
  const [metasFornecedores, setMetasFornecedores] = useState<MetaFornecedorKPI[]>(INITIAL_METAS_FORNECEDORES);
  const [checklists, setChecklists] = useState<ItemChecklistLocal[]>(INITIAL_CHECKLISTS);
  const [filtroMapa, setFiltroMapa] = useState<'todos' | TipoPinMapa>('todos');
  const [convidados, setConvidados] = useState<ConvidadoPortaria[]>(INITIAL_CONVIDADOS);
  const [horariosGrade, setHorariosGrade] = useState<HorarioTorneioGrade[]>(INITIAL_HORARIOS_TORNEIO);

  // Formulários Interativos
  const [novaEquipeNome, setNovaEquipeNome] = useState('');
  const [novaEquipeMod, setNovaEquipeMod] = useState('Robótica LEGO');
  const [novaEquipeAlunos, setNovaEquipeAlunos] = useState(
    'Lucas Gabriel Martins, Mariana Costa, Tiago Nunes, Sofia Lima'
  );
  const [novoMentorInput, setNovoMentorInput] = useState('');
  const [novoMentorArea, setNovoMentorArea] = useState('Robótica LEGO');
  const [novoVoluntarioInput, setNovoVoluntarioInput] = useState('');
  const [novoVoluntarioSetor, setNovoVoluntarioSetor] = useState('Portaria & Credenciamento');

  const [buscaFilaAvaliador, setBuscaFilaAvaliador] = useState('');
  const [equipeAvaliacaoId, setEquipeAvaliacaoId] = useState('eq-3');
  const [categoriaAvaliacao, setCategoriaAvaliacao] = useState('Robótica LEGO');
  const [notaEngenharia, setNotaEngenharia] = useState('9.5');
  const [notaProgramacao, setNotaProgramacao] = useState('9.0');
  const [notaDesempenho, setNotaDesempenho] = useState('8.5');
  const [notaPitch, setNotaPitch] = useState('10.0');
  const [obsAvaliador, setObsAvaliador] = useState(
    'Calibração precisa dos sensores ópticos e excelente domínio técnico da equipe durante a arguição.'
  );

  const [metaSelecionadaKpi, setMetaSelecionadaKpi] = useState('kpi-1');
  const [novoFornecedorNome, setNovoFornecedorNome] = useState('Panificadora Joinville Alimentos');
  const [novoFornecedorQtd, setNovoFornecedorQtd] = useState('50');

  const [novoHorarioMod, setNovoHorarioMod] = useState('Robótica LEGO — Desafio do Robô');
  const [novoHorarioAla, setNovoHorarioAla] = useState('Ala 01');
  const [novoHorarioHora, setNovoHorarioHora] = useState('16:00');

  const [convidadoNome, setConvidadoNome] = useState('');
  const [convidadoTelefone, setConvidadoTelefone] = useState('');
  const [qrTokenLido, setQrTokenLido] = useState<ParticipanteInscrito>(INITIAL_PARTICIPANTES[0]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3600);
  };

  const toggleAltoContraste = () => {
    document.body.classList.toggle('high-contrast');
    setAltoContraste(!altoContraste);
  };

  const alunoAtual = participantes.find((p) => p.id === alunoLogadoId) || participantes[0];
  const pendentesDeclaracaoCount = participantes.filter((p) => p.statusDeclaracao === 'aguardando').length;
  const pendentesAvaliacaoCount = equipes.filter((e) => !e.avaliada).length;

  // =========================================================================
  // HANDLERS DE AUTENTICAÇÃO E NAVEGAÇÃO
  // =========================================================================
  const handleSelecionarPerfilNoModal = (perfil: PerfilAcesso) => {
    setPerfilSelecionadoModal(perfil);
    setLoginEmailInput(PERFIS_CREDENCIADOS[perfil].emailDemo);
    setLoginSenhaInput('••••••••••••');
  };

  const handleConfirmarLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const info = PERFIS_CREDENCIADOS[perfilSelecionadoModal];
    setPerfilAutenticado(perfilSelecionadoModal);
    setModoVisualizacao('painel');
    setModalLoginAberto(false);
    showToast(`Sessão iniciada: ${info.usuarioNome} (${info.tituloArea}).`);
  };

  const handleLogout = () => {
    setPerfilAutenticado(null);
    setModoVisualizacao('publico');
    setAbaPublica('home');
    showToast('Sessão encerrada com segurança.');
  };

  const renderIconePerfil = (perfil: PerfilAcesso) => {
    switch (perfil) {
      case 'participante':
        return <UserCheck size={16} />;
      case 'escola':
        return <School size={16} />;
      case 'avaliador':
        return <Award size={16} />;
      case 'organizador':
        return <ShieldCheck size={16} />;
      case 'voluntario':
        return <QrCode size={16} />;
    }
  };

  // =========================================================================
  // HANDLERS DE NEGÓCIO
  // =========================================================================
  const atualizarStatusDeclaracao = (participanteId: string, novoStatus: StatusDeclaracao) => {
    setParticipantes((prev) =>
      prev.map((p) => (p.id === participanteId ? { ...p, statusDeclaracao: novoStatus } : p))
    );
    const alvo = participantes.find((p) => p.id === participanteId);
    showToast(`Declaração de ${alvo?.nome || 'Aluno'} alterada para ${novoStatus.toUpperCase()}.`);
  };

  const handleUploadDeclaracao = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParticipantes((prev) =>
      prev.map((p) =>
        p.id === alunoAtual.id
          ? {
              ...p,
              arquivoDeclaracao: file.name,
              dataEnvioDeclaracao: 'Agora mesmo',
              statusDeclaracao: 'aguardando',
            }
          : p
      )
    );
    showToast(`Documento "${file.name}" enviado para análise da escola.`);
  };

  const handleCadastrarEquipeEscola = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaEquipeNome.trim()) {
      showToast('Informe o nome da equipe para concluir a inscrição.');
      return;
    }
    const nova: EquipeEscola = {
      id: 'eq-' + (equipes.length + 1),
      nome: novaEquipeNome.trim(),
      escolaNome: 'E.M. Prefeito Wittich Freitag',
      modalidadePrincipal: novaEquipeMod,
      mentorNome: mentoresEscola[0]?.nome || 'Prof. Marcos Vinícius Silva',
      mentorMatricula: 'MAT-99412',
      voluntarioNome: voluntariosEscola[0]?.nome || 'Beatriz Helena Souza',
      alunosCount: novaEquipeAlunos.split(',').filter((s) => s.trim()).length || 4,
      alaAlocada: novaEquipeMod.includes('LEGO') ? 'Ala 01' : 'Ala 02',
      horarioPrincipal: '14:40',
      avaliada: false,
    };
    setEquipes([nova, ...equipes]);
    setNovaEquipeNome('');
    showToast(`Equipe "${nova.nome}" inscrita com sucesso na modalidade ${nova.modalidadePrincipal}.`);
  };

  const handleAdicionarMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoMentorInput.trim()) return;
    setMentoresEscola([
      ...mentoresEscola,
      { id: 'm-' + Date.now(), nome: novoMentorInput.trim(), area: novoMentorArea, turno: 'Contraturno' },
    ]);
    setNovoMentorInput('');
    showToast('Professor Mentor vinculado à delegação escolar.');
  };

  const handleAdicionarVoluntarioEscola = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoVoluntarioInput.trim()) return;
    setVoluntariosEscola([
      ...voluntariosEscola,
      { id: 'v-' + Date.now(), nome: novoVoluntarioInput.trim(), alocacao: novoVoluntarioSetor, telefone: '(47) 99900-1122' },
    ]);
    setNovoVoluntarioInput('');
    showToast('Voluntário cadastrado pela unidade escolar.');
  };

  const somaNotasAtual =
    (parseFloat(notaEngenharia) || 0) +
    (parseFloat(notaProgramacao) || 0) +
    (parseFloat(notaDesempenho) || 0) +
    (parseFloat(notaPitch) || 0);
  const notaFinalCalculada = Number(((somaNotasAtual / 40) * 100).toFixed(1));

  const handleRegistrarAvaliacao = (e: React.FormEvent) => {
    e.preventDefault();
    setEquipes((prev) =>
      prev.map((eq) =>
        eq.id === equipeAvaliacaoId ? { ...eq, avaliada: true, notaTotal: notaFinalCalculada } : eq
      )
    );
    const eqAlvo = equipes.find((eq) => eq.id === equipeAvaliacaoId);
    showToast(`Avaliação registrada para "${eqAlvo?.nome}": ${notaFinalCalculada} pts.`);
    setAbaAvaliador('fila');
  };

  const handleVotarDesempate = (equipeEscolhida: string) => {
    setEmpateAtivo((prev) => ({
      ...prev,
      votosJuizes: prev.votosJuizes.map((v, idx) =>
        idx === 1 ? { ...v, votoEquipe: equipeEscolhida } : v
      ),
      resolvido: true,
      vencedorDesempate: equipeEscolhida,
    }));
    showToast(`Desempate concluído pela banca ímpar (3 juízes): ${equipeEscolhida} vencedora.`);
  };

  const handleAdicionarEntregaFornecedor = (e: React.FormEvent) => {
    e.preventDefault();
    const qtd = parseInt(novoFornecedorQtd, 10);
    if (!novoFornecedorNome.trim() || isNaN(qtd) || qtd <= 0) {
      showToast('Informe um fornecedor e uma quantidade válida.');
      return;
    }
    setMetasFornecedores((prev) =>
      prev.map((m) =>
        m.id === metaSelecionadaKpi
          ? {
              ...m,
              entregas: [...m.entregas, { fornecedorNome: novoFornecedorNome.trim(), quantidade: qtd }],
            }
          : m
      )
    );
    showToast(`Entrega de +${qtd} un. (${novoFornecedorNome}) contabilizada no KPI.`);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklists((prev) =>
      prev.map((item) => (item.id === id ? { ...item, conferido: !item.conferido } : item))
    );
  };

  const handleCadastrarHorario = (e: React.FormEvent) => {
    e.preventDefault();
    const novo: HorarioTorneioGrade = {
      id: 'hor-' + (horariosGrade.length + 1),
      modalidade: novoHorarioMod,
      fase: 'Bateria Oficial (3 min)',
      ala: novoHorarioAla,
      horarioInicio: novoHorarioHora,
      horarioFim: '16:45',
      equipesEnvolvidas: ['JoinvilleBot Alpha', 'EcoBot Joinville'],
    };
    setHorariosGrade([...horariosGrade, novo]);
    showToast(`Janela ${novoHorarioHora} (${novoHorarioAla}) publicada sem conflito de equipes.`);
  };

  const handleRegistrarConvidado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convidadoNome.trim() || !convidadoTelefone.trim()) {
      showToast('Preencha Nome e Telefone para registrar o acesso.');
      return;
    }
    const agora = new Date();
    const horaFmt =
      String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0');
    const novoConv: ConvidadoPortaria = {
      id: 'conv-' + (convidados.length + 1),
      nome: convidadoNome.trim(),
      telefone: convidadoTelefone.trim(),
      horarioEntrada: horaFmt,
      voluntarioResponsavel: 'Beatriz Helena (Portaria)',
    };
    setConvidados([novoConv, ...convidados]);
    setConvidadoNome('');
    setConvidadoTelefone('');
    showToast(`Acesso liberado para o visitante ${novoConv.nome}.`);
  };

  // =========================================================================
  // RENDERIZAÇÃO DINÂMICA DAS OPÇÕES DA NAVBAR (SUBSTITUI AO LOGAR)
  // =========================================================================
  const emModoPainelRestrito = perfilAutenticado !== null && modoVisualizacao === 'painel';

  const renderChaveamentoCompartilhado = (destacarEquipeAluno: boolean) => (
    <div className="surface-card">
      <div className="surface-card-header">
        <div>
          <h3 className="surface-card-title">
            <span className="icon-squircle purple">
              <Layers size={18} />
            </span>
            Árvore de Chaveamento — Robótica LEGO (Ala 01 • Mesas 43504)
          </h3>
          <p className="surface-card-sub">
            Progressão oficial das baterias classificatórias até a Grande Final no Expocentro Edmundo Doubrawa.
          </p>
        </div>
        <span className="badge badge-purple">Atualização em Tempo Real</span>
      </div>

      <div className="grid-3">
        {/* Quartas */}
        <div>
          <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Quartas de Final
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {INITIAL_CHAVEAMENTO.filter((m) => m.fase === 'quartas').map((match) => {
              const isHighlight = destacarEquipeAluno && match.destaqueParticipante;
              return (
                <div
                  key={match.id}
                  style={{
                    border: isHighlight ? '2px solid var(--blue-600)' : '1px solid var(--border-hairline)',
                    borderRadius: '12px',
                    background: 'var(--bg-surface)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <div
                    style={{
                      background: isHighlight ? 'var(--blue-50)' : 'var(--bg-subtle)',
                      padding: '7px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isHighlight ? 'var(--blue-700)' : 'var(--text-muted)',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{match.codigo} • {match.horario}</span>
                    <span>{match.ala}</span>
                  </div>
                  <div style={{ padding: '10px 12px', fontSize: '13px', fontWeight: match.vencedor === match.equipeA ? 700 : 500, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{match.equipeA}</span>
                    <span className="badge badge-blue">{match.pontosA} pts</span>
                  </div>
                  <div style={{ padding: '10px 12px', fontSize: '13px', borderTop: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>{match.equipeB}</span>
                    <span>{match.pontosB} pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Semifinais */}
        <div>
          <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Semifinais
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {INITIAL_CHAVEAMENTO.filter((m) => m.fase === 'semifinal').map((match) => (
              <div
                key={match.id}
                style={{
                  border: '1px solid var(--border-strong)',
                  borderRadius: '12px',
                  background: 'var(--bg-surface)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ background: 'var(--purple-50)', color: 'var(--purple-700)', padding: '7px 12px', fontSize: '11px', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{match.codigo} • {match.horario}</span>
                  <span>{match.ala}</span>
                </div>
                <div style={{ padding: '11px 12px', fontSize: '13px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{match.equipeA}</span>
                  <span className="badge badge-purple">Classificada</span>
                </div>
                <div style={{ padding: '11px 12px', fontSize: '13px', fontWeight: 700, borderTop: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{match.equipeB}</span>
                  <span className="badge badge-purple">Classificada</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grande Final */}
        <div>
          <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Grande Final
          </div>
          {INITIAL_CHAVEAMENTO.filter((m) => m.fase === 'final').map((match) => (
            <div
              key={match.id}
              style={{
                border: '2px solid var(--blue-900)',
                borderRadius: '14px',
                background: 'var(--bg-surface)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ background: 'var(--blue-950)', color: '#FFFFFF', padding: '10px 14px', fontSize: '11.5px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Trophy size={14} /> {match.codigo} • {match.horario}
                </span>
                <span>{match.ala}</span>
              </div>
              <div style={{ padding: '14px', fontSize: '13.5px', fontWeight: 700 }}>
                {match.equipeA}
              </div>
              <div style={{ padding: '14px', fontSize: '13.5px', borderTop: '1px solid var(--border-hairline)', fontWeight: 700 }}>
                {match.equipeB}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* 1. Barra Institucional Minimalista */}
      <div className="gov-utility-bar">
        <div className="gov-utility-inner">
          <div className="gov-utility-left">
            <span className="gov-pill">Prefeitura de Joinville</span>
            <span>Secretaria Municipal de Educação (SED.URC) • Programa Somos Digitais</span>
          </div>
          <div className="gov-utility-actions">
            <button
              className="utility-chip-btn"
              onClick={() => showToast('Intérprete virtual VLibras inicializado.')}
            >
              <Accessibility size={12} /> VLibras
            </button>
            <button
              className={`utility-chip-btn ${altoContraste ? 'active' : ''}`}
              onClick={toggleAltoContraste}
            >
              <Contrast size={12} /> Alto Contraste
            </button>
            <button
              className="utility-chip-btn"
              onClick={() => showToast('Leitura assistiva de página ativada.')}
            >
              <Volume2 size={12} /> Áudio
            </button>
          </div>
        </div>
      </div>

      {/* 2. Navbar Principal Dinâmica (As opções do usuário logado SUBSTITUEM as opções públicas) */}
      <header className="main-navbar">
        <div className="main-navbar-inner">
          {/* Identidade da Marca */}
          <div
            className="brand-lockup"
            onClick={() => {
              if (emModoPainelRestrito) {
                if (perfilAutenticado === 'participante') setAbaParticipante('equipes');
                if (perfilAutenticado === 'escola') setAbaEscola('visao');
                if (perfilAutenticado === 'avaliador') setAbaAvaliador('fila');
                if (perfilAutenticado === 'organizador') setAbaOrganizador('visao');
                if (perfilAutenticado === 'voluntario') setAbaVoluntario('scanner');
              } else {
                setAbaPublica('home');
              }
            }}
          >
            <img src="/logo-cjr.png" alt="Logo CJR Joinville" className="brand-logo-box" />
            <div className="brand-titles">
              <div className="brand-title-row">
                <span className="brand-name">CJR Joinville</span>
                <span className={`brand-context-tag ${emModoPainelRestrito ? 'workspace' : ''}`}>
                  {emModoPainelRestrito
                    ? PERFIS_CREDENCIADOS[perfilAutenticado].tituloArea
                    : 'Portal Público'}
                </span>
              </div>
              <span className="brand-subtitle">6º Campeonato Joinvilense de Robótica</span>
            </div>
          </div>

          {/* Trilho Central Dinâmico: Opções do Perfil Logado OU Opções Públicas */}
          <nav className="nav-Menu-track" aria-label="Menu Principal Contextual">
            {!emModoPainelRestrito && (
              <>
                <button
                  className={`nav-tab-item ${abaPublica === 'home' ? 'active' : ''}`}
                  onClick={() => setAbaPublica('home')}
                >
                  Início
                </button>
                <button
                  className={`nav-tab-item ${abaPublica === 'sobre' ? 'active' : ''}`}
                  onClick={() => setAbaPublica('sobre')}
                >
                  Sobre
                </button>
                <button
                  className={`nav-tab-item ${abaPublica === 'edital' ? 'active' : ''}`}
                  onClick={() => setAbaPublica('edital')}
                >
                  Edital
                </button>
                <button
                  className={`nav-tab-item ${abaPublica === 'contato' ? 'active' : ''}`}
                  onClick={() => setAbaPublica('contato')}
                >
                  Contato
                </button>
              </>
            )}

            {emModoPainelRestrito && perfilAutenticado === 'participante' && (
              <>
                <button
                  className={`nav-tab-item ${abaParticipante === 'equipes' ? 'active' : ''}`}
                  onClick={() => setAbaParticipante('equipes')}
                >
                  <Clock size={15} /> Equipes & Horários
                </button>
                <button
                  className={`nav-tab-item ${abaParticipante === 'declaracao' ? 'active' : ''}`}
                  onClick={() => setAbaParticipante('declaracao')}
                >
                  <FileText size={15} /> Declaração
                  {alunoAtual.statusDeclaracao !== 'aceito' && (
                    <span className="nav-tab-badge alert">!</span>
                  )}
                </button>
                <button
                  className={`nav-tab-item ${abaParticipante === 'qrcode' ? 'active' : ''}`}
                  onClick={() => setAbaParticipante('qrcode')}
                >
                  <QrCode size={15} /> Ingresso QR
                </button>
                <button
                  className={`nav-tab-item ${abaParticipante === 'chaveamento' ? 'active' : ''}`}
                  onClick={() => setAbaParticipante('chaveamento')}
                >
                  <Layers size={15} /> Chaveamento
                </button>
              </>
            )}

            {emModoPainelRestrito && perfilAutenticado === 'escola' && (
              <>
                <button
                  className={`nav-tab-item ${abaEscola === 'visao' ? 'active' : ''}`}
                  onClick={() => setAbaEscola('visao')}
                >
                  <LayoutDashboard size={15} /> Visão Geral
                </button>
                <button
                  className={`nav-tab-item ${abaEscola === 'declaracoes' ? 'active' : ''}`}
                  onClick={() => setAbaEscola('declaracoes')}
                >
                  <CheckSquare size={15} /> Declarações
                  {pendentesDeclaracaoCount > 0 && (
                    <span className="nav-tab-badge">{pendentesDeclaracaoCount}</span>
                  )}
                </button>
                <button
                  className={`nav-tab-item ${abaEscola === 'equipes' ? 'active' : ''}`}
                  onClick={() => setAbaEscola('equipes')}
                >
                  <Users size={15} /> Equipes & Alunos
                </button>
                <button
                  className={`nav-tab-item ${abaEscola === 'apoio' ? 'active' : ''}`}
                  onClick={() => setAbaEscola('apoio')}
                >
                  <UserPlus size={15} /> Mentores & Voluntários
                </button>
              </>
            )}

            {emModoPainelRestrito && perfilAutenticado === 'avaliador' && (
              <>
                <button
                  className={`nav-tab-item ${abaAvaliador === 'fila' ? 'active' : ''}`}
                  onClick={() => setAbaAvaliador('fila')}
                >
                  <Clock size={15} /> Fila & Horários
                  {pendentesAvaliacaoCount > 0 && (
                    <span className="nav-tab-badge">{pendentesAvaliacaoCount}</span>
                  )}
                </button>
                <button
                  className={`nav-tab-item ${abaAvaliador === 'avaliar' ? 'active' : ''}`}
                  onClick={() => setAbaAvaliador('avaliar')}
                >
                  <Award size={15} /> Avaliar Equipe
                </button>
                <button
                  className={`nav-tab-item ${abaAvaliador === 'desempate' ? 'active' : ''}`}
                  onClick={() => setAbaAvaliador('desempate')}
                >
                  <AlertTriangle size={15} /> Desempate
                  {!empateAtivo.resolvido && <span className="nav-tab-badge alert">1</span>}
                </button>
                <button
                  className={`nav-tab-item ${abaAvaliador === 'chaveamento' ? 'active' : ''}`}
                  onClick={() => setAbaAvaliador('chaveamento')}
                >
                  <Layers size={15} /> Chaveamento
                </button>
              </>
            )}

            {emModoPainelRestrito && perfilAutenticado === 'organizador' && (
              <>
                <button
                  className={`nav-tab-item ${abaOrganizador === 'visao' ? 'active' : ''}`}
                  onClick={() => setAbaOrganizador('visao')}
                >
                  <LayoutDashboard size={15} /> Visão Geral
                </button>
                <button
                  className={`nav-tab-item ${abaOrganizador === 'mapa' ? 'active' : ''}`}
                  onClick={() => setAbaOrganizador('mapa')}
                >
                  <MapPin size={15} /> Mapa Joinville
                </button>
                <button
                  className={`nav-tab-item ${abaOrganizador === 'fornecedores' ? 'active' : ''}`}
                  onClick={() => setAbaOrganizador('fornecedores')}
                >
                  <PackageCheck size={15} /> Fornecedores & KPIs
                </button>
                <button
                  className={`nav-tab-item ${abaOrganizador === 'inspecao' ? 'active' : ''}`}
                  onClick={() => setAbaOrganizador('inspecao')}
                >
                  <ShieldCheck size={15} /> Inspeção Local
                </button>
                <button
                  className={`nav-tab-item ${abaOrganizador === 'horarios' ? 'active' : ''}`}
                  onClick={() => setAbaOrganizador('horarios')}
                >
                  <Calendar size={15} /> Horários
                </button>
              </>
            )}

            {emModoPainelRestrito && perfilAutenticado === 'voluntario' && (
              <>
                <button
                  className={`nav-tab-item ${abaVoluntario === 'scanner' ? 'active' : ''}`}
                  onClick={() => setAbaVoluntario('scanner')}
                >
                  <ScanLine size={15} /> Scanner QR Code
                </button>
                <button
                  className={`nav-tab-item ${abaVoluntario === 'convidados' ? 'active' : ''}`}
                  onClick={() => setAbaVoluntario('convidados')}
                >
                  <Users size={15} /> Entrada de Convidados
                </button>
              </>
            )}
          </nav>

          {/* Ações à Direita: Alternar Público/Painel + Sessão/Login */}
          <div className="navbar-actions">
            {perfilAutenticado ? (
              <>
                {modoVisualizacao === 'painel' ? (
                  <button
                    className="mode-switch-btn"
                    onClick={() => setModoVisualizacao('publico')}
                    title="Visualizar o Portal Público Institucional"
                  >
                    <Globe size={14} /> Site Público
                  </button>
                ) : (
                  <button
                    className="mode-switch-btn return-panel"
                    onClick={() => setModoVisualizacao('painel')}
                  >
                    {renderIconePerfil(perfilAutenticado)} Meu Painel
                  </button>
                )}

                <div className="session-chip">
                  <div className="session-avatar">
                    {PERFIS_CREDENCIADOS[perfilAutenticado].sigla}
                  </div>
                  <div className="session-meta">
                    <span className="session-name">
                      {PERFIS_CREDENCIADOS[perfilAutenticado].usuarioNome}
                    </span>
                    <span className="session-role">
                      {PERFIS_CREDENCIADOS[perfilAutenticado].cargoLabel}
                    </span>
                  </div>
                  <button
                    className="session-icon-btn"
                    onClick={() => {
                      handleSelecionarPerfilNoModal(perfilAutenticado);
                      setModalLoginAberto(true);
                    }}
                    title="Emular outro perfil de acesso"
                  >
                    <KeyRound size={14} />
                  </button>
                  <button
                    className="session-icon-btn danger"
                    onClick={handleLogout}
                    title="Sair da conta"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </>
            ) : (
              <button
                className="btn-login-primary"
                onClick={() => {
                  handleSelecionarPerfilNoModal('participante');
                  setModalLoginAberto(true);
                }}
              >
                <LogIn size={15} /> Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================================
          MODAL DE LOGIN (EMULADOR DE CREDENCIAIS POR ÁREA RBAC)
          ===================================================================== */}
      {modalLoginAberto && (
        <div className="sso-backdrop" onClick={() => setModalLoginAberto(false)}>
          <div className="sso-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="sso-aside">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
                  <img
                    src="/logo-cjr.png"
                    alt="Logo CJR"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: '#FFFFFF',
                      padding: '4px',
                      objectFit: 'contain',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#93C5FD', letterSpacing: '0.06em' }}>
                      AUTENTICAÇÃO UNIFICADA
                    </div>
                    <div style={{ fontSize: '17px', fontWeight: 800 }}>Acesso por Perfil</div>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '20px' }}>
                  Ao autenticar-se, a barra superior adapta-se automaticamente às ferramentas exclusivas da sua área, mantendo isolamento de permissões entre os portais.
                </p>

                <div
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    fontSize: '12px',
                    color: '#E2E8F0',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                    <Lock size={13} /> Módulos liberados neste perfil:
                  </div>
                  {PERFIS_CREDENCIADOS[perfilSelecionadoModal].escopoPermissao}
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '24px' }}>
                Secretaria de Educação de Joinville • ETP SEI 0020793169/2024
              </div>
            </div>

            <div className="sso-main">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Escolha a Área de Acesso</h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    Selecione uma credencial homologada para demonstração
                  </p>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setModalLoginAberto(false)}>
                  Cancelar
                </button>
              </div>

              <div className="sso-role-grid">
                {(Object.keys(PERFIS_CREDENCIADOS) as PerfilAcesso[]).map((key) => {
                  const item = PERFIS_CREDENCIADOS[key];
                  const selecionado = perfilSelecionadoModal === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      className={`sso-role-item ${selecionado ? 'selected' : ''}`}
                      onClick={() => handleSelecionarPerfilNoModal(key)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                        <span className={`icon-squircle ${selecionado ? 'blue' : 'purple'}`} style={{ width: '34px', height: '34px' }}>
                          {renderIconePerfil(key)}
                        </span>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                            {item.tituloArea}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            {item.usuarioNome} • {item.cargoLabel}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={16} color={selecionado ? '#1D4ED8' : '#94A3B8'} />
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleConfirmarLogin}>
                <div className="grid-2" style={{ gap: '10px', marginBottom: '14px' }}>
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label>E-mail Institucional</label>
                    <input
                      className="input-control"
                      value={loginEmailInput}
                      onChange={(e) => setLoginEmailInput(e.target.value)}
                    />
                  </div>
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label>Senha</label>
                    <input
                      type="password"
                      className="input-control"
                      value={loginSenhaInput}
                      onChange={(e) => setLoginSenhaInput(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '11px' }}>
                  <LogIn size={16} /> Acessar {PERFIS_CREDENCIADOS[perfilSelecionadoModal].tituloArea}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          CONTEÚDO PRINCIPAL (SEPARADO E ORGANIZADO POR ABA)
          ===================================================================== */}
      <main
        className="page-shell"
        key={`${modoVisualizacao}-${perfilAutenticado}-${abaPublica}-${abaParticipante}-${abaEscola}-${abaAvaliador}-${abaOrganizador}-${abaVoluntario}`}
      >
        {/* -------------------------------------------------------------------
            A. PORTAL PÚBLICO (INÍCIO, SOBRE, EDITAL, CONTATO)
            ------------------------------------------------------------------- */}
        {!emModoPainelRestrito && (
          <>
            {abaPublica === 'home' && (
              <div>
                {/* Hero Clean Editorial */}
                <section className="editorial-hero">
                  <div>
                    <div className="hero-kicker">
                      <Sparkles size={13} /> 6ª Edição • Expocentro Edmundo Doubrawa
                    </div>
                    <h2> Inovação e Robótica Educacional na Rede Municipal de Joinville</h2>
                    <p>
                      Tema norteador 2026: <strong>"Planeta em alerta: soluções para desastres naturais e ambientais"</strong>. Acompanhe notícias oficiais, editais, cronogramas e resultados das escolas participantes.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button className="btn btn-primary" onClick={() => setAbaPublica('edital')}>
                        <FileText size={15} /> Consultar Edital 2026
                      </button>
                      <button className="btn btn-outline" onClick={() => { setAbaPublica('contato'); setCanalContato('parceiro'); }}>
                        Seja Parceiro Institucional <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="hero-metrics-panel">
                    <div className="hero-metric-box">
                      <div className="hero-metric-num">69+</div>
                      <div className="hero-metric-lbl">Equipes Competidoras</div>
                    </div>
                    <div className="hero-metric-box">
                      <div className="hero-metric-num">35</div>
                      <div className="hero-metric-lbl">Escolas Municipais</div>
                    </div>
                    <div className="hero-metric-box">
                      <div className="hero-metric-num">07</div>
                      <div className="hero-metric-lbl">Modalidades Oficiais</div>
                    </div>
                    <div className="hero-metric-box">
                      <div className="hero-metric-num">16</div>
                      <div className="hero-metric-lbl">Mesas & Arenas Oficiais</div>
                    </div>
                  </div>
                </section>

                {/* Layout Blog + Cards de Notícias no Canto */}
                <div className="grid-asymmetric">
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Publicações em Destaque</h3>
                      <span className="badge badge-blue">Blog Oficial SED</span>
                    </div>

                    {INITIAL_POSTS_BLOG.map((post) => (
                      <article key={post.id} className="editorial-post-card">
                        <img src={post.imagemUrl} alt={post.titulo} className="editorial-post-img" />
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                              <span className="badge badge-purple">{post.categoria}</span>
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {post.data} • {post.autor}
                              </span>
                            </div>
                            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', lineHeight: 1.35 }}>
                              {post.titulo}
                            </h4>
                            <p style={{ fontSize: '13px', color: 'var(--text-body)' }}>{post.resumo}</p>
                          </div>
                          <div style={{ marginTop: '12px' }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => showToast(`Abrindo artigo completo: "${post.titulo}"`)}
                            >
                              Ler matéria completa <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Canto Direito: Cards de Notícias Rápidas */}
                  <aside style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div className="surface-card">
                      <div className="surface-card-header" style={{ marginBottom: '14px' }}>
                        <h3 className="surface-card-title">Avisos & Notícias Rápidas</h3>
                        <span className="badge badge-red">
                          <span className="status-dot" /> Tempo Real
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {INITIAL_CARDS_NOTICIA.map((card) => (
                          <div
                            key={card.id}
                            style={{
                              padding: '13px',
                              borderRadius: '10px',
                              background: 'var(--bg-subtle)',
                              border: '1px solid var(--border-hairline)',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <span
                                className={`badge ${
                                  card.corDestaque === 'blue'
                                    ? 'badge-blue'
                                    : card.corDestaque === 'purple'
                                    ? 'badge-purple'
                                    : 'badge-red'
                                }`}
                              >
                                {card.tag}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{card.horario}</span>
                            </div>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                              {card.titulo}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="surface-card">
                      <div className="surface-card-header" style={{ marginBottom: '12px' }}>
                        <h3 className="surface-card-title">
                          <Trophy size={16} color="#6D28D9" /> Memória de Campeões
                        </h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-hairline)' }}>
                          <span><strong>2025</strong> • E.M. Agrícola (Casa do Futuro)</span>
                          <span className="badge badge-blue">72 Equipes</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-hairline)' }}>
                          <span><strong>2024</strong> • E.M. Wittich Freitag</span>
                          <span className="badge badge-purple">91 Equipes</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span><strong>2021–2023</strong> • Somos Digitais</span>
                          <span className="badge badge-green">7 → 42 Equipes</span>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            )}

            {abaPublica === 'sobre' && (
              <div>
                <div className="workspace-header">
                  <div>
                    <div className="workspace-eyebrow">Institucional • Rede Municipal de Joinville</div>
                    <h2 className="workspace-title">Sobre o Campeonato & Modalidades</h2>
                    <p className="workspace-desc">
                      Evolução histórica do evento desde 2021 e especificações técnicas das 7 categorias homologadas pela Secretaria de Educação.
                    </p>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="surface-card">
                    <div className="surface-card-header">
                      <h3 className="surface-card-title">Linha do Tempo das Edições (2021–2026)</h3>
                      <span className="badge badge-blue">Memória Oficial</span>
                    </div>
                    <div className="table-wrap">
                      <table className="clean-table">
                        <thead>
                          <tr>
                            <th>Edição</th>
                            <th>Escala</th>
                            <th>Tema Central & Sede</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>6ª Edição (2026)</strong></td>
                            <td>69 equipes / 35 escolas</td>
                            <td>Planeta em Alerta: Desastres Naturais (Expocentro)</td>
                          </tr>
                          <tr>
                            <td><strong>5ª Edição (2025)</strong></td>
                            <td>72 equipes / 30 escolas</td>
                            <td>Casa do Futuro (Expocentro Edmundo Doubrawa)</td>
                          </tr>
                          <tr>
                            <td><strong>4ª Edição (2024)</strong></td>
                            <td>91 equipes / 37 escolas</td>
                            <td>Uso Consciente de Telas (Campus Park)</td>
                          </tr>
                          <tr>
                            <td><strong>1ª a 3ª (2021–2023)</strong></td>
                            <td>7 → 21 → 42 equipes</td>
                            <td>Implantação dos Clubes de Robótica</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="surface-card">
                    <div className="surface-card-header">
                      <h3 className="surface-card-title">Categorias & Infraestrutura (ETP SED.URC)</h3>
                      <span className="badge badge-purple">7 Modalidades</span>
                    </div>
                    <div className="grid-2" style={{ gap: '12px' }}>
                      <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg-subtle)', border: '1px solid var(--border-hairline)' }}>
                        <span className="badge badge-blue">Item 43504 • 8 Mesas</span>
                        <h4 style={{ fontSize: '14px', margin: '8px 0 4px' }}>LEGO & Micro:bit</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          15 equipes por categoria em mesas oficiais 2357×1143mm. 3 baterias de 3 min + 3 treinos de 10 min.
                        </p>
                      </div>
                      <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg-subtle)', border: '1px solid var(--border-hairline)' }}>
                        <span className="badge badge-purple">Item 43504 • 4 Mesas</span>
                        <h4 style={{ fontSize: '14px', margin: '8px 0 4px' }}>Seguidor de Linha</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Percurso autônomo de velocidade e precisão óptica com tomada de tempo oficial.
                        </p>
                      </div>
                      <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg-subtle)', border: '1px solid var(--border-hairline)' }}>
                        <span className="badge badge-red">Itens 43505 & 43506</span>
                        <h4 style={{ fontSize: '14px', margin: '8px 0 4px' }}>Sumô & Estoura Balão</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          2 arenas circulares de Sumô (Ø160cm) e 2 arenas sextavadas de Estoura Balão (1660mm).
                        </p>
                      </div>
                      <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg-subtle)', border: '1px solid var(--border-hairline)' }}>
                        <span className="badge badge-green">Inovação Aberta</span>
                        <h4 style={{ fontSize: '14px', margin: '8px 0 4px' }}>ArtBot & Projetos</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Expressão robótica criativa e protótipos tecnológicos voltados à sustentabilidade.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {abaPublica === 'edital' && (
              <div>
                <div className="workspace-header">
                  <div>
                    <div className="workspace-eyebrow">Regulamento Oficial • SEI Nº 0020793169/2024</div>
                    <h2 className="workspace-title">Edital & Diretrizes Operacionais 2026</h2>
                    <p className="workspace-desc">
                      Acesse o documento normativo oficial da Secretaria de Educação de Joinville com regras de inscrição, autorização parental e avaliação.
                    </p>
                  </div>
                  <div className="workspace-header-right">
                    <a
                      href="/edital_cjr.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      onClick={() => showToast('Abrindo Edital Oficial (edital_cjr.pdf)...')}
                    >
                      <Download size={16} /> Baixar Edital Completo (PDF)
                    </a>
                  </div>
                </div>

                <div className="grid-3">
                  <div className="surface-card">
                    <div className="icon-squircle blue" style={{ marginBottom: '12px' }}>
                      <School size={18} />
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
                      1. Inscrição e Validação Escolar
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      As unidades escolares inscrevem suas equipes, designam o professor mentor e validam digitalmente a autorização assinada pelos responsáveis legais dos estudantes menores.
                    </p>
                  </div>

                  <div className="surface-card">
                    <div className="icon-squircle purple" style={{ marginBottom: '12px' }}>
                      <Clock size={18} />
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
                      2. Cronograma sem Sobreposição (09h–18h)
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Cada equipe realiza 3 rodadas oficiais de 3 minutos (2h30 totais) e 3 treinos de 10 minutos (4h totais), além de 1h30 de almoço e 1h para abertura e premiação.
                    </p>
                  </div>

                  <div className="surface-card">
                    <div className="icon-squircle red" style={{ marginBottom: '12px' }}>
                      <Award size={18} />
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
                      3. Banca Ímpar & Critério de Desempate
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      As bancas avaliadoras operam sempre com número ímpar de integrantes. Havendo igualdade na pontuação, a soma dos votos de desempate define imediatamente a equipe vencedora.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {abaPublica === 'contato' && (
              <div>
                <div className="workspace-header">
                  <div>
                    <div className="workspace-eyebrow">Atendimento & Relacionamento</div>
                    <h2 className="workspace-title">Central de Contato CJR</h2>
                    <p className="workspace-desc">
                      Selecione abaixo o canal adequado para dúvidas gerais, manifestações formais de ouvidoria ou propostas de patrocínio/apoio.
                    </p>
                  </div>
                  <div className="segmented-pills">
                    <button
                      className={`segmented-pill ${canalContato === 'fale' ? 'active' : ''}`}
                      onClick={() => setCanalContato('fale')}
                    >
                      Fale Conosco
                    </button>
                    <button
                      className={`segmented-pill ${canalContato === 'ouvidoria' ? 'active' : ''}`}
                      onClick={() => setCanalContato('ouvidoria')}
                    >
                      Ouvidoria Oficial
                    </button>
                    <button
                      className={`segmented-pill ${canalContato === 'parceiro' ? 'active' : ''}`}
                      onClick={() => setCanalContato('parceiro')}
                    >
                      Seja Parceiro
                    </button>
                  </div>
                </div>

                <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                  {canalContato === 'fale' && (
                    <div className="surface-card">
                      <div className="surface-card-header">
                        <div>
                          <h3 className="surface-card-title">Fale Conosco</h3>
                          <p className="surface-card-sub">Dúvidas sobre visitação pública, escolas participantes e cronograma.</p>
                        </div>
                        <span className="badge badge-blue">Comissão CJR</span>
                      </div>
                      <div className="grid-2" style={{ gap: '12px' }}>
                        <div className="field-group">
                          <label>Nome Completo</label>
                          <input className="input-control" placeholder="Digite seu nome" />
                        </div>
                        <div className="field-group">
                          <label>E-mail ou Telefone</label>
                          <input className="input-control" placeholder="contato@joinville.sc.gov.br" />
                        </div>
                      </div>
                      <div className="field-group">
                        <label>Mensagem</label>
                        <textarea className="textarea-control" rows={4} placeholder="Escreva sua dúvida ou solicitação..." />
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => showToast('Mensagem encaminhada à equipe de atendimento CJR.')}
                      >
                        <Send size={15} /> Enviar Mensagem
                      </button>
                    </div>
                  )}

                  {canalContato === 'ouvidoria' && (
                    <div className="surface-card">
                      <div className="surface-card-header">
                        <div>
                          <h3 className="surface-card-title">Ouvidoria do Campeonato</h3>
                          <p className="surface-card-sub">Registro protocolado de recursos técnicos, segurança ou acessibilidade.</p>
                        </div>
                        <span className="badge badge-red">Protocolo Oficial</span>
                      </div>
                      <div className="grid-2" style={{ gap: '12px' }}>
                        <div className="field-group">
                          <label>Natureza da Manifestação</label>
                          <select className="select-control">
                            <option>Recurso Técnico / Regulamento</option>
                            <option>Acessibilidade e Segurança do Local</option>
                            <option>Relato Institucional</option>
                          </select>
                        </div>
                        <div className="field-group">
                          <label>Ala ou Modalidade Envolvida</label>
                          <input className="input-control" placeholder="Ex: Ala 01 • Robótica LEGO" />
                        </div>
                      </div>
                      <div className="field-group">
                        <label>Relato Detalhado</label>
                        <textarea className="textarea-control" rows={4} placeholder="Descreva os fatos para análise da Ouvidoria..." />
                      </div>
                      <button
                        className="btn btn-danger"
                        onClick={() => showToast('Protocolo registrado com sucesso na Ouvidoria CJR.')}
                      >
                        Registrar Manifestação
                      </button>
                    </div>
                  )}

                  {canalContato === 'parceiro' && (
                    <div className="surface-card">
                      <div className="surface-card-header">
                        <div>
                          <h3 className="surface-card-title">Seja Parceiro / Fornecedor Apoiador</h3>
                          <p className="surface-card-sub">Apoie o evento com kits de alimentação, insumos tecnológicos ou premiações.</p>
                        </div>
                        <span className="badge badge-purple">Parcerias & Cotas</span>
                      </div>
                      <div className="grid-2" style={{ gap: '12px' }}>
                        <div className="field-group">
                          <label>Empresa ou Instituição</label>
                          <input className="input-control" placeholder="Razão Social / Nome Fantasia" />
                        </div>
                        <div className="field-group">
                          <label>Frente de Apoio</label>
                          <select className="select-control">
                            <option>Kits de Alimentação / Lanches (Meta 200)</option>
                            <option>Equipamentos / Kits Micro:bit e LEGO</option>
                            <option>Premiação, Troféus e Medalhas</option>
                          </select>
                        </div>
                      </div>
                      <div className="field-group">
                        <label>Quantidade Ofertada & Responsável</label>
                        <textarea className="textarea-control" rows={4} placeholder="Ex: Fornecimento de 100 kits de alimentação..." />
                      </div>
                      <button
                        className="btn btn-purple"
                        onClick={() => showToast('Proposta enviada diretamente ao Painel do Organizador!')}
                      >
                        Enviar Proposta de Apoio
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* -------------------------------------------------------------------
            B. PAINEL DO PARTICIPANTE (4 ABAS SEPARADAS NA NAVBAR)
            ------------------------------------------------------------------- */}
        {emModoPainelRestrito && perfilAutenticado === 'participante' && (
          <div>
            <div className="workspace-header">
              <div>
                <div className="workspace-eyebrow">Área do Competidor • {alunoAtual.escolaNome}</div>
                <h2 className="workspace-title">
                  {abaParticipante === 'equipes' && 'Minhas Equipes, Torneios & Horários'}
                  {abaParticipante === 'declaracao' && 'Declaração de Autorização dos Pais'}
                  {abaParticipante === 'qrcode' && 'Ingresso QR Code de Entrada'}
                  {abaParticipante === 'chaveamento' && 'Chaveamento dos Torneios'}
                </h2>
                <p className="workspace-desc">
                  Estudante: <strong>{alunoAtual.nome}</strong> • Equipe: <strong>{alunoAtual.equipeNome}</strong>
                </p>
              </div>

              <div className="workspace-header-right">
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Alternar aluno (demo):</span>
                <select
                  className="select-control"
                  style={{ width: 'auto', padding: '7px 12px', fontWeight: 600 }}
                  value={alunoLogadoId}
                  onChange={(e) => setAlunoLogadoId(e.target.value)}
                >
                  {participantes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.statusDeclaracao.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ABA 1: EQUIPES & HORÁRIOS */}
            {abaParticipante === 'equipes' && (
              <div>
                <div className="grid-3" style={{ marginBottom: '22px' }}>
                  <div className="stat-card">
                    <div className="stat-card-top">
                      <span className="stat-label">Equipe Inscrita</span>
                      <span className="icon-squircle blue"><Users size={17} /></span>
                    </div>
                    <div className="stat-value" style={{ fontSize: '21px' }}>{alunoAtual.equipeNome}</div>
                    <div className="stat-foot">{alunoAtual.escolaNome}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-top">
                      <span className="stat-label">Modalidades Ativas</span>
                      <span className="icon-squircle purple"><Trophy size={17} /></span>
                    </div>
                    <div className="stat-value">0{alunoAtual.modalidades.length}</div>
                    <div className="stat-foot">Sem conflito de janela de horário</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-top">
                      <span className="stat-label">Autorização Parental</span>
                      <span className={`icon-squircle ${alunoAtual.statusDeclaracao === 'aceito' ? 'green' : 'amber'}`}>
                        <FileText size={17} />
                      </span>
                    </div>
                    <div>
                      {alunoAtual.statusDeclaracao === 'aceito' && <span className="badge badge-green">Aceito pela Escola</span>}
                      {alunoAtual.statusDeclaracao === 'aguardando' && <span className="badge badge-amber">Aguardando Escola</span>}
                      {alunoAtual.statusDeclaracao === 'recusado' && <span className="badge badge-red">Recusado — Reenviar</span>}
                    </div>
                    <div className="stat-foot">Responsável: {alunoAtual.responsavelLegal}</div>
                  </div>
                </div>

                <div className="surface-card">
                  <div className="surface-card-header">
                    <div>
                      <h3 className="surface-card-title">Cronograma Individual de Disputas e Locais</h3>
                      <p className="surface-card-sub">Apresente-se na ala indicada com 15 minutos de antecedência.</p>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => setAbaParticipante('qrcode')}>
                      <QrCode size={14} /> Abrir Meu QR Code
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table className="clean-table">
                      <thead>
                        <tr>
                          <th>Equipe</th>
                          <th>Torneio / Categoria</th>
                          <th>Horário da Bateria</th>
                          <th>Localização (Ala & Mesa)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alunoAtual.modalidades.map((mod, idx) => (
                          <tr key={idx}>
                            <td><strong>{alunoAtual.equipeNome}</strong></td>
                            <td><span className="badge badge-blue">{mod.nome}</span></td>
                            <td><strong style={{ color: 'var(--text-main)' }}>{mod.horario}</strong></td>
                            <td>
                              <span className="badge badge-purple">
                                <MapPin size={12} /> {mod.ala} • {mod.mesaPista}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: DECLARAÇÃO DOS PAIS */}
            {abaParticipante === 'declaracao' && (
              <div style={{ maxWidth: '880px', margin: '0 auto' }}>
                <div className="stepper-grid">
                  <div className="step-box done">
                    <div className="step-num">Etapa 01</div>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>Baixar Modelo</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Imprima o termo oficial para assinatura dos pais ou responsáveis.
                    </div>
                  </div>
                  <div className="step-box active">
                    <div className="step-num">Etapa 02</div>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>Enviar Assinada</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Anexe o arquivo digitalizado em PDF ou imagem legível.
                    </div>
                  </div>
                  <div className={`step-box ${alunoAtual.statusDeclaracao === 'aceito' ? 'done' : ''}`}>
                    <div className="step-num">Etapa 03</div>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>Validação Escolar</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      A coordenação da escola defere o documento e libera o QR Code.
                    </div>
                  </div>
                </div>

                <div className="surface-card">
                  <div className="surface-card-header">
                    <div>
                      <h3 className="surface-card-title">Documentação de Menor de Idade</h3>
                      <p className="surface-card-sub">Responsável cadastrado: {alunoAtual.responsavelLegal}</p>
                    </div>
                    {alunoAtual.statusDeclaracao === 'aceito' && (
                      <span className="badge badge-green"><CheckCircle2 size={13} /> Status: ACEITO</span>
                    )}
                    {alunoAtual.statusDeclaracao === 'aguardando' && (
                      <span className="badge badge-amber"><Clock size={13} /> Status: AGUARDANDO</span>
                    )}
                    {alunoAtual.statusDeclaracao === 'recusado' && (
                      <span className="badge badge-red"><XCircle size={13} /> Status: RECUSADO</span>
                    )}
                  </div>

                  <div
                    style={{
                      padding: '18px',
                      borderRadius: '12px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-hairline)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap',
                      marginBottom: '20px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                        Arquivo atual: {alunoAtual.arquivoDeclaracao}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Último envio registrado em: {alunoAtual.dataEnvioDeclaracao}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-outline"
                        onClick={() => showToast('Baixando Modelo_Declaracao_Pais_CJR2026.pdf...')}
                      >
                        <Download size={15} /> Baixar Modelo PDF
                      </button>

                      <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                        <Upload size={15} /> Enviar Versão Assinada
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={handleUploadDeclaracao}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: INGRESSO QR CODE */}
            {abaParticipante === 'qrcode' && (
              <div>
                <div className="digital-pass-wrapper">
                  <div className="digital-pass-top">
                    <div>
                      <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.08em', opacity: 0.85 }}>
                        PASSAPORTE OFICIAL • EXPOCENTRO
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
                        Credencial CJR 2026
                      </div>
                    </div>
                    <img
                      src="/logo-cjr.png"
                      alt="Logo CJR"
                      style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FFFFFF', padding: '3px' }}
                    />
                  </div>

                  <div className="digital-pass-body">
                    <div
                      style={{
                        width: '188px',
                        height: '188px',
                        margin: '0 auto 16px',
                        padding: '14px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-strong)',
                        background: '#FFFFFF',
                      }}
                    >
                      <svg width="158" height="158" viewBox="0 0 120 120" fill="none">
                        <rect width="120" height="120" fill="white" />
                        <rect x="8" y="8" width="32" height="32" stroke="#0F172A" strokeWidth="6" />
                        <rect x="18" y="18" width="12" height="12" fill="#1D4ED8" />
                        <rect x="80" y="8" width="32" height="32" stroke="#0F172A" strokeWidth="6" />
                        <rect x="90" y="18" width="12" height="12" fill="#6D28D9" />
                        <rect x="8" y="80" width="32" height="32" stroke="#0F172A" strokeWidth="6" />
                        <rect x="18" y="90" width="12" height="12" fill="#1D4ED8" />
                        <rect x="50" y="12" width="10" height="10" fill="#0F172A" />
                        <rect x="64" y="22" width="8" height="18" fill="#0F172A" />
                        <rect x="48" y="46" width="24" height="8" fill="#6D28D9" />
                        <rect x="14" y="52" width="18" height="8" fill="#0F172A" />
                        <rect x="54" y="60" width="16" height="16" fill="#1D4ED8" />
                        <rect x="82" y="54" width="24" height="10" fill="#0F172A" />
                        <rect x="50" y="84" width="12" height="24" fill="#0F172A" />
                        <rect x="72" y="80" width="34" height="26" fill="#0F172A" />
                      </svg>
                    </div>

                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                      {alunoAtual.nome}
                    </div>
                    <div style={{ fontSize: '12px', fontFamily: 'ui-monospace, monospace', color: 'var(--text-muted)', marginTop: '2px', marginBottom: '16px' }}>
                      {alunoAtual.qrCodeToken}
                    </div>

                    <div className="digital-pass-divider" style={{ marginBottom: '18px' }} />

                    <div className="grid-2" style={{ textAlign: 'left', gap: '12px', fontSize: '12px' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10.5px', fontWeight: 700 }}>EQUIPE</span>
                        <strong>{alunoAtual.equipeNome}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10.5px', fontWeight: 700 }}>ALAS DE ACESSO</span>
                        <strong style={{ color: 'var(--purple-700)' }}>
                          {alunoAtual.modalidades.map((m) => m.ala).join(' • ')}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10.5px', fontWeight: 700 }}>UNIDADE ESCOLAR</span>
                        <strong>{alunoAtual.escolaNome}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10.5px', fontWeight: 700 }}>STATUS PORTARIA</span>
                        {alunoAtual.statusDeclaracao === 'aceito' ? (
                          <span className="badge badge-green">Liberado</span>
                        ) : (
                          <span className="badge badge-red">Bloqueado ({alunoAtual.statusDeclaracao})</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 4: CHAVEAMENTO */}
            {abaParticipante === 'chaveamento' && renderChaveamentoCompartilhado(true)}
          </div>
        )}

        {/* -------------------------------------------------------------------
            C. PAINEL DA ESCOLA (4 ABAS SEPARADAS NA NAVBAR)
            ------------------------------------------------------------------- */}
        {emModoPainelRestrito && perfilAutenticado === 'escola' && (
          <div>
            <div className="workspace-header">
              <div>
                <div className="workspace-eyebrow">Unidade Escolar • E.M. Prefeito Wittich Freitag</div>
                <h2 className="workspace-title">
                  {abaEscola === 'visao' && 'Visão Geral da Delegação Escolar'}
                  {abaEscola === 'declaracoes' && 'Validação de Declarações Assinadas'}
                  {abaEscola === 'equipes' && 'Cadastro de Equipes & Estudantes'}
                  {abaEscola === 'apoio' && 'Professores Mentores & Voluntários'}
                </h2>
              </div>
              {abaEscola === 'visao' && (
                <div className="workspace-header-right">
                  <button className="btn btn-outline" onClick={() => setAbaEscola('declaracoes')}>
                    <CheckSquare size={15} /> Analisar Declarações ({pendentesDeclaracaoCount})
                  </button>
                  <button className="btn btn-primary" onClick={() => setAbaEscola('equipes')}>
                    <PlusCircle size={15} /> Nova Equipe
                  </button>
                </div>
              )}
            </div>

            {/* ABA 1: VISÃO GERAL */}
            {abaEscola === 'visao' && (
              <div>
                <div className="grid-4" style={{ marginBottom: '24px' }}>
                  <div className="stat-card">
                    <div className="stat-card-top">
                      <span className="stat-label">Equipes da Escola</span>
                      <span className="icon-squircle blue"><Users size={18} /></span>
                    </div>
                    <div className="stat-value">
                      0{equipes.filter((e) => e.escolaNome.includes('Wittich')).length}
                    </div>
                    <div className="stat-foot">Inscritas oficialmente na 6ª Edição</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-top">
                      <span className="stat-label">Declarações Deferidas</span>
                      <span className="icon-squircle green"><CheckSquare size={18} /></span>
                    </div>
                    <div className="stat-value">
                      {participantes.filter((p) => p.statusDeclaracao === 'aceito').length}/{participantes.length}
                    </div>
                    <div className="stat-foot">{pendentesDeclaracaoCount} aguardando parecer da direção</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-top">
                      <span className="stat-label">Professores Mentores</span>
                      <span className="icon-squircle purple"><Award size={18} /></span>
                    </div>
                    <div className="stat-value">0{mentoresEscola.length}</div>
                    <div className="stat-foot">Orientadores técnicos vinculados</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-top">
                      <span className="stat-label">Voluntários de Apoio</span>
                      <span className="icon-squircle amber"><UserCheck size={18} /></span>
                    </div>
                    <div className="stat-value">0{voluntariosEscola.length}</div>
                    <div className="stat-foot">Indicados para suporte no evento</div>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="surface-card">
                    <div className="surface-card-header">
                      <h3 className="surface-card-title">Equipes Representantes da Escola</h3>
                      <button className="btn btn-outline btn-sm" onClick={() => setAbaEscola('equipes')}>
                        Gerenciar
                      </button>
                    </div>
                    <div className="table-wrap">
                      <table className="clean-table">
                        <thead>
                          <tr>
                            <th>Equipe</th>
                            <th>Modalidade</th>
                            <th>Mentor</th>
                            <th>Ala</th>
                          </tr>
                        </thead>
                        <tbody>
                          {equipes
                            .filter((e) => e.escolaNome.includes('Wittich'))
                            .map((eq) => (
                              <tr key={eq.id}>
                                <td><strong>{eq.nome}</strong></td>
                                <td><span className="badge badge-blue">{eq.modalidadePrincipal}</span></td>
                                <td>{eq.mentorNome}</td>
                                <td><span className="badge badge-purple">{eq.alaAlocada}</span></td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="surface-card">
                    <div className="surface-card-header">
                      <h3 className="surface-card-title">Pendências de Autorização Parental</h3>
                      <button className="btn btn-outline btn-sm" onClick={() => setAbaEscola('declaracoes')}>
                        Ver todas
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {participantes.map((p) => (
                        <div
                          key={p.id}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '10px',
                            background: 'var(--bg-subtle)',
                            border: '1px solid var(--border-hairline)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 700 }}>{p.nome}</div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                              {p.equipeNome} • Resp: {p.responsavelLegal}
                            </div>
                          </div>
                          {p.statusDeclaracao === 'aceito' && <span className="badge badge-green">Deferida</span>}
                          {p.statusDeclaracao === 'aguardando' && <span className="badge badge-amber">Aguardando</span>}
                          {p.statusDeclaracao === 'recusado' && <span className="badge badge-red">Indeferida</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: DEFERIR / INDEFERIR DECLARAÇÕES */}
            {abaEscola === 'declaracoes' && (
              <div className="surface-card">
                <div className="surface-card-header">
                  <div>
                    <h3 className="surface-card-title">Análise de Declarações Assinadas pelos Pais</h3>
                    <p className="surface-card-sub">
                      O deferimento libera automaticamente o QR Code de acesso no painel do estudante.
                    </p>
                  </div>
                  <div className="segmented-pills">
                    {(['todos', 'aguardando', 'aceito', 'recusado'] as const).map((f) => (
                      <button
                        key={f}
                        className={`segmented-pill ${filtroDeclaracaoEscola === f ? 'active' : ''}`}
                        onClick={() => setFiltroDeclaracaoEscola(f)}
                      >
                        {f === 'todos' ? 'Todas' : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="table-wrap">
                  <table className="clean-table">
                    <thead>
                      <tr>
                        <th>Estudante</th>
                        <th>Responsável Legal</th>
                        <th>Equipe</th>
                        <th>Arquivo Digitalizado</th>
                        <th>Status</th>
                        <th>Decisão da Escola</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participantes
                        .filter((p) =>
                          filtroDeclaracaoEscola === 'todos' ? true : p.statusDeclaracao === filtroDeclaracaoEscola
                        )
                        .map((p) => (
                          <tr key={p.id}>
                            <td><strong>{p.nome}</strong></td>
                            <td>{p.responsavelLegal}</td>
                            <td>{p.equipeNome}</td>
                            <td>
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => showToast(`Inspecionando documento: ${p.arquivoDeclaracao}`)}
                              >
                                <FileText size={13} /> Abrir PDF
                              </button>
                            </td>
                            <td>
                              {p.statusDeclaracao === 'aceito' && <span className="badge badge-green">Aceito</span>}
                              {p.statusDeclaracao === 'aguardando' && <span className="badge badge-amber">Aguardando</span>}
                              {p.statusDeclaracao === 'recusado' && <span className="badge badge-red">Recusado</span>}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  className="btn btn-soft-success btn-sm"
                                  onClick={() => atualizarStatusDeclaracao(p.id, 'aceito')}
                                >
                                  <CheckCircle2 size={13} /> Deferir
                                </button>
                                <button
                                  className="btn btn-soft-danger btn-sm"
                                  onClick={() => atualizarStatusDeclaracao(p.id, 'recusado')}
                                >
                                  <XCircle size={13} /> Indeferir
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ABA 3: EQUIPES & ALUNOS */}
            {abaEscola === 'equipes' && (
              <div className="grid-sidebar-form">
                <div className="surface-card">
                  <div className="surface-card-header">
                    <div>
                      <h3 className="surface-card-title">Inscrever Nova Equipe</h3>
                      <p className="surface-card-sub">Vincule os alunos participantes e a modalidade.</p>
                    </div>
                  </div>
                  <form onSubmit={handleCadastrarEquipeEscola}>
                    <div className="field-group">
                      <label>Nome da Equipe</label>
                      <input
                        className="input-control"
                        value={novaEquipeNome}
                        onChange={(e) => setNovaEquipeNome(e.target.value)}
                        placeholder="Ex: Wittich CyberBots"
                      />
                    </div>
                    <div className="field-group">
                      <label>Modalidade Oficial</label>
                      <select
                        className="select-control"
                        value={novaEquipeMod}
                        onChange={(e) => setNovaEquipeMod(e.target.value)}
                      >
                        <option>Robótica LEGO</option>
                        <option>Robótica Micro:bit</option>
                        <option>Seguidor de Linha</option>
                        <option>Robótica Sumô</option>
                        <option>Estoura Balão</option>
                        <option>ArtBot</option>
                        <option>Projeto de Tecnologia Educacional</option>
                      </select>
                    </div>
                    <div className="field-group">
                      <label>Estudantes Integrantes (separados por vírgula)</label>
                      <textarea
                        className="textarea-control"
                        rows={3}
                        value={novaEquipeAlunos}
                        onChange={(e) => setNovaEquipeAlunos(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      <PlusCircle size={15} /> Confirmar Inscrição da Equipe
                    </button>
                  </form>
                </div>

                <div className="surface-card">
                  <div className="surface-card-header">
                    <h3 className="surface-card-title">Equipes Cadastradas na Rede</h3>
                    <span className="badge badge-blue">{equipes.length} Equipes</span>
                  </div>
                  <div className="table-wrap">
                    <table className="clean-table">
                      <thead>
                        <tr>
                          <th>Equipe</th>
                          <th>Modalidade</th>
                          <th>Alunos</th>
                          <th>Mentor</th>
                          <th>Local</th>
                        </tr>
                      </thead>
                      <tbody>
                        {equipes.map((eq) => (
                          <tr key={eq.id}>
                            <td>
                              <strong>{eq.nome}</strong>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{eq.escolaNome}</div>
                            </td>
                            <td><span className="badge badge-blue">{eq.modalidadePrincipal}</span></td>
                            <td>{eq.alunosCount} alunos</td>
                            <td>{eq.mentorNome}</td>
                            <td><span className="badge badge-purple">{eq.alaAlocada}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 4: MENTORES & VOLUNTÁRIOS */}
            {abaEscola === 'apoio' && (
              <div className="grid-2">
                <div className="surface-card">
                  <div className="surface-card-header">
                    <div>
                      <h3 className="surface-card-title">Professores Mentores</h3>
                      <p className="surface-card-sub">Docentes responsáveis pela orientação técnica das equipes.</p>
                    </div>
                    <span className="badge badge-purple">{mentoresEscola.length} Mentores</span>
                  </div>

                  <form onSubmit={handleAdicionarMentor} style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
                    <input
                      className="input-control"
                      style={{ flex: 1, minWidth: '180px' }}
                      placeholder="Nome do Professor Mentor"
                      value={novoMentorInput}
                      onChange={(e) => setNovoMentorInput(e.target.value)}
                    />
                    <select
                      className="select-control"
                      style={{ width: 'auto' }}
                      value={novoMentorArea}
                      onChange={(e) => setNovoMentorArea(e.target.value)}
                    >
                      <option>Robótica LEGO</option>
                      <option>Micro:bit & Código</option>
                      <option>Seguidor de Linha</option>
                    </select>
                    <button type="submit" className="btn btn-primary">Adicionar</button>
                  </form>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {mentoresEscola.map((m) => (
                      <div key={m.id} style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--bg-subtle)', border: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{m.nome}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{m.area}</div>
                        </div>
                        <span className="badge badge-blue">{m.turno}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-card">
                  <div className="surface-card-header">
                    <div>
                      <h3 className="surface-card-title">Voluntários de Apoio ao Evento</h3>
                      <p className="surface-card-sub">Colaboradores indicados pela escola para recepção, alas ou logística.</p>
                    </div>
                    <span className="badge badge-green">{voluntariosEscola.length} Voluntários</span>
                  </div>

                  <form onSubmit={handleAdicionarVoluntarioEscola} style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
                    <input
                      className="input-control"
                      style={{ flex: 1, minWidth: '180px' }}
                      placeholder="Nome completo do voluntário"
                      value={novoVoluntarioInput}
                      onChange={(e) => setNovoVoluntarioInput(e.target.value)}
                    />
                    <select
                      className="select-control"
                      style={{ width: 'auto' }}
                      value={novoVoluntarioSetor}
                      onChange={(e) => setNovoVoluntarioSetor(e.target.value)}
                    >
                      <option>Portaria & Credenciamento</option>
                      <option>Apoio de Arena • Ala 01</option>
                      <option>Apoio de Arena • Ala 02</option>
                    </select>
                    <button type="submit" className="btn btn-purple">Cadastrar</button>
                  </form>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {voluntariosEscola.map((v) => (
                      <div key={v.id} style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--bg-subtle)', border: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{v.nome}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.telefone}</div>
                        </div>
                        <span className="badge badge-purple">{v.alocacao}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------
            D. PAINEL DO AVALIADOR (4 ABAS SEPARADAS NA NAVBAR)
            ------------------------------------------------------------------- */}
        {emModoPainelRestrito && perfilAutenticado === 'avaliador' && (
          <div>
            <div className="workspace-header">
              <div>
                <div className="workspace-eyebrow">Banca Avaliadora Ímpar (3 Juízes) • Eng. Rafael Zimmermann</div>
                <h2 className="workspace-title">
                  {abaAvaliador === 'fila' && 'Fila de Equipes & Horários de Banca'}
                  {abaAvaliador === 'avaliar' && 'Ficha Técnica de Avaliação'}
                  {abaAvaliador === 'desempate' && 'Resolução de Empate Técnico'}
                  {abaAvaliador === 'chaveamento' && 'Chaveamento das Modalidades'}
                </h2>
              </div>

              {!empateAtivo.resolvido && abaAvaliador !== 'desempate' && (
                <button className="btn btn-danger btn-sm" onClick={() => setAbaAvaliador('desempate')}>
                  <AlertTriangle size={14} /> 1 Empate Técnico Pendente — Resolver Agora
                </button>
              )}
            </div>

            {/* ABA 1: FILA & HORÁRIOS */}
            {abaAvaliador === 'fila' && (
              <div>
                <div className="grid-3" style={{ marginBottom: '22px' }}>
                  <div className="stat-card">
                    <div className="stat-card-top">
                      <span className="stat-label">Equipes Não Avaliadas</span>
                      <span className="icon-squircle amber"><Clock size={18} /></span>
                    </div>
                    <div className="stat-value">0{pendentesAvaliacaoCount}</div>
                    <div className="stat-foot">Aguardando nota na bateria atual</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-top">
                      <span className="stat-label">Avaliações Concluídas</span>
                      <span className="icon-squircle green"><CheckCircle2 size={18} /></span>
                    </div>
                    <div className="stat-value">0{equipes.length - pendentesAvaliacaoCount}</div>
                    <div className="stat-foot">Sincronizadas com o chaveamento</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-top">
                      <span className="stat-label">Composição da Banca</span>
                      <span className="icon-squircle purple"><Award size={18} /></span>
                    </div>
                    <div className="stat-value">03 Juízes</div>
                    <div className="stat-foot">Sempre ímpar para garantia de desempate</div>
                  </div>
                </div>

                <div className="surface-card">
                  <div className="surface-card-header">
                    <h3 className="surface-card-title">Cronograma de Equipes na Banca</h3>
                    <div style={{ position: 'relative', width: '260px' }}>
                      <Search size={14} style={{ position: 'absolute', left: '11px', top: '11px', color: 'var(--text-muted)' }} />
                      <input
                        className="input-control"
                        style={{ paddingLeft: '32px' }}
                        placeholder="Filtrar equipe ou categoria..."
                        value={buscaFilaAvaliador}
                        onChange={(e) => setBuscaFilaAvaliador(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="table-wrap">
                    <table className="clean-table">
                      <thead>
                        <tr>
                          <th>Horário & Local</th>
                          <th>Equipe</th>
                          <th>Escola</th>
                          <th>Categoria</th>
                          <th>Situação</th>
                          <th>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {equipes
                          .filter(
                            (eq) =>
                              eq.nome.toLowerCase().includes(buscaFilaAvaliador.toLowerCase()) ||
                              eq.modalidadePrincipal.toLowerCase().includes(buscaFilaAvaliador.toLowerCase())
                          )
                          .map((eq) => (
                            <tr key={eq.id}>
                              <td>
                                <strong>{eq.horarioPrincipal}</strong>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{eq.alaAlocada}</div>
                              </td>
                              <td><strong>{eq.nome}</strong></td>
                              <td>{eq.escolaNome}</td>
                              <td><span className="badge badge-blue">{eq.modalidadePrincipal}</span></td>
                              <td>
                                {eq.avaliada ? (
                                  <span className="badge badge-green">Concluída ({eq.notaTotal} pts)</span>
                                ) : (
                                  <span className="badge badge-amber">Não Avaliada</span>
                                )}
                              </td>
                              <td>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => {
                                    setEquipeAvaliacaoId(eq.id);
                                    setCategoriaAvaliacao(eq.modalidadePrincipal);
                                    setAbaAvaliador('avaliar');
                                  }}
                                >
                                  Avaliar <ChevronRight size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: AVALIAR EQUIPE */}
            {abaAvaliador === 'avaliar' && (
              <div className="grid-asymmetric">
                <div className="surface-card">
                  <div className="surface-card-header">
                    <div>
                      <h3 className="surface-card-title">Preenchimento de Critérios & Observações</h3>
                      <p className="surface-card-sub">Notas de 0 a 10 convertidas automaticamente para escala de 100 pontos.</p>
                    </div>
                    <span className="badge badge-purple">Ficha Oficial CJR</span>
                  </div>

                  <form onSubmit={handleRegistrarAvaliacao}>
                    <div className="grid-2" style={{ gap: '14px' }}>
                      <div className="field-group">
                        <label>Equipe Avaliada</label>
                        <select
                          className="select-control"
                          value={equipeAvaliacaoId}
                          onChange={(e) => setEquipeAvaliacaoId(e.target.value)}
                        >
                          {equipes.map((eq) => (
                            <option key={eq.id} value={eq.id}>
                              {eq.nome} — {eq.escolaNome}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field-group">
                        <label>Categoria / Modalidade</label>
                        <select
                          className="select-control"
                          value={categoriaAvaliacao}
                          onChange={(e) => setCategoriaAvaliacao(e.target.value)}
                        >
                          <option>Robótica LEGO</option>
                          <option>Robótica Micro:bit</option>
                          <option>Seguidor de Linha</option>
                          <option>Robótica Sumô</option>
                          <option>Estoura Balão</option>
                          <option>ArtBot</option>
                          <option>Projeto de Tecnologia Educacional</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid-2" style={{ gap: '14px' }}>
                      <div className="field-group">
                        <label>1. Engenharia & Estrutura Mecânica (0–10)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          className="input-control"
                          value={notaEngenharia}
                          onChange={(e) => setNotaEngenharia(e.target.value)}
                        />
                      </div>
                      <div className="field-group">
                        <label>2. Lógica de Programação & Sensores (0–10)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          className="input-control"
                          value={notaProgramacao}
                          onChange={(e) => setNotaProgramacao(e.target.value)}
                        />
                      </div>
                      <div className="field-group">
                        <label>3. Desempenho Prático na Mesa/Arena (0–10)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          className="input-control"
                          value={notaDesempenho}
                          onChange={(e) => setNotaDesempenho(e.target.value)}
                        />
                      </div>
                      <div className="field-group">
                        <label>4. Trabalho em Equipe & Defesa Técnica (0–10)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          className="input-control"
                          value={notaPitch}
                          onChange={(e) => setNotaPitch(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label>Observações Técnicas da Banca</label>
                      <textarea
                        className="textarea-control"
                        rows={3}
                        value={obsAvaliador}
                        onChange={(e) => setObsAvaliador(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '11px' }}>
                      <CheckCircle2 size={16} /> Concluir Avaliação e Publicar Nota
                    </button>
                  </form>
                </div>

                <div className="surface-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span className="badge badge-blue" style={{ marginBottom: '12px' }}>Resumo da Nota</span>
                    <div style={{ fontSize: '46px', fontWeight: 800, color: 'var(--blue-700)', lineHeight: 1 }}>
                      {notaFinalCalculada}
                      <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 600 }}> / 100 pts</span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '10px', marginBottom: '20px' }}>
                      Pontuação consolidada a partir dos 4 eixos avaliativos oficiais da categoria <strong>{categoriaAvaliacao}</strong>.
                    </p>

                    <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg-subtle)', fontSize: '12.5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span>Engenharia & Construção</span>
                        <strong>{notaEngenharia}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span>Programação & Sensores</span>
                        <strong>{notaProgramacao}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span>Desempenho na Arena</span>
                        <strong>{notaDesempenho}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Trabalho em Equipe & Pitch</span>
                        <strong>{notaPitch}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: DESEMPATE (BANCA SEMPRE ÍMPAR) */}
            {abaAvaliador === 'desempate' && (
              <div style={{ maxWidth: '860px', margin: '0 auto' }}>
                <div className="surface-card">
                  <div className="surface-card-header">
                    <div>
                      <span className={`badge ${empateAtivo.resolvido ? 'badge-green' : 'badge-red'}`} style={{ marginBottom: '8px' }}>
                        <AlertTriangle size={13} />
                        {empateAtivo.resolvido
                          ? 'Empate Resolvido pela Banca Ímpar'
                          : 'Igualdade Pontual Detectada na Categoria'}
                      </span>
                      <h3 style={{ fontSize: '19px', fontWeight: 800 }}>
                        {empateAtivo.categoria}: {empateAtivo.equipeA} ({empateAtivo.pontuacaoEmpatada} pts) × {empateAtivo.equipeB} ({empateAtivo.pontuacaoEmpatada} pts)
                      </h3>
                      <p className="surface-card-sub" style={{ marginTop: '6px' }}>
                        Como a banca é composta por número <strong>sempre ímpar de avaliadores (3 juízes)</strong>, a soma dos pontos de desempate define matematicamente o vencedor sem possibilidade de novo empate.
                      </p>
                    </div>
                  </div>

                  <div className="grid-3" style={{ marginBottom: '22px' }}>
                    {empateAtivo.votosJuizes.map((v, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          background: v.votoEquipe ? 'var(--bg-subtle)' : 'var(--red-50)',
                          border: `1px solid ${v.votoEquipe ? 'var(--border-hairline)' : 'var(--red-100)'}`,
                        }}
                      >
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Integrante #{idx + 1} (Ímpar)
                        </div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, margin: '4px 0 8px' }}>
                          {v.avaliadorNome}
                        </div>
                        {v.votoEquipe ? (
                          <span className="badge badge-blue">+1 Ponto: {v.votoEquipe}</span>
                        ) : (
                          <span className="badge badge-red">Aguardando seu voto</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      padding: '18px',
                      borderRadius: '12px',
                      background: 'var(--bg-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700 }}>
                        {empateAtivo.resolvido
                          ? `Resultado Consolidado (2 × 1): ${empateAtivo.vencedorDesempate} classificada!`
                          : 'Atribua abaixo o seu Ponto de Desempate:'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleVotarDesempate(empateAtivo.equipeA)}
                      >
                        Votar em {empateAtivo.equipeA}
                      </button>
                      <button
                        className="btn btn-purple"
                        onClick={() => handleVotarDesempate(empateAtivo.equipeB)}
                      >
                        Votar em {empateAtivo.equipeB}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 4: CHAVEAMENTO */}
            {abaAvaliador === 'chaveamento' && renderChaveamentoCompartilhado(false)}
          </div>
        )}

        {/* -------------------------------------------------------------------
            E. PAINEL DO ORGANIZADOR (5 ABAS SEPARADAS NA NAVBAR)
            ------------------------------------------------------------------- */}
        {emModoPainelRestrito && perfilAutenticado === 'organizador' && (
          <div>
            <div className="workspace-header">
              <div>
                <div className="workspace-eyebrow">Administração Central SED • Centro de Comando CJR</div>
                <h2 className="workspace-title">
                  {abaOrganizador === 'visao' && 'Visão Geral Executiva do Evento'}
                  {abaOrganizador === 'mapa' && 'Mapa Georreferenciado de Joinville'}
                  {abaOrganizador === 'fornecedores' && 'Gestão de Fornecedores & Metas KPI'}
                  {abaOrganizador === 'inspecao' && 'Conferência de Acessibilidade & Segurança'}
                  {abaOrganizador === 'horarios' && 'Grade de Horários Multi-Modalidade'}
                </h2>
              </div>
            </div>

            {/* ABA 1: VISÃO GERAL */}
            {abaOrganizador === 'visao' && (
              <div>
                <div className="grid-4" style={{ marginBottom: '24px' }}>
                  <div className="stat-card">
                    <div className="stat-card-top">
                      <span className="stat-label">Delegações Ativas</span>
                      <span className="icon-squircle blue"><School size={18} /></span>
                    </div>
                    <div className="stat-value">35 Escolas</div>
                    <div className="stat-foot">{equipes.length + 63} equipes e 258 estudantes</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-top">
                      <span className="stat-label">KPI Alimentação</span>
                      <span className="icon-squircle purple"><PackageCheck size={18} /></span>
                    </div>
                    <div className="stat-value">
                      {metasFornecedores[0].entregas.reduce((a, b) => a + b.quantidade, 0)}/{metasFornecedores[0].metaTotal}
                    </div>
                    <div className="stat-foot">Kits entregues pelos fornecedores</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-top">
                      <span className="stat-label">Público na Portaria</span>
                      <span className="icon-squircle green"><Users size={18} /></span>
                    </div>
                    <div className="stat-value">{408 + convidados.length}</div>
                    <div className="stat-foot">Visitantes contabilizados ao vivo</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-top">
                      <span className="stat-label">Vistoria do Local</span>
                      <span className="icon-squircle amber"><ShieldCheck size={18} /></span>
                    </div>
                    <div className="stat-value">
                      {checklists.filter((c) => c.conferido).length}/{checklists.length}
                    </div>
                    <div className="stat-foot">Itens de acessibilidade e segurança</div>
                  </div>
                </div>

                <div className="grid-3">
                  <div className="surface-card">
                    <div className="surface-card-header">
                      <h3 className="surface-card-title"><MapPin size={17} color="#1D4ED8" /> Malha Geográfica</h3>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Inspecione os pins de Escolas Polo (Mesas 43504), Locais Sediadores e Fornecedores em Joinville.
                    </p>
                    <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setAbaOrganizador('mapa')}>
                      Abrir Mapa Interativo <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="surface-card">
                    <div className="surface-card-header">
                      <h3 className="surface-card-title"><PackageCheck size={17} color="#6D28D9" /> Suprimentos & Cotas</h3>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Acompanhe o checklist de metas de fornecedores (ex: 150/200 kits de alimentação) e registre entregas.
                    </p>
                    <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setAbaOrganizador('fornecedores')}>
                      Gerenciar Fornecedores <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="surface-card">
                    <div className="surface-card-header">
                      <h3 className="surface-card-title"><ShieldCheck size={17} color="#059669" /> Conformidade Técnica</h3>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Auditoria presencial de acessibilidade NBR 9050, rotas de emergência e isolamento das arenas.
                    </p>
                    <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setAbaOrganizador('inspecao')}>
                      Acessar Checklists <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: MAPA REACT-LEAFLET */}
            {abaOrganizador === 'mapa' && (
              <div className="surface-card">
                <div className="surface-card-header">
                  <div>
                    <h3 className="surface-card-title">Ecossistema CJR em Joinville (React-Leaflet)</h3>
                    <p className="surface-card-sub">
                      Locais Sediadores em Azul (S), Escolas Municipais em Roxo (E) e Fornecedores em Vermelho (F).
                    </p>
                  </div>

                  <div className="segmented-pills">
                    <button
                      className={`segmented-pill ${filtroMapa === 'todos' ? 'active' : ''}`}
                      onClick={() => setFiltroMapa('todos')}
                    >
                      Todos ({INITIAL_PINS_MAPA.length})
                    </button>
                    <button
                      className={`segmented-pill ${filtroMapa === 'sediador' ? 'active' : ''}`}
                      onClick={() => setFiltroMapa('sediador')}
                    >
                      Locais Sediadores
                    </button>
                    <button
                      className={`segmented-pill ${filtroMapa === 'escola' ? 'active' : ''}`}
                      onClick={() => setFiltroMapa('escola')}
                    >
                      Escolas
                    </button>
                    <button
                      className={`segmented-pill ${filtroMapa === 'fornecedor' ? 'active' : ''}`}
                      onClick={() => setFiltroMapa('fornecedor')}
                    >
                      Fornecedores
                    </button>
                  </div>
                </div>

                <OrganizerLeafletMap pins={INITIAL_PINS_MAPA} filtroAtivo={filtroMapa} />
              </div>
            )}

            {/* ABA 3: FORNECEDORES & KPIS */}
            {abaOrganizador === 'fornecedores' && (
              <div className="grid-sidebar-form">
                <div className="surface-card">
                  <div className="surface-card-header">
                    <div>
                      <h3 className="surface-card-title">Registrar Entrega de Fornecedor</h3>
                      <p className="surface-card-sub">Some novas remessas diretamente na meta do item.</p>
                    </div>
                  </div>
                  <form onSubmit={handleAdicionarEntregaFornecedor}>
                    <div className="field-group">
                      <label>Item / Meta de Suprimento</label>
                      <select
                        className="select-control"
                        value={metaSelecionadaKpi}
                        onChange={(e) => setMetaSelecionadaKpi(e.target.value)}
                      >
                        {metasFornecedores.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.itemRecurso} (Meta: {m.metaTotal})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field-group">
                      <label>Fornecedor / Parceiro</label>
                      <input
                        className="input-control"
                        value={novoFornecedorNome}
                        onChange={(e) => setNovoFornecedorNome(e.target.value)}
                        placeholder="Ex: Fornecedor X Alimentos"
                      />
                    </div>
                    <div className="field-group">
                      <label>Quantidade Entregue</label>
                      <input
                        type="number"
                        className="input-control"
                        value={novoFornecedorQtd}
                        onChange={(e) => setNovoFornecedorQtd(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      <PlusCircle size={15} /> Contabilizar Entrega no KPI
                    </button>
                  </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {metasFornecedores.map((meta) => {
                    const somaAtual = meta.entregas.reduce((acc, e) => acc + e.quantidade, 0);
                    const pct = Math.min(100, Math.round((somaAtual / meta.metaTotal) * 100));
                    const atingida = somaAtual >= meta.metaTotal;
                    return (
                      <div key={meta.id} className="surface-card" style={{ padding: '18px 22px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                          <div>
                            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                              {meta.itemRecurso}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {meta.entregas.map((e) => `${e.fornecedorNome} (${e.quantidade})`).join(' • ')}
                            </div>
                          </div>
                          <span className={`badge ${atingida ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: '12.5px', padding: '4px 12px' }}>
                            {somaAtual} / {meta.metaTotal} ({pct}%)
                          </span>
                        </div>
                        <div className="progress-rail">
                          <div className={`progress-bar-fill ${atingida ? 'complete' : ''}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ABA 4: INSPEÇÃO DE ACESSIBILIDADE & SEGURANÇA */}
            {abaOrganizador === 'inspecao' && (
              <div className="grid-2">
                <div className="surface-card">
                  <div className="surface-card-header">
                    <div>
                      <h3 className="surface-card-title">
                        <span className="icon-squircle blue"><Accessibility size={18} /></span>
                        Acessibilidade do Local (NBR 9050)
                      </h3>
                      <p className="surface-card-sub">Rampas, circulação PcD, intérprete de Libras e sinalização tátil.</p>
                    </div>
                    <span className="badge badge-blue">
                      {checklists.filter((c) => c.tipo === 'acessibilidade' && c.conferido).length}/
                      {checklists.filter((c) => c.tipo === 'acessibilidade').length} OK
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {checklists
                      .filter((c) => c.tipo === 'acessibilidade')
                      .map((item) => (
                        <label
                          key={item.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            background: item.conferido ? 'var(--bg-subtle)' : 'var(--amber-50)',
                            border: '1px solid var(--border-hairline)',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 500 }}>
                            <input
                              type="checkbox"
                              checked={item.conferido}
                              onChange={() => toggleChecklistItem(item.id)}
                            />
                            <span>{item.titulo}</span>
                          </div>
                          <span className={`badge ${item.conferido ? 'badge-green' : 'badge-amber'}`}>
                            {item.setorAla}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>

                <div className="surface-card">
                  <div className="surface-card-header">
                    <div>
                      <h3 className="surface-card-title">
                        <span className="icon-squircle red"><ShieldCheck size={18} /></span>
                        Segurança & Prevenção do Local
                      </h3>
                      <p className="surface-card-sub">Bombeiros, extintores, rotas de evasão e isolamento elétrico das arenas.</p>
                    </div>
                    <span className="badge badge-purple">
                      {checklists.filter((c) => c.tipo === 'seguranca' && c.conferido).length}/
                      {checklists.filter((c) => c.tipo === 'seguranca').length} OK
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {checklists
                      .filter((c) => c.tipo === 'seguranca')
                      .map((item) => (
                        <label
                          key={item.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            background: item.conferido ? 'var(--bg-subtle)' : 'var(--red-50)',
                            border: '1px solid var(--border-hairline)',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 500 }}>
                            <input
                              type="checkbox"
                              checked={item.conferido}
                              onChange={() => toggleChecklistItem(item.id)}
                            />
                            <span>{item.titulo}</span>
                          </div>
                          <span className={`badge ${item.conferido ? 'badge-green' : 'badge-red'}`}>
                            {item.setorAla}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* ABA 5: HORÁRIOS MULTI-MODALIDADE */}
            {abaOrganizador === 'horarios' && (
              <div className="grid-sidebar-form">
                <div className="surface-card">
                  <div className="surface-card-header">
                    <div>
                      <h3 className="surface-card-title">Publicar Janela de Disputa</h3>
                      <p className="surface-card-sub">
                        Validação automática para equipes inscritas em mais de uma modalidade.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleCadastrarHorario}>
                    <div className="field-group">
                      <label>Modalidade</label>
                      <select
                        className="select-control"
                        value={novoHorarioMod}
                        onChange={(e) => setNovoHorarioMod(e.target.value)}
                      >
                        <option>Robótica LEGO — Desafio do Robô</option>
                        <option>Robótica Micro:bit</option>
                        <option>Seguidor de Linha Autônomo</option>
                        <option>Robótica Sumô (Arena Ø160cm)</option>
                        <option>Estoura Balão (Arena 1660mm)</option>
                      </select>
                    </div>
                    <div className="field-group">
                      <label>Ala Alocada</label>
                      <select
                        className="select-control"
                        value={novoHorarioAla}
                        onChange={(e) => setNovoHorarioAla(e.target.value)}
                      >
                        <option>Ala 01</option>
                        <option>Ala 02</option>
                        <option>Ala 03</option>
                      </select>
                    </div>
                    <div className="field-group">
                      <label>Horário Inicial (09h às 18h)</label>
                      <input
                        type="time"
                        className="input-control"
                        value={novoHorarioHora}
                        onChange={(e) => setNovoHorarioHora(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      <SlidersHorizontal size={15} /> Validar & Publicar Horário
                    </button>
                  </form>
                </div>

                <div className="surface-card">
                  <div className="surface-card-header">
                    <h3 className="surface-card-title">Grade Oficial Consolidada</h3>
                    <span className="badge badge-green">Zero Conflitos Detectados</span>
                  </div>
                  <div className="table-wrap">
                    <table className="clean-table">
                      <thead>
                        <tr>
                          <th>Janela</th>
                          <th>Modalidade</th>
                          <th>Fase</th>
                          <th>Ala</th>
                          <th>Equipes Escaladas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {horariosGrade.map((h) => (
                          <tr key={h.id}>
                            <td><strong>{h.horarioInicio} – {h.horarioFim}</strong></td>
                            <td>{h.modalidade}</td>
                            <td>{h.fase}</td>
                            <td><span className="badge badge-purple">{h.ala}</span></td>
                            <td>{h.equipesEnvolvidas.join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------
            F. PAINEL DO VOLUNTÁRIO / PORTARIA (2 ABAS MINIMALISTAS NA NAVBAR)
            ------------------------------------------------------------------- */}
        {emModoPainelRestrito && perfilAutenticado === 'voluntario' && (
          <div>
            <div className="workspace-header">
              <div>
                <div className="workspace-eyebrow">Recepção & Portaria • Expocentro Edmundo Doubrawa</div>
                <h2 className="workspace-title">
                  {abaVoluntario === 'scanner'
                    ? 'Validação de Credencial QR Code'
                    : 'Credenciamento Rápido de Convidados'}
                </h2>
              </div>
              <div className="workspace-header-right">
                <span className="badge badge-purple" style={{ padding: '6px 12px', fontSize: '12.5px' }}>
                  Público Contabilizado: {408 + convidados.length} presentes
                </span>
              </div>
            </div>

            {/* ABA 1: SCANNER QR CODE */}
            {abaVoluntario === 'scanner' && (
              <div className="grid-2" style={{ maxWidth: '980px', margin: '0 auto' }}>
                <div className="surface-card" style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      background: 'var(--blue-950)',
                      borderRadius: '16px',
                      padding: '32px 20px',
                      color: '#FFFFFF',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: '132px',
                        height: '132px',
                        margin: '0 auto 14px',
                        borderRadius: '18px',
                        border: '2px dashed #60A5FA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(59, 130, 246, 0.08)',
                      }}
                    >
                      <QrCode size={58} color="#93C5FD" />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
                      Leitor Óptico Pronto
                    </div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                      Aproxime o QR Code do participante ou simule uma leitura abaixo:
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {participantes.map((p) => (
                      <button
                        key={p.id}
                        className={`btn btn-sm ${qrTokenLido.id === p.id ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => {
                          setQrTokenLido(p);
                          showToast(`Credencial lida: ${p.nome}`);
                        }}
                      >
                        Simular QR: {p.nome.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="surface-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'ui-monospace, monospace' }}>
                        {qrTokenLido.qrCodeToken}
                      </span>
                      {qrTokenLido.statusDeclaracao === 'aceito' ? (
                        <span className="badge badge-green">Acesso Liberado</span>
                      ) : (
                        <span className="badge badge-red">Retido • Declaração {qrTokenLido.statusDeclaracao}</span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '21px', fontWeight: 800, marginBottom: '4px' }}>{qrTokenLido.nome}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                      {qrTokenLido.escolaNome} • Equipe <strong>{qrTokenLido.equipeNome}</strong>
                    </p>

                    <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-hairline)' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Orientação de Encaminhamento na Entrada
                      </div>
                      {qrTokenLido.modalidades.map((m, i) => (
                        <div key={i} style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                          • {m.ala} ({m.mesaPista}) — Bateria às {m.horario}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: CONVIDADOS */}
            {abaVoluntario === 'convidados' && (
              <div className="grid-sidebar-form">
                <div className="surface-card">
                  <div className="surface-card-header">
                    <div>
                      <h3 className="surface-card-title">Novo Visitante / Convidado</h3>
                      <p className="surface-card-sub">Registro rápido e minimalista na recepção.</p>
                    </div>
                  </div>

                  <form onSubmit={handleRegistrarConvidado}>
                    <div className="field-group">
                      <label>Nome Completo</label>
                      <input
                        className="input-control"
                        value={convidadoNome}
                        onChange={(e) => setConvidadoNome(e.target.value)}
                        placeholder="Digite o nome do visitante"
                      />
                    </div>
                    <div className="field-group">
                      <label>Telefone para Contato</label>
                      <input
                        className="input-control"
                        value={convidadoTelefone}
                        onChange={(e) => setConvidadoTelefone(e.target.value)}
                        placeholder="(47) 99999-0000"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      Confirmar Entrada
                    </button>
                  </form>
                </div>

                <div className="surface-card">
                  <div className="surface-card-header">
                    <h3 className="surface-card-title">Últimos Acessos Registrados</h3>
                    <span className="badge badge-green">Sincronizado com Organizador</span>
                  </div>
                  <div className="table-wrap">
                    <table className="clean-table">
                      <thead>
                        <tr>
                          <th>Visitante</th>
                          <th>Telefone</th>
                          <th>Horário</th>
                          <th>Atendente</th>
                        </tr>
                      </thead>
                      <tbody>
                        {convidados.map((c) => (
                          <tr key={c.id}>
                            <td><strong>{c.nome}</strong></td>
                            <td>{c.telefone}</td>
                            <td><span className="badge badge-blue">{c.horarioEntrada}</span></td>
                            <td>{c.voluntarioResponsavel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {toastMsg && (
        <div className="toast-banner">
          <CheckCircle2 size={17} color="#60A5FA" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
