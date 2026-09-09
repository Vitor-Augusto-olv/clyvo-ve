# Clyvo Vet 🐾

Aplicativo mobile para tutores de pets acompanharem a saúde de seus animais: cadastro de pets, controle de vacinas e histórico de cuidados, com dados sincronizados na nuvem.

## Problema e solução

Tutores de pets costumam perder o controle de quando cada vacina foi aplicada e quando é o próximo reforço, muitas vezes descobrindo o atraso só na hora de agendar uma consulta. O Clyvo Vet resolve isso permitindo que o tutor cadastre seus pets e registre cada vacina aplicada, com data de aplicação e próximo reforço — o app sinaliza automaticamente quando uma vacina está próxima do vencimento ("Atenção") ou em dia ("Em dia").

## Tecnologias utilizadas

- **React Native + Expo** (Expo Router para navegação por arquivos)
- **Supabase** — Auth (autenticação real por e-mail/senha) e Postgres com API REST autogerada
- **TanStack Query** (`@tanstack/react-query`) — cache, loading states e sincronização automática dos dados da API com a interface
- **AsyncStorage** — persistência da sessão de login no dispositivo

## Arquitetura

O projeto separa claramente três camadas:

```
app/            → telas e navegação (Expo Router)
context/        → estado global de autenticação (AuthContext)
hooks/          → hooks do TanStack Query (useQuery/useMutation) — única porta de entrada das telas para dados
services/       → chamadas ao Supabase (Postgres/Auth) — nenhuma tela acessa o Supabase diretamente
constants/      → paleta de cores e constantes visuais
lib/            → configuração do client do Supabase
```

Fluxo de dados: **Tela → hook (TanStack Query) → service (Supabase) → banco**. Nenhuma regra de negócio ou chamada HTTP fica dentro dos componentes de tela.

## Funcionalidades principais

- **Autenticação real** (Supabase Auth): cadastro, login, persistência de sessão e logout, com proteção de rotas via Expo Router (grupos `(auth)` e `(tabs)`)
- **CRUD de Pets**: criar, listar, editar e remover pets, vinculados ao usuário autenticado (Row Level Security garante que cada usuário só vê os próprios dados)
- **CRUD de Vacinas**: cada pet tem seu próprio histórico de vacinas, com criação, edição, remoção e status calculado automaticamente (em dia / atenção) com base na data do próximo reforço

## Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- App **Expo Go** instalado no celular (mesma conta logada no terminal e no app)
- Conta no [Supabase](https://supabase.com)

### Passo a passo

1. Clone o repositório e instale as dependências:
   ```bash
   git clone <link-do-repositorio>
   cd clyvo-ve
   npm install
   ```

2. Crie um projeto no Supabase e rode o script `schema.sql` (na raiz do projeto) no **SQL Editor** do painel — ele cria as tabelas `pets` e `vacinas` já com Row Level Security configurado.

3. Configure o client do Supabase em `lib/supabase.js` com a URL e a chave pública (anon/publishable key) do seu projeto (Settings → API no painel do Supabase):
   ```js
   const SUPABASE_URL = 'https://dybsrpiiibzigekcpxff.supabase.co';
   const SUPABASE_ANON_KEY = 'sb_publishable_CV0LVXgcWA7KAkm1bMKpRg_ZGbGEi_z';
   ```

4. Faça login no Expo CLI e no app Expo Go com a mesma conta:
   ```bash
   npx expo login
   ```

5. Rode o projeto:
   ```bash
   npx expo start -c
   ```

6. Escaneie o QR code com o Expo Go.

### Fluxo de teste sugerido

1. Criar uma conta na tela de Cadastro
2. Cadastrar um pet na aba "Cadastrar"
3. Ver o pet na aba "Pets", editar seus dados
4. Entrar em "Gerenciar vacinas" e registrar uma vacina
5. Fazer logout e login novamente (a sessão deve persistir ao reabrir o app sem logout)

## Vídeo de demonstração

[Link do vídeo no YouTube](COLOQUE_O_LINK_AQUI)

## Integrantes

- Vitor Augusto Oliveira de Abreu — RM 564227
- André Bellandi Vital Rodrigues — RM 564662
- Gabriel Garcia Mayo Delatore — RM 563298

## Disciplina

Mobile Application Development