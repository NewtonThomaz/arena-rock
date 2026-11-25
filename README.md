# 🎸 Arena Rock — Agenda de Shows, Festivais e Cultura Underground

Plataforma web completa para divulgação de shows, festivais de Heavy Metal, noites de Punk & Grunge, tributos, batalhas de bandas e workshops, contando com portal público para o público e painel administrativo (**Backstage Admin**) para gestão de programação, casas de show, bandas, categorias, equipe e controle de portaria/check-in.

---

## 👥 Participantes do Projeto

| Participante | E-mail Institucional |
| :--- | :--- |
| **Newton André Thomaz** | [newton.thomaz@aluno.cps.sp.gov.br](mailto:newton.thomaz@aluno.cps.sp.gov.br) |
| **Maria Eduarda Santoni Pereira** | [maria.pereira17@aluno.cps.sp.gov.br](mailto:maria.pereira17@aluno.cps.sp.gov.br) |

---

## ✨ Funcionalidades

### 🌐 Portal Público
- **Agenda Rock (`index.html`)**: Vitrine principal com listagem de eventos, destaques e filtros por categoria.
- **Detalhes do Evento (`evento.html`)**: Informações completas de data, horário, local, endereço, banda principal, vertente, classificação etária, responsável e vagas restantes.
- **Inscrição / Reserva de Ingresso (`inscricao.html`)**: Formulário para inscrição em eventos com seleção de setor e geração de código de confirmação único.
- **Meus Ingressos (`ingressos.html`)**: Consulta de ingressos/inscrições realizadas.
- **Bandas & Line-up (`bandas.html`)**: Catálogo de bandas com vertente musical, cidade, integrantes e biografia.
- **Casas de Show (`locais.html`)**: Guia de locais e casas de show com endereço, capacidade e estrutura disponível.

### 🎛️ Backstage Admin (`admin/`)
- **Autenticação (`admin/login.html`)**: Acesso restrito para administradores e equipe de operação.
- **Painel / Dashboard (`admin/index.html`)**: Visão geral de eventos, inscritos e indicadores operacionais.
- **Shows & Eventos (`admin/eventos.html`)**: Cadastro, edição e gerenciamento de eventos, vagas e imagens.
- **Bandas & Line-up (`admin/bandas.html`)**: Gerenciamento de bandas cadastradas e destaques.
- **Casas de Show (`admin/locais.html`)**: Cadastro e edição de locais e capacidades.
- **Categorias (`admin/categorias.html`)**: Gestão de categorias de eventos e cores de identificação.
- **Portaria & Inscritos (`admin/inscritos.html`)**: Lista de inscritos por evento e controle de check-in na portaria.
- **Equipe (`admin/usuarios.html`)**: Gerenciamento de usuários e permissões do painel administrativo.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3 (`assets/css/styles.css`) e JavaScript puro (ES6+).
- **Tipografia e Visuais**: Google Fonts (`Archivo Black`, `Libre Franklin`, `Playfair Display`), ícones SVG e artes em `assets/images/`.
- **Banco de Dados & Backend**: **Supabase** (PostgreSQL com políticas de RLS definidas em `supabase/supabase-schema.sql` e migrations em `supabase/migrations/`).
- **Modo Offline / Fallback Local**: Caso as credenciais do Supabase não estejam configuradas, a aplicação utiliza `localStorage` com dados iniciais em `js/api.js` para permitir testes locais imediatos.

---

## 📁 Estrutura do Projeto

```text
web/
├── index.html                  # Página inicial (Agenda Rock)
├── evento.html                 # Detalhes de um evento
├── inscricao.html              # Inscrição / reserva de ingresso
├── ingressos.html              # Consulta de ingressos do usuário
├── bandas.html                 # Catálogo de bandas e line-up
├── locais.html                 # Guia de casas de show
├── supabase-credentials.js     # Credenciais do Supabase (ignorado no Git)
├── admin/                      # Painel administrativo (Backstage Admin)
│   ├── index.html              # Dashboard administrativo
│   ├── login.html              # Login do backstage
│   ├── eventos.html            # Gestão de shows e eventos
│   ├── bandas.html             # Gestão de bandas
│   ├── locais.html             # Gestão de casas de show
│   ├── categorias.html         # Gestão de categorias
│   ├── inscritos.html          # Portaria, inscritos e check-in
│   ├── usuarios.html           # Gestão da equipe
│   └── js/                     # Scripts do painel administrativo
├── assets/
│   ├── css/styles.css          # Folha de estilos principal
│   └── images/                 # Logotipos, ícones e capas dos cards
├── js/                         # Scripts do portal público e camada de API
└── supabase/
    ├── supabase-schema.sql     # Schema completo das tabelas e políticas RLS
    └── migrations/             # Scripts de seed e alterações incrementais
```

---

## 🚀 Como Executar Localmente

1. **Clone ou baixe o repositório** na sua máquina.
2. **(Opcional) Configure o Supabase**:
   - Execute o arquivo `supabase/supabase-schema.sql` no SQL Editor do seu projeto Supabase e, se desejar dados iniciais, execute os scripts em `supabase/migrations/`.
   - Configure o arquivo `supabase-credentials.js` na raiz do projeto com `SUPABASE_URL` e `SUPABASE_ANON_KEY`.
   - *Observação*: Caso não configure o Supabase, o projeto funcionará automaticamente em modo local utilizando `localStorage`.
3. **Inicie um servidor local** na raiz do projeto (por exemplo, com a extensão *Live Server* do VS Code ou via Python/Node):
   ```bash
   npx serve .
   ```
   ou
   ```bash
   python -m http.server 8080
   ```
4. Acesse `http://localhost:8080` no navegador para o portal público ou `/admin/login.html` para o **Backstage Admin**.
