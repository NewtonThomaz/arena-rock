# 🎸 Arena Rock — Agenda de Shows, Festivais e Cultura Underground

Plataforma web para divulgação de shows, festivais de Heavy Metal, noites de Punk & Grunge, tributos, batalhas de bandas e workshops, composta por um **Portal Público** e um painel administrativo (**Backstage Admin**) construído em HTML5 100% semântico, CSS3, JavaScript (ES6+) e Supabase (com fallback automático para `localStorage`).

---

## 👥 Participantes do Projeto

| Participante | E-mail Institucional |
| :--- | :--- |
| **Newton André Thomaz** | [newton.thomaz@aluno.cps.sp.gov.br](mailto:newton.thomaz@aluno.cps.sp.gov.br) |
| **Maria Eduarda Santoni Pereira** | [maria.pereira17@aluno.cps.sp.gov.br](mailto:maria.pereira17@aluno.cps.sp.gov.br) |

---

## 📁 Organização das Pastas do Projeto

```text
web/
├── index.html                  # Portal público: hero 3D, agenda, filtros e busca
├── evento.html                 # Detalhes do show, lotação e line-up
├── inscricao.html              # Reserva de ingresso com geração de código ROCK-XXXXXX
├── ingressos.html              # Consulta de vouchers emitidos por e-mail ou código
├── bandas.html                 # Catálogo de bandas e line-up do circuito
├── locais.html                 # Guia de casas de show, pubs e arenas parceiras
├── supabase-credentials.js     # Credenciais do Supabase (ignorado no .gitignore)
├── admin/                      # Painel Backstage VIP (acesso autenticado)
│   ├── login.html              # Tela de autenticação (Credencial VIP)
│   ├── index.html              # Dashboard: KPIs, lotação por show e feed recente
│   ├── eventos.html            # CRUD de shows em modal por 4 etapas + seletor de capa
│   ├── bandas.html             # CRUD de bandas em modal
│   ├── locais.html             # CRUD de casas de show em modal
│   ├── categorias.html         # Gestão de categorias e cores de filtro
│   ├── inscritos.html          # Portaria: check-in em tempo real, paginação (100/pág) e CSV
│   ├── usuarios.html           # Gestão da equipe e permissões do Backstage
│   └── js/                     # Controladores JS do Backstage + cliente Supabase
├── assets/
│   ├── css/styles.css          # Folha de estilos única (identidade visual + modais + responsivo)
│   └── images/                 # Logotipo, ícone e capas fotográficas em cards/
├── js/                         # Camada de API/persistência (api.js + ArenaUI) e scripts públicos
└── supabase/
    ├── supabase-schema.sql     # DDL consolidado (tabelas, colunas extras e políticas RLS)
    └── migrations/             # 17 migrations incrementais padronizadas (tabelas, colunas e seeds)
```

---

## 🚀 Como Rodar o Sistema

### 1. Configurar `supabase-credentials.js`
O arquivo `supabase-credentials.js` é ignorado pelo `.gitignore` e deve ser criado na **raiz do projeto** (`web/supabase-credentials.js`).

1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard) → **Project Settings** → **API**.
2. Copie a **Project URL** e a chave pública **anon / publishable** (nunca use a chave `service_role` no frontend).
3. Crie o arquivo `supabase-credentials.js` com exatamente o conteúdo abaixo:

```js
const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";
const SUPABASE_ANON_KEY = "SUA-CHAVE-PUBLICA-ANON";
```

> **Modo Offline (`localStorage`):** Se `supabase-credentials.js` não for criado ou mantiver os valores de placeholder, a aplicação funciona normalmente usando os dados iniciais em `js/api.js` persistidos no navegador.

---

### 2. Ordem de Execução das Migrations no Supabase
Abra o **SQL Editor** do seu projeto Supabase e execute os scripts em `supabase/migrations/` rigorosamente nesta ordem numérica *(ou execute primeiro `supabase/supabase-schema.sql` de uma só vez e depois apenas os scripts de `seed_*`, passos 10 a 17)*:

1. `20261119210001_create_categorias_table.sql` — cria a tabela `categorias` e RLS
2. `20261119210002_create_bandas_table.sql` — cria a tabela `bandas` e RLS
3. `20261119210003_create_locais_table.sql` — cria a tabela `locais` e RLS
4. `20261119210004_create_eventos_table.sql` — cria a tabela `eventos` e RLS
5. `20261119210005_create_inscricoes_table.sql` — cria a tabela `inscricoes` e RLS
6. `20261119210006_create_usuarios_table.sql` — cria a tabela `usuarios` e RLS
7. `20261119210101_add_imagem_to_eventos.sql` — adiciona a coluna `imagem` em `eventos`
8. `20261119210102_add_checkin_to_inscricoes.sql` — adiciona a coluna `checkin` em `inscricoes`
9. `20261119210103_add_checkin_em_to_inscricoes.sql` — adiciona a coluna `checkin_em` em `inscricoes`
10. `20261119220101_seed_categorias.sql` — popula as categorias iniciais de rock
11. `20261119220102_seed_bandas.sql` — popula as 6 bandas do circuito
12. `20261119220103_seed_locais.sql` — popula as 4 casas de show parceiras
13. `20261119220104_seed_eventos.sql` — popula os 6 shows iniciais
14. `20261119220105_seed_usuarios.sql` — popula os perfis iniciais de acesso ao Backstage
15. `20261125021501_seed_inscricoes_lote_1.sql` — simula compradores para Festival Trovão, Noite Grunge e Fúria Subterrânea
16. `20261125021502_seed_inscricoes_lote_2.sql` — simula compradores para Batalha das Garagens, Masterclass e Feira de Vinil
17. `20261125021503_seed_inscricoes_extras.sql` — popula shows extras sem inscritos e recalcula `vagas_restantes`

---

### 3. Iniciar o Servidor Local
Execute um servidor HTTP estático na raiz (`web/`) usando a extensão **Live Server** do VS Code ou via terminal:

```bash
npx serve .
# ou
python -m http.server 8080
```

- **Portal Público:** `http://localhost:8080/index.html`
- **Backstage Admin:** `http://localhost:8080/admin/login.html`

---

## 🔐 Credenciais de Acesso ao Backstage

Perfis pré-cadastrados disponíveis na migration `20261119220105_seed_usuarios.sql` e no fallback local (`admin/js/autenticacao.js`):

| Perfil | Nome | E-mail | Senha Padrão |
| :--- | :--- | :--- | :--- |
| **Produtor / Administrador** | Admin Arena Rock | `admin@arenarock.com.br` | `rock2026` |
| **Produtor / Administrador** | Rodrigo "Riff" Mendes | `rodrigo@arenarock.com.br` | `rock2026` |
| **Produtor / Administrador** | Camila Rocha | `camila@arenarock.com.br` | `rock2026` |
| **Portaria / Operador** | Equipe Bilheteria Manifesto | `bilheteria@arenarock.com.br` | `rock2026` |
