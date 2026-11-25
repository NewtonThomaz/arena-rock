(function () {
    const corpoTabela = document.getElementById("tabela-usuarios");
    const formulario = document.getElementById("form-cadastro-usuario");
    const campoNome = document.getElementById("campo-nome-usuario");
    const campoEmail = document.getElementById("campo-email-usuario");
    const campoSenha = document.getElementById("campo-senha-usuario");
    const campoPapel = document.getElementById("campo-papel-usuario");
    const campoStatus = document.getElementById("campo-status-usuario");

    async function listarUsuarios() {
        if (window.supabaseConfigurado && window.supabaseClient) {
            try {
                const resposta = await window.supabaseClient.from("usuarios").select("*").order("id", { ascending: true });
                if (resposta.data && resposta.data.length > 0) {
                    window.ControladorAutenticacao.salvarUsuariosLocais(resposta.data);
                    return resposta.data;
                }
            } catch (erro) {
                console.warn(erro);
            }
        }
        return window.ControladorAutenticacao.listarUsuariosLocais();
    }

    async function renderizarUsuarios() {
        if (!corpoTabela) return;
        const usuarios = await listarUsuarios();

        corpoTabela.innerHTML = usuarios.map(function (u) {
            const classePapel = u.papel === "administrador" ? "selo-admin" : "selo-usuario";
            const textoPapel = u.papel === "administrador" ? "Produtor / Admin" : "Portaria / Operador";
            const classeStatus = u.status === "ativo" ? "selo-ativo" : "selo-inativo";
            const textoStatus = u.status === "ativo" ? "Ativo" : "Inativo";

            return `
                <tr>
                    <td data-label="Nome"><strong>${u.nome}</strong></td>
                    <td data-label="E-mail">${u.email}</td>
                    <td data-label="Função"><span class="selo ${classePapel}">${textoPapel}</span></td>
                    <td data-label="Status"><span class="selo ${classeStatus}">${textoStatus}</span></td>
                    <td data-label="Ações" class="acoes-tabela">
                        <button type="button" class="botao-pequeno botao-excluir" data-id="${u.id}" data-email="${u.email}">Excluir</button>
                    </td>
                </tr>
            `;
        }).join("");

        corpoTabela.querySelectorAll(".botao-excluir").forEach(function (botao) {
            botao.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");
                const email = this.getAttribute("data-email");
                const confirmado = await window.ArenaUI.confirmar({
                    titulo: "Remover da Equipe",
                    mensagem: "Deseja revogar o acesso deste membro ao Backstage?",
                    textoConfirmar: "Sim, Remover",
                    perigoso: true
                });
                if (!confirmado) return;

                if (window.supabaseConfigurado && window.supabaseClient) {
                    await window.supabaseClient.from("usuarios").delete().eq("id", id);
                }

                const atuais = window.ControladorAutenticacao.listarUsuariosLocais().filter(function (item) {
                    return String(item.id) !== String(id) && item.email !== email;
                });
                window.ControladorAutenticacao.salvarUsuariosLocais(atuais);
                renderizarUsuarios();
            });
        });
    }

    if (formulario) {
        if (window.ControladorModalAdmin) {
            window.ControladorModalAdmin.registrarReset("formulario-usuario", function () {
                formulario.reset();
            });
        }

        formulario.addEventListener("submit", async function (evento) {
            evento.preventDefault();
            const nome = (campoNome.value || "").trim();
            const email = (campoEmail.value || "").trim().toLowerCase();
            const senha = (campoSenha.value || "").trim() || "rock2026";
            const papel = campoPapel ? campoPapel.value : "administrador";
            const status = campoStatus ? campoStatus.value : "ativo";

            if (nome.length < 3 || !email.includes("@")) {
                await window.ArenaUI.alerta({
                    titulo: "Dados Inválidos",
                    mensagem: "Preencha o nome completo e um e-mail válido.",
                    tipo: "erro"
                });
                return;
            }

            const novoUsuario = {
                id: Date.now(),
                nome: nome,
                email: email,
                senha: senha,
                papel: papel,
                status: status
            };

            const atuais = window.ControladorAutenticacao.listarUsuariosLocais();
            atuais.push(novoUsuario);
            window.ControladorAutenticacao.salvarUsuariosLocais(atuais);

            if (window.supabaseConfigurado && window.supabaseClient) {
                await window.supabaseClient.from("usuarios").insert({
                    nome: nome,
                    email: email,
                    senha: senha,
                    papel: papel,
                    status: status
                });
            }

            if (window.ControladorModalAdmin) {
                window.ControladorModalAdmin.fechar("formulario-usuario");
            } else {
                formulario.reset();
            }
            await renderizarUsuarios();
            await window.ArenaUI.alerta({
                titulo: "Membro Cadastrado",
                mensagem: "Membro cadastrado! Ele já pode fazer login no Backstage.",
                tipo: "sucesso"
            });
        });
    }

    document.addEventListener("DOMContentLoaded", renderizarUsuarios);
})();

