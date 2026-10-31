# Clyvo Vet 🐾

Aplicativo mobile para tutores de pets acompanharem a saúde dos seus animais: cadastro de pets, vacinas, consultas, medicamentos e histórico de cuidados, com lembretes por notificação e dados sincronizados na nuvem.

## Problema e solução

Tutores de pets costumam perder o controle de quando cada vacina foi aplicada, quando é o próximo reforço, quando a consulta está marcada e quando o medicamento deve ser dado — muitas vezes descobrindo o atraso só tarde demais.

O Clyvo Vet centraliza tudo em um só lugar: o tutor cadastra seus pets, registra vacinas, medicamentos e consultas, e o app sinaliza o que está próximo do vencimento, mostra o histórico de saúde de cada animal e **avisa por notificação** antes de cada compromisso.

## Tecnologias utilizadas

- **React Native + Expo** (Expo Router para navegação por arquivos)
- **Supabase** — Auth (e-mail/senha), Postgres com Row Level Security e funções SQL (RPC)
- **TanStack Query** — cache, loading states e atualização automática da interface
- **expo-notifications** — notificações locais (confirmações e lembretes agendados)
- **EAS Build** — geração do APK Android
- **Firebase App Distribution** — distribuição do aplicativo para testadores
- **AsyncStorage** — sessão de login e preferência de tema no dispositivo

## Arquitetura

```
app/            → telas e navegação (Expo Router)
components/     → componentes reutilizáveis (PetChips, LembretesSync)
context/        → estado global (AuthContext, ThemeContext)
hooks/          → hooks do TanStack Query — única porta de entrada das telas para os dados
services/       → chamadas ao Supabase e às notificações — nenhuma tela acessa o Supabase direto
utils/          → funções de data
constants/      → paletas de cores (clara e escura)
lib/            → client do Supabase
```

Fluxo de dados: **Tela → hook (TanStack Query) → service (Supabase) → banco**. Nenhuma regra de negócio ou chamada HTTP fica dentro dos componentes de tela.

## Funcionalidades

- **Autenticação real** (Supabase Auth): cadastro, login, sessão persistente, logout e proteção de rotas.
- **Pets**: criar, listar, editar e remover (cada usuário só enxerga os próprios dados, via Row Level Security).
- **Vacinas**: histórico por pet, com status calculado (em dia / atenção) pela data do próximo reforço.
- **Medicamentos**: cadastro e exclusão por pet, com próxima aplicação.
- **Agendamento de consultas**: escolha de pet, tipo, clínica, dia e horário. Horários já ocupados não aparecem, e o banco impede agendamento duplicado.
- **Cancelamento de consulta**: permitido somente com **24 horas ou mais** de antecedência. A regra é validada no banco (função `cancelar_agendamento`), não só na tela.
- **Histórico de saúde**: linha do tempo com vacinas, medicamentos e consultas de cada pet.
- **Home**: resumo real de saúde e próximas ações (vacinas, consultas e medicamentos mais próximos).
- **Notificações locais**:
  - confirmação imediata ao agendar uma consulta e ao registrar vacina ou medicamento;
  - lembretes agendados: consulta 24h e 1h antes, vacina 3 dias antes e no dia do reforço, medicamento no dia;
  - ao tocar na notificação, o app abre a aba correspondente em Saúde.
- **Tema claro e escuro**: Sistema, Claro ou Escuro, escolhido em Perfil → Aparência.
- **Sobre o App**: mostra versão e o **hash do commit** da versão publicada.

## Versão publicada

- **Distribuição:** Firebase App Distribution (grupo de testadores com o professor cadastrado).
- **Link do convite:** <LINK_FIREBASE>
- **Commit da versão publicada:** `e8dd670e8809eeb39fb57c17aa6a66dba5c5a0f3` (exibido em Perfil → Sobre o App). Commits posteriores alteram apenas a documentação.

## Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- App **Expo Go** no celular, ou um emulador Android
- Conta no [Supabase](https://supabase.com)

### Passo a passo

1. Clone o repositório e instale as dependências:
   ```bash
   git clone <link-do-repositorio>
   cd clyvo-ve
   npm install
   ```

2. Crie um projeto no Supabase e rode os scripts SQL da raiz do projeto, **nesta ordem**, no **SQL Editor**:
   1. `schema.sql` — tabelas `pets` e `vacinas`
   2. `schema_sprint4.sql` — perfis, agendamentos, eventos clínicos, dispositivos, leituras e mensagens
   3. `schema_sprint4_fase2.sql` — medicamentos
   4. `schema_fix_agendamento.sql` — impede horário duplicado
   5. `schema_cancelamento.sql` — função de cancelamento com prazo de 24h

3. Configure o client do Supabase em `lib/supabase.js` com a URL e a chave pública (anon/publishable) do seu projeto (Settings → API):
   ```js
   const SUPABASE_URL = 'https://<seu-projeto>.supabase.co';
   const SUPABASE_ANON_KEY = '<sua-chave-publica>';
   ```

4. Rode o projeto:
   ```bash
   npx expo start -c
   ```
   Escaneie o QR code com o Expo Go, ou pressione `a` com o emulador Android aberto.

### Gerar o APK (EAS Build)

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

O APK é gerado na nuvem do Expo. Depois, ele é enviado ao Firebase App Distribution para os testadores.

### Fluxo de teste sugerido

1. Criar uma conta e fazer login.
2. Cadastrar um pet na aba **Cadastrar**.
3. Registrar uma vacina em **Pets → Gerenciar vacinas** (aparece uma notificação de confirmação).
4. Em **Saúde → Medicamentos**, adicionar um medicamento.
5. Em **Agendar**, marcar uma consulta e conferir a notificação.
6. Em **Saúde → Consultas**, cancelar uma consulta com mais de 24h de antecedência.
7. Conferir **Home**, **Saúde** e **Histórico**.
8. Em **Perfil**, alternar o tema e abrir **Sobre o App** para ver o hash do commit.

## Vídeo de demonstração

- **Sprint 3:** [vídeo no YouTube](https://youtu.be/BtLmnragaQ8)
- **Sprint 4:** <LINK_VIDEO_SPRINT4>

## Integrantes

- Vitor Augusto Oliveira de Abreu — RM 564227
- André Bellandi Vital Rodrigues — RM 564662
- Gabriel Garcia Mayo Delatore — RM 563298

## Disciplina

Mobile Application Development — Challenge FIAP 2026
