# Reserva de Salas

Sistema full stack para reservar salas e laboratórios, que bloqueia reservas em horários que se cruzam.

🔗 **Site publicado:** [reserva-salas-vitoria.netlify.app](https://reserva-salas-vitoria.netlify.app)
🔗 **API publicada:** [reserva-salas-api.onrender.com/salas](https://reserva-salas-api.onrender.com/salas)

> A API usa o plano gratuito do Render e "dorme" quando fica sem uso. No primeiro acesso, ela pode levar cerca de 50 segundos para responder.

## Telas

| Salas | Agenda da sala |
|---|---|
| ![Lista de salas](docs/salas.png) | ![Agenda da Sala 101 com as reservas do dia](docs/agenda.png) |

| Conflito de horário |
|---|
| ![Mensagem de conflito ao tentar reservar um horário ocupado](docs/conflito.png) |

## Funcionalidades

- Listagem de salas e laboratórios
- Agenda de cada sala, filtrada por dia
- Criação de reservas, com validação de data e horário
- Bloqueio de reservas em horários que se cruzam, mostrando qual reserva ocupa o horário
- Cancelamento de reservas, com confirmação
- Mensagens de erro claras, vindas da API e exibidas na tela

## Como funciona

```
Site (React, no Netlify)  →  API (Node.js + Express, no Render)  →  Banco (PostgreSQL, no Neon)
```

O site nunca acessa o banco diretamente: ele só conhece o endereço da API, e só a API conhece o banco.

### A regra de conflito

Duas reservas da mesma sala, no mesmo dia, conflitam quando **a nova começa antes de a existente terminar e termina depois de a existente começar**. A verificação é feita direto no banco, numa única consulta SQL. Reservas "encostadas", como uma das 08:00 às 10:00 e outra das 10:00 às 12:00, são permitidas.

## Tecnologias

- **Back-end:** Node.js, Express, PostgreSQL com SQL puro (biblioteca `pg`, consultas parametrizadas contra SQL injection)
- **Front-end:** React, Vite
- **Deploy:** Render (API), Neon (banco de dados), Netlify (site)
- **Ferramentas:** Postman, Git e GitHub

## Rotas da API

| Método | Rota | O que faz |
|---|---|---|
| GET | `/salas` | Lista as salas |
| GET | `/salas/:id` | Busca uma sala |
| POST | `/salas` | Cria uma sala |
| PUT | `/salas/:id` | Edita uma sala |
| DELETE | `/salas/:id` | Apaga uma sala |
| GET | `/salas/:id/reservas?data=AAAA-MM-DD` | Agenda de uma sala (data opcional) |
| GET | `/reservas` | Lista as reservas |
| GET | `/reservas/:id` | Busca uma reserva |
| POST | `/reservas` | Cria uma reserva (responde 409 se houver conflito) |
| DELETE | `/reservas/:id` | Cancela uma reserva |

Status usados: **200** (ok), **201** (criado), **204** (apagado), **400** (dados inválidos), **404** (não encontrado), **409** (horário ocupado) e **500** (erro no servidor).

## Estrutura

```
.
├── controllers/   valida o pedido e escolhe a resposta
├── routes/        liga cada endereço à sua função
├── services/      consultas ao banco de dados
├── utils/         funções reaproveitadas
├── db/            conexão e script das tabelas (schema.sql)
├── postman/       coleção com todas as requisições
├── server.js      ponto de partida da API
└── web/           front-end em React
```

## Como rodar localmente

Pré-requisitos: [Node.js](https://nodejs.org) (versão LTS) e [PostgreSQL](https://www.postgresql.org).

**API**

1. Clone o repositório e instale as dependências:
   ```bash
   git clone https://github.com/vitoriasmiranda/reserva-salas.git
   cd reserva-salas
   npm install
   ```
2. Crie um banco no PostgreSQL e execute o arquivo `db/schema.sql`
3. Crie um arquivo `.env` na raiz com a variável `DATABASE_URL`, por exemplo:
   ```
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/reserva_salas
   ```
4. Rode a API, que fica em `http://localhost:3000`:
   ```bash
   node --watch server.js
   ```

**Front-end**

1. Em outro terminal:
   ```bash
   cd web
   npm install
   ```
2. Crie um arquivo `.env` dentro de `web`, copiando o `.env.example`
3. Rode o site, que fica em `http://localhost:5173`:
   ```bash
   npm run dev
   ```

**Testar a API no Postman**

1. Importe a coleção que está em `postman/reserva-salas-api.postman_collection.json`
2. Na aba Variables da coleção, defina a variável `baseUrl` como `http://localhost:3000`

## Próximos passos

- Testes automatizados com Vitest e Supertest
- Login com JWT e permissões por perfil
- Proteção contra reservas simultâneas direto no banco

## Autora

Desenvolvido por **Vitória Miranda**, como projeto para aprender back-end.

[GitHub](https://github.com/vitoriasmiranda) · [LinkedIn](https://www.linkedin.com/in/vitoriasmiranda)