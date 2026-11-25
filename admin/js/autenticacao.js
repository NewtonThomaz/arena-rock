window.ControladorAutenticacao = (function () {
    const CHAVE_SESSAO = "arena_rock_sessao_admin_v1";
    const CHAVE_USUARIOS_LOCAIS = "arena_rock_usuarios_v1";

    const usuariosPadrao = [
        {
            id: 1,
            nome: "Admin Arena Rock",
            email: "admin@arenarock.com.br",
            senha: "rock2026",
            papel: "administrador",
            status: "ativo"
        },
        {
            id: 2,
            nome: "Admin",
            email: "admin@usinadoriff.com.br",
            senha: "rock2026",
            papel: "administrador",
            status: "ativo"
        },
        {
            id: 3,
            nome: "Admin",
            email: "admin@palcodorock.com.br",
            senha: "rock2026",
            papel: "administrador",
            status: "ativo"
        },
        {
            id: 4,
            nome: "Rodrigo \"Riff\" Mendes",
            email: "rodrigo@arenarock.com.br",
            senha: "rock2026",
            papel: "administrador",
            status: "ativo"
        },
        {
            id: 5,
            nome: "Camila Rocha",
            email: "camila@arenarock.com.br",
            senha: "rock2026",
            papel: "administrador",
            status: "ativo"
        },
        {
            id: 6,
            nome: "Equipe Bilheteria Manifesto",
            email: "bilheteria@arenarock.com.br",
            senha: "rock2026",
            papel: "usuario",
            status: "ativo"
        }
    ];

    function listarUsuariosLocais() {
        try {
            const salvo = localStorage.getItem(CHAVE_USUARIOS_LOCAIS);
            if (!salvo) {
                localStorage.setItem(CHAVE_USUARIOS_LOCAIS, JSON.stringify(usuariosPadrao));
                return usuariosPadrao.slice();
            }
            return JSON.parse(salvo);
        } catch (erro) {
            return usuariosPadrao.slice();
        }
    }

    function salvarUsuariosLocais(lista) {
        try {
            localStorage.setItem(CHAVE_USUARIOS_LOCAIS, JSON.stringify(lista));
        } catch (erro) {
            console.warn(erro);
        }
    }

    function obterSessaoAtual() {
        try {
            const sessao = localStorage.getItem(CHAVE_SESSAO);
            return sessao ? JSON.parse(sessao) : null;
        } catch (erro) {
            return null;
        }
    }

    function salvarSessao(usuario) {
        const dadosSessao = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            papel: usuario.papel || "administrador",
            autenticadoEm: new Date().toISOString()
        };
        localStorage.setItem(CHAVE_SESSAO, JSON.stringify(dadosSessao));
        return dadosSessao;
    }

    async function encerrarSessao() {
        localStorage.removeItem(CHAVE_SESSAO);
        if (window.supabaseConfigurado && window.supabaseClient && window.supabaseClient.auth) {
            try {
                await window.supabaseClient.auth.signOut();
            } catch (erro) {
                console.warn(erro);
            }
        }
        window.location.href = "login.html";
    }

    function exigirAutenticacao() {
        const caminho = window.location.pathname.toLowerCase();
        if (caminho.endsWith("login.html")) {
            return;
        }

        const sessao = obterSessaoAtual();
        if (!sessao || !sessao.email) {
            window.location.replace("login.html");
            return;
        }
    }

    async function autenticar(email, senha) {
        const emailLimpo = (email || "").trim().toLowerCase();
        const senhaLimpa = (senha || "").trim();

        if (!emailLimpo || !senhaLimpa) {
            return { sucesso: false, mensagem: "Preencha o e-mail e a senha de acesso." };
        }

        if (window.supabaseConfigurado && window.supabaseClient) {
            try {
                const consulta = await window.supabaseClient
                    .from("usuarios")
                    .select("*")
                    .ilike("email", emailLimpo)
                    .limit(1);

                if (consulta.data && consulta.data.length > 0) {
                    const usuarioBanco = consulta.data[0];
                    if (usuarioBanco.status === "inativo") {
                        return { sucesso: false, mensagem: "Este usuário está inativo no painel." };
                    }
                    const senhaEsperada = usuarioBanco.senha || "rock2026";
                    if (senhaEsperada === senhaLimpa) {
                        salvarSessao(usuarioBanco);
                        return { sucesso: true, usuario: usuarioBanco };
                    } else {
                        return { sucesso: false, mensagem: "Senha incorreta para este usuário." };
                    }
                }
            } catch (erro) {
                console.warn(erro);
            }

            if (window.supabaseClient.auth) {
                try {
                    const authRes = await window.supabaseClient.auth.signInWithPassword({
                        email: emailLimpo,
                        password: senhaLimpa
                    });
                    if (authRes.data && authRes.data.user) {
                        const usuarioAuth = {
                            id: authRes.data.user.id,
                            nome: authRes.data.user.email.split("@")[0],
                            email: authRes.data.user.email,
                            papel: "administrador"
                        };
                        salvarSessao(usuarioAuth);
                        return { sucesso: true, usuario: usuarioAuth };
                    }
                } catch (erro) {
                    console.warn(erro);
                }
            }
        }

        const usuarios = listarUsuariosLocais();
        const encontrado = usuarios.find(function (u) {
            return u.email.toLowerCase() === emailLimpo && (u.senha || "rock2026") === senhaLimpa;
        });

        if (encontrado) {
            if (encontrado.status === "inativo") {
                return { sucesso: false, mensagem: "Este usuário está inativo no painel." };
            }
            salvarSessao(encontrado);
            return { sucesso: true, usuario: encontrado };
        }

        return {
            sucesso: false,
            mensagem: "E-mail ou senha inválidos."
        };
    }

    function obterIniciais(nome) {
        const partes = String(nome || "AR").trim().split(/\s+/).filter(Boolean);
        if (partes.length === 0) return "AR";
        if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
        return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }

    function hidratarSidebarBackstage() {
        const sessao = obterSessaoAtual();
        const elNome = document.getElementById("usuario-sidebar-nome");
        const elEmail = document.getElementById("usuario-sidebar-email");
        const elIniciais = document.getElementById("usuario-sidebar-iniciais");

        if (sessao) {
            if (elNome) elNome.textContent = sessao.nome || "Produtor";
            if (elEmail) elEmail.textContent = sessao.email || "";
            if (elIniciais) elIniciais.textContent = obterIniciais(sessao.nome || sessao.email);
        }

        const elStatus = document.getElementById("status-conexao-admin");
        if (elStatus) {
            const conectado = Boolean(window.supabaseConfigurado && window.supabaseClient);
            elStatus.classList.remove("online", "local");
            elStatus.classList.add(conectado ? "online" : "local");
            elStatus.textContent = conectado ? "Supabase Online" : "Modo Local";
        }
    }

    function configurarBotoesSair() {
        const linksSair = document.querySelectorAll('a[href="login.html"], #botao-sair');
        linksSair.forEach(function (link) {
            link.addEventListener("click", function (evento) {
                evento.preventDefault();
                encerrarSessao();
            });
        });

        hidratarSidebarBackstage();

        const botaoSidebar = document.getElementById("botao-sidebar-admin");
        const sidebar = document.getElementById("sidebar-backstage");
        const fundoSidebar = document.getElementById("fundo-sidebar-admin");

        if (botaoSidebar && sidebar && botaoSidebar.dataset.inicializado !== "sim") {
            botaoSidebar.dataset.inicializado = "sim";

            function alternarSidebar() {
                const aberta = sidebar.classList.toggle("aberta");
                botaoSidebar.classList.toggle("ativo", aberta);
                botaoSidebar.setAttribute("aria-expanded", aberta ? "true" : "false");
                document.body.style.overflow = aberta ? "hidden" : "";
                if (fundoSidebar) {
                    fundoSidebar.classList.toggle("visivel", aberta);
                }
            }

            function fecharSidebar() {
                sidebar.classList.remove("aberta");
                botaoSidebar.classList.remove("ativo");
                botaoSidebar.setAttribute("aria-expanded", "false");
                document.body.style.overflow = "";
                if (fundoSidebar) {
                    fundoSidebar.classList.remove("visivel");
                }
            }

            botaoSidebar.addEventListener("click", alternarSidebar);
            if (fundoSidebar) {
                fundoSidebar.addEventListener("click", fecharSidebar);
            }

            document.addEventListener("keydown", function (evento) {
                if (evento.key === "Escape" && sidebar.classList.contains("aberta")) {
                    fecharSidebar();
                }
            });

            sidebar.querySelectorAll(".link-sidebar-admin").forEach(function (link) {
                link.addEventListener("click", fecharSidebar);
            });
        }
    }

    exigirAutenticacao();

    document.addEventListener("DOMContentLoaded", configurarBotoesSair);

    return {
        obterSessaoAtual: obterSessaoAtual,
        autenticar: autenticar,
        encerrarSessao: encerrarSessao,
        listarUsuariosLocais: listarUsuariosLocais,
        salvarUsuariosLocais: salvarUsuariosLocais
    };
})();

