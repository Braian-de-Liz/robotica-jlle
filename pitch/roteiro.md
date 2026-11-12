# Pitch do Sistema CJR: roteiro de 5 minutos

Para duas pessoas. Acompanha a apresentação em `pitch/apresentacao.html` (um slide por bloco abaixo).

Antes de ensaiar, troque `[nome]` pelos nomes de vocês e confira a lista de ferramentas de IA no slide 9.

## 1. O problema que o pitch defende

**O que os documentos dizem.** O briefing do Desafio 01 descreve a situação assim: a organização do campeonato articula fornecedores, apoiadores, voluntários, parceiros e empresas contratadas; as informações e decisões são produzidas antes, durante e depois do evento, mas ficam dispersas e dependem do conhecimento de pessoas específicas. O desafio pede uma gestão mais organizada, rastreável e sustentável entre edições.

**A escala (regulamento, seção 1).** 6ª edição em 2026, com 69 equipes, 35 escolas e mais de 250 estudantes.

**O que acontece sem um sistema.** Esta tabela é a leitura da equipe sobre o que foi apresentado na abertura. Os documentos não trazem números de retrabalho nem de tempo perdido, e por isso o pitch não cita nenhum.

| Como é hoje | O que isso gera |
| --- | --- |
| Cada pessoa mantém a sua planilha ou o seu documento | Versões diferentes da mesma informação, sem saber qual vale |
| Decisões são combinadas em conversa, sem registro | Não dá para recuperar quem decidiu, quando e por quê |
| O conhecimento fica com quem organizou | Se a pessoa sai, a edição seguinte recomeça do zero |
| Ninguém enxerga o todo antes do dia | A entrega que faltou e o item de segurança não conferido só aparecem no dia do evento |
| Arquivos compartilhados não têm níveis de acesso | Dados de alunos menores circulam em arquivo aberto, ou ficam trancados com uma pessoa só |

**A ideia central do pitch.** Um robô seguidor de linha para quando a linha acaba. A informação do campeonato hoje é uma linha quebrada em pedaços (planilhas, documentos soltos, memória de quem organizou). A proposta é religar a linha: um sistema só, com um perfil para cada pessoa da organização.

## 2. Roteiro

Total: 5:00. O tempo de cada bloco é o mesmo que o cronômetro da apresentação usa.

### 1. Capa (0:00 a 0:15), Pessoa 1

> Olá. Eu sou **[nome]**, este é **[nome]**, e o nosso desafio é o número um: a gestão do evento. Em cinco minutos, a gente vai mostrar como colocar o campeonato inteiro numa linha só.

### 2. Gancho (0:15 a 0:35), Pessoa 1

> Todo mundo aqui já viu um robô seguidor de linha. Ele tem uma regra só: enquanto existe linha, ele anda. Quando a linha acaba, ele para. Guardem essa imagem.

### 3. O tamanho do campeonato (0:35 a 0:55), Pessoa 2

> Agora, o campeonato. A sexta edição reuniu 69 equipes de 35 escolas, com mais de 250 estudantes. E, para isso acontecer, a Secretaria articula fornecedores, apoiadores, voluntários, parceiros e empresas contratadas, antes, durante e depois do evento.

### 4. O problema (0:55 a 1:25), Pessoa 2

Espere a linha se partir na tela antes de falar dos três pedaços.

> E onde está toda essa informação hoje? Em planilhas. Em documentos soltos. E na memória de quem organizou. Cada pedaço existe, mas cada um está num lugar, e ninguém enxerga o todo. A linha está quebrada. E, igual ao robô, a organização para: para pra procurar, para pra perguntar, para pra refazer.

### 5. O que isso gera (1:25 a 1:55), Pessoa 1

> Isso gera três coisas. Cada edição recomeça do zero, porque o que se aprendeu não ficou registrado. Ninguém consegue dizer quem decidiu o quê, nem quem ficou responsável. E o problema só aparece no dia: a entrega que faltou, o item de segurança que ninguém conferiu. Com mais de 250 estudantes no pavilhão, descobrir no dia custa caro.

### 6. A solução (1:55 a 2:20), Pessoa 1

> A nossa proposta é religar essa linha. Um sistema só, em que cada pessoa entra com o seu perfil: organização, escola, participante, avaliador e portaria. Todos trabalham em cima da mesma informação, e cada um vê só a parte que é sua.

### 7. O produto e a demonstração (2:20 a 3:40), Pessoa 2 fala, Pessoa 1 opera

> E isso já está funcionando.

**[Pessoa 1 abre o sistema.]**

> Esta é a visão da organização. A primeira tela responde à pergunta que mais importa: o que ainda pede atenção? Dois itens de vistoria sem conferir, e faltam 50 kits de alimentação.
>
> O fornecedor chegou: a gente registra a entrega, e a meta fecha na hora.
>
> Agora, uma disputa marcada numa ala que já está ocupada: o sistema não deixa, e mostra onde está o conflito.

**[Pessoa 1 volta aos slides.]**

> E a linha continua: a escola aceita a declaração do responsável, o ingresso do aluno é liberado, e a portaria lê o QR Code pelo celular. A mesma informação, de ponta a ponta, sem planilha no meio.

### 8. Os benefícios (3:40 a 4:10), Pessoa 2

> O que a organização ganha? Rastreabilidade: cada tarefa tem um responsável. Continuidade: quem organizar a próxima edição encontra o que esta deixou. Segurança: dado de aluno não fica em arquivo aberto, cada perfil tem o seu nível de acesso. E acessibilidade em todas as telas: Libras, leitura em áudio, alto contraste e teclado.

### 9. Como fizemos (4:10 a 4:40), Pessoa 1

> Como fizemos: o que vocês viram é um MVP com dados fictícios, como o regulamento pede. As telas são em React com TypeScript. O banco, em PostgreSQL, foi modelado por edição, que é o que sustenta a continuidade, e a API em Fastify está em construção. Usamos IA como apoio, e nós revisamos e respondemos por tudo o que está no repositório. O próximo passo é ligar as telas à API e abrir o histórico entre edições.

### 10. Fecho (4:40 a 5:00), Pessoa 2

> A gente começou com um robô parado, porque a linha acabou. A nossa proposta é que a próxima edição do campeonato não precise começar do zero. Obrigado.

## 3. A demonstração, passo a passo

Cabe em 50 segundos se o sistema já estiver aberto e logado.

**Preparação.** Rode o sistema (`cd frontend && bun run dev`), entre com a conta **Organização** e deixe a aba parada em **Resumo do evento**. Recarregue a página logo antes do pitch: isso zera os dados de demonstração.

1. **Resumo do evento.** Mostre o bloco "Pede atenção": dois itens de vistoria e os 50 kits que faltam.
2. **Fornecimento**, em "Kits de alimentação", clique em **Registrar entrega**. Preencha um fornecedor qualquer e a quantidade `50`. Ao confirmar, a barra enche e aparece "Meta atingida".
3. **Grade de horários**, clique em **Publicar janela**. Deixe "Ala 01", coloque início `14:00` e término `14:30` e confirme. O sistema recusa: "A Ala 01 já está ocupada das 13:30 às 14:45".
4. Volte para a apresentação (Alt+Tab).

**Se a demonstração falhar,** não tente consertar ao vivo. O slide 7 mostra as telas reais em rodízio: narre por cima delas.

## 4. Se a banca perguntar

O regulamento avisa que a organização pode questionar código, escolhas de arquitetura, segurança, testes e autoria. Respostas que correspondem ao que existe hoje no repositório:

**O sistema está pronto para uso?**
Não. É um MVP: as telas funcionam com dados fictícios guardados em memória. A API e o banco estão iniciados, e ligar as telas à API é o primeiro item do backlog.

**Por que há telas de avaliação e chaveamento, que são do Desafio 02?**
São pontos de integração simulados, para mostrar o fluxo de ponta a ponta. A fonte da verdade de disputas e notas é do domínio de competições. O nosso domínio é a gestão do evento: fornecimento, vistoria do local, grade de horários, portaria, perfis e níveis de acesso.

**Como vocês garantem a continuidade entre edições?**
O banco tem uma tabela de edições do evento (está na migração em `api/drizzle/`), e os registros se ligam a ela. A tela de histórico entre edições e o registro de decisões ainda não existem: são o segundo item do backlog.

**Como funciona o controle de acesso?**
No MVP, os cinco perfis são demonstrados na interface, cada um com o seu menu. A autenticação real na API ainda não foi implementada; o banco já tem a tabela de cargos com nível de acesso.

**Onde a IA foi usada?**
No apoio ao desenvolvimento das telas e desta apresentação. Vale saber explicar a estrutura do código: as páginas de cada perfil ficam em `frontend/src/pages/`, o estado compartilhado em `frontend/src/lib/store.tsx` e os dados fictícios em `frontend/src/data/mockDatabase.ts`.

## 5. Antes de apresentar

- Abra `pitch/apresentacao.html` e preencha, no bloco de configuração no topo do arquivo, os nomes em `APRESENTADORES` e as ferramentas em `FERRAMENTAS_IA`. Se quiser mostrar o repositório no último slide, preencha `REPOSITORIO`.
- Abra o arquivo no Chrome e aperte **F** para tela cheia. Ele funciona sem internet.
- Ensaie pelo menos duas vezes com o cronômetro (**T**) e o roteiro na tela (**N**).
- Combinem quem aperta a tecla. Um clique por slide: são 9 cliques no total.

## 6. Atalhos da apresentação

| Tecla | O que faz |
| --- | --- |
| → ou Espaço | Próximo slide (também funciona com passador de slides e clique) |
| ← | Slide anterior |
| F | Tela cheia |
| T | Mostra o cronômetro (começa no primeiro avanço) |
| N | Mostra o roteiro do slide na parte de baixo, para ensaiar |
| P | Modo automático: avança sozinho no tempo de cada bloco |
| D | Abre o sistema em outra aba, para a demonstração |
| Home | Volta para a capa e zera o cronômetro |
